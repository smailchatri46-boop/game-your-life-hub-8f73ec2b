import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  getConversations,
  createConversation,
  updateConversation,
  deleteConversation as deleteConversationService,
  getMessages,
  createMessage,
} from "@/services/supabase/chat";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

// Generate a smart 2-5 word title from the conversation
function generateSmartTitle(userMessage: string, aiResponse: string): string {
  const combined = userMessage.toLowerCase();
  
  // Common topic patterns to extract
  const patterns = [
    { regex: /morning\s*(routine|habit)/i, title: "Morning routine" },
    { regex: /evening\s*(routine|habit)/i, title: "Evening routine" },
    { regex: /sleep|bedtime|rest/i, title: "Sleep habits" },
    { regex: /exercise|workout|gym|fitness/i, title: "Fitness goals" },
    { regex: /meditat|mindful/i, title: "Meditation practice" },
    { regex: /read|book/i, title: "Reading habit" },
    { regex: /water|hydrat/i, title: "Hydration tips" },
    { regex: /productiv|focus|work/i, title: "Productivity boost" },
    { regex: /stress|anxi|overwhelm/i, title: "Stress management" },
    { regex: /motiv|inspir/i, title: "Motivation tips" },
    { regex: /goal|plan|start/i, title: "Goal planning" },
    { regex: /habit|routine|daily/i, title: "Habit building" },
    { regex: /journal|reflect|write/i, title: "Journaling tips" },
    { regex: /mood|feel|emotion/i, title: "Mood check-in" },
    { regex: /help|advice|suggest/i, title: "Wellness advice" },
  ];

  for (const { regex, title } of patterns) {
    if (regex.test(combined)) {
      return title;
    }
  }

  // Fallback: extract first 2-4 meaningful words
  const words = userMessage
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['the', 'and', 'for', 'how', 'can', 'you', 'help', 'me', 'with', 'what', 'about'].includes(w.toLowerCase()))
    .slice(0, 3);

  if (words.length > 0) {
    const title = words.join(' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  return "New conversation";
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Avoid stale closures when creating/selecting conversations.
  const currentConvIdRef = useRef<string | null>(null);

  const isAuthed = !!user;

  const loadConversations = useCallback(async () => {
    if (!isAuthed || !user) {
      setConversations([]);
      return;
    }
    
    try {
      const convs = await getConversations(user.id);
      setConversations(convs.map(c => ({
        id: c.id,
        title: c.title,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at),
      })));
    } catch (error) {
      console.error("Error loading conversations:", error);
      setConversations([]);
    }
  }, [isAuthed, user]);

  const loadConversation = useCallback(
    async (conversationId: string) => {
      setCurrentConversationId(conversationId);
      currentConvIdRef.current = conversationId;

      if (!isAuthed || !user) {
        return;
      }

      try {
        const msgs = await getMessages(conversationId, user.id);
        setMessages(msgs.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at),
        })));
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      }
    },
    [isAuthed, user]
  );

  const startNewConversation = useCallback(async (): Promise<string | null> => {
    const now = new Date();
    
    if (isAuthed && user) {
      try {
        const conv = await createConversation(user.id, "New chat");
        const newConv: Conversation = {
          id: conv.id,
          title: conv.title,
          createdAt: new Date(conv.created_at),
          updatedAt: new Date(conv.updated_at),
        };
        setConversations((prev) => [newConv, ...prev]);
        setCurrentConversationId(conv.id);
        currentConvIdRef.current = conv.id;
        setMessages([]);
        return conv.id;
      } catch (error) {
        console.error("Error creating conversation:", error);
        return null;
      }
    }

    // Local-only for unauthenticated users
    const id = crypto.randomUUID();
    const newConv: Conversation = {
      id,
      title: "New chat",
      createdAt: now,
      updatedAt: now,
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(id);
    currentConvIdRef.current = id;
    setMessages([]);
    return id;
  }, [isAuthed, user]);

  const updateConversationTitle = useCallback(
    async (conversationId: string, title: string) => {
      if (!title.trim()) return;

      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, title: title.trim(), updatedAt: new Date() } : c))
      );
      
      if (isAuthed && user) {
        try {
          await updateConversation(conversationId, user.id, { title: title.trim() });
        } catch (error) {
          console.error("Error updating conversation title:", error);
        }
      }
    },
    [isAuthed, user]
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (currentConvIdRef.current === conversationId) {
        setCurrentConversationId(null);
        currentConvIdRef.current = null;
        setMessages([]);
      }
      
      if (isAuthed && user) {
        try {
          await deleteConversationService(conversationId, user.id);
        } catch (error) {
          console.error("Error deleting conversation:", error);
        }
      }
    },
    [isAuthed, user]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      let convId = currentConvIdRef.current;
      if (!convId) {
        convId = await startNewConversation();
        if (!convId) return;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      // Immediately render user message
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Save user message to database if authenticated
        if (isAuthed && user) {
          await createMessage(user.id, convId, trimmed, "user");
        }

        // Build message history for AI
        const messageHistory = [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content,
        }));

        // Call AI coach edge function
        const { data, error } = await supabase.functions.invoke("ai-coach", {
          body: { messages: messageHistory, userId: user?.id },
        });

        let assistantContent: string;
        
        if (error) {
          console.error("AI error:", error);
          assistantContent = "I'm having trouble connecting right now. Please try again in a moment.";
        } else if (data?.error) {
          assistantContent = data.message || data.error;
        } else {
          assistantContent = data?.response || "I'm here to help! What would you like to discuss about your habits and goals?";
        }
        
        const assistantId = crypto.randomUUID();
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: assistantContent, timestamp: new Date() },
        ]);

        // Save assistant message to database if authenticated
        if (isAuthed && user) {
          await createMessage(user.id, convId, assistantContent, "assistant");
        }

        // Auto-generate smart title from first AI response
        if (messages.length === 0) {
          const smartTitle = generateSmartTitle(trimmed, assistantContent);
          await updateConversationTitle(convId, smartTitle);
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Sorry — I ran into an error: ${error instanceof Error ? error.message : "Unknown error"}.`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, startNewConversation, updateConversationTitle, isAuthed, user]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
    currentConvIdRef.current = null;
  }, []);

  return {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    sendMessage,
    loadConversations,
    loadConversation,
    startNewConversation,
    updateConversationTitle,
    deleteConversation,
    clearMessages,
    // Expose for UI decisions
    isAuthed,
  };
}

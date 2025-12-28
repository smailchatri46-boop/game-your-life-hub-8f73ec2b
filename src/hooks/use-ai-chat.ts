import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Use ref to track current conversation ID to avoid stale closures
  const currentConvIdRef = useRef<string | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to load conversations:", error);
      return;
    }

    if (data) {
      setConversations(
        data.map((c) => ({
          id: c.id,
          title: c.title,
          createdAt: new Date(c.created_at),
          updatedAt: new Date(c.updated_at),
        }))
      );
    }
  }, [user]);

  const loadConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    setCurrentConversationId(conversationId);
    currentConvIdRef.current = conversationId;

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load conversation messages:", error);
      return;
    }

    if (data) {
      setMessages(
        data.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date(m.created_at),
        }))
      );
    }
  }, [user]);

  const startNewConversation = useCallback(async (): Promise<string | null> => {
    if (!user) {
      console.error("No user found for creating conversation");
      return null;
    }

    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({
        user_id: user.id,
        title: "New conversation",
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to create conversation:", error);
      return null;
    }

    const newConv: Conversation = {
      id: data.id,
      title: data.title,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(data.id);
    currentConvIdRef.current = data.id;
    setMessages([]);

    return data.id;
  }, [user]);

  const updateConversationTitle = useCallback(async (conversationId: string, title: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("chat_conversations")
      .update({ title })
      .eq("id", conversationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to update conversation title:", error);
      return;
    }

    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, title } : c))
    );
  }, [user]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("chat_conversations")
      .delete()
      .eq("id", conversationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to delete conversation:", error);
      return;
    }

    setConversations((prev) => prev.filter((c) => c.id !== conversationId));

    if (currentConvIdRef.current === conversationId) {
      setCurrentConversationId(null);
      currentConvIdRef.current = null;
      setMessages([]);
    }
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user) {
      console.error("No user found, cannot send message");
      return;
    }

    let convId = currentConvIdRef.current;

    // Create new conversation if none exists
    if (!convId) {
      console.log("Creating new conversation...");
      convId = await startNewConversation();
      if (!convId) {
        console.error("Failed to create conversation");
        return;
      }
      console.log("Created conversation:", convId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Add message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message to database
    const { error: insertError } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content,
      conversation_id: convId,
    });

    if (insertError) {
      console.error("Failed to save user message:", insertError);
    }

    // Auto-generate title from first message
    const currentMessages = messages;
    if (currentMessages.length === 0) {
      const shortTitle = content.slice(0, 40) + (content.length > 40 ? "..." : "");
      await updateConversationTitle(convId, shortTitle);
    }

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

      console.log("Sending message to AI...");
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...currentMessages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("AI response error:", errorData);

        if (response.status === 429 && (errorData.error === "limit_reached" || errorData.error === "daily_limit_reached")) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: errorData.message,
              timestamp: new Date(),
            },
          ]);
          return;
        }

        throw new Error(errorData.error || errorData.message || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Save assistant message
      if (assistantContent) {
        const { error: assistantInsertError } = await supabase.from("chat_messages").insert({
          user_id: user.id,
          role: "assistant",
          content: assistantContent,
          conversation_id: convId,
        });

        if (assistantInsertError) {
          console.error("Failed to save assistant message:", assistantInsertError);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, user, startNewConversation, updateConversationTitle]);

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
  };
}

import { useCallback, useRef, useState } from "react";
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

// Dev/test mode: allow chat without login.
// IMPORTANT: This uses a fixed UUID so the backend can apply usage limits.
const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Avoid stale closures when creating/selecting conversations.
  const currentConvIdRef = useRef<string | null>(null);

  const isAuthed = !!user;
  const effectiveUserId = user?.id ?? DEV_USER_ID;

  const loadConversations = useCallback(async () => {
    if (!isAuthed) {
      setConversations([]);
      return;
    }

    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("user_id", user!.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to load conversations:", error);
      return;
    }

    setConversations(
      (data ?? []).map((c) => ({
        id: c.id,
        title: c.title,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at),
      }))
    );
  }, [isAuthed, user]);

  const loadConversation = useCallback(
    async (conversationId: string) => {
      setCurrentConversationId(conversationId);
      currentConvIdRef.current = conversationId;

      if (!isAuthed) {
        // Dev mode: messages are local-only.
        return;
      }

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user!.id)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load conversation messages:", error);
        return;
      }

      setMessages(
        (data ?? []).map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date(m.created_at),
        }))
      );
    },
    [isAuthed, user]
  );

  const startNewConversation = useCallback(async (): Promise<string | null> => {
    const now = new Date();

    if (!isAuthed) {
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
    }

    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ user_id: user!.id, title: "New conversation" })
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
  }, [isAuthed, user]);

  const updateConversationTitle = useCallback(
    async (conversationId: string, title: string) => {
      if (!title.trim()) return;

      if (!isAuthed) {
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, title: title.trim(), updatedAt: new Date() } : c))
        );
        return;
      }

      const { error } = await supabase
        .from("chat_conversations")
        .update({ title: title.trim() })
        .eq("id", conversationId)
        .eq("user_id", user!.id);

      if (error) {
        console.error("Failed to update conversation title:", error);
        return;
      }

      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, title: title.trim() } : c))
      );
    },
    [isAuthed, user]
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      if (!isAuthed) {
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
        if (currentConvIdRef.current === conversationId) {
          setCurrentConversationId(null);
          currentConvIdRef.current = null;
          setMessages([]);
        }
        return;
      }

      const { error } = await supabase
        .from("chat_conversations")
        .delete()
        .eq("id", conversationId)
        .eq("user_id", user!.id);

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

      // Persist only when authed
      if (isAuthed) {
        await supabase.from("chat_messages").insert({
          user_id: user!.id,
          role: "user",
          content: trimmed,
          conversation_id: convId,
        });

        // Auto-title from first message
        if (messages.length === 0) {
          const shortTitle = trimmed.slice(0, 40) + (trimmed.length > 40 ? "..." : "");
          await updateConversationTitle(convId, shortTitle);
        }
      } else {
        // Dev mode: local title only
        if (messages.length === 0) {
          const shortTitle = trimmed.slice(0, 40) + (trimmed.length > 40 ? "..." : "");
          await updateConversationTitle(convId, shortTitle);
        }
      }

      try {
        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

        const response = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
            userId: effectiveUserId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          if (
            response.status === 429 &&
            (errorData.error === "limit_reached" || errorData.error === "daily_limit_reached")
          ) {
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: errorData.message || "Usage limit reached.",
                timestamp: new Date(),
              },
            ]);
            return;
          }

          throw new Error(errorData.error || errorData.message || `Request failed (${response.status})`);
        }

        if (!response.body) throw new Error("No response body");

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
                  prev.map((m) => (m.id === assistantId ? { ...m, content: assistantContent } : m))
                );
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }

        // Persist assistant only when authed
        if (assistantContent && isAuthed) {
          await supabase.from("chat_messages").insert({
            user_id: user!.id,
            role: "assistant",
            content: assistantContent,
            conversation_id: convId,
          });
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
    [effectiveUserId, isAuthed, messages, startNewConversation, updateConversationTitle, user, isLoading]
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

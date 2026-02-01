// Supabase service for chat conversations and messages
import { supabase } from "@/integrations/supabase/client";
import type { ChatConversation, ChatMessage, AIUsage } from "@/services/firestore/types";

// ============ CONVERSATIONS ============

export async function getConversations(userId: string): Promise<ChatConversation[]> {
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  return data || [];
}

export async function createConversation(
  userId: string,
  title: string = "New conversation"
): Promise<ChatConversation> {
  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({
      user_id: userId,
      title,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create conversation: ${error.message}`);
  }

  return data;
}

export async function updateConversation(
  conversationId: string,
  userId: string,
  updates: Partial<Pick<ChatConversation, "title">>
): Promise<void> {
  const { error } = await supabase
    .from("chat_conversations")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to update conversation: ${error.message}`);
  }
}

export async function deleteConversation(
  conversationId: string,
  userId: string
): Promise<void> {
  // Delete all messages in the conversation first
  await supabase
    .from("chat_messages")
    .delete()
    .eq("conversation_id", conversationId)
    .eq("user_id", userId);

  // Delete the conversation
  const { error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete conversation: ${error.message}`);
  }
}

// ============ MESSAGES ============

export async function getMessages(
  conversationId: string,
  userId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data as ChatMessage[] || [];
}

export async function createMessage(
  userId: string,
  conversationId: string,
  content: string,
  role: "user" | "assistant"
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      user_id: userId,
      conversation_id: conversationId,
      content,
      role,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create message: ${error.message}`);
  }

  // Update conversation's updated_at
  await supabase
    .from("chat_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return data as ChatMessage;
}

// ============ AI USAGE ============

export async function getAIUsage(
  userId: string,
  monthYear: string
): Promise<AIUsage | null> {
  const { data, error } = await supabase
    .from("ai_usage")
    .select("*")
    .eq("user_id", userId)
    .eq("month_year", monthYear)
    .maybeSingle();

  if (error) {
    console.error("Error fetching AI usage:", error);
    return null;
  }

  return data;
}

export async function updateAIUsage(
  userId: string,
  monthYear: string,
  messageCount: number
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const existing = await getAIUsage(userId, monthYear);

  if (existing) {
    const { error } = await supabase
      .from("ai_usage")
      .update({
        message_count: messageCount,
        last_message_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      throw new Error(`Failed to update AI usage: ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from("ai_usage")
      .insert({
        user_id: userId,
        month_year: monthYear,
        message_count: messageCount,
        last_message_date: today,
        voice_seconds_today: 0,
        voice_last_date: today,
        voice_seconds_used: 0,
      });

    if (error) {
      throw new Error(`Failed to create AI usage: ${error.message}`);
    }
  }
}

export async function getTodayMessageCount(userId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0];
  const todayStart = `${today}T00:00:00.000Z`;

  const { count, error } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "user")
    .gte("created_at", todayStart);

  if (error) {
    console.error("Error counting today's messages:", error);
    return 0;
  }

  return count || 0;
}

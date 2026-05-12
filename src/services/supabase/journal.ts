// Supabase service for journal entries
import { supabase } from "@/integrations/supabase/client";
import type { JournalEntry } from "@/services/supabase/types";

export async function getJournalEntries(
  userId: string,
  limitCount: number = 50
): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limitCount);

  if (error) {
    console.error("Error fetching journal entries:", error);
    return [];
  }

  return data || [];
}

export async function createJournalEntry(
  userId: string,
  entry: Omit<JournalEntry, "id" | "user_id" | "created_at" | "updated_at">
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      ...entry,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create journal entry: ${error.message}`);
  }

  return data;
}

export async function updateJournalEntry(
  entryId: string,
  userId: string,
  updates: Partial<Omit<JournalEntry, "id" | "user_id" | "created_at">>
): Promise<void> {
  const { error } = await supabase
    .from("journal_entries")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to update journal entry: ${error.message}`);
  }
}

export async function deleteJournalEntry(entryId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete journal entry: ${error.message}`);
  }
}

export async function getJournalEntryCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error counting journal entries:", error);
    return 0;
  }

  return count || 0;
}

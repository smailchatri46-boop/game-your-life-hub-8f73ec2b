// Supabase service for mood logs
import { supabase } from "@/integrations/supabase/client";
import type { MoodLog } from "@/services/supabase/types";

export async function getMoodLogs(
  userId: string,
  startDate: string,
  endDate: string
): Promise<MoodLog[]> {
  const { data, error } = await supabase
    .from("mood_logs")
    .select("id, user_id, date, mood, motivation, reflection, created_at")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching mood logs:", error);
    return [];
  }

  return data || [];
}

export async function getMoodLogForDate(
  userId: string,
  date: string
): Promise<MoodLog | null> {
  const { data, error } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();

  if (error) {
    console.error("Error fetching mood log:", error);
    return null;
  }

  return data;
}

export async function upsertMoodLog(
  userId: string,
  date: string,
  mood?: number,
  motivation?: number,
  reflection?: string
): Promise<MoodLog> {
  const existing = await getMoodLogForDate(userId, date);

  if (existing) {
    // Update existing
    const updates: Partial<MoodLog> = {};
    if (mood !== undefined) updates.mood = mood;
    if (motivation !== undefined) updates.motivation = motivation;
    if (reflection !== undefined) updates.reflection = reflection;

    const { data, error } = await supabase
      .from("mood_logs")
      .update(updates)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update mood log: ${error.message}`);
    }
    return data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from("mood_logs")
      .insert({
        user_id: userId,
        date,
        mood: mood ?? null,
        motivation: motivation ?? null,
        reflection: reflection ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create mood log: ${error.message}`);
    }
    return data;
  }
}

export async function deleteMoodLog(logId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("mood_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete mood log: ${error.message}`);
  }
}

export async function getRecentMoodLogs(
  userId: string,
  limitCount: number = 30
): Promise<MoodLog[]> {
  const { data, error } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limitCount);

  if (error) {
    console.error("Error fetching recent mood logs:", error);
    return [];
  }

  return data || [];
}

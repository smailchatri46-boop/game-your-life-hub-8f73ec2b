// Supabase service for habits
import { supabase } from "@/integrations/supabase/client";
import type { Habit, HabitCompletion } from "@/services/firestore/types";

// ============ HABITS ============

export async function getHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  return data || [];
}

export async function createHabit(
  userId: string,
  habit: Omit<Habit, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Habit> {
  const { data, error } = await supabase
    .from("habits")
    .insert({
      ...habit,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create habit: ${error.message}`);
  }

  return data;
}

export async function updateHabit(
  habitId: string,
  userId: string,
  updates: Partial<Omit<Habit, "id" | "user_id" | "created_at">>
): Promise<void> {
  const { error } = await supabase
    .from("habits")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", habitId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to update habit: ${error.message}`);
  }
}

export async function deleteHabit(habitId: string, userId: string): Promise<void> {
  // Delete completions first
  await supabase
    .from("habit_completions")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", userId);

  // Delete the habit
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete habit: ${error.message}`);
  }
}

// ============ HABIT COMPLETIONS ============

export async function getCompletions(
  userId: string,
  startDate: string,
  endDate: string
): Promise<HabitCompletion[]> {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error("Error fetching completions:", error);
    return [];
  }

  return data || [];
}

export async function getCompletionForDate(
  habitId: string,
  userId: string,
  date: string
): Promise<HabitCompletion | null> {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();

  if (error) {
    console.error("Error fetching completion:", error);
    return null;
  }

  return data;
}

export async function upsertCompletion(
  habitId: string,
  userId: string,
  date: string,
  value: number
): Promise<HabitCompletion | null> {
  const existing = await getCompletionForDate(habitId, userId, date);

  if (value === 0) {
    // Delete if exists
    if (existing) {
      await supabase
        .from("habit_completions")
        .delete()
        .eq("id", existing.id);
    }
    return null;
  }

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from("habit_completions")
      .update({ value })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update completion: ${error.message}`);
    }
    return data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from("habit_completions")
      .insert({
        habit_id: habitId,
        user_id: userId,
        date,
        value,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create completion: ${error.message}`);
    }
    return data;
  }
}

export async function deleteCompletion(
  habitId: string,
  userId: string,
  date: string
): Promise<void> {
  const { error } = await supabase
    .from("habit_completions")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("date", date);

  if (error) {
    throw new Error(`Failed to delete completion: ${error.message}`);
  }
}

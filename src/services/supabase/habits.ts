// Supabase service for habits
import { supabase } from "@/integrations/supabase/client";
import type { Habit, HabitCompletion } from "@/services/supabase/types";

// ============ HABITS ============

export interface HabitWithSchedule extends Habit {
  schedule_days?: number[] | null;
  position?: number;
}

export async function getHabits(userId: string): Promise<HabitWithSchedule[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  return data || [];
}

export async function createHabit(
  userId: string,
  habit: Omit<Habit, "id" | "user_id" | "created_at" | "updated_at"> & { schedule_days?: number[] }
): Promise<HabitWithSchedule> {
  // Get max position
  const { data: existing } = await supabase
    .from("habits")
    .select("position")
    .eq("user_id", userId)
    .order("position", { ascending: false })
    .limit(1);
    
  const nextPosition = existing && existing.length > 0 ? (existing[0].position || 0) + 1 : 0;
  
  const { data, error } = await supabase
    .from("habits")
    .insert({
      ...habit,
      user_id: userId,
      position: nextPosition,
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

export async function updateHabitPositions(
  userId: string,
  updates: { id: string; position: number }[]
): Promise<void> {
  // Update positions in parallel
  await Promise.all(
    updates.map(({ id, position }) =>
      supabase
        .from("habits")
        .update({ position })
        .eq("id", id)
        .eq("user_id", userId)
    )
  );
}

/**
 * Check if a habit should be visible on a specific day
 * @param habit - The habit to check
 * @param dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns true if the habit should be shown on this day
 */
export function isHabitVisibleOnDay(habit: HabitWithSchedule, dayOfWeek: number): boolean {
  // If no schedule_days or empty array, habit is daily (visible every day)
  if (!habit.schedule_days || habit.schedule_days.length === 0) {
    return true;
  }
  // Check if the day is in the schedule
  return habit.schedule_days.includes(dayOfWeek);
}

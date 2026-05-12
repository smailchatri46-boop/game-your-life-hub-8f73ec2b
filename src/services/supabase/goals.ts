// Supabase service for goals
import { supabase } from "@/integrations/supabase/client";
import type { Goal, GoalHabit } from "@/services/supabase/types";

// ============ GOALS ============

export async function getGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching goals:", error);
    return [];
  }

  return (data || []) as Goal[];
}

export async function createGoal(
  userId: string,
  goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at" | "completed_count" | "status">,
  habitIds: string[] = []
): Promise<Goal> {
  const { data, error } = await supabase
    .from("goals")
    .insert({
      ...goal,
      user_id: userId,
      completed_count: 0,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create goal: ${error.message}`);
  }

  // Link habits if provided
  if (habitIds.length > 0) {
    const links = habitIds.map((habitId) => ({
      goal_id: data.id,
      habit_id: habitId,
      user_id: userId,
    }));

    await supabase.from("goal_habits").insert(links);
  }

  return data as Goal;
}

export async function updateGoal(
  goalId: string,
  userId: string,
  updates: Partial<Omit<Goal, "id" | "user_id" | "created_at">>
): Promise<void> {
  const { error } = await supabase
    .from("goals")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", goalId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to update goal: ${error.message}`);
  }
}

export async function deleteGoal(goalId: string, userId: string): Promise<void> {
  // Delete goal habits first
  await supabase
    .from("goal_habits")
    .delete()
    .eq("goal_id", goalId)
    .eq("user_id", userId);

  // Delete the goal
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete goal: ${error.message}`);
  }
}

export async function incrementGoalProgress(
  goalId: string,
  userId: string,
  currentCount: number,
  targetCount: number,
  amount: number = 1
): Promise<void> {
  const newCount = Math.min(currentCount + amount, targetCount);
  const newStatus = newCount >= targetCount ? "completed" : "active";

  const { error } = await supabase
    .from("goals")
    .update({
      completed_count: newCount,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", goalId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to increment goal progress: ${error.message}`);
  }
}

// ============ GOAL HABITS ============

export async function getGoalHabits(userId: string): Promise<GoalHabit[]> {
  const { data, error } = await supabase
    .from("goal_habits")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching goal habits:", error);
    return [];
  }

  return data || [];
}

export async function linkHabitToGoal(
  goalId: string,
  habitId: string,
  userId: string
): Promise<GoalHabit> {
  const { data, error } = await supabase
    .from("goal_habits")
    .insert({
      goal_id: goalId,
      habit_id: habitId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to link habit to goal: ${error.message}`);
  }

  return data;
}

export async function unlinkHabitFromGoal(
  goalId: string,
  habitId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("goal_habits")
    .delete()
    .eq("goal_id", goalId)
    .eq("habit_id", habitId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to unlink habit from goal: ${error.message}`);
  }
}

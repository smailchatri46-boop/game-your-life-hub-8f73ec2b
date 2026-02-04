// Supabase service for daily todos
import { supabase } from "@/integrations/supabase/client";
import type { DailyTodo } from "@/services/firestore/types";

export interface TodoWithEmoji extends DailyTodo {
  emoji?: string;
  position?: number;
}

export async function getTodosForDate(
  userId: string,
  date: string
): Promise<TodoWithEmoji[]> {
  const { data, error } = await supabase
    .from("daily_todos")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }

  return data || [];
}

export async function createTodo(
  userId: string,
  text: string,
  date: string,
  emoji: string = "📝"
): Promise<TodoWithEmoji> {
  // Get max position for the date
  const { data: existing } = await supabase
    .from("daily_todos")
    .select("position")
    .eq("user_id", userId)
    .eq("date", date)
    .order("position", { ascending: false })
    .limit(1);
    
  const nextPosition = existing && existing.length > 0 ? (existing[0].position || 0) + 1 : 0;
  
  const { data, error } = await supabase
    .from("daily_todos")
    .insert({
      user_id: userId,
      text,
      date,
      completed: false,
      emoji,
      position: nextPosition,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create todo: ${error.message}`);
  }

  return data;
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updates: Partial<Pick<DailyTodo, "text" | "completed">>
): Promise<void> {
  const { error } = await supabase
    .from("daily_todos")
    .update(updates)
    .eq("id", todoId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to update todo: ${error.message}`);
  }
}

export async function toggleTodo(
  todoId: string,
  userId: string,
  completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from("daily_todos")
    .update({ completed })
    .eq("id", todoId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to toggle todo: ${error.message}`);
  }
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("daily_todos")
    .delete()
    .eq("id", todoId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete todo: ${error.message}`);
  }
}

export async function updateTodoPositions(
  userId: string,
  updates: { id: string; position: number }[]
): Promise<void> {
  // Update positions in parallel
  await Promise.all(
    updates.map(({ id, position }) =>
      supabase
        .from("daily_todos")
        .update({ position })
        .eq("id", id)
        .eq("user_id", userId)
    )
  );
}

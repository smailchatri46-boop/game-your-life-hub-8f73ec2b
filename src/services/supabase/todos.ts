// Supabase service for daily todos
import { supabase } from "@/integrations/supabase/client";
import type { DailyTodo } from "@/services/firestore/types";

export async function getTodosForDate(
  userId: string,
  date: string
): Promise<DailyTodo[]> {
  const { data, error } = await supabase
    .from("daily_todos")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
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
  date: string
): Promise<DailyTodo> {
  const { data, error } = await supabase
    .from("daily_todos")
    .insert({
      user_id: userId,
      text,
      date,
      completed: false,
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

// Firestore data types - mirrors the Supabase schema
// These types define the structure of documents in Firestore collections

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  category: string;
  category_color: string | null;
  target: number;
  importance: number | null;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  value: number;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  category: string;
  category_emoji: string;
  start_date: string;
  end_date: string;
  target_count: number;
  completed_count: number;
  status: "active" | "completed";
  created_at: string;
  updated_at: string;
}

export interface GoalHabit {
  id: string;
  goal_id: string;
  habit_id: string;
  user_id: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  emoji: string | null;
  bg_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood: number | null;
  motivation: number | null;
  reflection: string | null;
  created_at: string;
}

export interface DailyTodo {
  id: string;
  user_id: string;
  date: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  conversation_id: string | null;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}

export interface AIUsage {
  id: string;
  user_id: string;
  month_year: string;
  message_count: number;
  last_message_date: string;
  voice_seconds_today: number;
  voice_last_date: string;
  voice_seconds_used: number;
  created_at: string;
  updated_at: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          emoji: string
          entity_id: string | null
          entity_name: string
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          emoji?: string
          entity_id?: string | null
          entity_name: string
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          emoji?: string
          entity_id?: string | null
          entity_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_usage: {
        Row: {
          created_at: string
          id: string
          last_message_date: string
          message_count: number
          month_year: string
          updated_at: string
          user_id: string
          voice_last_date: string
          voice_seconds_today: number
          voice_seconds_used: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_date?: string
          message_count?: number
          month_year: string
          updated_at?: string
          user_id: string
          voice_last_date?: string
          voice_seconds_today?: number
          voice_seconds_used?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_message_date?: string
          message_count?: number
          month_year?: string
          updated_at?: string
          user_id?: string
          voice_last_date?: string
          voice_seconds_today?: number
          voice_seconds_used?: number
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_todos: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          emoji: string | null
          id: string
          position: number | null
          text: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          emoji?: string | null
          id?: string
          position?: number | null
          text: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          emoji?: string | null
          id?: string
          position?: number | null
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_habits: {
        Row: {
          created_at: string
          goal_id: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_habits_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_habits_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          category_emoji: string
          completed_count: number
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
          status: string
          target_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          category_emoji?: string
          completed_count?: number
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: string
          target_count: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          category_emoji?: string
          completed_count?: number
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: string
          target_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          created_at: string
          date: string
          habit_id: string
          id: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          date: string
          habit_id: string
          id?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: string
          category_color: string | null
          created_at: string
          icon: string
          id: string
          importance: number | null
          name: string
          position: number | null
          schedule_days: number[] | null
          target: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          category_color?: string | null
          created_at?: string
          icon?: string
          id?: string
          importance?: number | null
          name: string
          position?: number | null
          schedule_days?: number[] | null
          target?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          category_color?: string | null
          created_at?: string
          icon?: string
          id?: string
          importance?: number | null
          name?: string
          position?: number | null
          schedule_days?: number[] | null
          target?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          bg_color: string | null
          content: string
          created_at: string
          emoji: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bg_color?: string | null
          content: string
          created_at?: string
          emoji?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bg_color?: string | null
          content?: string
          created_at?: string
          emoji?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          mood: number | null
          motivation: number | null
          reflection: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          mood?: number | null
          motivation?: number | null
          reflection?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mood?: number | null
          motivation?: number | null
          reflection?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding_data: {
        Row: {
          ai_preferences: Json | null
          checked_affirmations: string[] | null
          commitment_name: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string
          current_apps: string | null
          focus_areas: string[] | null
          id: string
          past_experience: Json | null
          struggles: string[] | null
          survey_answers: Json | null
          tracking_struggles: string[] | null
          unique_about: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_preferences?: Json | null
          checked_affirmations?: string[] | null
          commitment_name?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_apps?: string | null
          focus_areas?: string[] | null
          id?: string
          past_experience?: Json | null
          struggles?: string[] | null
          survey_answers?: Json | null
          tracking_struggles?: string[] | null
          unique_about?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_preferences?: Json | null
          checked_affirmations?: string[] | null
          commitment_name?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_apps?: string | null
          focus_areas?: string[] | null
          id?: string
          past_experience?: Json | null
          struggles?: string[] | null
          survey_answers?: Json | null
          tracking_struggles?: string[] | null
          unique_about?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          id: string
          plan: string | null
          polar_customer_id: string | null
          polar_subscription_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string | null
          polar_customer_id?: string | null
          polar_subscription_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string | null
          polar_customer_id?: string | null
          polar_subscription_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

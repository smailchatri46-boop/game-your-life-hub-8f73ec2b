import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";
import { format, subDays, startOfMonth, endOfMonth, isToday, parseISO } from "date-fns";

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

// Demo data for when user is not authenticated
const DEMO_HABITS: Habit[] = [
  { id: "demo-1", user_id: "demo", name: "Morning Meditation", icon: "🧘", category: "Mind", category_color: "#8B5CF6", target: 1, importance: 70, created_at: "", updated_at: "" },
  { id: "demo-2", user_id: "demo", name: "Exercise", icon: "💪", category: "Health", category_color: "#22C55E", target: 1, importance: 80, created_at: "", updated_at: "" },
  { id: "demo-3", user_id: "demo", name: "Read 30 mins", icon: "📚", category: "Growth", category_color: "#EC4899", target: 1, importance: 60, created_at: "", updated_at: "" },
  { id: "demo-4", user_id: "demo", name: "Drink Water", icon: "💧", category: "Health", category_color: "#22C55E", target: 8, importance: 50, created_at: "", updated_at: "" },
  { id: "demo-5", user_id: "demo", name: "No Social Media", icon: "📵", category: "Focus", category_color: "#3B82F6", target: 1, importance: 40, created_at: "", updated_at: "" },
];

// Generate demo completions for current month
const generateDemoCompletions = (habits: Habit[], year: number, month: number, currentDay: number): HabitCompletion[] => {
  const completions: HabitCompletion[] = [];
  
  habits.forEach(habit => {
    for (let day = 1; day <= currentDay; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (habit.target === 1) {
        if (Math.random() > 0.2) {
          completions.push({
            id: `demo-comp-${habit.id}-${dateStr}`,
            habit_id: habit.id,
            user_id: "demo",
            date: dateStr,
            value: 1,
            created_at: dateStr,
          });
        }
      } else {
        const value = Math.floor(Math.random() * (habit.target + 2));
        if (value > 0) {
          completions.push({
            id: `demo-comp-${habit.id}-${dateStr}`,
            habit_id: habit.id,
            user_id: "demo",
            date: dateStr,
            value,
            created_at: dateStr,
          });
        }
      }
    }
  });
  
  return completions;
};

// Generate demo mood logs
const generateDemoMoodLogs = (year: number, month: number, currentDay: number): MoodLog[] => {
  const logs: MoodLog[] = [];
  for (let day = 1; day <= currentDay; day++) {
    if (Math.random() > 0.4) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      logs.push({
        id: `demo-mood-${dateStr}`,
        user_id: "demo",
        date: dateStr,
        mood: Math.floor(Math.random() * 5) + 5, // 5-10
        motivation: Math.floor(Math.random() * 5) + 5, // 5-10
        reflection: null,
        created_at: dateStr,
      });
    }
  }
  return logs;
};

export function useHabitsData(selectedYear?: number, selectedMonth?: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isDemo = !user;
  
  const now = new Date();
  const year = selectedYear ?? now.getFullYear();
  const month = selectedMonth ?? now.getMonth();
  const currentDay = (year === now.getFullYear() && month === now.getMonth()) 
    ? now.getDate() 
    : new Date(year, month + 1, 0).getDate();

  // Fetch habits
  const habitsQuery = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user) return DEMO_HABITS;
      
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return (data as Habit[]) || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch completions for the selected month
  const completionsQuery = useQuery({
    queryKey: ["habit_completions", user?.id, year, month],
    queryFn: async () => {
      if (!user) {
        return generateDemoCompletions(DEMO_HABITS, year, month, currentDay);
      }
      
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;
      
      const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate);
      
      if (error) throw error;
      return (data as HabitCompletion[]) || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  // Fetch mood logs for the selected month
  const moodLogsQuery = useQuery({
    queryKey: ["mood_logs", user?.id, year, month],
    queryFn: async () => {
      if (!user) {
        return generateDemoMoodLogs(year, month, currentDay);
      }
      
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;
      
      const { data, error } = await supabase
        .from("mood_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate);
      
      if (error) throw error;
      return (data as MoodLog[]) || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  // Fetch todos for today
  const todosQuery = useQuery({
    queryKey: ["daily_todos", user?.id, format(now, "yyyy-MM-dd")],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("daily_todos")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", format(now, "yyyy-MM-dd"));
      
      if (error) throw error;
      return (data as DailyTodo[]) || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  // Create habit
  const createHabit = useMutation({
    mutationFn: async (habit: Omit<Habit, "id" | "user_id" | "created_at" | "updated_at">) => {
      if (!user) {
        toast.error("Please sign in to create habits");
        return null;
      }
      
      const { data, error } = await supabase
        .from("habits")
        .insert({ ...habit, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Habit created!");
    },
    onError: () => {
      toast.error("Failed to create habit");
    },
  });

  // Delete habit
  const deleteHabit = useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) return;
      
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit_completions"] });
      toast.success("Habit deleted");
    },
    onError: () => {
      toast.error("Failed to delete habit");
    },
  });

  // Toggle completion for a habit on a specific day
  const toggleCompletion = useMutation({
    mutationFn: async ({ habitId, date, currentValue, target }: { habitId: string; date: string; currentValue: number; target: number }) => {
      if (!user) return null;
      
      // For boolean habits (target=1): toggle between 0 and 1
      // For numeric habits: cycle 0 -> 1 -> 2 -> ... -> target -> 0
      let newValue: number;
      if (target === 1) {
        newValue = currentValue === 1 ? 0 : 1;
      } else {
        newValue = currentValue >= target ? 0 : currentValue + 1;
      }
      
      // If new value is 0, delete the completion record
      if (newValue === 0) {
        await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("date", date)
          .eq("user_id", user.id);
        return { deleted: true, habitId, date, newValue: 0 };
      }
      
      // Check if record exists
      const { data: existing } = await supabase
        .from("habit_completions")
        .select("id")
        .eq("habit_id", habitId)
        .eq("date", date)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (existing) {
        // Update
        const { error } = await supabase
          .from("habit_completions")
          .update({ value: newValue })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("habit_completions")
          .insert({
            habit_id: habitId,
            user_id: user.id,
            date,
            value: newValue,
          });
        if (error) throw error;
      }
      
      return { deleted: false, habitId, date, newValue };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit_completions"] });
    },
    onError: () => {
      toast.error("Failed to update completion");
    },
  });

  // Save mood log
  const saveMoodLog = useMutation({
    mutationFn: async ({ date, mood, motivation, reflection }: { date: string; mood?: number; motivation?: number; reflection?: string }) => {
      if (!user) return null;
      
      // Check if record exists
      const { data: existing } = await supabase
        .from("mood_logs")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", date)
        .maybeSingle();
      
      if (existing) {
        const { error } = await supabase
          .from("mood_logs")
          .update({ mood, motivation, reflection })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("mood_logs")
          .insert({
            user_id: user.id,
            date,
            mood,
            motivation,
            reflection,
          });
        if (error) throw error;
      }
      
      return { date, mood, motivation, reflection };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood_logs"] });
    },
    onError: () => {
      toast.error("Failed to save mood log");
    },
  });

  // Create todo
  const createTodo = useMutation({
    mutationFn: async ({ text, date }: { text: string; date: string }) => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("daily_todos")
        .insert({ user_id: user.id, text, date, completed: false })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_todos"] });
      toast.success("Task added!");
    },
    onError: () => {
      toast.error("Failed to add task");
    },
  });

  // Toggle todo
  const toggleTodo = useMutation({
    mutationFn: async ({ todoId, completed }: { todoId: string; completed: boolean }) => {
      if (!user) return;
      
      const { error } = await supabase
        .from("daily_todos")
        .update({ completed })
        .eq("id", todoId)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_todos"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  // Delete todo
  const deleteTodo = useMutation({
    mutationFn: async (todoId: string) => {
      if (!user) return;
      
      const { error } = await supabase
        .from("daily_todos")
        .delete()
        .eq("id", todoId)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_todos"] });
      toast.success("Task deleted");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  // Build completion map: habitId -> { dateKey -> value }
  const completionsMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    (completionsQuery.data || []).forEach(comp => {
      if (!map[comp.habit_id]) map[comp.habit_id] = {};
      map[comp.habit_id][comp.date] = comp.value;
    });
    return map;
  }, [completionsQuery.data]);

  // Build mood map: dateKey -> { mood, motivation, reflection }
  const moodMap = useMemo(() => {
    const map: Record<string, MoodLog> = {};
    (moodLogsQuery.data || []).forEach(log => {
      map[log.date] = log;
    });
    return map;
  }, [moodLogsQuery.data]);

  // Helper to get completion value for a habit on a date
  const getCompletionValue = useCallback((habitId: string, date: string): number => {
    return completionsMap[habitId]?.[date] || 0;
  }, [completionsMap]);

  // Calculate habit progress (percentage completed in current month)
  const getHabitProgress = useCallback((habitId: string, target: number): number => {
    const habitCompletions = completionsMap[habitId] || {};
    let completedDays = 0;
    
    for (let day = 1; day <= currentDay; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const value = habitCompletions[dateKey] || 0;
      if (target === 1) {
        if (value >= 1) completedDays++;
      } else {
        if (value >= target) completedDays++;
      }
    }
    
    return currentDay > 0 ? Math.round((completedDays / currentDay) * 100) : 0;
  }, [completionsMap, currentDay, year, month]);

  // Calculate stats
  const stats = useMemo(() => {
    const habits = habitsQuery.data || [];
    const completions = completionsMap;
    const moodLogs = moodLogsQuery.data || [];
    
    // Helper to get weighted progress for a day
    const getDayProgress = (day: number): number => {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let totalWeight = 0;
      let weightedProgress = 0;
      
      habits.forEach(habit => {
        const weight = habit.importance || 50;
        totalWeight += weight;
        const value = completions[habit.id]?.[dateKey] || 0;
        if (habit.target === 1) {
          if (value >= 1) weightedProgress += weight;
        } else {
          weightedProgress += (Math.min(value, habit.target) / habit.target) * weight;
        }
      });
      
      return totalWeight > 0 ? (weightedProgress / totalWeight) * 100 : 0;
    };

    // Today's progress
    const todayProgress = Math.round(getDayProgress(currentDay));

    // Week average (last 7 days)
    let weekTotal = 0;
    let weekDays = 0;
    for (let i = 0; i < 7; i++) {
      const day = currentDay - i;
      if (day > 0) {
        weekTotal += getDayProgress(day);
        weekDays++;
      }
    }
    const weekAvg = weekDays > 0 ? Math.round(weekTotal / weekDays) : 0;

    // Month average
    let monthTotal = 0;
    for (let day = 1; day <= currentDay; day++) {
      monthTotal += getDayProgress(day);
    }
    const monthPercent = currentDay > 0 ? Math.round(monthTotal / currentDay) : 0;

    // Perfect days this week (100% completion)
    let perfectDaysThisWeek = 0;
    for (let i = 0; i < 7; i++) {
      const day = currentDay - i;
      if (day > 0 && getDayProgress(day) >= 100) {
        perfectDaysThisWeek++;
      }
    }

    // Mood stats
    const moodValues = moodLogs.filter(l => l.mood != null).map(l => l.mood!);
    const avgMood = moodValues.length > 0 
      ? Math.round(moodValues.reduce((a, b) => a + b, 0) / moodValues.length)
      : 7;
    
    // Mood stability (inverse of variance, normalized to 1-10)
    let emotionalStability = 7;
    if (moodValues.length >= 2) {
      const mean = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
      const variance = moodValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / moodValues.length;
      const stdDev = Math.sqrt(variance);
      // Convert: 0 stdDev = 10 stability, 3+ stdDev = 1 stability
      emotionalStability = Math.max(1, Math.min(10, Math.round(10 - stdDev * 3)));
    }

    const MOOD_EMOJIS: Record<number, string> = {
      1: "😢", 2: "😞", 3: "😔", 4: "😕", 5: "😐",
      6: "🙂", 7: "😊", 8: "😄", 9: "🥳", 10: "🔥",
    };
    const MOOD_LABELS: Record<number, string> = {
      1: "Very Sad", 2: "Sad", 3: "Down", 4: "Meh", 5: "Neutral",
      6: "Okay", 7: "Happy", 8: "Great", 9: "Excited", 10: "On Fire",
    };

    return {
      todayProgress,
      weekAvg,
      monthPercent,
      perfectDaysThisWeek,
      averageMood: avgMood,
      averageMoodEmoji: MOOD_EMOJIS[avgMood] || "😊",
      averageMoodLabel: MOOD_LABELS[avgMood] || "Happy",
      emotionalStability,
    };
  }, [habitsQuery.data, completionsMap, moodLogsQuery.data, currentDay, year, month]);

  // Chart data for progress chart
  const chartData = useMemo(() => {
    const habits = habitsQuery.data || [];
    const data: { day: number; progress: number }[] = [];
    
    for (let day = 1; day <= currentDay; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let totalWeight = 0;
      let weightedProgress = 0;
      
      habits.forEach(habit => {
        const weight = habit.importance || 50;
        totalWeight += weight;
        const value = completionsMap[habit.id]?.[dateKey] || 0;
        if (habit.target === 1) {
          if (value >= 1) weightedProgress += weight;
        } else {
          weightedProgress += (Math.min(value, habit.target) / habit.target) * weight;
        }
      });
      
      data.push({
        day,
        progress: totalWeight > 0 ? Math.round((weightedProgress / totalWeight) * 100) : 0,
      });
    }
    
    return data;
  }, [habitsQuery.data, completionsMap, currentDay, year, month]);

  // Mood/motivation chart data
  const moodMotivationChartData = useMemo(() => {
    const data: { day: number; mood?: number; motivation?: number }[] = [];
    
    for (let day = 1; day <= currentDay; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const log = moodMap[dateKey];
      data.push({
        day,
        mood: log?.mood != null ? log.mood * 10 : undefined, // Convert 1-10 to 10-100
        motivation: log?.motivation != null ? log.motivation * 10 : undefined,
      });
    }
    
    return data;
  }, [moodMap, currentDay, year, month]);

  return {
    // Data
    habits: habitsQuery.data || [],
    completions: completionsQuery.data || [],
    completionsMap,
    moodLogs: moodLogsQuery.data || [],
    moodMap,
    todos: todosQuery.data || [],
    
    // Stats
    stats,
    chartData,
    moodMotivationChartData,
    
    // Helpers
    getCompletionValue,
    getHabitProgress,
    
    // Loading states
    isLoading: habitsQuery.isLoading || completionsQuery.isLoading,
    isDemo,
    
    // Mutations
    createHabit,
    deleteHabit,
    toggleCompletion,
    saveMoodLog,
    createTodo,
    toggleTodo,
    deleteTodo,
    
    // Meta
    currentDay,
    year,
    month,
  };
}

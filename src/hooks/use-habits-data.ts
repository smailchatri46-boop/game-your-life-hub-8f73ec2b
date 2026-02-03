import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import {
  getHabits,
  createHabit as createHabitService,
  deleteHabit as deleteHabitService,
  getCompletions,
  upsertCompletion,
  deleteCompletion,
} from "@/services/supabase/habits";
import {
  getMoodLogs,
  upsertMoodLog,
} from "@/services/supabase/mood";
import {
  getTodosForDate,
  createTodo as createTodoService,
  toggleTodo as toggleTodoService,
  deleteTodo as deleteTodoService,
} from "@/services/supabase/todos";
import { logActivity } from "@/services/supabase/activity";

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

  // Fetch habits from Firestore
  const habitsQuery = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user) return DEMO_HABITS;
      return await getHabits(user.id);
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch completions for the selected month from Firestore
  const completionsQuery = useQuery({
    queryKey: ["habit_completions", user?.id, year, month],
    queryFn: async () => {
      if (!user) {
        return generateDemoCompletions(DEMO_HABITS, year, month, currentDay);
      }
      
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;
      
      return await getCompletions(user.id, startDate, endDate);
    },
    staleTime: 1000 * 60 * 2,
  });

  // Fetch mood logs for the selected month from Firestore
  const moodLogsQuery = useQuery({
    queryKey: ["mood_logs", user?.id, year, month],
    queryFn: async () => {
      if (!user) {
        return generateDemoMoodLogs(year, month, currentDay);
      }
      
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;
      
      return await getMoodLogs(user.id, startDate, endDate);
    },
    staleTime: 1000 * 60 * 2,
  });

  // Fetch todos for today from Firestore
  const todosQuery = useQuery({
    queryKey: ["daily_todos", user?.id, format(now, "yyyy-MM-dd")],
    queryFn: async () => {
      if (!user) return [];
      return await getTodosForDate(user.id, format(now, "yyyy-MM-dd"));
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
      
      return await createHabitService(user.id, habit);
    },
    onSuccess: async () => {
      // CRITICAL: Immediately refetch to show new habit
      await queryClient.refetchQueries({ queryKey: ["habits", user?.id] });
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
      await deleteHabitService(habitId, user.id);
    },
    onSuccess: async () => {
      // CRITICAL: Immediately refetch to update UI
      await queryClient.refetchQueries({ queryKey: ["habits", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["habit_completions"] });
      toast.success("Habit deleted");
    },
    onError: () => {
      toast.error("Failed to delete habit");
    },
  });

  // Toggle completion for a habit on a specific day
  const toggleCompletion = useMutation({
    mutationFn: async ({ habitId, date, currentValue, target, habitName, habitIcon }: { 
      habitId: string; 
      date: string; 
      currentValue: number; 
      target: number;
      habitName?: string;
      habitIcon?: string;
    }) => {
      if (!user) return null;
      
      // For boolean habits (target=1): toggle between 0 and 1
      // For numeric habits: cycle 0 -> 1 -> 2 -> ... -> target -> 0
      let newValue: number;
      if (target === 1) {
        newValue = currentValue === 1 ? 0 : 1;
      } else {
        newValue = currentValue >= target ? 0 : currentValue + 1;
      }
      
      // Use upsertCompletion which handles create/update/delete
      await upsertCompletion(habitId, user.id, date, newValue);
      
      // Log activity if habit was just completed (went from incomplete to complete)
      const wasCompleted = target === 1 ? currentValue >= 1 : currentValue >= target;
      const isNowCompleted = target === 1 ? newValue >= 1 : newValue >= target;
      
      if (!wasCompleted && isNowCompleted && habitName) {
        await logActivity(user.id, "habit_completed", habitName, habitIcon || "✅", habitId);
      }
      
      return { habitId, date, newValue };
    },
    // OPTIMISTIC UPDATE: Update UI immediately before server responds
    onMutate: async ({ habitId, date, currentValue, target }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["habit_completions", user?.id, year, month] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData<HabitCompletion[]>(["habit_completions", user?.id, year, month]);
      
      // Calculate new value
      let newValue: number;
      if (target === 1) {
        newValue = currentValue === 1 ? 0 : 1;
      } else {
        newValue = currentValue >= target ? 0 : currentValue + 1;
      }
      
      // Optimistically update the cache
      queryClient.setQueryData<HabitCompletion[]>(
        ["habit_completions", user?.id, year, month],
        (old = []) => {
          const existingIndex = old.findIndex(c => c.habit_id === habitId && c.date === date);
          
          if (newValue === 0) {
            // Remove the completion
            return old.filter((_, i) => i !== existingIndex);
          }
          
          if (existingIndex >= 0) {
            // Update existing completion
            return old.map((c, i) => i === existingIndex ? { ...c, value: newValue } : c);
          } else {
            // Add new completion
            return [...old, {
              id: `temp-${habitId}-${date}`,
              habit_id: habitId,
              user_id: user?.id || "",
              date,
              value: newValue,
              created_at: new Date().toISOString(),
            }];
          }
        }
      );
      
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["habit_completions", user?.id, year, month], context.previousData);
      }
      toast.error("Failed to update completion");
    },
    onSettled: () => {
      // Silently refetch in background to ensure consistency (no await)
      queryClient.invalidateQueries({ queryKey: ["habit_completions"] });
      queryClient.invalidateQueries({ queryKey: ["recent_activities"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-completions"] });
      queryClient.invalidateQueries({ queryKey: ["goal_completions"] });
    },
  });

  // Save mood log
  const saveMoodLog = useMutation({
    mutationFn: async ({ date, mood, motivation, reflection }: { date: string; mood?: number; motivation?: number; reflection?: string }) => {
      if (!user) return null;
      const result = await upsertMoodLog(user.id, date, mood, motivation, reflection);
      
      // Log activity
      await logActivity(user.id, "mood_logged", "Mood & Motivation", "💭");
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mood_logs"] });
      queryClient.invalidateQueries({ queryKey: ["recent_activities"] });
    },
    onError: () => {
      toast.error("Failed to save mood log");
    },
  });

  // Create todo
  const createTodo = useMutation({
    mutationFn: async ({ text, date }: { text: string; date: string }) => {
      if (!user) return null;
      return await createTodoService(user.id, text, date);
    },
    onSuccess: async () => {
      // CRITICAL: Immediately refetch to show new task
      await queryClient.refetchQueries({ queryKey: ["daily_todos"] });
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
      await toggleTodoService(todoId, user.id, completed);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["daily_todos"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  // Delete todo
  const deleteTodo = useMutation({
    mutationFn: async (todoId: string) => {
      if (!user) return;
      await deleteTodoService(todoId, user.id);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["daily_todos"] });
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
    const todayPercent = Math.round(getDayProgress(currentDay));

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

    // Perfect days count (100% completion)
    let perfectDays = 0;
    for (let day = 1; day <= currentDay; day++) {
      if (getDayProgress(day) >= 100) perfectDays++;
    }

    // Current streak
    let streak = 0;
    for (let day = currentDay; day > 0; day--) {
      if (getDayProgress(day) >= 80) {
        streak++;
      } else {
        break;
      }
    }

    // Average mood/motivation
    const moodValues = moodLogs.filter(l => l.mood !== null).map(l => l.mood as number);
    const avgMood = moodValues.length > 0 ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length : 5;

    return { todayPercent, weekAvg, monthPercent, perfectDays, streak, avgMood };
  }, [habitsQuery.data, completionsMap, moodLogsQuery.data, currentDay, year, month]);

  // Chart data for progress chart
  const chartData = useMemo(() => {
    const habits = habitsQuery.data || [];
    const completions = completionsMap;
    
    return Array.from({ length: currentDay }, (_, i) => {
      const day = i + 1;
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
      
      return {
        day,
        progress: totalWeight > 0 ? Math.round((weightedProgress / totalWeight) * 100) : 0,
      };
    });
  }, [habitsQuery.data, completionsMap, currentDay, year, month]);

  // Mood/motivation chart data
  const moodMotivationChartData = useMemo(() => {
    return Array.from({ length: currentDay }, (_, i) => {
      const day = i + 1;
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const log = moodMap[dateKey];
      
      return {
        day,
        mood: log?.mood !== null ? (log?.mood ?? 0) * 10 : undefined,
        motivation: log?.motivation !== null ? (log?.motivation ?? 0) * 10 : undefined,
      };
    });
  }, [moodMap, currentDay, year, month]);

  return {
    habits: habitsQuery.data || [],
    completions: completionsQuery.data || [],
    moodLogs: moodLogsQuery.data || [],
    todos: todosQuery.data || [],
    completionsMap,
    moodMap,
    stats,
    chartData,
    moodMotivationChartData,
    getCompletionValue,
    getHabitProgress,
    isLoading: habitsQuery.isLoading || completionsQuery.isLoading,
    isDemo,
    createHabit,
    deleteHabit,
    toggleCompletion,
    saveMoodLog,
    createTodo,
    toggleTodo,
    deleteTodo,
  };
}

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Habit {
  id: string;
  target: number;
  importance: number | null;
}

interface Completion {
  habit_id: string;
  date: string;
  value: number;
}

interface Task {
  date: string;
  completed: boolean;
}

/**
 * Color mapping based on completion percentage
 * 0% → neutral / very light
 * 1-49% → light orange
 * 50-79% → medium orange  
 * 80-99% → dark orange
 * 100% → strongest orange
 */
export function getCalendarDayColor(percentage: number): {
  bg: string;
  hover: string;
  intensity: "none" | "low" | "medium" | "high" | "perfect";
} {
  if (percentage === 0) {
    return { bg: "bg-secondary", hover: "hover:bg-secondary/80", intensity: "none" };
  }
  if (percentage < 50) {
    return { bg: "bg-orange-100", hover: "hover:bg-orange-200", intensity: "low" };
  }
  if (percentage < 80) {
    return { bg: "bg-orange-200", hover: "hover:bg-orange-300", intensity: "medium" };
  }
  if (percentage < 100) {
    return { bg: "bg-orange-300", hover: "hover:bg-orange-400", intensity: "high" };
  }
  // 100%
  return { bg: "bg-orange-400", hover: "hover:bg-orange-500", intensity: "perfect" };
}

export function useCalendarData(year: number, month: number) {
  const { user } = useAuth();
  const isDemo = !user;

  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const currentDay = isCurrentMonth ? now.getDate() : new Date(year, month + 1, 0).getDate();

  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, "0")}`;

  // Fetch habits
  const habitsQuery = useQuery({
    queryKey: ["calendar-habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("habits")
        .select("id, target, importance")
        .eq("user_id", user.id);
      return (data as Habit[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch completions for month
  const completionsQuery = useQuery({
    queryKey: ["calendar-completions", user?.id, year, month],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("habit_completions")
        .select("habit_id, date, value")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate);
      return (data as Completion[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch todos for month
  const todosQuery = useQuery({
    queryKey: ["calendar-todos", user?.id, year, month],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("daily_todos")
        .select("date, completed")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate);
      return (data as Task[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  // Build completion maps
  const { completionsMap, todosMap } = useMemo(() => {
    const compMap: Record<string, Record<string, number>> = {};
    (completionsQuery.data || []).forEach(c => {
      if (!compMap[c.habit_id]) compMap[c.habit_id] = {};
      compMap[c.habit_id][c.date] = c.value;
    });

    const todoMap: Record<string, { total: number; completed: number }> = {};
    (todosQuery.data || []).forEach(t => {
      if (!todoMap[t.date]) todoMap[t.date] = { total: 0, completed: 0 };
      todoMap[t.date].total++;
      if (t.completed) todoMap[t.date].completed++;
    });

    return { completionsMap: compMap, todosMap: todoMap };
  }, [completionsQuery.data, todosQuery.data]);

  // Calculate day completion percentage - ONLY based on to-dos (not habits)
  const getDayCompletionRate = useMemo(() => {
    return (day: number): number => {
      // Future days always return 0 (no progress shown)
      if (day > currentDay) return 0;
      
      if (isDemo) {
        // Demo mode - return random for past days
        return Math.floor(Math.random() * 100);
      }

      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      
      // Only count tasks (to-dos), NOT habits
      const dayTasks = todosMap[dateKey] || { total: 0, completed: 0 };

      if (dayTasks.total === 0) return 0;

      return Math.round((dayTasks.completed / dayTasks.total) * 100);
    };
  }, [todosMap, year, month, currentDay, isDemo]);

  // Precompute all day percentages
  const dayPercentages = useMemo(() => {
    const percentages: Record<number, number> = {};
    for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
      percentages[day] = getDayCompletionRate(day);
    }
    return percentages;
  }, [getDayCompletionRate, year, month]);

  return {
    dayPercentages,
    getDayCompletionRate,
    getCalendarDayColor,
    currentDay,
    isCurrentMonth,
    isLoading: habitsQuery.isLoading || completionsQuery.isLoading || todosQuery.isLoading,
    refetch: () => {
      completionsQuery.refetch();
      todosQuery.refetch();
    },
  };
}

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfDay, subDays, startOfMonth, format } from "date-fns";

interface HabitStats {
  todayPercent: number;
  todayCompleted: number;
  todayTotal: number;
  weekAvg: number;
  monthPercent: number;
  currentStreak: number;
  isLoading: boolean;
}

export function useHabitStats(): HabitStats {
  const { user } = useAuth();
  const [habits, setHabits] = useState<{ id: string }[]>([]);
  const [completions, setCompletions] = useState<{ date: string; habit_id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch user's habits
      const { data: habitsData } = await supabase
        .from("habits")
        .select("id")
        .eq("user_id", user.id);

      // Fetch completions for last 60 days (enough for streak + month)
      const sixtyDaysAgo = format(subDays(new Date(), 60), "yyyy-MM-dd");
      const { data: completionsData } = await supabase
        .from("habit_completions")
        .select("date, habit_id")
        .eq("user_id", user.id)
        .gte("date", sixtyDaysAgo);

      setHabits(habitsData || []);
      setCompletions(completionsData || []);
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    if (totalHabits === 0) {
      return {
        todayPercent: 0,
        todayCompleted: 0,
        todayTotal: 0,
        weekAvg: 0,
        monthPercent: 0,
        currentStreak: 0,
      };
    }

    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    const habitIds = new Set(habits.map(h => h.id));

    // Today's completions
    const todayCompletions = completions.filter(
      c => c.date === today && habitIds.has(c.habit_id)
    );
    const todayCompleted = new Set(todayCompletions.map(c => c.habit_id)).size;
    const todayPercent = Math.round((todayCompleted / totalHabits) * 100);

    // Week average (last 7 days)
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      last7Days.push(format(subDays(new Date(), i), "yyyy-MM-dd"));
    }
    
    let weekTotal = 0;
    let daysWithData = 0;
    for (const day of last7Days) {
      const dayCompletions = completions.filter(
        c => c.date === day && habitIds.has(c.habit_id)
      );
      const uniqueCompleted = new Set(dayCompletions.map(c => c.habit_id)).size;
      if (dayCompletions.length > 0 || day === today) {
        weekTotal += (uniqueCompleted / totalHabits) * 100;
        daysWithData++;
      }
    }
    const weekAvg = daysWithData > 0 ? Math.round(weekTotal / daysWithData) : 0;

    // Month average
    const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
    const monthCompletions = completions.filter(
      c => c.date >= monthStart && habitIds.has(c.habit_id)
    );
    
    // Group by day
    const completionsByDay: Record<string, Set<string>> = {};
    for (const c of monthCompletions) {
      if (!completionsByDay[c.date]) {
        completionsByDay[c.date] = new Set();
      }
      completionsByDay[c.date].add(c.habit_id);
    }
    
    const daysInMonthSoFar = Object.keys(completionsByDay).length || 1;
    let monthTotal = 0;
    for (const daySet of Object.values(completionsByDay)) {
      monthTotal += (daySet.size / totalHabits) * 100;
    }
    const monthPercent = Math.round(monthTotal / daysInMonthSoFar);

    // Current streak - consecutive days with 100% completion
    let currentStreak = 0;
    let checkDate = new Date();
    
    // Start from yesterday if today has no completions yet
    if (todayCompleted === 0) {
      checkDate = subDays(checkDate, 1);
    }
    
    while (true) {
      const dateStr = format(checkDate, "yyyy-MM-dd");
      const dayCompletions = completions.filter(
        c => c.date === dateStr && habitIds.has(c.habit_id)
      );
      const uniqueCompleted = new Set(dayCompletions.map(c => c.habit_id)).size;
      
      // Consider day complete if at least 80% habits done
      if (uniqueCompleted >= totalHabits * 0.8) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
      
      // Safety limit
      if (currentStreak > 365) break;
    }

    return {
      todayPercent,
      todayCompleted,
      todayTotal: totalHabits,
      weekAvg,
      monthPercent,
      currentStreak,
    };
  }, [habits, completions]);

  return {
    ...stats,
    isLoading,
  };
}

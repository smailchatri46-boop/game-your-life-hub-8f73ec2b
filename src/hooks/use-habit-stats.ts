import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfDay, subDays, startOfMonth, format, startOfWeek } from "date-fns";

interface HabitStats {
  todayPercent: number;
  todayCompleted: number;
  todayTotal: number;
  weekAvg: number;
  monthPercent: number;
  currentStreak: number;
  perfectDaysThisWeek: number;
  averageMoodEmoji: string;
  averageMoodLabel: string;
  emotionalStability: number;
  isLoading: boolean;
}

interface MoodLog {
  date: string;
  mood: number | null;
}

export function useHabitStats(): HabitStats {
  const { user } = useAuth();
  const [habits, setHabits] = useState<{ id: string }[]>([]);
  const [completions, setCompletions] = useState<{ date: string; habit_id: string }[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
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

      // Fetch mood logs for last 30 days
      const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
      const { data: moodData } = await supabase
        .from("mood_logs")
        .select("date, mood")
        .eq("user_id", user.id)
        .gte("date", thirtyDaysAgo);

      setHabits(habitsData || []);
      setCompletions(completionsData || []);
      setMoodLogs(moodData || []);
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
        perfectDaysThisWeek: 0,
        averageMoodEmoji: "😊",
        averageMoodLabel: "Happy",
        emotionalStability: 7,
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
    let perfectDaysThisWeek = 0;
    
    // Get this week's days (Monday to today)
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const thisWeekDays: string[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = subDays(new Date(), i);
      if (dayDate >= weekStart) {
        thisWeekDays.push(format(dayDate, "yyyy-MM-dd"));
      }
    }
    
    for (const day of last7Days) {
      const dayCompletions = completions.filter(
        c => c.date === day && habitIds.has(c.habit_id)
      );
      const uniqueCompleted = new Set(dayCompletions.map(c => c.habit_id)).size;
      
      // Count perfect days this week (100% completion)
      if (thisWeekDays.includes(day) && uniqueCompleted === totalHabits) {
        perfectDaysThisWeek++;
      }
      
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

    // Calculate average mood from mood logs
    const validMoods = moodLogs.filter(m => m.mood !== null).map(m => m.mood as number);
    let averageMood = 3; // Default to middle
    if (validMoods.length > 0) {
      averageMood = Math.round(validMoods.reduce((a, b) => a + b, 0) / validMoods.length);
    }
    
    // Map mood value to emoji and label (1-5 scale)
    const moodMap: Record<number, { emoji: string; label: string }> = {
      1: { emoji: "😢", label: "Sad" },
      2: { emoji: "😔", label: "Down" },
      3: { emoji: "😐", label: "Neutral" },
      4: { emoji: "🙂", label: "Calm" },
      5: { emoji: "😊", label: "Happy" },
    };
    
    const moodInfo = moodMap[Math.min(5, Math.max(1, averageMood))] || moodMap[3];
    
    // Calculate emotional stability (variance-based, lower variance = higher stability)
    let emotionalStability = 7; // Default
    if (validMoods.length >= 2) {
      const mean = validMoods.reduce((a, b) => a + b, 0) / validMoods.length;
      const variance = validMoods.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) / validMoods.length;
      // Convert variance to stability score (0-10 scale, lower variance = higher score)
      // Max variance for 1-5 scale is 4 (all 1s or all 5s vs mean of 3)
      emotionalStability = Math.round(10 - (variance / 4) * 10);
      emotionalStability = Math.max(1, Math.min(10, emotionalStability));
    }

    return {
      todayPercent,
      todayCompleted,
      todayTotal: totalHabits,
      weekAvg,
      monthPercent,
      currentStreak,
      perfectDaysThisWeek,
      averageMoodEmoji: moodInfo.emoji,
      averageMoodLabel: moodInfo.label,
      emotionalStability,
    };
  }, [habits, completions, moodLogs]);

  return {
    ...stats,
    isLoading,
  };
}

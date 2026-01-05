import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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

interface MoodLog {
  date: string;
  mood: number | null;
  motivation: number | null;
}

const MOOD_EMOJIS: Record<number, string> = {
  1: "😢", 2: "😞", 3: "😔", 4: "😕", 5: "😐",
  6: "🙂", 7: "😊", 8: "😄", 9: "🥳", 10: "🔥",
};

const MOOD_LABELS: Record<number, string> = {
  1: "Very Sad", 2: "Sad", 3: "Down", 4: "Meh", 5: "Neutral",
  6: "Okay", 7: "Happy", 8: "Great", 9: "Excited", 10: "On Fire",
};

export function useHabitStats(): HabitStats {
  const { user } = useAuth();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const currentDay = now.getDate();
  
  // Fetch habits
  const habitsQuery = useQuery({
    queryKey: ["habits-stats", user?.id],
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

  // Fetch completions for current month
  const completionsQuery = useQuery({
    queryKey: ["completions-stats", user?.id, year, month],
    queryFn: async () => {
      if (!user) return [];
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;
      
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

  // Fetch mood logs for current month
  const moodQuery = useQuery({
    queryKey: ["mood-stats", user?.id, year, month],
    queryFn: async () => {
      if (!user) return [];
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;
      
      const { data } = await supabase
        .from("mood_logs")
        .select("date, mood, motivation")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate);
      return (data as MoodLog[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  const stats = useMemo(() => {
    const habits = habitsQuery.data || [];
    const completions = completionsQuery.data || [];
    const moodLogs = moodQuery.data || [];
    
    // Build completion map
    const compMap: Record<string, Record<string, number>> = {};
    completions.forEach(c => {
      if (!compMap[c.habit_id]) compMap[c.habit_id] = {};
      compMap[c.habit_id][c.date] = c.value;
    });

    // Helper to get weighted progress for a day
    const getDayProgress = (day: number): number => {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let totalWeight = 0;
      let weightedProgress = 0;
      
      habits.forEach(habit => {
        const weight = habit.importance || 50;
        totalWeight += weight;
        const value = compMap[habit.id]?.[dateKey] || 0;
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
    const todayCompleted = habits.filter(h => {
      const dateKey = format(now, "yyyy-MM-dd");
      const val = compMap[h.id]?.[dateKey] || 0;
      return h.target === 1 ? val >= 1 : val >= h.target;
    }).length;

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

    // Perfect days this week
    let perfectDaysThisWeek = 0;
    for (let i = 0; i < 7; i++) {
      const day = currentDay - i;
      if (day > 0 && getDayProgress(day) >= 100) {
        perfectDaysThisWeek++;
      }
    }

    // Current streak
    let currentStreak = 0;
    for (let day = currentDay; day >= 1; day--) {
      if (getDayProgress(day) >= 100) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Mood stats
    const moodValues = moodLogs.filter(l => l.mood != null).map(l => l.mood!);
    const avgMood = moodValues.length > 0 
      ? Math.round(moodValues.reduce((a, b) => a + b, 0) / moodValues.length)
      : 7;
    
    // Emotional stability
    let emotionalStability = 7;
    if (moodValues.length >= 2) {
      const mean = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
      const variance = moodValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / moodValues.length;
      const stdDev = Math.sqrt(variance);
      emotionalStability = Math.max(1, Math.min(10, Math.round(10 - stdDev * 3)));
    }

    return {
      todayPercent: todayProgress,
      todayCompleted,
      todayTotal: habits.length,
      weekAvg,
      monthPercent,
      currentStreak,
      perfectDaysThisWeek,
      averageMoodEmoji: MOOD_EMOJIS[avgMood] || "😊",
      averageMoodLabel: MOOD_LABELS[avgMood] || "Happy",
      emotionalStability,
    };
  }, [habitsQuery.data, completionsQuery.data, moodQuery.data, currentDay, year, month]);

  // Return demo data if not authenticated
  if (!user) {
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
      isLoading: false,
    };
  }

  return {
    ...stats,
    isLoading: habitsQuery.isLoading || completionsQuery.isLoading || moodQuery.isLoading,
  };
}

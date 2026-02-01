import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";

export interface HabitStats {
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
  yesterdayPercent: number;
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

interface Task {
  id: string;
  date: string;
  completed: boolean;
}

// Mood emoji mapping based on average score (1-10 scale)
function getMoodEmoji(avgMood: number): string {
  if (avgMood >= 9) return "😊"; // Very Happy
  if (avgMood >= 7) return "🙂"; // Happy
  if (avgMood >= 5) return "😐"; // Neutral
  if (avgMood >= 3) return "😕"; // Slightly sad
  return "😢"; // Sad
}

// Mood label mapping based on average score (1-10 scale)
function getMoodLabel(avgMood: number): string {
  if (avgMood >= 9) return "Amazing";
  if (avgMood >= 7) return "Happy";
  if (avgMood >= 5) return "Okay";
  if (avgMood >= 3) return "Low";
  return "Very Low";
}

// Get last 7 days as date strings
function getLast7Days(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    dates.push(format(date, "yyyy-MM-dd"));
  }
  
  return dates;
}

export function useHabitStats(): HabitStats {
  const { user } = useAuth();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const currentDay = now.getDate();
  
  // Get date range for current month
  const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`;
  
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
      const { data } = await supabase
        .from("habit_completions")
        .select("habit_id, date, value")
        .eq("user_id", user.id)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);
      return (data as Completion[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch tasks for current month
  const tasksQuery = useQuery({
    queryKey: ["tasks-stats", user?.id, year, month],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("daily_todos")
        .select("id, date, completed")
        .eq("user_id", user.id)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);
      return (data as Task[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch mood logs for last 7 days (for mood average)
  const last7Days = getLast7Days();
  const moodQuery = useQuery({
    queryKey: ["mood-stats-7days", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("mood_logs")
        .select("date, mood, motivation")
        .eq("user_id", user.id)
        .in("date", last7Days);
      return (data as MoodLog[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  const stats = useMemo(() => {
    const habits = habitsQuery.data || [];
    const completions = completionsQuery.data || [];
    const tasks = tasksQuery.data || [];
    const moodLogs = moodQuery.data || [];
    
    // Build completion map: habitId -> { date -> value }
    const compMap: Record<string, Record<string, number>> = {};
    completions.forEach(c => {
      if (!compMap[c.habit_id]) compMap[c.habit_id] = {};
      compMap[c.habit_id][c.date] = c.value;
    });

    // Build tasks map: date -> { total, completed }
    const tasksMap: Record<string, { total: number; completed: number }> = {};
    tasks.forEach(t => {
      if (!tasksMap[t.date]) tasksMap[t.date] = { total: 0, completed: 0 };
      tasksMap[t.date].total++;
      if (t.completed) tasksMap[t.date].completed++;
    });

    // Helper to calculate weighted progress for a day (habits + tasks)
    const getDayProgress = (dateKey: string): number => {
      // Count completed habits
      let completedHabitsCount = 0;
      habits.forEach(habit => {
        const value = compMap[habit.id]?.[dateKey] || 0;
        if (habit.target === 1) {
          if (value >= 1) completedHabitsCount++;
        } else {
          if (value >= habit.target) completedHabitsCount++;
        }
      });
      
      // Count completed tasks
      const dayTasks = tasksMap[dateKey] || { total: 0, completed: 0 };
      
      const totalCompleted = completedHabitsCount + dayTasks.completed;
      const totalExpected = habits.length + dayTasks.total;
      
      return totalExpected > 0 ? (totalCompleted / totalExpected) * 100 : 0;
    };

    // Today's date key
    const todayKey = format(now, "yyyy-MM-dd");
    
    // Yesterday's date key
    const yesterdayKey = format(subDays(now, 1), "yyyy-MM-dd");
    
    // Today's progress
    const todayProgress = Math.round(getDayProgress(todayKey));
    
    // Count today's completed habits
    const todayCompleted = habits.filter(h => {
      const val = compMap[h.id]?.[todayKey] || 0;
      return h.target === 1 ? val >= 1 : val >= h.target;
    }).length;

    // Yesterday's progress
    const yesterdayProgress = Math.round(getDayProgress(yesterdayKey));

    // Week average (last 7 days rolling window)
    const last7DaysDates = getLast7Days();
    const dailyPercentages: number[] = [];
    
    last7DaysDates.forEach(dateKey => {
      dailyPercentages.push(getDayProgress(dateKey));
    });
    
    const weekAvg = dailyPercentages.length > 0 
      ? Math.round(dailyPercentages.reduce((sum, p) => sum + p, 0) / 7)
      : 0;

    // Month average (all days in current month up to today)
    let monthTotal = 0;
    for (let day = 1; day <= currentDay; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      monthTotal += getDayProgress(dateKey);
    }
    const monthPercent = currentDay > 0 ? Math.round(monthTotal / currentDay) : 0;

    // Perfect days this week (100% completion)
    let perfectDaysThisWeek = 0;
    last7DaysDates.forEach(dateKey => {
      const dayProgress = getDayProgress(dateKey);
      // Consider a day perfect if all expected items are completed
      const dayTasks = tasksMap[dateKey] || { total: 0, completed: 0 };
      const totalExpected = habits.length + dayTasks.total;
      
      if (totalExpected > 0 && dayProgress >= 100) {
        perfectDaysThisWeek++;
      }
    });

    // Current streak (consecutive 100% days from today going backward)
    let currentStreak = 0;
    for (let day = currentDay; day >= 1; day--) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (getDayProgress(dateKey) >= 100) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Mood stats (from last 7 days only)
    const moodValues = moodLogs.filter(l => l.mood != null).map(l => l.mood!);
    
    let avgMood = 5; // Default neutral
    let averageMoodEmoji = "😐";
    let averageMoodLabel = "No mood data yet";
    
    if (moodValues.length > 0) {
      avgMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
      averageMoodEmoji = getMoodEmoji(avgMood);
      averageMoodLabel = getMoodLabel(avgMood);
    }
    
    // Emotional stability (lower variance = higher stability)
    let emotionalStability = 0;
    if (moodValues.length >= 2) {
      const mean = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
      const squaredDiffs = moodValues.map(score => Math.pow(score - mean, 2));
      const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / moodValues.length;
      const standardDeviation = Math.sqrt(variance);
      
      // Convert to 0-10 scale (lower deviation = higher stability)
      // Max deviation we consider is 3 (maps to 0 stability)
      const maxDeviation = 3;
      emotionalStability = Math.max(0, Math.round(10 - (standardDeviation / maxDeviation) * 10));
    }

    return {
      todayPercent: todayProgress,
      todayCompleted,
      todayTotal: habits.length,
      weekAvg,
      monthPercent,
      currentStreak,
      perfectDaysThisWeek,
      averageMoodEmoji,
      averageMoodLabel,
      emotionalStability,
      yesterdayPercent: yesterdayProgress,
    };
  }, [habitsQuery.data, completionsQuery.data, tasksQuery.data, moodQuery.data, currentDay, year, month]);

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
      averageMoodEmoji: "😐",
      averageMoodLabel: "No mood data yet",
      emotionalStability: 0,
      yesterdayPercent: 0,
      isLoading: false,
    };
  }

  return {
    ...stats,
    isLoading: habitsQuery.isLoading || completionsQuery.isLoading || tasksQuery.isLoading || moodQuery.isLoading,
  };
}

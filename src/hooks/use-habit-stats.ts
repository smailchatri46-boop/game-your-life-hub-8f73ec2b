import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

export function useHabitStats(): HabitStats {
  const { user } = useAuth();

  const stats = useMemo(() => {
    // Return demo/default stats when not authenticated or Firebase not configured
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
  }, [user]);

  return {
    ...stats,
    isLoading: false,
  };
}

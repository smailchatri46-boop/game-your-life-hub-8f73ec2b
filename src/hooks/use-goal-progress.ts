import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Goal } from "@/hooks/use-goals";

interface GoalHabit {
  goal_id: string;
  habit_id: string;
}

interface Completion {
  habit_id: string;
  date: string;
  value: number;
}

interface Task {
  id: string;
  date: string;
  completed: boolean;
}

/**
 * Hook to calculate real goal progress based on linked habit completions
 * within the goal's date range.
 */
export function useGoalProgress(goals: Goal[], goalHabits: GoalHabit[]) {
  const { user } = useAuth();

  // Get all habit completions for the earliest goal start to latest goal end
  const dateRange = useMemo(() => {
    if (goals.length === 0) return null;
    
    const starts = goals.map(g => new Date(g.start_date).getTime());
    const ends = goals.map(g => new Date(g.end_date).getTime());
    
    return {
      startDate: new Date(Math.min(...starts)).toISOString().split("T")[0],
      endDate: new Date(Math.max(...ends)).toISOString().split("T")[0],
    };
  }, [goals]);

  // Fetch all completions within the combined date range
  const completionsQuery = useQuery({
    queryKey: ["goal_completions", user?.id, dateRange?.startDate, dateRange?.endDate],
    queryFn: async () => {
      if (!user || !dateRange) return [];
      
      const { data, error } = await supabase
        .from("habit_completions")
        .select("habit_id, date, value")
        .eq("user_id", user.id)
        .gte("date", dateRange.startDate)
        .lte("date", dateRange.endDate);

      if (error) {
        console.error("Error fetching goal completions:", error);
        return [];
      }

      return (data || []) as Completion[];
    },
    enabled: !!user && !!dateRange,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch all tasks within the combined date range (for goals linked to tasks)
  const tasksQuery = useQuery({
    queryKey: ["goal_tasks", user?.id, dateRange?.startDate, dateRange?.endDate],
    queryFn: async () => {
      if (!user || !dateRange) return [];
      
      const { data, error } = await supabase
        .from("daily_todos")
        .select("id, date, completed")
        .eq("user_id", user.id)
        .gte("date", dateRange.startDate)
        .lte("date", dateRange.endDate);

      if (error) {
        console.error("Error fetching goal tasks:", error);
        return [];
      }

      return (data || []) as Task[];
    },
    enabled: !!user && !!dateRange,
    staleTime: 1000 * 60 * 2,
  });

  // Calculate progress for each goal
  const goalProgressMap = useMemo(() => {
    const map: Record<string, { completed: number; target: number; percentage: number }> = {};
    const completions = completionsQuery.data || [];
    const tasks = tasksQuery.data || [];

    goals.forEach(goal => {
      // Get habits linked to this goal
      const linkedHabitIds = goalHabits
        .filter(gh => gh.goal_id === goal.id)
        .map(gh => gh.habit_id);

      // Filter completions within goal date range
      const goalCompletions = completions.filter(c => {
        const isLinked = linkedHabitIds.includes(c.habit_id);
        const date = c.date;
        return isLinked && date >= goal.start_date && date <= goal.end_date;
      });

      // Filter tasks within goal date range and count completed ones
      const goalTasks = tasks.filter(t => {
        return t.date >= goal.start_date && t.date <= goal.end_date && t.completed;
      });

      // Sum up all completion values (each day a habit is done counts as its value)
      // For boolean habits: value is 1 per completed day
      // For numeric habits: value is the actual count
      const habitCompletedCount = goalCompletions.reduce((sum, c) => sum + c.value, 0);
      
      // Add completed tasks count
      const totalCompleted = habitCompletedCount + goalTasks.length;

      // Cap at target
      const cappedCompleted = Math.min(totalCompleted, goal.target_count);
      const percentage = goal.target_count > 0 
        ? Math.min(100, Math.round((cappedCompleted / goal.target_count) * 100))
        : 0;

      map[goal.id] = {
        completed: cappedCompleted,
        target: goal.target_count,
        percentage,
      };
    });

    return map;
  }, [goals, goalHabits, completionsQuery.data, tasksQuery.data]);

  // Get calculated progress for a specific goal
  const getCalculatedProgress = (goalId: string) => {
    return goalProgressMap[goalId] || { completed: 0, target: 0, percentage: 0 };
  };

  return {
    goalProgressMap,
    getCalculatedProgress,
    isLoading: completionsQuery.isLoading || tasksQuery.isLoading,
  };
}

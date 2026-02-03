// Goals management hook with Supabase integration
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useCallback, useMemo } from "react";
import { differenceInDays } from "date-fns";
import {
  getGoals,
  createGoal as createGoalService,
  updateGoal as updateGoalService,
  deleteGoal as deleteGoalService,
  incrementGoalProgress as incrementGoalProgressService,
  getGoalHabits,
} from "@/services/supabase/goals";
import { logActivity } from "@/services/supabase/activity";

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  category: string;
  category_emoji: string;
  start_date: string;
  end_date: string;
  target_count: number;
  completed_count: number;
  status: "active" | "completed";
  created_at: string;
  updated_at: string;
}

export interface GoalHabit {
  id: string;
  goal_id: string;
  habit_id: string;
  user_id: string;
}

export interface CreateGoalInput {
  name: string;
  category: string;
  category_emoji: string;
  start_date: string;
  end_date: string;
  target_count: number;
  habit_ids: string[];
}

// Default demo goal - static, no local storage
const DEFAULT_DEMO_GOAL: Goal = {
  id: "demo-default-save-5k",
  user_id: "demo",
  name: "SAVE 5K",
  category: "Finance",
  category_emoji: "💰",
  start_date: "2025-01-01",
  end_date: "2025-12-31",
  target_count: 90,
  completed_count: 0,
  status: "active",
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-01T00:00:00.000Z",
};

export function useGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isDemo = !user;

  // Demo mode state - only use static default goal, no local storage
  const [demoGoals, setDemoGoalsState] = useState<Goal[]>([DEFAULT_DEMO_GOAL]);
  const [demoGoalHabits, setDemoGoalHabitsState] = useState<GoalHabit[]>([]);

  // Fetch goals from Firestore
  const goalsQuery = useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getGoals(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch goal-habit links from Firestore
  const goalHabitsQuery = useQuery({
    queryKey: ["goal_habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getGoalHabits(user.id);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  // Create goal mutation
  const createGoal = useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      if (isDemo) {
        // Handle demo mode inline
        const newGoal: Goal = {
          id: crypto.randomUUID(),
          user_id: "demo",
          name: input.name,
          category: input.category,
          category_emoji: input.category_emoji,
          start_date: input.start_date,
          end_date: input.end_date,
          target_count: input.target_count,
          completed_count: 0,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setDemoGoalsState(prev => [newGoal, ...prev]);

        // Link habits
        if (input.habit_ids.length > 0) {
          const newLinks: GoalHabit[] = input.habit_ids.map((habit_id) => ({
            id: crypto.randomUUID(),
            goal_id: newGoal.id,
            habit_id,
            user_id: "demo",
          }));
          setDemoGoalHabitsState(prev => [...prev, ...newLinks]);
        }

        toast.success("Goal created! (Demo mode - sign up to save)");
        return newGoal;
      }

      const goal = await createGoalService(
        user!.id,
        {
          name: input.name,
          category: input.category,
          category_emoji: input.category_emoji,
          start_date: input.start_date,
          end_date: input.end_date,
          target_count: input.target_count,
        },
        input.habit_ids
      );
      
      // Log activity for goal creation
      await logActivity(user!.id, "goal_created", input.name, input.category_emoji, goal.id);
      
      return goal;
    },
    onSuccess: (_, __, context) => {
      if (!isDemo) {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        queryClient.invalidateQueries({ queryKey: ["goal_habits"] });
        queryClient.invalidateQueries({ queryKey: ["recent_activities"] });
        toast.success("Goal created successfully!");
      }
    },
    onError: (error) => {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    },
  });

  // Delete goal mutation
  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      if (isDemo) {
        setDemoGoalsState(prev => prev.filter((g) => g.id !== goalId));
        setDemoGoalHabitsState(prev => prev.filter((gh) => gh.goal_id !== goalId));
        toast.success("Goal deleted (Demo mode)");
        return;
      }

      await deleteGoalService(goalId, user!.id);
    },
    onSuccess: () => {
      if (!isDemo) {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        queryClient.invalidateQueries({ queryKey: ["goal_habits"] });
        toast.success("Goal deleted");
      }
    },
    onError: () => {
      toast.error("Failed to delete goal");
    },
  });

  // Update goal mutation
  const updateGoal = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>) => {
      if (isDemo) {
        setDemoGoalsState(prev => prev.map((g) =>
          g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
        ));
        toast.success("Goal updated (Demo mode)");
        return;
      }

      await updateGoalService(id, user!.id, updates);
    },
    onSuccess: () => {
      if (!isDemo) {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        toast.success("Goal updated");
      }
    },
    onError: () => {
      toast.error("Failed to update goal");
    },
  });

  // Increment goal progress
  const incrementGoalProgress = useMutation({
    mutationFn: async ({ goalId, amount = 1 }: { goalId: string; amount?: number }) => {
      if (isDemo) {
        setDemoGoalsState(prev => {
          const goal = prev.find(g => g.id === goalId);
          if (!goal) return prev;
          return prev.map(g => 
            g.id === goalId 
              ? { ...g, completed_count: Math.min(g.completed_count + amount, g.target_count) }
              : g
          );
        });
        return;
      }

      const goal = goalsQuery.data?.find(g => g.id === goalId);
      if (!goal) return;

      await incrementGoalProgressService(goalId, user!.id, goal.completed_count, goal.target_count, amount);
    },
    onSuccess: () => {
      if (!isDemo) {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
      }
    },
  });

  const getGoalProgress = useCallback((goal: Goal) => {
    if (goal.target_count === 0) return 0;
    return Math.min(100, Math.round((goal.completed_count / goal.target_count) * 100));
  }, []);

  const getGoalPace = useCallback((goal: Goal) => {
    const now = new Date();
    const start = new Date(goal.start_date);
    const end = new Date(goal.end_date);
    
    if (now < start) return "Not started";
    if (goal.status === "completed") return "Completed";
    if (now > end) return "Overdue";
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = (elapsedDays / totalDays) * 100;
    const actualProgress = getGoalProgress(goal);
    
    if (actualProgress <= expectedProgress - 10) return "Falling behind";
    return "On track";
  }, [getGoalProgress]);

  // Use demo data or real data based on auth status
  const goals = isDemo ? demoGoals : (goalsQuery.data || []);
  const goalHabits = isDemo ? demoGoalHabits : (goalHabitsQuery.data || []);
  
  // Filter goals by status and type
  const activeGoals = useMemo(() => {
    const now = new Date();
    return goals.filter((g) => {
      const endDate = new Date(g.end_date);
      return g.status === "active" && endDate >= now;
    });
  }, [goals]);

  const completedGoals = useMemo(() => {
    return goals.filter((g) => g.status === "completed");
  }, [goals]);

  const expiredGoals = useMemo(() => {
    const now = new Date();
    return goals.filter((g) => {
      const endDate = new Date(g.end_date);
      return g.status === "active" && endDate < now;
    });
  }, [goals]);

  // Quarterly goals (less than 120 days duration)
  const quarterlyGoals = useMemo(() => {
    return goals.filter((g) => {
      const start = new Date(g.start_date);
      const end = new Date(g.end_date);
      const days = differenceInDays(end, start);
      return days <= 120;
    });
  }, [goals]);

  // Yearly goals (more than 120 days duration)
  const yearlyGoals = useMemo(() => {
    return goals.filter((g) => {
      const start = new Date(g.start_date);
      const end = new Date(g.end_date);
      const days = differenceInDays(end, start);
      return days > 120;
    });
  }, [goals]);

  return {
    goals,
    activeGoals,
    completedGoals,
    expiredGoals,
    quarterlyGoals,
    yearlyGoals,
    goalHabits,
    isLoading: isDemo ? false : goalsQuery.isLoading,
    isDemo,
    createGoal,
    deleteGoal,
    updateGoal,
    incrementGoalProgress,
    getGoalProgress,
    getGoalPace,
  };
}

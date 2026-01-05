import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useCallback } from "react";

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

  const goalsQuery = useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // TODO: Replace with Firebase Firestore query
      return [];
    },
    enabled: !!user,
  });

  const goalHabitsQuery = useQuery({
    queryKey: ["goal_habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // TODO: Replace with Firebase Firestore query
      return [];
    },
    enabled: !!user,
  });

  // Demo mode create goal - only session storage, resets on reload
  const createDemoGoal = useCallback((input: CreateGoalInput) => {
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

    const updatedGoals = [newGoal, ...demoGoals];
    setDemoGoalsState(updatedGoals);

    // Link habits
    if (input.habit_ids.length > 0) {
      const newLinks: GoalHabit[] = input.habit_ids.map((habit_id) => ({
        id: crypto.randomUUID(),
        goal_id: newGoal.id,
        habit_id,
        user_id: "demo",
      }));
      const updatedLinks = [...demoGoalHabits, ...newLinks];
      setDemoGoalHabitsState(updatedLinks);
    }

    toast.success("Goal created! (Demo mode - sign up to save)");
    return newGoal;
  }, [demoGoals, demoGoalHabits]);

  // Demo mode delete goal
  const deleteDemoGoal = useCallback((goalId: string) => {
    const updatedGoals = demoGoals.filter((g) => g.id !== goalId);
    setDemoGoalsState(updatedGoals);

    const updatedLinks = demoGoalHabits.filter((gh) => gh.goal_id !== goalId);
    setDemoGoalHabitsState(updatedLinks);

    toast.success("Goal deleted (Demo mode)");
  }, [demoGoals, demoGoalHabits]);

  // Demo mode update goal
  const updateDemoGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    const updatedGoals = demoGoals.map((g) =>
      g.id === goalId ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
    );
    setDemoGoalsState(updatedGoals);
    toast.success("Goal updated (Demo mode)");
  }, [demoGoals]);

  const createGoal = useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      // Demo mode - use local state
      if (isDemo) {
        return createDemoGoal(input);
      }

      // TODO: Replace with Firebase Firestore
      toast.error("Firebase not configured yet");
      return null;
    },
    onSuccess: () => {
      if (!isDemo) {
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        queryClient.invalidateQueries({ queryKey: ["goal_habits"] });
        toast.success("Goal created successfully!");
      }
    },
    onError: (error) => {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      // Demo mode
      if (isDemo) {
        deleteDemoGoal(goalId);
        return;
      }

      // TODO: Replace with Firebase Firestore
      toast.error("Firebase not configured yet");
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

  const updateGoal = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>) => {
      // Demo mode
      if (isDemo) {
        updateDemoGoal(id, updates);
        return;
      }

      // TODO: Replace with Firebase Firestore
      toast.error("Firebase not configured yet");
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

  const getGoalProgress = (goal: Goal) => {
    if (goal.target_count === 0) return 0;
    return Math.min(100, Math.round((goal.completed_count / goal.target_count) * 100));
  };

  const getGoalPace = (goal: Goal) => {
    const now = new Date();
    const start = new Date(goal.start_date);
    const end = new Date(goal.end_date);
    
    if (now < start) return "Not started";
    if (now > end) return goal.status === "completed" ? "Completed" : "Ended";
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = (elapsedDays / totalDays) * 100;
    const actualProgress = getGoalProgress(goal);
    
    if (actualProgress >= expectedProgress + 10) return "Ahead of schedule";
    if (actualProgress <= expectedProgress - 10) return "Falling behind";
    return "On track";
  };

  // Use demo data or real data based on auth status
  const goals = isDemo ? demoGoals : (goalsQuery.data || []);
  const goalHabits = isDemo ? demoGoalHabits : (goalHabitsQuery.data || []);
  
  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  return {
    goals,
    activeGoals,
    completedGoals,
    goalHabits,
    isLoading: isDemo ? false : goalsQuery.isLoading,
    isDemo,
    createGoal,
    deleteGoal,
    updateGoal,
    getGoalProgress,
    getGoalPace,
  };
}

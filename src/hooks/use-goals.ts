import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

// Local storage key for demo goals
const DEMO_GOALS_KEY = "demo_goals";
const DEMO_GOAL_HABITS_KEY = "demo_goal_habits";

// Default demo goal that's always present
const getDefaultDemoGoal = (): Goal => ({
  id: "demo-default-save-5k",
  user_id: "demo",
  name: "SAVE 5K",
  category: "Finance",
  category_emoji: "💰",
  start_date: new Date().toISOString().split("T")[0],
  end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  target_count: 90,
  completed_count: 0,
  status: "active",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Helper functions for local storage
const getDemoGoals = (): Goal[] => {
  try {
    const stored = localStorage.getItem(DEMO_GOALS_KEY);
    const customGoals: Goal[] = stored ? JSON.parse(stored) : [];
    // Always include the default goal
    const hasDefault = customGoals.some((g) => g.id === "demo-default-10k-mrr");
    return hasDefault ? customGoals : [getDefaultDemoGoal(), ...customGoals];
  } catch {
    return [getDefaultDemoGoal()];
  }
};

const setDemoGoals = (goals: Goal[]) => {
  localStorage.setItem(DEMO_GOALS_KEY, JSON.stringify(goals));
};

const getDemoGoalHabits = (): GoalHabit[] => {
  try {
    const stored = localStorage.getItem(DEMO_GOAL_HABITS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setDemoGoalHabits = (habits: GoalHabit[]) => {
  localStorage.setItem(DEMO_GOAL_HABITS_KEY, JSON.stringify(habits));
};

export function useGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isDemo = !user;

  // Demo mode state
  const [demoGoals, setDemoGoalsState] = useState<Goal[]>(() => getDemoGoals());
  const [demoGoalHabits, setDemoGoalHabitsState] = useState<GoalHabit[]>(() => getDemoGoalHabits());

  const goalsQuery = useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user,
  });

  const goalHabitsQuery = useQuery({
    queryKey: ["goal_habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("goal_habits")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data as GoalHabit[];
    },
    enabled: !!user,
  });

  // Demo mode create goal
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
    setDemoGoals(updatedGoals);
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
      setDemoGoalHabits(updatedLinks);
      setDemoGoalHabitsState(updatedLinks);
    }

    toast.success("Goal created! (Demo mode - data stored locally)");
    return newGoal;
  }, [demoGoals, demoGoalHabits]);

  // Demo mode delete goal
  const deleteDemoGoal = useCallback((goalId: string) => {
    const updatedGoals = demoGoals.filter((g) => g.id !== goalId);
    setDemoGoals(updatedGoals);
    setDemoGoalsState(updatedGoals);

    const updatedLinks = demoGoalHabits.filter((gh) => gh.goal_id !== goalId);
    setDemoGoalHabits(updatedLinks);
    setDemoGoalHabitsState(updatedLinks);

    toast.success("Goal deleted (Demo mode)");
  }, [demoGoals, demoGoalHabits]);

  // Demo mode update goal
  const updateDemoGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    const updatedGoals = demoGoals.map((g) =>
      g.id === goalId ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
    );
    setDemoGoals(updatedGoals);
    setDemoGoalsState(updatedGoals);
    toast.success("Goal updated (Demo mode)");
  }, [demoGoals]);

  const createGoal = useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      // Demo mode - use local storage
      if (isDemo) {
        return createDemoGoal(input);
      }

      // Authenticated mode - use Supabase
      const { data: goal, error: goalError } = await supabase
        .from("goals")
        .insert({
          user_id: user!.id,
          name: input.name,
          category: input.category,
          category_emoji: input.category_emoji,
          start_date: input.start_date,
          end_date: input.end_date,
          target_count: input.target_count,
        })
        .select()
        .single();

      if (goalError) throw goalError;

      // Link habits to the goal
      if (input.habit_ids.length > 0) {
        const habitLinks = input.habit_ids.map((habit_id) => ({
          goal_id: goal.id,
          habit_id,
          user_id: user!.id,
        }));

        const { error: linkError } = await supabase
          .from("goal_habits")
          .insert(habitLinks);

        if (linkError) throw linkError;
      }

      return goal;
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

      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId);
      
      if (error) throw error;
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

      const { error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id);
      
      if (error) throw error;
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

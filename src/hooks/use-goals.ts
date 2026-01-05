import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useCallback, useMemo } from "react";
import { differenceInDays } from "date-fns";

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

  // Fetch goals from Supabase
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
      return (data as Goal[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch goal-habit links
  const goalHabitsQuery = useQuery({
    queryKey: ["goal_habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("goal_habits")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return (data as GoalHabit[]) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
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

  // Create goal mutation
  const createGoal = useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      if (isDemo) {
        return createDemoGoal(input);
      }

      const { data, error } = await supabase
        .from("goals")
        .insert({
          user_id: user!.id,
          name: input.name,
          category: input.category,
          category_emoji: input.category_emoji,
          start_date: input.start_date,
          end_date: input.end_date,
          target_count: input.target_count,
          completed_count: 0,
          status: "active",
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Link habits if any
      if (input.habit_ids.length > 0 && data) {
        const links = input.habit_ids.map(habit_id => ({
          goal_id: data.id,
          habit_id,
          user_id: user!.id,
        }));
        
        await supabase.from("goal_habits").insert(links);
      }
      
      return data;
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

  // Delete goal mutation
  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      if (isDemo) {
        deleteDemoGoal(goalId);
        return;
      }

      // Delete goal habits first
      await supabase
        .from("goal_habits")
        .delete()
        .eq("goal_id", goalId)
        .eq("user_id", user!.id);
      
      // Delete goal
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId)
        .eq("user_id", user!.id);
      
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

  // Update goal mutation
  const updateGoal = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>) => {
      if (isDemo) {
        updateDemoGoal(id, updates);
        return;
      }

      const { error } = await supabase
        .from("goals")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", user!.id);
      
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

  // Increment goal progress
  const incrementGoalProgress = useMutation({
    mutationFn: async ({ goalId, amount = 1 }: { goalId: string; amount?: number }) => {
      if (isDemo) {
        const goal = demoGoals.find(g => g.id === goalId);
        if (goal) {
          updateDemoGoal(goalId, { 
            completed_count: Math.min(goal.completed_count + amount, goal.target_count) 
          });
        }
        return;
      }

      const goal = goalsQuery.data?.find(g => g.id === goalId);
      if (!goal) return;

      const newCount = Math.min(goal.completed_count + amount, goal.target_count);
      const newStatus = newCount >= goal.target_count ? "completed" : "active";

      const { error } = await supabase
        .from("goals")
        .update({ 
          completed_count: newCount, 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq("id", goalId)
        .eq("user_id", user!.id);
      
      if (error) throw error;
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
    if (now > end) return goal.status === "completed" ? "Completed" : "Ended";
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = (elapsedDays / totalDays) * 100;
    const actualProgress = getGoalProgress(goal);
    
    if (actualProgress >= expectedProgress + 10) return "Ahead of schedule";
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

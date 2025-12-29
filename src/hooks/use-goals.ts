import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

export function useGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const createGoal = useMutation({
    mutationFn: async (input: CreateGoalInput) => {
      if (!user) throw new Error("Not authenticated");

      // Create the goal
      const { data: goal, error: goalError } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
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
          user_id: user.id,
        }));

        const { error: linkError } = await supabase
          .from("goal_habits")
          .insert(habitLinks);

        if (linkError) throw linkError;
      }

      return goal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal_habits"] });
      toast.success("Goal created successfully!");
    },
    onError: (error) => {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal_habits"] });
      toast.success("Goal deleted");
    },
    onError: () => {
      toast.error("Failed to delete goal");
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

  const activeGoals = goalsQuery.data?.filter((g) => g.status === "active") || [];
  const completedGoals = goalsQuery.data?.filter((g) => g.status === "completed") || [];

  return {
    goals: goalsQuery.data || [],
    activeGoals,
    completedGoals,
    goalHabits: goalHabitsQuery.data || [],
    isLoading: goalsQuery.isLoading,
    createGoal,
    deleteGoal,
    getGoalProgress,
    getGoalPace,
  };
}

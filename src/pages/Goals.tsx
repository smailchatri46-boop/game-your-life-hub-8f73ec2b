import { useState, useEffect } from "react";

import { GlassCard } from "@/components/GlassCard";
import { CommunityLink } from "@/components/CommunityLink";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/GoalCard";
import { AddGoalModal } from "@/components/AddGoalModal";
import { PaywallModal } from "@/components/PaywallModal";
import { useGoals } from "@/hooks/use-goals";
import { usePlanLimits, LimitType } from "@/hooks/use-plan-limits";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Target } from "lucide-react";
import { getHabits } from "@/services/supabase/habits";
// SEO meta tags handled in index.html

type FilterType = "all" | "active" | "completed" | "quarterly" | "yearly";

export default function Goals() {
  const { user } = useAuth();
  const { goals, activeGoals, completedGoals, goalHabits, isLoading } = useGoals();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<FilterType>("active");
  
  // Paywall state
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallLimitType, setPaywallLimitType] = useState<LimitType>('goals');
  
  // Plan limits
  const { canAddGoal, setGoalsCount, getLimitMessage } = usePlanLimits();
  
  // Sync goals count with plan limits
  useEffect(() => {
    setGoalsCount(goals.length);
  }, [goals.length, setGoalsCount]);

  // Fetch habits for linking from Firestore
  const { data: habits = [] } = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getHabits(user.id);
    },
    enabled: !!user,
  });

  const getLinkedHabits = (goalId: string) => {
    const links = goalHabits.filter((gh) => gh.goal_id === goalId);
    return habits.filter((h) => links.some((l) => l.habit_id === h.id));
  };

  const getFilteredGoals = () => {
    switch (filter) {
      case "active":
        return activeGoals;
      case "completed":
        return completedGoals;
      case "quarterly":
        return goals.filter((g) => {
          const months = Math.ceil(
            (new Date(g.end_date).getTime() - new Date(g.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
          );
          return months <= 6;
        });
      case "yearly":
        return goals.filter((g) => {
          const months = Math.ceil(
            (new Date(g.end_date).getTime() - new Date(g.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
          );
          return months > 6;
        });
      default:
        return goals;
    }
  };

  const filteredGoals = getFilteredGoals();
  const hasGoals = goals.length > 0;

  const filters: { key: FilterType; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "quarterly", label: "Quarterly" },
    { key: "yearly", label: "Yearly" },
  ];

  return (
    <>

      <main className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
        {!hasGoals && !isLoading ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-[60vh]">
            <GlassCard className="p-12 text-center max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                <AppleEmoji emoji="🎯" size="4xl" />
              </div>
              <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
                Set your first goal
              </h1>
              <p className="text-muted-foreground mb-8">
                Small consistent actions lead to big changes. Define what matters and start tracking your journey.
              </p>
              <Button
                onClick={() => {
                  if (!canAddGoal) {
                    setPaywallLimitType('goals');
                    setPaywallOpen(true);
                    return;
                  }
                  setShowAddModal(true);
                }}
                variant="gradient"
                size="lg"
                className="px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Goal
              </Button>
            </GlassCard>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-semibold text-foreground">Goals</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Track your progress toward what matters most
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <GlassCard className="p-4 text-center">
                <p className="text-3xl font-bold gradient-text">{activeGoals.length}</p>
                <p className="text-xs text-muted-foreground">Active Goals</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <p className="text-3xl font-bold gradient-text">{completedGoals.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <p className="text-3xl font-bold gradient-text">
                  {goals.filter((g) => {
                    const months = Math.ceil(
                      (new Date(g.end_date).getTime() - new Date(g.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
                    );
                    return months <= 6;
                  }).length}
                </p>
                <p className="text-xs text-muted-foreground">Quarterly</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <p className="text-3xl font-bold gradient-text">
                  {goals.filter((g) => {
                    const months = Math.ceil(
                      (new Date(g.end_date).getTime() - new Date(g.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
                    );
                    return months > 6;
                  }).length}
                </p>
                <p className="text-xs text-muted-foreground">Yearly</p>
              </GlassCard>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    filter === f.key
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "bg-white/70 text-muted-foreground hover:bg-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Goals Grid */}
            {filteredGoals.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    linkedHabits={getLinkedHabits(goal.id)}
                  />
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center">
                <AppleEmoji emoji="📭" size="3xl" className="mb-4" />
                <p className="text-muted-foreground">
                  No {filter === "all" ? "" : filter} goals found
                </p>
              </GlassCard>
            )}
          </>
        )}
      </main>

      {/* Fixed community link at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent pb-4 pt-8 pointer-events-none z-40">
        <div className="pointer-events-auto">
          <CommunityLink />
        </div>
      </div>

      {/* Floating Add Goal Button */}
      <Button 
        variant="gradient" 
        size="icon" 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-large z-50"
        onClick={() => {
          if (!canAddGoal) {
            setPaywallLimitType('goals');
            setPaywallOpen(true);
            return;
          }
          setShowAddModal(true);
        }}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Goal Modal */}
      <AddGoalModal open={showAddModal} onOpenChange={setShowAddModal} />
      
      {/* Paywall Modal */}
      <PaywallModal
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        limitType={paywallLimitType}
        limitMessage={getLimitMessage(paywallLimitType)}
      />
    </>
  );
}

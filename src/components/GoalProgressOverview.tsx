import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { useGoals } from "@/hooks/use-goals";
import { useGoalProgress } from "@/hooks/use-goal-progress";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useMemo } from "react";

export function GoalProgressOverview() {
  const { activeGoals, goalHabits } = useGoals();
  const { getCalculatedProgress } = useGoalProgress(activeGoals, goalHabits);

  // Find the goal to display: closest upcoming deadline, then most recently created
  const displayGoal = useMemo(() => {
    if (activeGoals.length === 0) return null;
    
    const sortedGoals = [...activeGoals].sort((a, b) => {
      // First sort by deadline (closest first)
      const deadlineA = new Date(a.end_date).getTime();
      const deadlineB = new Date(b.end_date).getTime();
      if (deadlineA !== deadlineB) return deadlineA - deadlineB;
      
      // If tied, sort by created_at (most recent first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    return sortedGoals[0];
  }, [activeGoals]);

  // Calculate overall progress across all goals - MUST be before any conditional returns
  const overallProgress = useMemo(() => {
    if (activeGoals.length === 0) return 0;
    
    const totalProgress = activeGoals.reduce((sum, goal) => {
      const goalProgress = getCalculatedProgress(goal.id);
      return sum + goalProgress.percentage;
    }, 0);
    
    return Math.round(totalProgress / activeGoals.length);
  }, [activeGoals, getCalculatedProgress]);

  // Get progress for the display goal - MUST be before any conditional returns
  const progress = displayGoal ? getCalculatedProgress(displayGoal.id) : { completed: 0, target: 0, percentage: 0 };
  const daysLeft = displayGoal ? differenceInDays(new Date(displayGoal.end_date), new Date()) : 0;
  const isEnded = daysLeft < 0;

  if (activeGoals.length === 0) {
    return (
      <Link to="/goals">
        <GlassCard className="p-5 hover:shadow-large transition-all duration-300 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AppleEmoji emoji="🎯" size="xl" />
              <h3 className="font-display text-lg font-semibold text-foreground">Goals</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground flex-1">
            Set your first goal and start tracking your progress toward what matters most.
          </p>
          <div className="mt-4 text-sm font-medium text-primary">
            Create a goal →
          </div>
        </GlassCard>
      </Link>
    );
  }

  return (
    <Link to="/goals">
      <GlassCard className="p-5 hover:shadow-large transition-all duration-300 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AppleEmoji emoji="🎯" size="xl" />
            <h3 className="font-display text-lg font-semibold text-foreground">Goal Progress</h3>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className="stroke-secondary"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className="stroke-primary"
                strokeWidth="3"
                strokeDasharray={`${overallProgress} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">{overallProgress}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {activeGoals.length} active goal{activeGoals.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              Average progress
            </p>
          </div>
        </div>

        {/* Featured goal */}
        {displayGoal && (
          <div className="p-3 rounded-2xl bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <AppleEmoji emoji={displayGoal.category_emoji} size="sm" />
              <span className="text-sm font-medium text-foreground line-clamp-1">
                {displayGoal.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isEnded ? "Ended" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`} • {progress.percentage}% complete
            </p>
          </div>
        )}
      </GlassCard>
    </Link>
  );
}

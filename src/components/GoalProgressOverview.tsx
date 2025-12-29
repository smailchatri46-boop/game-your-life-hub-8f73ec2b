import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { useGoals } from "@/hooks/use-goals";
import { Link } from "react-router-dom";
import { ChevronRight, Target } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export function GoalProgressOverview() {
  const { activeGoals, getGoalProgress } = useGoals();

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

  // Find the goal with the nearest deadline
  const sortedByDeadline = [...activeGoals].sort(
    (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
  );
  const nearestGoal = sortedByDeadline[0];
  const daysLeft = differenceInDays(new Date(nearestGoal.end_date), new Date());

  // Calculate overall progress
  const totalProgress = activeGoals.reduce((sum, goal) => sum + getGoalProgress(goal), 0);
  const avgProgress = Math.round(totalProgress / activeGoals.length);

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
                strokeDasharray={`${avgProgress} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">{avgProgress}%</span>
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

        {/* Nearest deadline */}
        <div className="p-3 rounded-2xl bg-secondary/50">
          <div className="flex items-center gap-2 mb-1">
            <AppleEmoji emoji={nearestGoal.category_emoji} size="sm" />
            <span className="text-sm font-medium text-foreground line-clamp-1">
              {nearestGoal.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"} • {getGoalProgress(nearestGoal)}% complete
          </p>
        </div>
      </GlassCard>
    </Link>
  );
}

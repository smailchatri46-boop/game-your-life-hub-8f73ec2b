import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Calendar } from "lucide-react";

export function GoalsShowcase() {
  const demoGoal = {
    name: "Complete 90-Day Fitness Challenge",
    category: "Health & Fitness",
    category_emoji: "💪",
    progress: 68,
    completed_count: 61,
    target_count: 90,
    start_date: "Jan 1, 2025",
    end_date: "Mar 31, 2025",
    pace: "On track",
    linkedHabits: [
      { id: "1", name: "Exercise", icon: "🏃" },
      { id: "2", name: "Drink Water", icon: "💧" },
      { id: "3", name: "Sleep 8 hours", icon: "😴" },
    ],
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left side - Title and Description - Aligned to top */}
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Set Goals <span className="font-body text-xl md:text-2xl">&</span>{" "}
              <span className="gradient-text italic">Track Them</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Create meaningful goals, link them to your daily habits, and watch your progress grow. 
              Stay motivated with visual progress tracking and pace indicators.
            </p>
          </div>

          {/* Right side - Goal Card Preview */}
          <div className="order-1 md:order-2">
            <GlassCard className="p-5 hover:shadow-large transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <AppleEmoji emoji={demoGoal.category_emoji} size="xl" />
                  </div>
                  <div>
                    <h3 className="font-body text-lg font-semibold text-foreground line-clamp-1">
                      {demoGoal.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{demoGoal.category}</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold gradient-text">{demoGoal.progress}%</span>
                  <span className="text-xs font-medium text-primary">{demoGoal.pace}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full progress-bar-orange rounded-full transition-all duration-500"
                    style={{ width: `${demoGoal.progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{demoGoal.completed_count} completed</span>
                  <span>{demoGoal.target_count} target</span>
                </div>
              </div>

              {/* Date range */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {demoGoal.start_date} — {demoGoal.end_date}
                </span>
              </div>

              {/* Linked habits */}
              <div className="pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Linked habits:</p>
                <div className="flex flex-wrap gap-2">
                  {demoGoal.linkedHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/80 text-xs"
                    >
                      <AppleEmoji emoji={habit.icon} size="sm" />
                      <span className="text-foreground">{habit.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
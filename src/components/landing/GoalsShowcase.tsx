import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Calendar } from "lucide-react";

export function GoalsShowcase() {
  const demoGoals = [
    {
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
      ],
    },
    {
      name: "Read 24 Books This Year",
      category: "Learning",
      category_emoji: "📚",
      progress: 42,
      completed_count: 10,
      target_count: 24,
      start_date: "Jan 1, 2025",
      end_date: "Dec 31, 2025",
      pace: "On track",
      linkedHabits: [
        { id: "3", name: "Read 30 min", icon: "📖" },
      ],
    },
    {
      name: "Save $5,000 Emergency Fund",
      category: "Finance",
      category_emoji: "💰",
      progress: 85,
      completed_count: 4250,
      target_count: 5000,
      start_date: "Jan 1, 2025",
      end_date: "Jun 30, 2025",
      pace: "Ahead",
      linkedHabits: [
        { id: "4", name: "Track spending", icon: "📊" },
        { id: "5", name: "No impulse buys", icon: "🛑" },
      ],
    },
  ];

  return (
    <section className="py-14 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Title - centered at top */}
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">
          Set Goals <span className="font-body text-2xl md:text-3xl">&</span>{" "}
          <span className="gradient-text italic">Track Them</span>
        </h2>

        {/* Goal Cards - three side-by-side */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {demoGoals.map((goal, index) => (
              <GlassCard key={index} className="p-5 hover:shadow-large transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <AppleEmoji emoji={goal.category_emoji} size="xl" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-body text-base font-semibold text-foreground line-clamp-2">
                        {goal.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{goal.category}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold gradient-text">{goal.progress}%</span>
                    <span className="text-xs font-medium text-primary">{goal.pace}</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full progress-bar-orange rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{goal.completed_count} completed</span>
                    <span>{goal.target_count} target</span>
                  </div>
                </div>

                {/* Date range */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {goal.start_date} — {goal.end_date}
                  </span>
                </div>

                {/* Linked habits */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 text-left">Linked habits:</p>
                  <div className="flex flex-wrap gap-2">
                    {goal.linkedHabits.map((habit) => (
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
            ))}
          </div>
        </div>

        {/* Description - centered below cards, wider */}
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
          Create meaningful goals, link them to your daily habits, and watch your progress grow. 
          Stay motivated with visual progress tracking and pace indicators.
        </p>
      </div>
    </section>
  );
}

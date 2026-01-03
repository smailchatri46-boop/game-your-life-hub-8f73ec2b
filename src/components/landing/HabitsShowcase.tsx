import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check } from "lucide-react";

const demoHabits = [
  { name: "Morning Meditation", emoji: "🧘", completions: [true, true, false, true, true, false, true] },
  { name: "Exercise", emoji: "💪", completions: [true, false, true, true, false, true, true] },
  { name: "Read 30 mins", emoji: "📚", completions: [true, true, true, false, true, true, false] },
  { name: "Drink Water", emoji: "💧", completions: [true, true, true, true, true, true, true] },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitsShowcase() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Organize Your Daily Routine <span className="gradient-text italic">Effortlessly</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Track habits and tasks in a beautiful spreadsheet-style grid. See your progress at a glance.
            </p>
          </div>

          {/* Habits Grid Preview */}
          <div>
            <GlassCard className="p-5 overflow-hidden" glow>
              {/* Header */}
              <div className="grid grid-cols-8 gap-2 mb-3">
                <div className="col-span-1" />
                {days.map((day) => (
                  <div key={day} className="text-center">
                    <span className="text-xs font-medium text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>

              {/* Habits Rows */}
              <div className="space-y-2">
                {demoHabits.map((habit, habitIndex) => (
                  <div key={habitIndex} className="grid grid-cols-8 gap-2 items-center">
                    <div className="flex items-center gap-2 col-span-1">
                      <AppleEmoji emoji={habit.emoji} size="sm" />
                    </div>
                    {habit.completions.map((completed, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          completed
                            ? "bg-gradient-to-br from-accent/80 to-primary/80"
                            : "bg-secondary/50"
                        }`}
                      >
                        {completed && <Check className="w-4 h-4 text-white" />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Habit Names */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                  {demoHabits.map((habit, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground flex items-center gap-1"
                    >
                      <AppleEmoji emoji={habit.emoji} size="sm" />
                      {habit.name}
                    </span>
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

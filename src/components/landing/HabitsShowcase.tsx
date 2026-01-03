import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, GripVertical, Trash2 } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Mind: "#8B5CF6",
  Health: "#22C55E",
  Growth: "#EC4899",
  Focus: "#3B82F6",
};

const demoHabits = [
  { 
    name: "Morning Meditation", 
    icon: "🧘", 
    category: "Mind",
    completions: [true, true, true, true, true, true, true, true, true, false, true, true, true, true],
    progress: 94
  },
  { 
    name: "Exercise", 
    icon: "💪", 
    category: "Health",
    completions: [false, true, true, false, false, true, true, true, true, true, true, true, false, true],
    progress: 68
  },
  { 
    name: "Read 30 mins", 
    icon: "📚", 
    category: "Growth",
    completions: [true, true, true, true, true, true, true, false, false, true, true, false, true, true],
    progress: 74
  },
  { 
    name: "Drink Water", 
    icon: "💧", 
    category: "Health",
    target: 8,
    completions: [1, 4, 0, 0, 7, 3, 7, 8, 2, 8, 7, 1, 3, 1],
    progress: 16
  },
  { 
    name: "Journal Writing", 
    icon: "📝", 
    category: "Mind",
    completions: [true, false, true, true, false, true, true, true, false, true, true, true, false, true],
    progress: 71
  },
  { 
    name: "Deep Work", 
    icon: "🎯", 
    category: "Focus",
    completions: [true, true, false, true, true, true, false, true, true, true, false, true, true, true],
    progress: 79
  },
];

const days = Array.from({ length: 14 }, (_, i) => i + 1);

export function HabitsShowcase() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Organize Your Daily Routine <span className="gradient-text italic">Effortlessly</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track habits and tasks in a beautiful spreadsheet-style grid. See your progress at a glance.
          </p>
        </div>

        {/* Exact Habits Grid from Dashboard */}
        <GlassCard className="p-2 sm:p-3 lg:p-4 overflow-x-auto">
          <table className="w-full table-fixed" style={{ minWidth: '700px' }}>
            <thead>
              <tr>
                <th className="text-left p-1.5 lg:p-2" style={{ width: '160px' }}>
                  <span className="text-xs lg:text-sm font-semibold text-foreground">Habits and Tasks</span>
                </th>
                {days.map((day) => (
                  <th key={day} className="p-0.5 lg:p-1 text-center">
                    <span className={`text-xs lg:text-sm font-medium ${day === 14 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                      {day}
                    </span>
                  </th>
                ))}
                <th className="p-1 lg:p-2 text-right" style={{ width: '48px' }}>
                  <span className="text-xs lg:text-sm font-semibold text-foreground">%</span>
                </th>
                <th style={{ width: '36px' }}></th>
              </tr>
            </thead>
            <tbody>
              {demoHabits.map((habit, habitIndex) => (
                <tr key={habitIndex} className="border-t border-border/30">
                  <td className="p-1.5 lg:p-2">
                    <div className="flex items-center gap-1.5">
                      <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0 hidden lg:block" />
                      <AppleEmoji emoji={habit.icon} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs lg:text-sm font-medium truncate">{habit.name}</p>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: CATEGORY_COLORS[habit.category] || "#6B7280" }}
                          />
                          <p className="text-[10px] lg:text-xs text-muted-foreground">{habit.category}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  {habit.completions.map((value, dayIndex) => {
                    const isCompleted = habit.target ? (value as number) >= habit.target : value === true;
                    const isNumeric = habit.target !== undefined;
                    
                    return (
                      <td key={dayIndex} className="p-0.5 lg:p-1">
                        <div
                          className={`w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto rounded-md flex items-center justify-center text-xs transition-all duration-200 ${
                            isCompleted
                              ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-sm'
                              : 'bg-secondary'
                          }`}
                        >
                          {isNumeric ? (
                            <span className="font-medium text-[10px] lg:text-xs">
                              {value as number}
                            </span>
                          ) : (
                            isCompleted && <Check className="w-3 h-3 lg:w-4 lg:h-4" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-1 lg:p-2 text-right">
                    <span className="text-xs lg:text-sm font-bold gradient-text">{habit.progress}%</span>
                  </td>
                  <td className="p-1 lg:p-2">
                    {/* Non-clickable delete icon */}
                    <div className="p-1 text-muted-foreground/40">
                      <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </section>
  );
}
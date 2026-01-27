import { AppleEmoji } from "@/components/AppleEmoji";
import { GlassCard } from "@/components/GlassCard";
import { Check, Target, TrendingUp, Calendar, Heart, BarChart3, Plus, GripVertical, Trash2 } from "lucide-react";

// Demo data for habits grid
const DEMO_HABITS = [
  {
    name: "Morning Meditation",
    icon: "🧘",
    category: "Mind",
    categoryColor: "#8B5CF6",
    progress: 70,
    completions: [true, true, false, true, false, true, true, true, true, true, true, true, true, false, true, true, true, false, true, true, true, true],
  },
  {
    name: "Exercise",
    icon: "💪",
    category: "Health",
    categoryColor: "#10B981",
    progress: 93,
    completions: [true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true],
  },
  {
    name: "Read 30 mins",
    icon: "📚",
    category: "Growth",
    categoryColor: "#A855F7",
    progress: 85,
    completions: [true, true, true, true, true, true, true, false, true, true, true, true, true, true, false, true, true, true, true, true, true, true],
  },
  {
    name: "Drink Water",
    icon: "💧",
    category: "Health",
    categoryColor: "#10B981",
    progress: 4,
    target: 8,
    completions: [1, 8, 1, 6, 1, 5, 7, 3, 1, 1, 5, 6, 6, 4, 0, 7, 0, 3, 5, 0, 2, 2],
  },
  {
    name: "No Social Media",
    icon: "🚫",
    category: "Focus",
    categoryColor: "#3B82F6",
    progress: 67,
    completions: [true, false, true, true, false, true, true, true, true, true, true, false, true, true, false, true, true, true, false, true, true, true],
  },
  {
    name: "Daily Reflection",
    icon: "📝",
    category: "Journal",
    categoryColor: "#F97316",
    progress: 0,
    completions: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  },
];

// Demo goals
const DEMO_GOALS = [
  {
    name: "Save $5,000 Emergency Fund",
    category: "Finance",
    emoji: "💰",
    progress: 85,
    completed: 4250,
    target: 5000,
    startDate: "Jan 1, 2025",
    endDate: "Jun 30, 2025",
    pace: "Ahead",
    linkedHabits: [
      { icon: "📊", name: "Track spending" },
      { icon: "🛑", name: "No impulse buys" },
    ],
  },
  {
    name: "Learn Spanish Fluently",
    category: "Personal Growth",
    emoji: "🌍",
    progress: 35,
    completed: 105,
    target: 300,
    startDate: "Jan 1, 2025",
    endDate: "Dec 31, 2025",
    pace: "On track",
    linkedHabits: [
      { icon: "🗣️", name: "Practice 20 min" },
      { icon: "🃏", name: "Flashcards" },
    ],
  },
  {
    name: "Meditate 100 Days",
    category: "Mindfulness",
    emoji: "🧘",
    progress: 72,
    completed: 72,
    target: 100,
    startDate: "Jan 1, 2025",
    endDate: "Apr 10, 2025",
    pace: "On track",
    linkedHabits: [{ icon: "🌅", name: "Morning meditation" }],
  },
];

// Stat Card Component
function StatCardPreview({
  title,
  subtitle,
  value,
  suffix = "%",
  icon: Icon,
  iconColor = "text-primary",
  progress,
}: {
  title: string;
  subtitle?: string;
  value: number | string;
  suffix?: string;
  icon: React.ElementType;
  iconColor?: string;
  progress?: number;
}) {
  return (
    <div className="glass-card p-5 min-w-[200px] flex-shrink-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-xl bg-secondary ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-0.5 mb-3">
        <span className="text-3xl font-bold gradient-text">{value}</span>
        <span className="text-lg font-medium text-primary/70">{suffix}</span>
      </div>
      {progress !== undefined && (
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full progress-bar-orange rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Overview Stat Card (mood/analytics style)
function OverviewStatCardPreview({
  title,
  value,
  suffix,
  subtitle,
  icon: Icon,
  iconColor = "text-accent",
  progress,
  emoji,
}: {
  title: string;
  value?: number | string;
  suffix?: string;
  subtitle?: string;
  icon: React.ElementType;
  iconColor?: string;
  progress?: number;
  emoji?: string;
}) {
  return (
    <div className="glass-card p-5 min-w-[200px] flex-shrink-0">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <div className={`p-2 rounded-xl bg-secondary ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {emoji ? (
        <div className="flex items-center gap-2 mb-2">
          <AppleEmoji emoji={emoji} size="3xl" />
        </div>
      ) : (
        <div className="flex items-baseline gap-0.5 mb-2">
          <span className="text-3xl font-bold gradient-text">{value}</span>
          {suffix && <span className="text-lg font-medium text-primary/70">{suffix}</span>}
        </div>
      )}
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full progress-bar-orange rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// To-Do List Card
function TodoCardPreview() {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)] min-w-[280px] flex-shrink-0">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">To-Do List</h3>
          <p className="text-sm text-muted-foreground">27 janvier 2026</p>
        </div>
        <AppleEmoji emoji="😌" size="2xl" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-sm">
          <AppleEmoji emoji="💬" size="lg" />
          <span className="text-sm flex-1 text-muted-foreground line-through">Call mom</span>
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[hsl(25,60%,70%)] border-[hsl(25,60%,70%)]">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/50 text-muted-foreground border-2 border-dashed border-muted-foreground/20">
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add task</span>
        </button>
      </div>
    </div>
  );
}

// Habits Grid Preview (compact version)
function HabitsGridPreview() {
  const days = Array.from({ length: 22 }, (_, i) => i + 1);

  return (
    <GlassCard className="p-4 min-w-[750px] flex-shrink-0 overflow-hidden">
      <table className="w-full table-fixed" style={{ minWidth: "700px" }}>
        <thead>
          <tr>
            <th className="text-left p-1.5" style={{ width: "160px" }}>
              <span className="text-xs font-semibold text-foreground">Habits and Tasks</span>
            </th>
            {days.map((day) => (
              <th key={day} className="p-0.5 text-center">
                <span className={`text-xs font-medium ${day === 14 ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {day}
                </span>
              </th>
            ))}
            <th className="p-1 text-right" style={{ width: "48px" }}>
              <span className="text-xs font-semibold text-foreground">%</span>
            </th>
            <th style={{ width: "36px" }}></th>
          </tr>
        </thead>
        <tbody>
          {DEMO_HABITS.map((habit, habitIndex) => (
            <tr key={habitIndex} className="border-t border-border/30">
              <td className="p-1.5">
                <div className="flex items-center gap-1.5">
                  <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                  <AppleEmoji emoji={habit.icon} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{habit.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: habit.categoryColor }}
                      />
                      <p className="text-[10px] text-muted-foreground">{habit.category}</p>
                    </div>
                  </div>
                </div>
              </td>
              {habit.completions.map((value, dayIndex) => {
                const isCompleted = habit.target ? (value as number) >= habit.target : value === true;
                const isNumeric = habit.target !== undefined;

                return (
                  <td key={dayIndex} className="p-0.5">
                    <div
                      className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center text-xs ${
                        isCompleted
                          ? "bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-sm"
                          : "bg-secondary"
                      }`}
                    >
                      {isNumeric ? (
                        <span className="font-medium text-[10px]">{value as number}</span>
                      ) : (
                        isCompleted && <Check className="w-3 h-3" />
                      )}
                    </div>
                  </td>
                );
              })}
              <td className="p-1 text-right">
                <span className="text-xs font-bold gradient-text">{habit.progress}%</span>
              </td>
              <td className="p-1">
                <div className="p-1 text-muted-foreground/40">
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}

// Goal Card Preview
function GoalCardPreview({
  goal,
}: {
  goal: (typeof DEMO_GOALS)[0];
}) {
  const paceColor =
    goal.pace === "Ahead"
      ? "text-green-600"
      : goal.pace === "On track"
      ? "text-primary"
      : "text-muted-foreground";

  return (
    <GlassCard className="p-5 min-w-[320px] flex-shrink-0">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <AppleEmoji emoji={goal.emoji} size="xl" />
        </div>
        <div>
          <h3 className="font-body text-lg font-semibold text-foreground line-clamp-1">{goal.name}</h3>
          <p className="text-xs text-muted-foreground">{goal.category}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold gradient-text">{goal.progress}%</span>
          <span className={`text-xs font-medium ${paceColor}`}>{goal.pace}</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full progress-bar-orange rounded-full"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{goal.completed} completed</span>
          <span>{goal.target} target</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3.5 h-3.5" />
        <span>
          {goal.startDate} — {goal.endDate}
        </span>
      </div>

      {goal.linkedHabits.length > 0 && (
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Linked habits:</p>
          <div className="flex flex-wrap gap-2">
            {goal.linkedHabits.map((habit, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/80 text-xs"
              >
                <AppleEmoji emoji={habit.icon} size="sm" />
                <span className="text-foreground">{habit.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

export function PaywallMarquee() {
  // Build the marquee items in a logical order
  const marqueeItems = [
    // Stat cards (This Month, This Week, Today)
    <StatCardPreview
      key="stat-month"
      title="This Month"
      subtitle="January progress so far"
      value={74}
      icon={TrendingUp}
      iconColor="text-primary"
      progress={74}
    />,
    <StatCardPreview
      key="stat-week"
      title="This Week Average"
      subtitle="Last 7 days"
      value={68}
      icon={Calendar}
      iconColor="text-accent"
      progress={68}
    />,
    <StatCardPreview
      key="stat-today"
      title="Today"
      subtitle="Today's progress"
      value={94}
      icon={Target}
      iconColor="text-primary"
      progress={94}
    />,
    // Goals
    ...DEMO_GOALS.map((goal, i) => <GoalCardPreview key={`goal-${i}`} goal={goal} />),
    // Overview mood cards
    <OverviewStatCardPreview
      key="perfect-days"
      title="Perfect Days"
      value={0}
      suffix="/ 7"
      subtitle="Days completed fully this week"
      icon={Target}
      iconColor="text-accent"
      progress={0}
    />,
    <OverviewStatCardPreview
      key="mood-average"
      title="Mood Average"
      emoji="😊"
      subtitle="Your average mood is Happy."
      icon={Heart}
      iconColor="text-primary"
    />,
    <OverviewStatCardPreview
      key="mood-stability"
      title="Mood Stability"
      value={7}
      suffix="/ 10"
      subtitle="Consistency of mood"
      icon={BarChart3}
      iconColor="text-accent"
      progress={70}
    />,
    <OverviewStatCardPreview
      key="daily-progress"
      title="Daily Progress"
      value={0}
      suffix="%"
      subtitle="Average daily completion"
      icon={TrendingUp}
      iconColor="text-primary"
      progress={0}
    />,
    // Todo card
    <TodoCardPreview key="todo" />,
    // Habits grid
    <HabitsGridPreview key="habits-grid" />,
  ];

  return (
    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden py-6">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-[hsl(30,100%,99%)] to-transparent" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[hsl(30,100%,99%)] to-transparent" />

      {/* Marquee track */}
      <div className="flex animate-marquee-paywall gap-4">
        {/* First set */}
        {marqueeItems}
        {/* Duplicate for seamless loop */}
        {marqueeItems}
      </div>
    </div>
  );
}

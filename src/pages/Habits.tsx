import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Check } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  target: number;
  completions: Record<number, boolean | number>;
}

const initialHabits: Habit[] = [
  { id: "1", name: "Morning Meditation", icon: "🧘", category: "Mind", target: 1, completions: { 1: true, 2: true, 3: true, 4: false, 5: true, 6: true, 7: true, 8: true, 9: false, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: false, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true, 25: true } },
  { id: "2", name: "Exercise", icon: "💪", category: "Health", target: 1, completions: { 1: true, 2: false, 3: true, 4: true, 5: true, 6: false, 7: true, 8: true, 9: true, 10: true, 11: false, 12: true, 13: true, 14: true, 15: false, 16: true, 17: true, 18: true, 19: true, 20: false, 21: true, 22: true, 23: true, 24: false, 25: true } },
  { id: "3", name: "Read 30 mins", icon: "📚", category: "Growth", target: 1, completions: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: true, 9: true, 10: true, 11: true, 12: true, 13: false, 14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: false, 23: true, 24: true, 25: true } },
  { id: "4", name: "Drink Water", icon: "💧", category: "Health", target: 8, completions: { 1: 8, 2: 6, 3: 8, 4: 7, 5: 8, 6: 5, 7: 8, 8: 8, 9: 6, 10: 8, 11: 7, 12: 8, 13: 8, 14: 6, 15: 8, 16: 8, 17: 7, 18: 8, 19: 8, 20: 6, 21: 8, 22: 8, 23: 7, 24: 8, 25: 8 } },
  { id: "5", name: "No Social Media", icon: "📵", category: "Focus", target: 1, completions: { 1: true, 2: true, 3: false, 4: true, 5: true, 6: true, 7: true, 8: false, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: false, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true, 25: true } },
];

const generateChartData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    progress: Math.floor(50 + Math.random() * 40 + Math.sin(i / 3) * 15),
  }));
};

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const chartData = generateChartData();
  const daysInMonth = 31;
  const today = 25;

  const toggleHabit = (habitId: string, day: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        if (habit.target === 1) {
          newCompletions[day] = !newCompletions[day];
        }
        return { ...habit, completions: newCompletions };
      }
      return habit;
    }));
  };

  const getHabitProgress = (habit: Habit) => {
    const completed = Object.values(habit.completions).filter(v => 
      typeof v === 'boolean' ? v : (v as number) >= habit.target
    ).length;
    return Math.round((completed / today) * 100);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Habits</h1>
            <p className="text-muted-foreground mt-1">December 2025</p>
          </div>
          <Button variant="gradient" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Habit
          </Button>
        </div>
        
        {/* Habits Grid */}
        <GlassCard className="p-4 mb-8 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <th className="text-left p-2 w-48">
                  <span className="text-sm font-semibold text-foreground">Habit</span>
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i} className="p-1 w-8">
                    <span className={`text-xs font-medium ${i + 1 === today ? 'text-primary' : 'text-muted-foreground'}`}>
                      {i + 1}
                    </span>
                  </th>
                ))}
                <th className="p-2 w-20 text-right">
                  <span className="text-sm font-semibold text-foreground">%</span>
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="border-t border-border/30">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                      <span className="text-lg">{habit.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{habit.name}</p>
                        <p className="text-xs text-muted-foreground">{habit.category}</p>
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const value = habit.completions[day];
                    const isCompleted = habit.target === 1 
                      ? value === true 
                      : typeof value === 'number' && value >= habit.target;
                    const isFuture = day > today;
                    
                    return (
                      <td key={i} className="p-1">
                        <button
                          onClick={() => !isFuture && toggleHabit(habit.id, day)}
                          disabled={isFuture}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-200 ${
                            isFuture 
                              ? 'bg-muted/30 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-sm'
                                : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {!isFuture && habit.target === 1 && isCompleted && (
                            <Check className="w-4 h-4" />
                          )}
                          {!isFuture && habit.target > 1 && typeof value === 'number' && (
                            <span className="font-medium">{value}</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-2 text-right">
                    <span className="text-sm font-bold gradient-text">{getHabitProgress(habit)}%</span>
                  </td>
                  <td className="p-2">
                    <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Mood Row */}
              <tr className="border-t-2 border-border/50">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                    <span className="text-lg">😊</span>
                    <div>
                      <p className="text-sm font-medium">Daily Mood</p>
                      <p className="text-xs text-muted-foreground">How are you feeling?</p>
                    </div>
                  </div>
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const moods = ['😊', '😌', '😐', '😔', '🥳'];
                  const moodIndex = Math.floor(Math.random() * 5);
                  const isFuture = day > today;
                  
                  return (
                    <td key={i} className="p-1">
                      <button
                        disabled={isFuture}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                          isFuture ? 'bg-muted/30 cursor-not-allowed' : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        {!isFuture && moods[moodIndex]}
                      </button>
                    </td>
                  );
                })}
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </GlassCard>
        
        {/* Progress Chart */}
        <GlassCard className="p-6">
          <h3 className="font-display text-xl font-semibold mb-6">30-Day Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(38, 100%, 60%)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(25, 15%, 50%)', fontSize: 12 }}
                  tickFormatter={(value) => value}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(25, 15%, 50%)', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(0, 0%, 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px -4px hsl(24, 95%, 53%, 0.1)',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Completion']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="hsl(24, 95%, 53%)"
                  strokeWidth={3}
                  fill="url(#progressGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

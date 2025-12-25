import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useSelectedMonth } from "@/hooks/use-selected-month";

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  target: number;
  completions: Record<string, boolean | number>; // key is "YYYY-MM-DD"
}

const generateCompletions = (year: number, month: number, maxDay: number, target: number) => {
  const completions: Record<string, boolean | number> = {};
  for (let day = 1; day <= maxDay; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (target === 1) {
      completions[dateKey] = Math.random() > 0.2;
    } else {
      completions[dateKey] = Math.floor(Math.random() * (target + 2));
    }
  }
  return completions;
};

const habitTemplates = [
  { id: "1", name: "Morning Meditation", icon: "🧘", category: "Mind", target: 1 },
  { id: "2", name: "Exercise", icon: "💪", category: "Health", target: 1 },
  { id: "3", name: "Read 30 mins", icon: "📚", category: "Growth", target: 1 },
  { id: "4", name: "Drink Water", icon: "💧", category: "Health", target: 8 },
  { id: "5", name: "No Social Media", icon: "📵", category: "Focus", target: 1 },
];

const generateChartData = (daysInMonth: number, currentDay: number) => {
  const maxDay = Math.min(daysInMonth, currentDay);
  return Array.from({ length: maxDay }, (_, i) => ({
    day: i + 1,
    progress: Math.floor(50 + Math.random() * 40 + Math.sin(i / 3) * 15),
  }));
};

export default function Habits() {
  const {
    monthName,
    year,
    month,
    goToPreviousMonth,
    goToNextMonth,
    getDaysInMonth,
    getCurrentDay,
  } = useSelectedMonth();

  const daysInMonth = getDaysInMonth();
  const currentDay = getCurrentDay();

  // Generate habits with completions for the current month
  const habits = useMemo<Habit[]>(() => {
    return habitTemplates.map(template => ({
      ...template,
      completions: generateCompletions(year, month, currentDay, template.target),
    }));
  }, [year, month, currentDay]);

  const chartData = useMemo(() => {
    return generateChartData(daysInMonth, currentDay);
  }, [daysInMonth, currentDay]);

  // Generate mood data for the month
  const moodData = useMemo(() => {
    const moods: Record<number, string> = {};
    const moodEmojis = ['😊', '😌', '😐', '😔', '🥳'];
    for (let day = 1; day <= currentDay; day++) {
      moods[day] = moodEmojis[Math.floor(Math.random() * 5)];
    }
    return moods;
  }, [currentDay, month, year]);

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getHabitProgress = (habit: Habit) => {
    let completed = 0;
    for (let day = 1; day <= currentDay; day++) {
      const dateKey = getDateKey(day);
      const value = habit.completions[dateKey];
      if (habit.target === 1) {
        if (value === true) completed++;
      } else {
        if (typeof value === 'number' && value >= habit.target) completed++;
      }
    }
    return Math.round((completed / currentDay) * 100);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">Track your habits</p>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="font-display text-base sm:text-lg min-w-[130px] sm:min-w-[150px] text-center">
              <span className="text-primary font-semibold">{monthName}</span>
              <span className="text-foreground ml-2">{year}</span>
            </h2>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <Button variant="gradient" size="lg" className="ml-2 sm:ml-4 hidden sm:flex">
              <Plus className="w-5 h-5 mr-2" />
              Add Habit
            </Button>
            <Button variant="gradient" size="icon" className="ml-2 sm:hidden">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Habits Grid - scrollable on small screens, full width on large screens */}
        <GlassCard className="p-3 sm:p-4 xl:p-5 mb-8 overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1000px' }}>
            <thead>
              <tr>
                <th className="text-left p-2 xl:p-3 w-[180px] xl:w-[220px]">
                  <span className="text-sm xl:text-base font-semibold text-foreground">Habit</span>
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i} className="p-1 xl:p-1.5 text-center">
                    <span className={`text-sm xl:text-base font-medium ${i + 1 === currentDay ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                      {i + 1}
                    </span>
                  </th>
                ))}
                <th className="p-2 xl:p-3 w-[60px] xl:w-[70px] text-right">
                  <span className="text-sm xl:text-base font-semibold text-foreground">%</span>
                </th>
                <th className="w-[40px] xl:w-[48px]"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="border-t border-border/30">
                  <td className="p-2 xl:p-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab flex-shrink-0 hidden sm:block" />
                      <AppleEmoji emoji={habit.icon} size="xl" />
                      <div className="min-w-0">
                        <p className="text-sm xl:text-base font-medium truncate">{habit.name}</p>
                        <p className="text-xs xl:text-sm text-muted-foreground">{habit.category}</p>
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateKey = getDateKey(day);
                    const value = habit.completions[dateKey];
                    const isCompleted = habit.target === 1 
                      ? value === true 
                      : typeof value === 'number' && value >= habit.target;
                    const isFuture = day > currentDay;
                    
                    return (
                      <td key={i} className="p-1 xl:p-1.5">
                        <button
                          disabled={isFuture}
                          className={`w-7 h-7 xl:w-8 xl:h-8 mx-auto rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${
                            isFuture 
                              ? 'bg-muted/30 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-sm hover:scale-105'
                                : 'bg-secondary hover:bg-secondary/80 cursor-pointer'
                          }`}
                        >
                          {!isFuture && habit.target === 1 && isCompleted && (
                            <Check className="w-4 h-4 xl:w-5 xl:h-5" />
                          )}
                          {!isFuture && habit.target > 1 && typeof value === 'number' && (
                            <span className="font-medium text-xs xl:text-sm">{value}</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-2 xl:p-3 text-right">
                    <span className="text-sm xl:text-base font-bold gradient-text">{getHabitProgress(habit)}%</span>
                  </td>
                  <td className="p-2 xl:p-3">
                    <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4 xl:w-5 xl:h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Mood Row */}
              <tr className="border-t-2 border-border/50">
                <td className="p-2 xl:p-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 hidden sm:block" />
                    <AppleEmoji emoji="😊" size="xl" />
                    <div className="min-w-0">
                      <p className="text-sm xl:text-base font-medium">Daily Mood</p>
                      <p className="text-xs xl:text-sm text-muted-foreground">How are you?</p>
                    </div>
                  </div>
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isFuture = day > currentDay;
                  
                  return (
                    <td key={i} className="p-1 xl:p-1.5">
                      <button
                        disabled={isFuture}
                        className={`w-7 h-7 xl:w-8 xl:h-8 mx-auto rounded-lg flex items-center justify-center ${
                          isFuture ? 'bg-muted/30 cursor-not-allowed' : 'bg-secondary hover:bg-secondary/80 cursor-pointer'
                        }`}
                      >
                        {!isFuture && <AppleEmoji emoji={moodData[day]} size="md" />}
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
          <h3 className="font-display text-xl font-semibold mb-6">{monthName} Progress</h3>
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

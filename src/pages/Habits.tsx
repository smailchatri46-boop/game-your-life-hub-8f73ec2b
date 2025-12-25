import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { AlignedProgressChart } from "@/components/AlignedProgressChart";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
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
        
        {/* Habits Grid - fits all days on desktop without scroll */}
        <GlassCard className="p-2 sm:p-3 lg:p-4 mb-8 overflow-x-auto lg:overflow-visible">
          <table className="w-full table-fixed" style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th className="text-left p-1.5 lg:p-2" style={{ width: '140px' }}>
                  <span className="text-xs lg:text-sm font-semibold text-foreground">Habit</span>
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i} className="p-0.5 lg:p-1 text-center">
                    <span className={`text-xs lg:text-sm font-medium ${i + 1 === currentDay ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                      {i + 1}
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
              {habits.map((habit) => (
                <tr key={habit.id} className="border-t border-border/30">
                  <td className="p-1.5 lg:p-2">
                    <div className="flex items-center gap-1.5">
                      <GripVertical className="w-3 h-3 text-muted-foreground/50 cursor-grab flex-shrink-0 hidden lg:block" />
                      <AppleEmoji emoji={habit.icon} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs lg:text-sm font-medium truncate">{habit.name}</p>
                        <p className="text-[10px] lg:text-xs text-muted-foreground">{habit.category}</p>
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
                      <td key={i} className="p-0.5 lg:p-1">
                        <button
                          disabled={isFuture}
                          className={`w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto rounded-md flex items-center justify-center text-xs transition-all duration-200 ${
                            isFuture 
                              ? 'bg-muted/30 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-sm hover:scale-105'
                                : 'bg-secondary hover:bg-secondary/80 cursor-pointer'
                          }`}
                        >
                          {!isFuture && habit.target === 1 && isCompleted && (
                            <Check className="w-3 h-3 lg:w-4 lg:h-4" />
                          )}
                          {!isFuture && habit.target > 1 && typeof value === 'number' && (
                            <span className="font-medium text-[10px] lg:text-xs">{value}</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-1 lg:p-2 text-right">
                    <span className="text-xs lg:text-sm font-bold gradient-text">{getHabitProgress(habit)}%</span>
                  </td>
                  <td className="p-1 lg:p-2">
                    <button className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Mood Row */}
              <tr className="border-t-2 border-border/50">
                <td className="p-1.5 lg:p-2">
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0 hidden lg:block" />
                    <AppleEmoji emoji="😊" size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm font-medium">Daily Mood</p>
                      <p className="text-[10px] lg:text-xs text-muted-foreground">How are you?</p>
                    </div>
                  </div>
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isFuture = day > currentDay;
                  
                  return (
                    <td key={i} className="p-0.5 lg:p-1">
                      <button
                        disabled={isFuture}
                        className={`w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto rounded-md flex items-center justify-center ${
                          isFuture ? 'bg-muted/30 cursor-not-allowed' : 'bg-secondary hover:bg-secondary/80 cursor-pointer'
                        }`}
                      >
                        {!isFuture && <AppleEmoji emoji={moodData[day]} size="sm" />}
                      </button>
                    </td>
                  );
                })}
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </GlassCard>
        
        {/* Progress Chart - perfectly aligned with table columns */}
        <GlassCard className="py-2 px-1 sm:py-3 sm:px-1.5 lg:py-4 lg:px-2 overflow-x-auto lg:overflow-visible">
          <div style={{ minWidth: '900px' }}>
            <AlignedProgressChart 
              data={chartData}
              daysInMonth={daysInMonth}
              currentDay={currentDay}
              monthName={monthName}
            />
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

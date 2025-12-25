import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { AlignedProgressChart } from "@/components/AlignedProgressChart";
import { AddHabitModal, NewHabit } from "@/components/AddHabitModal";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelectedMonth } from "@/hooks/use-selected-month";

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  categoryColor?: string;
  target: number;
  importance?: number;
  completions: Record<string, boolean | number>; // key is "YYYY-MM-DD"
}

const CATEGORY_COLORS: Record<string, string> = {
  Mind: "#8B5CF6",
  Health: "#22C55E",
  Growth: "#EC4899",
  Focus: "#3B82F6",
  Work: "#3B82F6",
  Fitness: "#F59E0B",
  Learning: "#8B5CF6",
  "Personal Growth": "#EC4899",
  Spiritual: "#06B6D4",
  Other: "#6B7280",
};

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
  { id: "1", name: "Morning Meditation", icon: "🧘", category: "Mind", categoryColor: "#8B5CF6", target: 1, importance: 70 },
  { id: "2", name: "Exercise", icon: "💪", category: "Health", categoryColor: "#22C55E", target: 1, importance: 80 },
  { id: "3", name: "Read 30 mins", icon: "📚", category: "Growth", categoryColor: "#EC4899", target: 1, importance: 60 },
  { id: "4", name: "Drink Water", icon: "💧", category: "Health", categoryColor: "#22C55E", target: 8, importance: 50 },
  { id: "5", name: "No Social Media", icon: "📵", category: "Focus", categoryColor: "#3B82F6", target: 1, importance: 40 },
];

const generateChartData = (habits: Habit[], daysInMonth: number, currentDay: number, year: number, month: number) => {
  const maxDay = Math.min(daysInMonth, currentDay);
  return Array.from({ length: maxDay }, (_, i) => {
    const day = i + 1;
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    let totalWeight = 0;
    let weightedProgress = 0;
    
    habits.forEach(habit => {
      const weight = habit.importance || 50;
      totalWeight += weight;
      const value = habit.completions[dateKey];
      if (habit.target === 1) {
        if (value === true) weightedProgress += weight;
      } else {
        if (typeof value === 'number') {
          weightedProgress += (Math.min(value, habit.target) / habit.target) * weight;
        }
      }
    });
    
    return {
      day,
      progress: totalWeight > 0 ? Math.round((weightedProgress / totalWeight) * 100) : 0,
    };
  });
};

export default function Habits() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  // Initialize all habits with completions - stored in state for interactivity
  const [allHabits, setAllHabits] = useState<Habit[]>(() => {
    return habitTemplates.map(template => ({
      ...template,
      completions: generateCompletions(year, month, currentDay, template.target),
    }));
  });

  // Regenerate completions when month changes
  const displayHabits = useMemo<Habit[]>(() => {
    // Update template habits with current month's data if needed
    return allHabits.map(habit => {
      // Check if this habit has data for the current month
      const firstDayKey = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      if (habit.completions[firstDayKey] === undefined && habitTemplates.some(t => t.id === habit.id)) {
        // Generate new completions for template habits in new month
        return {
          ...habit,
          completions: {
            ...habit.completions,
            ...generateCompletions(year, month, currentDay, habit.target),
          },
        };
      }
      return habit;
    });
  }, [allHabits, year, month, currentDay]);

  // Calculate chart data from actual habit completions
  const chartData = useMemo(() => {
    return generateChartData(displayHabits, daysInMonth, currentDay, year, month);
  }, [displayHabits, daysInMonth, currentDay, year, month]);


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

  const handleAddHabit = (newHabit: NewHabit) => {
    const habit: Habit = {
      id: newHabit.id,
      name: newHabit.name,
      icon: newHabit.icon,
      category: newHabit.category,
      categoryColor: newHabit.categoryColor,
      target: newHabit.target,
      importance: newHabit.importance,
      completions: {},
    };
    setAllHabits(prev => [...prev, habit]);
  };

  const handleDeleteHabit = (habitId: string) => {
    setAllHabits(prev => prev.filter(h => h.id !== habitId));
  };

  // Toggle habit completion for a specific day
  const toggleHabitCompletion = (habitId: string, day: number) => {
    const dateKey = getDateKey(day);
    
    setAllHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const currentValue = habit.completions[dateKey];
      let newValue: boolean | number;
      
      if (habit.target === 1) {
        // Boolean habit - toggle true/false
        newValue = currentValue !== true;
      } else {
        // Numeric habit - cycle through values (0 -> 1 -> 2 -> ... -> target -> 0)
        const current = typeof currentValue === 'number' ? currentValue : 0;
        newValue = current >= habit.target ? 0 : current + 1;
      }
      
      return {
        ...habit,
        completions: {
          ...habit.completions,
          [dateKey]: newValue,
        },
      };
    }));
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
            
            <Button variant="gradient" size="lg" className="ml-2 sm:ml-4 hidden sm:flex" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Habit
            </Button>
            <Button variant="gradient" size="icon" className="ml-2 sm:hidden" onClick={() => setIsModalOpen(true)}>
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
              {displayHabits.map((habit) => (
                <tr key={habit.id} className="border-t border-border/30">
                  <td className="p-1.5 lg:p-2">
                    <div className="flex items-center gap-1.5">
                      <GripVertical className="w-3 h-3 text-muted-foreground/50 cursor-grab flex-shrink-0 hidden lg:block" />
                      <AppleEmoji emoji={habit.icon} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs lg:text-sm font-medium truncate">{habit.name}</p>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: habit.categoryColor || CATEGORY_COLORS[habit.category] || "#6B7280" }}
                          />
                          <p className="text-[10px] lg:text-xs text-muted-foreground">{habit.category}</p>
                        </div>
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
                          onClick={() => !isFuture && toggleHabitCompletion(habit.id, day)}
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
                          {!isFuture && habit.target > 1 && (
                            <span className="font-medium text-[10px] lg:text-xs">
                              {typeof value === 'number' ? value : 0}
                            </span>
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

      <AddHabitModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleAddHabit}
      />
    </div>
  );
}

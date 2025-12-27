import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { AlignedProgressChart } from "@/components/AlignedProgressChart";
import { MoodMotivationChart } from "@/components/MoodMotivationChart";
import { AICoachingSection } from "@/components/AICoachingSection";
import { AddHabitModal, NewHabit } from "@/components/AddHabitModal";
import { StatCard } from "@/components/StatCard";
import { DailyReflectionModal } from "@/components/DailyReflectionModal";
import { UnifiedMoodMotivationModal } from "@/components/UnifiedMoodMotivationModal";
import { AppleEmoji as MoodEmoji } from "@/components/AppleEmoji";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Check, ChevronLeft, ChevronRight, Target, Calendar, TrendingUp, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelectedMonth } from "@/hooks/use-selected-month";
import { format } from "date-fns";

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
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [selectedReflectionDay, setSelectedReflectionDay] = useState<number | null>(null);
  
  // Mood & Motivation state (unified)
  const [moodData, setMoodData] = useState<Record<string, number>>({});
  const [motivationData, setMotivationData] = useState<Record<string, number>>({});
  const [moodMotivationModalOpen, setMoodMotivationModalOpen] = useState(false);
  const [selectedMoodMotivationDay, setSelectedMoodMotivationDay] = useState<number | null>(null);
  
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

  // Handle saving a daily reflection
  const handleSaveReflection = (dateKey: string, text: string) => {
    setReflections(prev => ({
      ...prev,
      [dateKey]: text,
    }));
  };

  // Get completion percentage for a specific day
  const getDayCompletionPercent = (day: number) => {
    const dateKey = getDateKey(day);
    let totalWeight = 0;
    let weightedProgress = 0;
    
    displayHabits.forEach(habit => {
      const weight = habit.importance || 50;
      totalWeight += weight;
      const value = habit.completions[dateKey];
      if (habit.target === 1) {
        if (value === true) weightedProgress += weight;
      } else if (typeof value === 'number') {
        weightedProgress += (Math.min(value, habit.target) / habit.target) * weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((weightedProgress / totalWeight) * 100) : 0;
  };

  // Format date for display
  const formatReflectionDate = (day: number) => {
    const date = new Date(year, month, day);
    return format(date, "EEEE, MMMM d, yyyy");
  };

  // Handle saving mood and motivation (unified)
  const handleSaveMoodMotivation = (dateKey: string, mood: number, motivation: number) => {
    setMoodData(prev => ({ ...prev, [dateKey]: mood }));
    setMotivationData(prev => ({ ...prev, [dateKey]: motivation }));
  };

  // Generate mood/motivation chart data - convert 1-10 scale to 10%-100%
  const moodMotivationChartData = useMemo(() => {
    return Array.from({ length: currentDay }, (_, i) => {
      const day = i + 1;
      const dateKey = getDateKey(day);
      const moodValue = moodData[dateKey];
      const motivationValue = motivationData[dateKey];
      return {
        day,
        // Convert 1-10 to 10%-100% (1→10%, 10→100%)
        mood: moodValue !== undefined ? moodValue * 10 : undefined,
        motivation: motivationValue !== undefined ? motivationValue * 10 : undefined,
      };
    });
  }, [moodData, motivationData, currentDay, year, month]);

  // Calculate stats from habit data
  const stats = useMemo(() => {
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    // Today's completion
    const todayKey = getDateKey(currentDay);
    let todayTotal = 0;
    let todayWeight = 0;
    displayHabits.forEach(habit => {
      const weight = habit.importance || 50;
      todayWeight += weight;
      const value = habit.completions[todayKey];
      if (habit.target === 1) {
        if (value === true) todayTotal += weight;
      } else if (typeof value === 'number') {
        todayTotal += (Math.min(value, habit.target) / habit.target) * weight;
      }
    });
    const todayPercent = todayWeight > 0 ? Math.round((todayTotal / todayWeight) * 100) : 0;

    // Week average (last 7 days)
    let weekTotal = 0;
    let weekDays = 0;
    for (let i = Math.max(1, currentDay - 6); i <= currentDay; i++) {
      const dateKey = getDateKey(i);
      let dayWeight = 0;
      let dayTotal = 0;
      displayHabits.forEach(habit => {
        const weight = habit.importance || 50;
        dayWeight += weight;
        const value = habit.completions[dateKey];
        if (habit.target === 1) {
          if (value === true) dayTotal += weight;
        } else if (typeof value === 'number') {
          dayTotal += (Math.min(value, habit.target) / habit.target) * weight;
        }
      });
      if (dayWeight > 0) {
        weekTotal += (dayTotal / dayWeight) * 100;
        weekDays++;
      }
    }
    const weekAvg = weekDays > 0 ? Math.round(weekTotal / weekDays) : 0;

    // Month average
    let monthTotal = 0;
    let monthDays = 0;
    for (let i = 1; i <= currentDay; i++) {
      const dateKey = getDateKey(i);
      let dayWeight = 0;
      let dayTotal = 0;
      displayHabits.forEach(habit => {
        const weight = habit.importance || 50;
        dayWeight += weight;
        const value = habit.completions[dateKey];
        if (habit.target === 1) {
          if (value === true) dayTotal += weight;
        } else if (typeof value === 'number') {
          dayTotal += (Math.min(value, habit.target) / habit.target) * weight;
        }
      });
      if (dayWeight > 0) {
        monthTotal += (dayTotal / dayWeight) * 100;
        monthDays++;
      }
    }
    const monthPercent = monthDays > 0 ? Math.round(monthTotal / monthDays) : 0;

    return { todayPercent, weekAvg, monthPercent, isCurrentMonth };
  }, [displayHabits, currentDay, year, month]);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-24 px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Month Navigation - Centered above stats */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="font-display text-xl min-w-[180px] text-center">
            <span className="text-primary font-semibold">{monthName}</span>
            <span className="text-foreground ml-2">{year}</span>
          </h2>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Today"
            subtitle={stats.isCurrentMonth ? `View current month` : "View current month"}
            value={stats.isCurrentMonth ? stats.todayPercent : 0}
            icon={Target}
            iconColor="text-primary"
            progress={stats.isCurrentMonth ? stats.todayPercent : 0}
          />
          <StatCard
            title="This Week Average"
            subtitle="Last 7 days"
            value={stats.weekAvg}
            icon={Calendar}
            iconColor="text-accent"
            progress={stats.weekAvg}
          />
          <StatCard
            title="This Month"
            subtitle={monthName}
            value={stats.monthPercent}
            icon={TrendingUp}
            iconColor="text-primary"
            progress={stats.monthPercent}
          />
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
              {/* Daily Reflection Row - inside habits table */}
              <tr className="border-t border-border/30">
                <td className="p-1.5 lg:p-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 hidden lg:block" /> {/* Spacer for grip icon alignment */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm font-medium">Daily Reflection</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-br from-accent to-primary" />
                        <p className="text-[10px] lg:text-xs text-muted-foreground">Journal</p>
                      </div>
                    </div>
                  </div>
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateKey = getDateKey(day);
                  const hasReflection = !!reflections[dateKey];
                  const isFuture = day > currentDay;
                  
                  return (
                    <td key={i} className="p-0.5 lg:p-1">
                      <button
                        disabled={isFuture}
                        onClick={() => {
                          if (!isFuture) {
                            setSelectedReflectionDay(day);
                            setReflectionModalOpen(true);
                          }
                        }}
                        className={`w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto rounded-md flex items-center justify-center text-xs ${
                          isFuture 
                            ? 'bg-muted/30 cursor-not-allowed'
                            : hasReflection
                              ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-sm hover:scale-105'
                              : 'bg-secondary hover:bg-secondary/80 cursor-pointer'
                        }`}
                      >
                        {!isFuture && (
                          hasReflection 
                            ? <FileText className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-white" />
                            : <Plus className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                  );
                })}
                <td className="p-1 lg:p-2 text-right">
                  <span className="text-xs lg:text-sm font-bold gradient-text">
                    {currentDay > 0 ? Math.round((Object.keys(reflections).filter(key => {
                      const [y, m] = key.split('-').map(Number);
                      return y === year && m === month + 1;
                    }).length / currentDay) * 100) : 0}%
                  </span>
                </td>
                <td className="p-1 lg:p-2">
                  {/* No delete button for reflection row */}
                </td>
              </tr>
            </tbody>
          </table>
        </GlassCard>
        
        {/* Progress Chart - perfectly aligned with table columns */}
        <GlassCard className="py-2 px-0 sm:py-3 sm:px-0 lg:py-4 lg:px-0 overflow-x-auto lg:overflow-visible">
          <div style={{ minWidth: '900px' }}>
            <AlignedProgressChart 
              data={chartData}
              daysInMonth={daysInMonth}
              currentDay={currentDay}
              monthName={monthName}
            />
          </div>
        </GlassCard>

        {/* Mood & Motivation Section */}
        <h3 className="text-lg font-semibold text-foreground mt-8 mb-4">Mood <span style={{ fontFamily: 'Inter, sans-serif' }}>&</span> Motivation</h3>
        
        {/* Mood & Motivation Row - same style as Daily Reflection */}
        <GlassCard className="p-2 sm:p-3 lg:p-4 mb-8 overflow-x-auto lg:overflow-visible">
          <table className="w-full table-fixed" style={{ minWidth: '900px' }}>
            <thead>
              <tr className="align-top">
                <th className="text-left p-0.5 lg:p-1 align-top" style={{ width: '140px' }}>
                  <span className="text-xs lg:text-sm font-semibold text-foreground leading-tight">Emotions Area</span>
                  <p className="text-[10px] lg:text-xs text-muted-foreground/70 leading-tight">Track your mood and motivation here</p>
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateKey = getDateKey(day);
                  const hasMood = moodData[dateKey] !== undefined;
                  const hasMotivation = motivationData[dateKey] !== undefined;
                  const hasEntry = hasMood || hasMotivation;
                  const isFuture = day > currentDay;
                  
                  const moodValue = moodData[dateKey];
                  const MOOD_EMOJIS: Record<number, string> = {
                    1: "😢", 2: "😞", 3: "😔", 4: "😕", 5: "😐",
                    6: "🙂", 7: "😊", 8: "😄", 9: "🥳", 10: "🔥",
                  };
                  const moodEmoji = moodValue ? MOOD_EMOJIS[moodValue] : null;

                  return (
                    <th key={i} className="p-0.5 text-center align-top">
                      <span className={`text-xs lg:text-sm font-medium leading-tight ${i + 1 === currentDay ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {i + 1}
                      </span>
                      <button
                        disabled={isFuture}
                        onClick={() => {
                          if (!isFuture) {
                            setSelectedMoodMotivationDay(day);
                            setMoodMotivationModalOpen(true);
                          }
                        }}
                        className={`w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto mt-0.5 rounded-md flex items-center justify-center text-xs transition-all duration-200 ${
                          isFuture 
                            ? 'bg-muted/30 cursor-not-allowed'
                            : hasEntry
                              ? 'bg-secondary/80 shadow-sm hover:scale-105'
                              : 'bg-secondary hover:bg-secondary/80 cursor-pointer'
                        }`}
                      >
                        {!isFuture && (
                          hasEntry && moodEmoji
                            ? <MoodEmoji emoji={moodEmoji} size="sm" />
                            : <Plus className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </th>
                  );
                })}
                <th className="p-0.5 lg:p-1 text-right align-top" style={{ width: '48px' }}>
                  <span className="text-xs lg:text-sm font-semibold text-foreground leading-tight">%</span>
                  <div className="mt-0.5">
                    <span className="text-xs lg:text-sm font-bold gradient-text">
                      {currentDay > 0 ? Math.round((Object.keys(moodData).filter(key => {
                        const [y, m] = key.split('-').map(Number);
                        return y === year && m === month + 1;
                      }).length / currentDay) * 100) : 0}%
                    </span>
                  </div>
                </th>
                <th style={{ width: '36px' }}></th>
              </tr>
            </thead>
          </table>
        </GlassCard>

        {/* Mood & Motivation Chart */}
        <GlassCard className="py-2 px-0 sm:py-3 sm:px-0 lg:py-4 lg:px-0 overflow-x-auto lg:overflow-visible mb-8">
          <div style={{ minWidth: '900px' }}>
            <MoodMotivationChart 
              data={moodMotivationChartData}
              daysInMonth={daysInMonth}
              currentDay={currentDay}
            />
          </div>
        </GlassCard>

        {/* AI Coaching Section */}
        <AICoachingSection />
      </main>

      {/* Floating Add Habit Button */}
      <Button 
        variant="gradient" 
        size="icon" 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-large z-50"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddHabitModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleAddHabit}
      />

      {selectedReflectionDay && (
        <DailyReflectionModal
          open={reflectionModalOpen}
          onOpenChange={setReflectionModalOpen}
          date={formatReflectionDate(selectedReflectionDay)}
          dateKey={getDateKey(selectedReflectionDay)}
          completionPercent={getDayCompletionPercent(selectedReflectionDay)}
          existingReflection={reflections[getDateKey(selectedReflectionDay)]}
          onSave={handleSaveReflection}
        />
      )}

      {selectedMoodMotivationDay && (
        <UnifiedMoodMotivationModal
          open={moodMotivationModalOpen}
          onOpenChange={setMoodMotivationModalOpen}
          date={new Date(year, month, selectedMoodMotivationDay)}
          dateKey={getDateKey(selectedMoodMotivationDay)}
          completionPercent={getDayCompletionPercent(selectedMoodMotivationDay)}
          existingMood={moodData[getDateKey(selectedMoodMotivationDay)]}
          existingMotivation={motivationData[getDateKey(selectedMoodMotivationDay)]}
          onSave={handleSaveMoodMotivation}
        />
      )}
    </div>
  );
}


import { GlassCard } from "@/components/GlassCard";
import { CommunityLink } from "@/components/CommunityLink";
import { AppleEmoji } from "@/components/AppleEmoji";
import { AlignedProgressChart } from "@/components/AlignedProgressChart";
import { MoodMotivationChart } from "@/components/MoodMotivationChart";
import { AIBuddyChat } from "@/components/AIBuddyChat";
import { AddHabitModal, NewHabit } from "@/components/AddHabitModal";
import { StatCard } from "@/components/StatCard";
import { DailyReflectionModal } from "@/components/DailyReflectionModal";
import { UnifiedMoodMotivationModal } from "@/components/UnifiedMoodMotivationModal";
import { AppleEmoji as MoodEmoji } from "@/components/AppleEmoji";
import { useFirstTimeTips } from "@/hooks/use-first-time-tips";
import { FirstTimeTip } from "@/components/FirstTimeTip";
import { GoalProgressOverview } from "@/components/GoalProgressOverview";
import { PaywallModal } from "@/components/PaywallModal";
import { usePlanLimits, LimitType } from "@/hooks/use-plan-limits";
import { DeleteHabitModal } from "@/components/DeleteHabitModal";
import { useToast } from "@/hooks/use-toast";
import { MarqueeText } from "@/components/MarqueeText";
import { useHabitsData, Habit } from "@/hooks/use-habits-data";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Check, Target, Calendar, TrendingUp, FileText } from "lucide-react";
import { MonthSelector } from "@/components/MonthSelector";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSelectedMonth } from "@/hooks/use-selected-month";
import { format } from "date-fns";

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

export default function Habits() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [selectedReflectionDay, setSelectedReflectionDay] = useState<number | null>(null);
  
  // Mood & Motivation state (unified)
  const [moodMotivationModalOpen, setMoodMotivationModalOpen] = useState(false);
  const [selectedMoodMotivationDay, setSelectedMoodMotivationDay] = useState<number | null>(null);
  
  // Paywall state
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallLimitType, setPaywallLimitType] = useState<LimitType>('habits');
  
  // Delete habit modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  
  // Local state for demo mode habits
  const [demoHabits, setDemoHabits] = useState<Habit[]>([]);
  const [demoCompletions, setDemoCompletions] = useState<Record<string, Record<string, number>>>({});
  const [demoMoodData, setDemoMoodData] = useState<Record<string, number>>({});
  const [demoMotivationData, setDemoMotivationData] = useState<Record<string, number>>({});
  const [reflections, setReflections] = useState<Record<string, { text: string; createdAt: string }>>({});
  
  const { toast } = useToast();
  
  // Plan limits
  const { 
    canAddHabit, 
    incrementHabits, 
    decrementHabits, 
    setHabitsCount,
    getLimitMessage,
    usage 
  } = usePlanLimits();
  
  // First-time tips
  const { activeTip, tipMessage, triggerTip, dismissTip, shouldShowTip } = useFirstTimeTips();
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
  
  // Get data from centralized hook
  const {
    habits: dbHabits,
    completionsMap: dbCompletionsMap,
    moodMap,
    stats: dbStats,
    chartData: dbChartData,
    moodMotivationChartData: dbMoodMotivationChartData,
    getCompletionValue,
    getHabitProgress,
    isLoading,
    isDemo,
    createHabit,
    deleteHabit,
    toggleCompletion,
    saveMoodLog,
  } = useHabitsData(year, month);
  
  // Initialize demo data on mount
  useEffect(() => {
    if (isDemo && demoHabits.length === 0) {
      const templates: Habit[] = [
        { id: "demo-1", user_id: "demo", name: "Morning Meditation", icon: "🧘", category: "Mind", category_color: "#8B5CF6", target: 1, importance: 70, created_at: "", updated_at: "" },
        { id: "demo-2", user_id: "demo", name: "Exercise", icon: "💪", category: "Health", category_color: "#22C55E", target: 1, importance: 80, created_at: "", updated_at: "" },
        { id: "demo-3", user_id: "demo", name: "Read 30 mins", icon: "📚", category: "Growth", category_color: "#EC4899", target: 1, importance: 60, created_at: "", updated_at: "" },
        { id: "demo-4", user_id: "demo", name: "Drink Water", icon: "💧", category: "Health", category_color: "#22C55E", target: 8, importance: 50, created_at: "", updated_at: "" },
        { id: "demo-5", user_id: "demo", name: "No Social Media", icon: "📵", category: "Focus", category_color: "#3B82F6", target: 1, importance: 40, created_at: "", updated_at: "" },
      ];
      setDemoHabits(templates);
      
      // Generate demo completions
      const comps: Record<string, Record<string, number>> = {};
      templates.forEach(h => {
        comps[h.id] = {};
        for (let day = 1; day <= currentDay; day++) {
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          if (h.target === 1) {
            comps[h.id][dateKey] = Math.random() > 0.2 ? 1 : 0;
          } else {
            comps[h.id][dateKey] = Math.floor(Math.random() * (h.target + 2));
          }
        }
      });
      setDemoCompletions(comps);
    }
  }, [isDemo, demoHabits.length, currentDay, year, month]);
  
  // Use demo or real data
  const displayHabits = isDemo ? demoHabits : dbHabits;
  const completionsMap = isDemo ? demoCompletions : dbCompletionsMap;
  
  // Sync habits count with plan limits
  useEffect(() => {
    setHabitsCount(displayHabits.length);
  }, [displayHabits.length, setHabitsCount]);

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getLocalHabitProgress = useCallback((habitId: string, target: number): number => {
    const habitComps = completionsMap[habitId] || {};
    let completedDays = 0;
    
    for (let day = 1; day <= currentDay; day++) {
      const dateKey = getDateKey(day);
      const value = habitComps[dateKey] || 0;
      if (target === 1) {
        if (value >= 1) completedDays++;
      } else {
        if (value >= target) completedDays++;
      }
    }
    
    return currentDay > 0 ? Math.round((completedDays / currentDay) * 100) : 0;
  }, [completionsMap, currentDay, year, month]);

  const handleAddHabit = (newHabit: NewHabit) => {
    if (isDemo) {
      const habit: Habit = {
        id: crypto.randomUUID(),
        user_id: "demo",
        name: newHabit.name,
        icon: newHabit.icon,
        category: newHabit.category,
        category_color: newHabit.categoryColor || null,
        target: newHabit.target,
        importance: newHabit.importance,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setDemoHabits(prev => [...prev, habit]);
      setDemoCompletions(prev => ({ ...prev, [habit.id]: {} }));
      toast({ title: "Habit created!", description: "Demo mode - sign up to save" });
    } else {
      createHabit.mutate({
        name: newHabit.name,
        icon: newHabit.icon,
        category: newHabit.category,
        category_color: newHabit.categoryColor || null,
        target: newHabit.target,
        importance: newHabit.importance,
      });
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    if (isDemo) {
      setDemoHabits(prev => prev.filter(h => h.id !== habitId));
      setDemoCompletions(prev => {
        const newComps = { ...prev };
        delete newComps[habitId];
        return newComps;
      });
      toast({ title: "Habit deleted", description: "Your habit has been permanently removed." });
    } else {
      deleteHabit.mutate(habitId);
    }
  };
  
  const openDeleteModal = (habit: Habit) => {
    setHabitToDelete(habit);
    setDeleteModalOpen(true);
  };

  const handleFabClick = () => {
    if (!canAddHabit) {
      setPaywallLimitType('habits');
      setPaywallOpen(true);
      return;
    }
    setIsModalOpen(true);
  };

  const toggleHabitCompletion = (habitId: string, day: number) => {
    const dateKey = getDateKey(day);
    const habit = displayHabits.find(h => h.id === habitId);
    if (!habit) return;
    
    const currentValue = completionsMap[habitId]?.[dateKey] || 0;
    
    if (isDemo) {
      let newValue: number;
      if (habit.target === 1) {
        newValue = currentValue >= 1 ? 0 : 1;
      } else {
        newValue = currentValue >= habit.target ? 0 : currentValue + 1;
      }
      
      setDemoCompletions(prev => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [dateKey]: newValue,
        },
      }));
    } else {
      toggleCompletion.mutate({
        habitId,
        date: dateKey,
        currentValue,
        target: habit.target,
        habitName: habit.name,
        habitIcon: habit.icon,
      });
    }
  };

  const handleSaveReflection = (dateKey: string, text: string) => {
    if (isDemo) {
      // Demo mode - save locally
      setReflections(prev => ({
        ...prev,
        [dateKey]: { text, createdAt: new Date().toISOString() },
      }));
    } else {
      // Save to Supabase via saveMoodLog mutation
      saveMoodLog.mutate({ date: dateKey, reflection: text });
    }
  };

  const getDayCompletionPercent = (day: number) => {
    const dateKey = getDateKey(day);
    let totalWeight = 0;
    let weightedProgress = 0;
    
    displayHabits.forEach(habit => {
      const weight = habit.importance || 50;
      totalWeight += weight;
      const value = completionsMap[habit.id]?.[dateKey] || 0;
      if (habit.target === 1) {
        if (value >= 1) weightedProgress += weight;
      } else {
        weightedProgress += (Math.min(value, habit.target) / habit.target) * weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((weightedProgress / totalWeight) * 100) : 0;
  };

  const formatReflectionDate = (day: number) => {
    const date = new Date(year, month, day);
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const handleSaveMoodMotivation = (dateKey: string, mood: number, motivation: number) => {
    if (isDemo) {
      setDemoMoodData(prev => ({ ...prev, [dateKey]: mood }));
      setDemoMotivationData(prev => ({ ...prev, [dateKey]: motivation }));
    } else {
      saveMoodLog.mutate({ date: dateKey, mood, motivation });
    }
  };

  // Calculate stats from data
  const stats = useMemo(() => {
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    const getDayProgress = (day: number): number => {
      const dateKey = getDateKey(day);
      let totalWeight = 0;
      let weightedProgress = 0;
      
      displayHabits.forEach(habit => {
        const weight = habit.importance || 50;
        totalWeight += weight;
        const value = completionsMap[habit.id]?.[dateKey] || 0;
        if (habit.target === 1) {
          if (value >= 1) weightedProgress += weight;
        } else {
          weightedProgress += (Math.min(value, habit.target) / habit.target) * weight;
        }
      });
      
      return totalWeight > 0 ? (weightedProgress / totalWeight) * 100 : 0;
    };

    const todayPercent = Math.round(getDayProgress(currentDay));

    let weekTotal = 0;
    let weekDays = 0;
    for (let i = 0; i < 7; i++) {
      const day = currentDay - i;
      if (day > 0) {
        weekTotal += getDayProgress(day);
        weekDays++;
      }
    }
    const weekAvg = weekDays > 0 ? Math.round(weekTotal / weekDays) : 0;

    let monthTotal = 0;
    for (let day = 1; day <= currentDay; day++) {
      monthTotal += getDayProgress(day);
    }
    const monthPercent = currentDay > 0 ? Math.round(monthTotal / currentDay) : 0;

    return { todayPercent, weekAvg, monthPercent, isCurrentMonth };
  }, [displayHabits, completionsMap, currentDay, year, month]);

  // Chart data
  const chartData = useMemo(() => {
    return Array.from({ length: currentDay }, (_, i) => {
      const day = i + 1;
      const dateKey = getDateKey(day);
      let totalWeight = 0;
      let weightedProgress = 0;
      
      displayHabits.forEach(habit => {
        const weight = habit.importance || 50;
        totalWeight += weight;
        const value = completionsMap[habit.id]?.[dateKey] || 0;
        if (habit.target === 1) {
          if (value >= 1) weightedProgress += weight;
        } else {
          weightedProgress += (Math.min(value, habit.target) / habit.target) * weight;
        }
      });
      
      return {
        day,
        progress: totalWeight > 0 ? Math.round((weightedProgress / totalWeight) * 100) : 0,
      };
    });
  }, [displayHabits, completionsMap, currentDay, year, month]);

  // Mood chart data
  const moodMotivationChartData = useMemo(() => {
    const moodData = isDemo ? demoMoodData : Object.fromEntries(
      Object.entries(moodMap).map(([k, v]) => [k, v.mood])
    );
    const motivationData = isDemo ? demoMotivationData : Object.fromEntries(
      Object.entries(moodMap).map(([k, v]) => [k, v.motivation])
    );
    
    return Array.from({ length: currentDay }, (_, i) => {
      const day = i + 1;
      const dateKey = getDateKey(day);
      const moodValue = moodData[dateKey];
      const motivationValue = motivationData[dateKey];
      return {
        day,
        mood: moodValue !== undefined ? moodValue * 10 : undefined,
        motivation: motivationValue !== undefined ? motivationValue * 10 : undefined,
      };
    });
  }, [isDemo, demoMoodData, demoMotivationData, moodMap, currentDay, year, month]);

  // Mood data for display
  const displayMoodData = isDemo ? demoMoodData : Object.fromEntries(
    Object.entries(moodMap).map(([k, v]) => [k, v.mood])
  );
  const displayMotivationData = isDemo ? demoMotivationData : Object.fromEntries(
    Object.entries(moodMap).map(([k, v]) => [k, v.motivation])
  );

  return (
    <>
      <main className="pt-28 pb-24 px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Month Navigation - Centered above stats */}
        <MonthSelector
          monthName={monthName}
          year={year}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="This Month"
            subtitle={`${monthName} progress so far`}
            value={stats.monthPercent}
            icon={TrendingUp}
            iconColor="text-primary"
            progress={stats.monthPercent}
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
            title="Today"
            subtitle="Today's progress"
            value={stats.isCurrentMonth ? stats.todayPercent : 0}
            icon={Target}
            iconColor="text-primary"
            progress={stats.isCurrentMonth ? stats.todayPercent : 0}
          />
        </div>
        
        {/* Habits Grid - fits all days on desktop without scroll */}
        <GlassCard className="p-2 sm:p-3 lg:p-4 mb-8 overflow-x-auto lg:overflow-visible">
          <table className="w-full table-fixed" style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th className="text-left p-1.5 lg:p-2" style={{ width: '160px' }}>
                  <span className="text-xs lg:text-sm font-semibold text-foreground">Habits and Tasks</span>
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
              {displayHabits.map((habit, habitIndex) => (
                <tr key={habit.id} className="border-t border-border/30">
                  <td className="p-1.5 lg:p-2">
                    <div className="flex items-center gap-1.5">
                      <GripVertical className="w-3 h-3 text-muted-foreground/50 cursor-grab flex-shrink-0 hidden lg:block" />
                      <AppleEmoji emoji={habit.icon} size="lg" />
                      <div className="min-w-0 flex-1">
                        <MarqueeText text={habit.name} className="text-xs lg:text-sm font-medium" index={habitIndex} />
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: habit.category_color || CATEGORY_COLORS[habit.category] || "#6B7280" }}
                          />
                          <p className="text-[10px] lg:text-xs text-muted-foreground">{habit.category}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateKey = getDateKey(day);
                    const value = completionsMap[habit.id]?.[dateKey] || 0;
                    const isCompleted = habit.target === 1 
                      ? value >= 1 
                      : value >= habit.target;
                    const isFuture = day > currentDay;
                    
                    return (
                      <td key={i} className="p-0.5 lg:p-1">
                        <button
                          disabled={isFuture}
                          onClick={() => !isFuture && toggleHabitCompletion(habit.id, day)}
                          className={`w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto rounded-md flex items-center justify-center text-xs ${
                            isFuture 
                              ? 'bg-muted/30 cursor-not-allowed'
                              : isCompleted
                                ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-sm'
                                : 'bg-secondary hover:bg-secondary/80 cursor-pointer'
                          }`}
                        >
                          {!isFuture && habit.target === 1 && isCompleted && (
                            <Check className="w-3 h-3 lg:w-4 lg:h-4" />
                          )}
                          {!isFuture && habit.target > 1 && (
                            <span className={`font-medium text-[10px] lg:text-xs ${isCompleted ? '' : 'text-muted-foreground'}`}>
                              {value}
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-1 lg:p-2 text-right">
                    <span className="text-xs lg:text-sm font-bold gradient-text">{getLocalHabitProgress(habit.id, habit.target)}%</span>
                  </td>
                  <td className="p-1 lg:p-2">
                    <button 
                      onClick={() => openDeleteModal(habit)}
                      className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
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
                  // Check moodMap for Supabase data, fallback to local reflections for demo
                  const hasReflection = isDemo 
                    ? !!reflections[dateKey]?.text 
                    : !!moodMap[dateKey]?.reflection;
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
                    {currentDay > 0 ? Math.round((
                      isDemo 
                        ? Object.keys(reflections).filter(key => {
                            const [y, m] = key.split('-').map(Number);
                            return y === year && m === month + 1 && reflections[key]?.text;
                          }).length
                        : Object.keys(moodMap).filter(key => {
                            const [y, m] = key.split('-').map(Number);
                            return y === year && m === month + 1 && moodMap[key]?.reflection;
                          }).length
                    ) / currentDay * 100) : 0}%
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
        <GlassCard className="p-2 sm:p-3 lg:p-4 overflow-x-auto lg:overflow-visible">
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
                  const hasMood = displayMoodData[dateKey] !== undefined;
                  const hasMotivation = displayMotivationData[dateKey] !== undefined;
                  const hasEntry = hasMood || hasMotivation;
                  const isFuture = day > currentDay;
                  
                  const moodValue = displayMoodData[dateKey];
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
                        className={`w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 mx-auto mt-1.5 rounded-md flex items-center justify-center text-xs transition-all duration-200 ${
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
                <th className="p-1 lg:p-2" style={{ width: '84px' }}>
                  <div className="flex flex-col items-center justify-center pt-2">
                    <span className="text-[9px] lg:text-[10px] text-muted-foreground leading-tight whitespace-nowrap">Mood Score</span>
                    <div className="mt-0.5 flex items-center justify-center gap-0.5">
                      {(() => {
                        const monthEntries = Object.entries(displayMoodData)
                          .filter(([key]) => {
                            const [y, m] = key.split('-').map(Number);
                            return y === year && m === month + 1;
                          })
                          .map(([key, mood]) => ({
                            key,
                            mood: mood as number,
                            motivation: (displayMotivationData[key] as number) || 0
                          }))
                          .filter(e => e.mood > 0 || e.motivation > 0);
                        
                        const avgScore = monthEntries.length > 0
                          ? Math.round(monthEntries.reduce((sum, e) => {
                              const count = (e.mood > 0 ? 1 : 0) + (e.motivation > 0 ? 1 : 0);
                              const total = (e.mood || 0) + (e.motivation || 0);
                              return sum + (count > 0 ? total / count : 0);
                            }, 0) / monthEntries.length)
                          : 0;
                        
                        const sortedEntries = monthEntries
                          .sort((a, b) => a.key.localeCompare(b.key))
                          .slice(-3);
                        
                        let trend: 'up' | 'down' | 'neutral' = 'neutral';
                        if (sortedEntries.length >= 2) {
                          const getAvg = (e: typeof sortedEntries[0]) => {
                            const count = (e.mood > 0 ? 1 : 0) + (e.motivation > 0 ? 1 : 0);
                            return count > 0 ? ((e.mood || 0) + (e.motivation || 0)) / count : 0;
                          };
                          const first = getAvg(sortedEntries[0]);
                          const last = getAvg(sortedEntries[sortedEntries.length - 1]);
                          if (last > first + 0.5) trend = 'up';
                          else if (last < first - 0.5) trend = 'down';
                        }
                        
                        return (
                          <>
                            <span className="text-xs lg:text-sm font-bold gradient-text">{avgScore || '–'}</span>
                            <span className="text-[10px] lg:text-xs text-muted-foreground">
                              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </th>
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

        {/* Goal Progress Overview */}
        <div className="mb-8">
          <GoalProgressOverview />
        </div>

        {/* AI Buddy Chat */}
        <div className="max-w-7xl mx-auto">
          <AIBuddyChat />
        </div>
        
        <CommunityLink />
      </main>

      {/* Floating Add Habit Button */}
      <Button 
        variant="gradient" 
        size="icon" 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-large z-50"
        onClick={handleFabClick}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddHabitModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleAddHabit}
        skipCelebration={true}
      />

      {selectedReflectionDay && (
        <DailyReflectionModal
          open={reflectionModalOpen}
          onOpenChange={setReflectionModalOpen}
          date={formatReflectionDate(selectedReflectionDay)}
          dateKey={getDateKey(selectedReflectionDay)}
          completionPercent={getDayCompletionPercent(selectedReflectionDay)}
          existingReflection={isDemo ? reflections[getDateKey(selectedReflectionDay)]?.text : moodMap[getDateKey(selectedReflectionDay)]?.reflection || undefined}
          reflectionCreatedAt={isDemo ? reflections[getDateKey(selectedReflectionDay)]?.createdAt : moodMap[getDateKey(selectedReflectionDay)]?.created_at}
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
          existingMood={displayMoodData[getDateKey(selectedMoodMotivationDay)]}
          existingMotivation={displayMotivationData[getDateKey(selectedMoodMotivationDay)]}
          onSave={handleSaveMoodMotivation}
        />
      )}
      
      {/* First-time habit tip */}
      <FirstTimeTip
        open={activeTip === "habit"}
        title={tipMessage?.title || ""}
        message={tipMessage?.message || ""}
        onDismiss={dismissTip}
      />
      
      {/* Paywall Modal */}
      <PaywallModal
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        limitType={paywallLimitType}
        limitMessage={getLimitMessage(paywallLimitType)}
      />
      
      {/* Delete Habit Modal */}
      {deleteModalOpen && habitToDelete && (
        <DeleteHabitModal
          habitName={habitToDelete.name}
          habitIcon={habitToDelete.icon}
          onClose={() => {
            setDeleteModalOpen(false);
            setHabitToDelete(null);
          }}
          onConfirmDelete={() => {
            handleDeleteHabit(habitToDelete.id);
            setDeleteModalOpen(false);
            setHabitToDelete(null);
          }}
        />
      )}
    </>
  );
}


import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { OnboardingQuestionsModal } from "@/components/OnboardingQuestionsModal";
import { AIBuddyChat } from "@/components/AIBuddyChat";
import { useHabitStats } from "@/hooks/use-habit-stats";
import { Target, TrendingUp, Heart, BarChart3, X, Plus, Check } from "lucide-react";
import { GoalProgressOverview } from "@/components/GoalProgressOverview";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelectedMonth } from "@/hooks/use-selected-month";
import { useAuth } from "@/contexts/AuthContext";
import { PaywallModal } from "@/components/PaywallModal";
import { usePlanLimits, LimitType } from "@/hooks/use-plan-limits";
import { useHabitsData } from "@/hooks/use-habits-data";
import { useCalendarData, getCalendarDayColor } from "@/hooks/use-calendar-data";
import { useRecentActivity } from "@/hooks/use-recent-activity";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getHabits } from "@/services/firestore/habits";
import { getTodosForDate, createTodo as createTodoService, toggleTodo as toggleTodoService } from "@/services/firestore/todos";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  emoji: string;
}

const TODO_EMOJIS = ["📝", "⏰", "💼", "📚", "🏃", "🧠", "🎨", "💪", "🍎", "💧", "🧘", "📞", "🛒", "🏠", "💡", "✈️", "🎵", "📷", "🎮", "☕"];

export default function Overview() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    monthName,
    year,
    month,
    getDaysInMonth,
    getFirstDayOfMonth,
    getCurrentDay,
    isCurrentMonth,
  } = useSelectedMonth();
  
  const daysInMonth = getDaysInMonth();
  const startDay = getFirstDayOfMonth();
  const currentDay = getCurrentDay();
  
  // Auto-select today's date on initial load
  const [selectedDate, setSelectedDate] = useState<number | null>(() => {
    if (isCurrentMonth()) {
      return new Date().getDate();
    }
    return 1; // First day of past months
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const habitStats = useHabitStats();
  
  // Paywall state
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallLimitType, setPaywallLimitType] = useState<LimitType>('todos');
  
  // Plan limits
  const { canAddTodo, incrementTodos, setTodosCount, getLimitMessage, usage } = usePlanLimits();
  
  // To-Do List state
  const [newTodoText, setNewTodoText] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [hasSelectedEmoji, setHasSelectedEmoji] = useState(false);
  
  // Demo mode todos
  const [demoTodos, setDemoTodos] = useState<TodoItem[]>([]);
  
  // Get habits data for calendar
  const { completionsMap, stats: habitsStats } = useHabitsData(year, month);
  
  // Calendar data with proper coloring
  const { 
    dayPercentages, 
    getDayCompletionRate: getCalendarDayRate, 
    currentDay: calendarCurrentDay,
    refetch: refetchCalendar 
  } = useCalendarData(year, month);
  
  // Recent activity
  const { activities, logActivity } = useRecentActivity();
  
  const habits = useQuery({
    queryKey: ["habits-overview", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const data = await getHabits(user.id);
      return data.map(h => ({ id: h.id, target: h.target, importance: h.importance }));
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
  
  // Fetch todos for selected date
  const todayStr = selectedDate 
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
    : format(new Date(), "yyyy-MM-dd");
    
  const todosQuery = useQuery({
    queryKey: ["daily_todos", user?.id, todayStr],
    queryFn: async () => {
      if (!user) return [];
      const data = await getTodosForDate(user.id, todayStr);
      return data.map(t => ({
        id: t.id,
        text: t.text,
        completed: t.completed,
        emoji: "📝", // Default emoji since we don't store it
      })) as TodoItem[];
    },
    enabled: !!user,
  });
  
  const todos = user ? (todosQuery.data || []) : demoTodos;
  
  // Create todo mutation
  const createTodo = useMutation({
    mutationFn: async ({ text, date }: { text: string; date: string }) => {
      if (!user) return null;
      return await createTodoService(user.id, text, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_todos"] });
      toast.success("Task added!");
    },
    onError: () => {
      toast.error("Failed to add task");
    },
  });
  
  // Toggle todo mutation
  const toggleTodo = useMutation({
    mutationFn: async ({ todoId, completed }: { todoId: string; completed: boolean }) => {
      if (!user) return;
      await toggleTodoService(todoId, user.id, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_todos"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-todos"] });
      refetchCalendar();
    },
  });
  
  const handleAddTodo = () => {
    if (!newTodoText.trim() || !selectedEmoji) return;
    
    if (!user) {
      // Demo mode
      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        text: newTodoText.trim(),
        completed: false,
        emoji: selectedEmoji
      };
      setDemoTodos(prev => [...prev, newTodo]);
      incrementTodos();
    } else {
      createTodo.mutate({ text: newTodoText.trim(), date: todayStr });
      incrementTodos();
    }
    
    setNewTodoText("");
    setIsAddingTodo(false);
    setSelectedEmoji(null);
    setHasSelectedEmoji(false);
  };
  
  // Handle "Add task" button click - check limits first
  const handleStartAddTodo = () => {
    if (!canAddTodo) {
      setPaywallLimitType('todos');
      setPaywallOpen(true);
      return;
    }
    setIsAddingTodo(true);
  };
  
  const handleToggleTodo = (todoId: string) => {
    if (!user) {
      setDemoTodos(prev => prev.map(t => 
        t.id === todoId ? { ...t, completed: !t.completed } : t
      ));
    } else {
      const todo = todos.find(t => t.id === todoId);
      if (todo) {
        toggleTodo.mutate({ todoId, completed: !todo.completed });
        
        // Log activity if completing (not un-completing)
        if (!todo.completed) {
          logActivity({
            activityType: "task_completed",
            entityName: todo.text,
            emoji: "📝",
            entityId: todoId,
          });
        }
      }
    }
  };
  
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Use the calendar hook for completion rates with proper coloring
  const getCompletionRate = (day: number): number => {
    if (!user) {
      // Demo mode - consistent random based on day
      return Math.floor((day * 17 + 23) % 101);
    }
    return dayPercentages[day] || 0;
  };

  return (
    <>
      
      <main className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
        {/* AI Buddy Chat - First Section */}
        <div className="mb-8">
          <AIBuddyChat />
        </div>

        {/* Stats Row - New Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 - Perfect Days */}
          <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Perfect Days</h3>
              </div>
              <div className="p-2 rounded-xl bg-secondary text-accent">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-0.5 mb-2">
              <span className="text-3xl font-bold gradient-text">{habitStats.perfectDaysThisWeek}</span>
              <span className="text-lg font-medium text-primary/70"> / 7</span>
            </div>
            <p className="text-xs text-muted-foreground">Days completed fully this week</p>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full progress-bar-orange rounded-full transition-all duration-500"
                style={{ width: `${(habitStats.perfectDaysThisWeek / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* Card 2 - Mood Average */}
          <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Mood Average</h3>
              </div>
              <div className="p-2 rounded-xl bg-secondary text-primary">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <AppleEmoji emoji={habitStats.averageMoodEmoji} size="3xl" />
            </div>
            <p className="text-xs text-muted-foreground">
              {habitStats.averageMoodLabel === "No mood data yet" 
                ? habitStats.averageMoodLabel 
                : <>Your average mood is <span className="font-bold">{habitStats.averageMoodLabel}</span>.</>
              }
            </p>
          </div>

          {/* Card 3 - Mood Stability */}
          <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Mood Stability</h3>
              </div>
              <div className="p-2 rounded-xl bg-secondary text-accent">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-0.5 mb-2">
              <span className="text-3xl font-bold gradient-text">{habitStats.emotionalStability}</span>
              <span className="text-lg font-medium text-primary/70"> / 10</span>
            </div>
            <p className="text-xs text-muted-foreground">Consistency of mood</p>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full progress-bar-orange rounded-full transition-all duration-500"
                style={{ width: `${(habitStats.emotionalStability / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Card 4 - Daily Progress (Yesterday) */}
          <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Daily Progress</h3>
              </div>
              <div className="p-2 rounded-xl bg-secondary text-primary">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-0.5 mb-2">
              <span className="text-3xl font-bold gradient-text">{habitStats.yesterdayPercent}</span>
              <span className="text-lg font-medium text-primary/70">%</span>
            </div>
            <p className="text-xs text-muted-foreground">Yesterday's completion</p>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full progress-bar-orange rounded-full transition-all duration-500"
                style={{ width: `${habitStats.yesterdayPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Monthly Calendar */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h3 className="font-display text-xl font-semibold mb-4">Monthly Calendar</h3>
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startDay }, (_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const completionRate = getCompletionRate(day);
                  const isFuture = day > currentDay;
                  const isSelected = selectedDate === day;
                  const colorClasses = getCalendarDayColor(completionRate);
                  
                  return (
                    <button
                      key={day}
                      onClick={() => !isFuture && setSelectedDate(day)}
                      disabled={isFuture}
                      style={isSelected && !isFuture ? { background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' } : undefined}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-colors duration-200 ${
                        isFuture 
                          ? 'bg-muted/30 cursor-not-allowed'
                          : isSelected
                            ? 'text-primary-foreground shadow-medium hover:brightness-[1.03]'
                            : `${colorClasses.bg} ${colorClasses.hover}`
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isSelected ? 'text-primary-foreground' : ''}`}>
                        {day}
                      </span>
                      {!isFuture && (
                        <span className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {completionRate}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>
          
          {/* To-Do List Panel */}
          <div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)]">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">To-Do List</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(year, month, selectedDate || 1).toLocaleDateString('fr-FR', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <AppleEmoji emoji="😌" size="2xl" />
              </div>
              
              <div className="space-y-2 mt-4">
                {todos.map((todo) => (
                  <div 
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-sm"
                  >
                    <AppleEmoji emoji={todo.emoji} size="lg" />
                    <span className={`text-sm flex-1 ${
                      todo.completed 
                        ? 'text-muted-foreground line-through' 
                        : 'text-foreground'
                    }`}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed 
                          ? 'bg-[hsl(25,60%,70%)] border-[hsl(25,60%,70%)]' 
                          : 'border-[hsl(25,40%,80%)] hover:border-[hsl(25,50%,65%)]'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                ))}
                
                {isAddingTodo ? (
                  <div className="space-y-2">
                    {!hasSelectedEmoji ? (
                      <div className="p-3 rounded-2xl bg-white/90 shadow-md grid grid-cols-5 gap-2">
                        {TODO_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setSelectedEmoji(emoji);
                              setHasSelectedEmoji(true);
                            }}
                            className="p-2 rounded-xl"
                          >
                            <AppleEmoji emoji={emoji} size="lg" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-sm">
                        <button 
                          onClick={() => setHasSelectedEmoji(false)}
                        >
                          <AppleEmoji emoji={selectedEmoji || "🧠"} size="lg" />
                        </button>
                        <Input
                          value={newTodoText}
                          onChange={(e) => setNewTodoText(e.target.value)}
                          placeholder="Add a task..."
                          className="flex-1 h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTodoText.trim()) handleAddTodo();
                            if (e.key === 'Escape') {
                              setIsAddingTodo(false);
                              setNewTodoText("");
                              setHasSelectedEmoji(false);
                              setSelectedEmoji(null);
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={handleAddTodo}
                          disabled={!newTodoText.trim()}
                          className="text-primary hover:opacity-80 transition-opacity disabled:opacity-30"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleStartAddTodo}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/50 hover:bg-white/70 transition-colors text-muted-foreground border-2 border-dashed border-muted-foreground/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add task</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 h-full">
              <h3 className="font-display text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button variant="secondary" className="justify-start h-auto py-4 px-5" asChild>
                  <Link to="/dashboard">
                    <span className="mr-3"><AppleEmoji emoji="🔥" size="xl" /></span>
                    <div className="text-left">
                      <p className="font-semibold">Track Habits</p>
                      <p className="text-xs text-muted-foreground">Log today's progress</p>
                    </div>
                  </Link>
                </Button>
                <Button variant="secondary" className="justify-start h-auto py-4 px-5" asChild>
                  <Link to="/journal">
                    <span className="mr-3"><AppleEmoji emoji="📝" size="xl" /></span>
                    <div className="text-left">
                      <p className="font-semibold">Write Journal</p>
                      <p className="text-xs text-muted-foreground">Reflect on your day</p>
                    </div>
                  </Link>
                </Button>
                <Button variant="secondary" className="justify-start h-auto py-4 px-5" asChild>
                  <Link to="/tutorials">
                    <span className="mr-3"><AppleEmoji emoji="🎥" size="xl" /></span>
                    <div className="text-left">
                      <p className="font-semibold">Tutorials</p>
                      <p className="text-xs text-muted-foreground">Learn how to use Locked</p>
                    </div>
                  </Link>
                </Button>
                <Button variant="secondary" className="justify-start h-auto py-4 px-5" asChild>
                  <Link to="/goals">
                    <span className="mr-3"><AppleEmoji emoji="🎯" size="xl" /></span>
                    <div className="text-left">
                      <p className="font-semibold">Goals</p>
                      <p className="text-xs text-muted-foreground">See how close you are to your goals</p>
                    </div>
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </div>
          
          {/* Goals Progress Overview */}
          <GoalProgressOverview />
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8">
          <GlassCard className="p-6">
            <h3 className="font-display text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <AppleEmoji emoji={activity.emoji} size="xl" />
                    <p className="flex-1 text-sm">{activity.text}</p>
                    <span className="text-xs text-muted-foreground">{activity.timeAgo}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <AppleEmoji emoji="📭" size="2xl" className="mb-2" />
                  <p className="text-sm">No recent activity yet</p>
                  <p className="text-xs">Complete habits and tasks to see your activity here</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
        
        {/* Onboarding Questions Modal */}
        <OnboardingQuestionsModal 
          open={showOnboarding} 
          onOpenChange={setShowOnboarding} 
        />
        
        {/* Paywall Modal */}
        <PaywallModal
          open={paywallOpen}
          onOpenChange={setPaywallOpen}
          limitType={paywallLimitType}
          limitMessage={getLimitMessage(paywallLimitType)}
        />
      </main>
    </>
  );
}

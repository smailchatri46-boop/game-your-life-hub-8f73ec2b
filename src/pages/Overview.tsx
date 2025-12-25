import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { LevelProgress } from "@/components/LevelProgress";
import { GlassCard } from "@/components/GlassCard";
import { Target, Calendar, TrendingUp, Flame, Sparkles, Lock, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useSelectedMonth } from "@/hooks/use-selected-month";

interface DayData {
  date: number;
  habits: { name: string; completed: boolean }[];
  mood: string;
  journal?: string;
}

const generateMonthData = (daysInMonth: number, currentDay: number): Record<number, DayData> => {
  const data: Record<number, DayData> = {};
  const habits = ["Morning Meditation", "Exercise", "Read 30 mins", "Drink Water", "No Social Media"];
  const moods = ["😊", "😌", "😐", "😔", "🥳"];
  
  const maxDay = Math.min(daysInMonth, currentDay);
  
  for (let i = 1; i <= maxDay; i++) {
    data[i] = {
      date: i,
      habits: habits.map(name => ({
        name,
        completed: Math.random() > 0.3,
      })),
      mood: moods[Math.floor(Math.random() * 5)],
      journal: Math.random() > 0.5 ? "Had a great day today. Feeling productive and motivated." : undefined,
    };
  }
  return data;
};

export default function Overview() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const {
    monthName,
    year,
    month,
    goToPreviousMonth,
    goToNextMonth,
    getDaysInMonth,
    getFirstDayOfMonth,
    isCurrentMonth,
    getCurrentDay,
  } = useSelectedMonth();

  const daysInMonth = getDaysInMonth();
  const startDay = getFirstDayOfMonth();
  const currentDay = getCurrentDay();
  
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Regenerate data when month changes
  const monthData = useMemo(() => {
    return generateMonthData(daysInMonth, currentDay);
  }, [month, year, daysInMonth, currentDay]);

  // Calculate stats from month data
  const stats = useMemo(() => {
    const entries = Object.values(monthData);
    if (entries.length === 0) return { todayPercent: 0, weekAvg: 0, monthPercent: 0 };

    const todayData = monthData[currentDay];
    const todayPercent = todayData 
      ? Math.round((todayData.habits.filter(h => h.completed).length / todayData.habits.length) * 100)
      : 0;

    const last7Days = entries.slice(-7);
    const weekAvg = Math.round(
      last7Days.reduce((sum, day) => {
        const completed = day.habits.filter(h => h.completed).length;
        return sum + (completed / day.habits.length) * 100;
      }, 0) / last7Days.length
    );

    const monthPercent = Math.round(
      entries.reduce((sum, day) => {
        const completed = day.habits.filter(h => h.completed).length;
        return sum + (completed / day.habits.length) * 100;
      }, 0) / entries.length
    );

    return { todayPercent, weekAvg, monthPercent };
  }, [monthData, currentDay]);
  
  const getCompletionRate = (day: number) => {
    const data = monthData[day];
    if (!data) return 0;
    const completed = data.habits.filter(h => h.completed).length;
    return Math.round((completed / data.habits.length) * 100);
  };

  // Reset selected date when month changes
  const handlePreviousMonth = () => {
    setSelectedDate(null);
    goToPreviousMonth();
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    goToNextMonth();
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-6xl mx-auto">
        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button 
            onClick={handlePreviousMonth}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="font-display text-xl min-w-[180px] text-center">
            <span className="text-primary font-semibold">{monthName}</span>
            <span className="text-foreground ml-2">{year}</span>
          </h2>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Today"
            subtitle={isCurrentMonth() ? `${Math.round(stats.todayPercent / 100 * 6)}/6 completed` : "View current month"}
            value={isCurrentMonth() ? stats.todayPercent : 0}
            icon={Target}
            iconColor="text-primary"
            progress={isCurrentMonth() ? stats.todayPercent : 0}
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
          <StatCard
            title="Current Streak"
            subtitle="Keep it up! 🔥"
            value={12}
            suffix=" days"
            icon={Flame}
            iconColor="text-accent"
          />
        </div>
        
        {/* Level Progress */}
        <div className="mb-8">
          <LevelProgress
            level={7}
            currentXP={2450}
            maxXP={3000}
          />
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
                  
                  return (
                    <button
                      key={day}
                      onClick={() => !isFuture && setSelectedDate(day)}
                      disabled={isFuture}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                        isFuture 
                          ? 'bg-muted/30 cursor-not-allowed'
                          : isSelected
                            ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground shadow-medium scale-105'
                            : completionRate >= 80
                              ? 'bg-primary/20 hover:bg-primary/30'
                              : completionRate >= 50
                                ? 'bg-accent/20 hover:bg-accent/30'
                                : 'bg-secondary hover:bg-secondary/80'
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
          
          {/* Day Details Panel */}
          <div>
            {selectedDate ? (
              <GlassCard className="p-6 sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-semibold">
                    {monthName} {selectedDate}
                  </h3>
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {monthData[selectedDate] ? (
                  <>
                    <div className="mb-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Mood</p>
                      <span className="text-3xl">{monthData[selectedDate].mood}</span>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Habits</p>
                      <div className="space-y-2">
                        {monthData[selectedDate].habits.map((habit, i) => (
                          <div 
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-xl ${
                              habit.completed ? 'bg-primary/10' : 'bg-secondary'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              habit.completed 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              {habit.completed ? '✓' : ''}
                            </span>
                            <span className={`text-sm ${habit.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {habit.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {monthData[selectedDate].journal && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Journal</p>
                        <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-xl">
                          {monthData[selectedDate].journal}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No data for this day</p>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-6 text-center">
                <span className="text-4xl mb-4 block">📅</span>
                <h3 className="font-display text-lg font-semibold mb-2">Select a day</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any day to see your habits, mood, and journal entry
                </p>
              </GlassCard>
            )}
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
                    <Target className="w-5 h-5 mr-3 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Track Habits</p>
                      <p className="text-xs text-muted-foreground">Log today's progress</p>
                    </div>
                  </Link>
                </Button>
                <Button variant="secondary" className="justify-start h-auto py-4 px-5" asChild>
                  <Link to="/journal">
                    <span className="text-xl mr-3">📝</span>
                    <div className="text-left">
                      <p className="font-semibold">Write Journal</p>
                      <p className="text-xs text-muted-foreground">Reflect on your day</p>
                    </div>
                  </Link>
                </Button>
                <Button variant="secondary" className="justify-start h-auto py-4 px-5" asChild>
                  <Link to="/tutorials">
                    <span className="text-xl mr-3">🎥</span>
                    <div className="text-left">
                      <p className="font-semibold">Tutorials</p>
                      <p className="text-xs text-muted-foreground">Learn how to use Locked</p>
                    </div>
                  </Link>
                </Button>
                <Button variant="secondary" className="justify-start h-auto py-4 px-5" asChild>
                  <Link to="/settings">
                    <span className="text-xl mr-3">⚙️</span>
                    <div className="text-left">
                      <p className="font-semibold">Settings</p>
                      <p className="text-xs text-muted-foreground">Customize your experience</p>
                    </div>
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </div>
          
          {/* AI Coach Teaser */}
          <GlassCard className="p-6 relative overflow-hidden" glow>
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                PRO
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">AI Coach</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get personalized insights, motivation, and progress reflection from your AI life coach.
            </p>
            <Button variant="gradient" size="sm" className="w-full" asChild>
              <Link to="/ai-chat">
                <Lock className="w-4 h-4 mr-2" />
                Unlock AI Coach
              </Link>
            </Button>
          </GlassCard>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8">
          <GlassCard className="p-6">
            <h3 className="font-display text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { emoji: "✅", text: "Completed 'Morning Meditation'", time: "2 hours ago" },
                { emoji: "🔥", text: "12 day streak achieved!", time: "Yesterday" },
                { emoji: "⬆️", text: "Leveled up to Level 7", time: "2 days ago" },
                { emoji: "📝", text: "Wrote journal entry", time: "2 days ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <span className="text-xl">{activity.emoji}</span>
                  <p className="flex-1 text-sm">{activity.text}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

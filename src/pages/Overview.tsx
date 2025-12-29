import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { OnboardingQuestionsModal } from "@/components/OnboardingQuestionsModal";
import { AIBuddyChat } from "@/components/AIBuddyChat";
import { useHabitStats } from "@/hooks/use-habit-stats";
import { Target, TrendingUp, Heart, BarChart3, X } from "lucide-react";
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const habitStats = useHabitStats();
  const {
    monthName,
    year,
    month,
    getDaysInMonth,
    getFirstDayOfMonth,
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
  
  const getCompletionRate = (day: number) => {
    const data = monthData[day];
    if (!data) return 0;
    const completed = data.habits.filter(h => h.completed).length;
    return Math.round((completed / data.habits.length) * 100);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
        {/* AI Buddy Chat - First Section */}
        <div className="mb-8">
          <AIBuddyChat />
        </div>

        {/* Stats Row - New Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 - Average Day Progress */}
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
              <span className="text-3xl font-bold gradient-text">{habitStats.perfectDaysThisWeek ?? 0}</span>
              <span className="text-lg font-medium text-primary/70"> / 7</span>
            </div>
            <p className="text-xs text-muted-foreground">Days completed fully this week</p>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full progress-bar-orange rounded-full transition-all duration-500"
                style={{ width: `${((habitStats.perfectDaysThisWeek ?? 0) / 7) * 100}%` }}
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
              <AppleEmoji emoji={habitStats.averageMoodEmoji ?? "😊"} size="3xl" />
            </div>
            <p className="text-xs text-muted-foreground">Your average mood is <span className="font-bold">{habitStats.averageMoodLabel ?? "Happy"}</span>.</p>
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
              <span className="text-3xl font-bold gradient-text">{habitStats.emotionalStability ?? 7}</span>
              <span className="text-lg font-medium text-primary/70"> / 10</span>
            </div>
            <p className="text-xs text-muted-foreground">Consistency of mood</p>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full progress-bar-orange rounded-full transition-all duration-500"
                style={{ width: `${((habitStats.emotionalStability ?? 7) / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Card 4 - Daily Progress */}
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
              <span className="text-3xl font-bold gradient-text">{habitStats.monthPercent}</span>
              <span className="text-lg font-medium text-primary/70">%</span>
            </div>
            <p className="text-xs text-muted-foreground">Average daily completion</p>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full progress-bar-orange rounded-full transition-all duration-500"
                style={{ width: `${habitStats.monthPercent}%` }}
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
                      <AppleEmoji emoji={monthData[selectedDate].mood} size="3xl" />
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
                <span className="mb-4 block"><AppleEmoji emoji="📅" size="4xl" /></span>
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
          
          {/* Goals Teaser */}
          <GlassCard className="p-6 relative overflow-hidden" glow>
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                NEW
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
              <AppleEmoji emoji="🎯" size="3xl" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Goals</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set yearly and quarterly goals, break them into milestones, and track your progress.
            </p>
            <Button variant="gradient" size="sm" className="w-full" asChild>
              <Link to="/goals">
                Explore Goals
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
                { emoji: "💪", text: "Completed 'Exercise'", time: "2 hours ago" },
                { emoji: "💧", text: "Completed 'Drink Water'", time: "3 hours ago" },
                { emoji: "📓", text: "Wrote a journal entry", time: "Yesterday" },
                { emoji: "🧘", text: "Completed 'Morning Meditation'", time: "Yesterday" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <AppleEmoji emoji={activity.emoji} size="xl" />
                  <p className="flex-1 text-sm">{activity.text}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        
        {/* Onboarding Questions Modal */}
        <OnboardingQuestionsModal 
          open={showOnboarding} 
          onOpenChange={setShowOnboarding} 
        />
      </main>
    </div>
  );
}

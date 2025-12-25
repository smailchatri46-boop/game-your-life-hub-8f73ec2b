import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { LevelProgress } from "@/components/LevelProgress";
import { GlassCard } from "@/components/GlassCard";
import { Target, Calendar, TrendingUp, Flame, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [currentMonth] = useState(new Date());
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-6xl mx-auto">
        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="font-display text-xl">
            <span className="text-primary font-semibold">{monthName}</span>
            <span className="text-foreground ml-2">{year}</span>
          </h2>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Today"
            subtitle="4/6 completed"
            value={70}
            icon={Target}
            iconColor="text-primary"
            progress={70}
          />
          <StatCard
            title="This Week Average"
            subtitle="This week"
            value={60}
            icon={Calendar}
            iconColor="text-accent"
            progress={60}
          />
          <StatCard
            title="This Month"
            subtitle="December"
            value={80}
            icon={TrendingUp}
            iconColor="text-primary"
            progress={80}
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
        
        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 h-full">
              <h3 className="font-display text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button variant="secondary" className="justify-start h-auto py-4 px-5" asChild>
                  <Link to="/habits">
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
                  <Link to="/overview">
                    <Calendar className="w-5 h-5 mr-3 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">View Calendar</p>
                      <p className="text-xs text-muted-foreground">See monthly overview</p>
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

import { LandingNavbar } from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Link } from "react-router-dom";
import { Check, Sparkles, TrendingUp, BookOpen, Brain } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 animate-fade-in">
            <span className="italic gradient-text">Turn your life</span>
            <br />
            <span className="text-foreground">into a Game</span>
            <span className="gradient-text"> for free</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in delay-100">
            Track habits, level up your life, and stay consistent with the most beautiful habit tracker you've ever used.
          </p>
          
          <div className="animate-fade-in delay-200">
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup" className="gap-3">
                <AppleEmoji emoji="👤" size="md" />
                Sign up with Google
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Demo Preview */}
        <div className="max-w-4xl mx-auto mt-16 animate-slide-up delay-300">
          <GlassCard className="aspect-video flex items-center justify-center" glow>
            <div className="text-center text-muted-foreground">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <p className="text-lg font-medium">App Demo</p>
              <p className="text-sm">Interactive preview coming soon</p>
            </div>
          </GlassCard>
        </div>
      </section>
      
      {/* Value Proposition */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            <span className="font-bold">Your</span> all in one tracker
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
            Replace scattered spreadsheets, random apps, and messy notes with one beautiful solution.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                <Brain className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">AI Tools</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="21" x2="9" y2="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-sm text-muted-foreground">Excel</span>
            </div>
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-muted-foreground font-bold text-lg">
              →
            </div>
            
            <GlassCard className="px-5 py-3 flex items-center gap-2" glow>
              <span className="font-display font-semibold gradient-text">Locked.</span>
            </GlassCard>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-12">
            Everything you need to <span className="gradient-text italic">succeed</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard className="p-6" hover>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Habit Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Track daily habits with a beautiful spreadsheet-style grid. See your progress at a glance.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6" hover>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Levels & XP</h3>
              <p className="text-muted-foreground text-sm">
                Earn experience points for consistency. Level up and unlock achievements.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6" hover>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Daily Journal</h3>
              <p className="text-muted-foreground text-sm">
                Reflect on your day with beautiful journal entries. Track mood and motivation.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6" hover>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">AI Coach</h3>
              <p className="text-muted-foreground text-sm">
                Get personalized insights and motivation from your AI-powered life coach.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6" hover>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                <AppleEmoji emoji="🔥" size="2xl" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Streaks</h3>
              <p className="text-muted-foreground text-sm">
                Build momentum with streak tracking. Don't break the chain!
              </p>
            </GlassCard>
            
            <GlassCard className="p-6" hover>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                <AppleEmoji emoji="📊" size="2xl" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Beautiful charts and insights to understand your patterns and growth.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <GlassCard className="p-10" glow>
            <h2 className="font-display text-3xl font-semibold mb-4">
              Ready to level up?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of people who have transformed their lives with Locked.
            </p>
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup" className="gap-3">
                Start for free
              </Link>
            </Button>
          </GlassCard>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-display font-semibold gradient-text">Locked.</span>
          <p className="text-sm text-muted-foreground">© 2025 Locked. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

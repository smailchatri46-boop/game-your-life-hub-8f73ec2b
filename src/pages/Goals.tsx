import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Target } from "lucide-react";

export default function Goals() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <main className="pt-28 pb-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold text-foreground">Goals</h1>
          <p className="text-muted-foreground text-sm mt-2">Set and track your life goals</p>
        </div>
        
        <GlassCard className="p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-6">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Set yearly and quarterly goals, break them into actionable milestones, and track your progress toward what matters most.
          </p>
          <div className="mt-6">
            <AppleEmoji emoji="🎯" size="xl" />
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";

interface AICoachingSectionProps {
  onUpgrade?: () => void;
  onDismiss?: () => void;
}

export function AICoachingSection({ onUpgrade, onDismiss }: AICoachingSectionProps) {
  return (
    <GlassCard className="p-8 text-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 blur-xl" />
      <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 blur-xl" />
      
      {/* Lock Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
        Unlock AI Coaching
      </h3>

      {/* Description */}
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        AI coaching is part of Locked Pro. Unlock personalized insights, motivation, and progress reflection.
      </p>

      {/* Upgrade Button */}
      <Button 
        variant="gradient" 
        size="lg"
        className="w-full max-w-xs mx-auto mb-4"
        onClick={onUpgrade}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Upgrade to Pro
      </Button>

      {/* Maybe Later Link */}
      <button 
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        Maybe later
      </button>

      {/* Pricing */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <div className="flex justify-center items-center gap-8">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">$14<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            <div className="text-xs text-muted-foreground">Monthly</div>
          </div>
          <div className="w-px h-10 bg-border/50" />
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">$7<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            <div className="text-xs text-muted-foreground">Yearly (save 50%)</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

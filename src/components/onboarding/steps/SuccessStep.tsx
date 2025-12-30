import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";

interface SuccessStepProps {
  commitmentName: string;
  onGoToDashboard: () => void;
  onAddMoreHabits: () => void;
  onStartJournaling: () => void;
}

export function SuccessStep({
  commitmentName,
  onGoToDashboard,
  onAddMoreHabits,
  onStartJournaling,
}: SuccessStepProps) {
  return (
    <OnboardingCard className="text-center">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="🎉" size="3xl" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground mb-3">
          You're all set{commitmentName ? `, ${commitmentName}` : ""}!
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Your journey starts now. Remember: small steps, taken consistently, lead to remarkable change.
        </p>
      </div>

      {/* Motivational quote */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border border-primary/10">
        <p className="text-sm text-foreground italic font-display">
          "The secret of getting ahead is getting started."
        </p>
        <p className="text-xs text-muted-foreground mt-1">— Mark Twain</p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onGoToDashboard}
          variant="gradient"
          className="w-full h-12 text-base hover:opacity-90"
        >
          <AppleEmoji emoji="🏠" size="sm" />
          Go to my dashboard
        </Button>
        
        <div className="flex gap-3">
          <Button
            onClick={onAddMoreHabits}
            variant="outline"
            className="flex-1 h-11 bg-white/50 border-border/30 hover:bg-secondary/50 hover:border-border/30"
          >
            <AppleEmoji emoji="➕" size="sm" />
            Add more habits
          </Button>
          <Button
            onClick={onStartJournaling}
            variant="outline"
            className="flex-1 h-11 bg-white/50 border-border/30 hover:bg-secondary/50 hover:border-border/30"
          >
            <AppleEmoji emoji="📝" size="sm" />
            Start journaling
          </Button>
        </div>
      </div>
    </OnboardingCard>
  );
}

import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import dashboardPreview from "@/assets/dashboard-preview.png";

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
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Blurred dashboard background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${dashboardPreview})`,
          filter: 'blur(12px)',
          transform: 'scale(1.05)',
        }}
      />
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-white/30" />
      
      {/* Card content */}
      <div className="relative z-10 w-full max-w-md px-4">
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

          <Button
            onClick={onGoToDashboard}
            variant="gradient"
            className="w-full h-12 text-base hover:opacity-90"
          >
            Start organizing my life
          </Button>
        </OnboardingCard>
      </div>
    </div>
  );
}

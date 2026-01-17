import { useEffect } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { AppleEmoji } from "@/components/AppleEmoji";

interface LoadingStepProps {
  onComplete: () => void;
}

export function LoadingStep({ onComplete }: LoadingStepProps) {
  useEffect(() => {
    // Complete after loading animation
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <OnboardingCard className="text-center">
      <div className="py-8 flex flex-col items-center justify-center min-h-[200px]">
        {/* Pulsing emoji */}
        <div className="mb-6 animate-pulse-float">
          <AppleEmoji emoji="✨" size="3xl" />
        </div>

        {/* Modern pill progress loader */}
        <div className="w-48 h-3 rounded-full bg-secondary/60 overflow-hidden relative mb-6 shadow-inner">
          {/* Animated gradient fill */}
          <div 
            className="absolute inset-y-0 left-0 w-full rounded-full animate-progress-slide"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(38, 100%, 70%) 20%, hsl(24, 95%, 53%) 50%, hsl(38, 100%, 70%) 80%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
          {/* Shimmer overlay */}
          <div 
            className="absolute inset-0 rounded-full animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Modern loading text */}
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          Setting up your tracker…
        </h2>
        <p className="text-sm text-muted-foreground">
          Personalizing goals, habits, and tasks.
        </p>
      </div>
    </OnboardingCard>
  );
}

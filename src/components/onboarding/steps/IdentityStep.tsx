import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface IdentityStepProps {
  variant: 1 | 2 | 3;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const IDENTITY_CONTENT = {
  1: {
    emoji: "🎯",
    title: "You want more control over your life.",
    subtitle: "And that's exactly why you're here.",
  },
  2: {
    emoji: "🔄",
    title: "You're tired of starting and stopping.",
    subtitle: "We get it. The cycle ends here.",
  },
  3: {
    emoji: "💪",
    title: "You're ready to stay consistent.",
    subtitle: "Small steps, every single day.",
  },
};

export function IdentityStep({ variant, onNext, onBack, onSkip }: IdentityStepProps) {
  const content = IDENTITY_CONTENT[variant];

  return (
    <OnboardingCard className="text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-5">
          <AppleEmoji emoji={content.emoji} size="3xl" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground mb-3 leading-snug">
          {content.title}
        </h2>
        <p className="text-muted-foreground text-base">
          {content.subtitle}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-11 bg-white/50 border-border/30"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onNext}
          variant="gradient"
          className="flex-1 h-11"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <button
        onClick={onSkip}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        Skip onboarding
      </button>
    </OnboardingCard>
  );
}

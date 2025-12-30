import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";

interface IdentityStepProps {
  variant: 1 | 2;
  onNext: () => void;
  onSkip: () => void;
}

const IDENTITY_CONTENT: Record<1 | 2, { emoji: string; title: string; subtitle: string }> = {
  1: {
    emoji: "🎯",
    title: "Take control over your life.",
    subtitle: "Locked gives you habits, tasks, to-do lists, journals, and goal tracking — everything you need to organize your life.",
  },
  2: {
    emoji: "💪",
    title: "You're ready to stay consistent.",
    subtitle: "Start with small steps today — let momentum compound over the next months.",
  },
};

export function IdentityStep({ variant, onNext, onSkip }: IdentityStepProps) {
  const content = IDENTITY_CONTENT[variant];

  return (
    <OnboardingCard className="text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-5">
          <AppleEmoji emoji={content.emoji} size="3xl" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground mb-4">
          {content.title}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      <Button
        onClick={onNext}
        variant="gradient"
        className="w-full h-11"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>

      <button
        onClick={onSkip}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip onboarding
      </button>
    </OnboardingCard>
  );
}

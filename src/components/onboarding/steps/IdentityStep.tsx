import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";

interface IdentityStepProps {
  variant: 1 | 2;
  onNext: () => void;
}

const IDENTITY_CONTENT: Record<1 | 2, { emoji: string; title: string; subtitle: string }> = {
  1: {
    emoji: "🎯",
    title: "Take control over your life.",
    subtitle: "Neyler gives you habits, tasks, to-do lists, journals, and goal tracking. Everything you need to organize your life.",
  },
  2: {
    emoji: "💪",
    title: "Be ready to stay consistent.",
    subtitle: "Neyler offers you everything you need to track your goals. An AI buddy to help you on your low days. Journaling, tasks, and habits—all in one simple place to achieve your goals.",
  },
};

export function IdentityStep({ variant, onNext }: IdentityStepProps) {
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
    </OnboardingCard>
  );
}

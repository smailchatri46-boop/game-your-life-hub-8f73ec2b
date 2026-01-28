import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";

type Variant = "readiness" | "gentle-commitment";

interface JourneyTransitionStepProps {
  variant: Variant;
  onNext: () => void;
}

const CONTENT: Record<Variant, {
  emoji: string;
  title: string;
  subtitle: string;
  ctaText: string;
}> = {
  "readiness": {
    emoji: "🚀",
    title: "Ready to start your journey?",
    subtitle: "You're about to set up the foundation for real progress.",
    ctaText: "Yes, let's start",
  },
  "gentle-commitment": {
    emoji: "🌱",
    title: "Small steps, real change",
    subtitle: "You don't need perfection — just consistency.",
    ctaText: "Continue",
  },
};

export function JourneyTransitionStep({
  variant,
  onNext,
}: JourneyTransitionStepProps) {
  const content = CONTENT[variant];

  return (
    <OnboardingCard className="text-center">
      <div className="py-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <AppleEmoji emoji={content.emoji} size="4xl" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold font-display text-foreground mb-3">
          {content.title}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm mx-auto">
          {content.subtitle}
        </p>

        <Button
          onClick={onNext}
          variant="gradient"
          className="w-full h-12 text-base hover:opacity-90"
        >
          {content.ctaText}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </OnboardingCard>
  );
}

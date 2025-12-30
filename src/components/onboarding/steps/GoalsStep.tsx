import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GoalsStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function GoalsStep({ onNext, onBack, onSkip }: GoalsStepProps) {
  return (
    <OnboardingCard className="text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-5">
          <AppleEmoji emoji="🎯" size="3xl" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground mb-4">
          Set your goals inside the app
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          You can create quarterly or yearly goals and track progress in real time inside the Goals tab once you log in. Don't forget to check it out.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          size="default"
          className="h-11 px-4 bg-white/50 border-border/30 hover:bg-secondary/50"
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
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip onboarding
      </button>
    </OnboardingCard>
  );
}

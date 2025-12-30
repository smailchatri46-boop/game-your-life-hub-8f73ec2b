import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WhyWeExistStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function WhyWeExistStep({ onNext, onBack, onSkip }: WhyWeExistStepProps) {
  return (
    <OnboardingCard className="text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-5">
          <AppleEmoji emoji="✨" size="3xl" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground mb-4">
          Why Locked exists
        </h2>
        <div className="space-y-3 text-muted-foreground text-base leading-relaxed">
          <p>
            Locked helps you build habits, complete tasks, set goals, and reflect — all in one place.
          </p>
          <p>
            We believe in consistency over intensity. Small steps, taken daily, lead to remarkable change.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-2xl">
          <AppleEmoji emoji="📋" size="xl" />
          <span className="text-xs mt-1.5 text-muted-foreground">Habits</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-2xl">
          <AppleEmoji emoji="✅" size="xl" />
          <span className="text-xs mt-1.5 text-muted-foreground">Tasks</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-2xl">
          <AppleEmoji emoji="🎯" size="xl" />
          <span className="text-xs mt-1.5 text-muted-foreground">Goals</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-2xl">
          <AppleEmoji emoji="📝" size="xl" />
          <span className="text-xs mt-1.5 text-muted-foreground">Journal</span>
        </div>
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

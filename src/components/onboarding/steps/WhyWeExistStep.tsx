import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";

interface WhyWeExistStepProps {
  onNext: () => void;
}

export function WhyWeExistStep({ onNext }: WhyWeExistStepProps) {
  return (
    <OnboardingCard className="text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-5">
          <AppleEmoji emoji="💪" size="3xl" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground mb-4">
          Neyler got your back
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Neyler is an AI-powered habit, task, and goals tracker. Everything in one place with meaningful insights built for you.
        </p>
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

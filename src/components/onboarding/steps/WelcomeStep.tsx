import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <OnboardingCard className="text-center">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="✨" size="3xl" />
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground mb-3">
          Welcome to Locked
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Turn your daily habits, tasks, journals and goals into clear data you can analyze with AI — and finally stay consistent.
        </p>
      </div>

      <Button
        onClick={onNext}
        className="w-full h-12 text-base"
        variant="gradient"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </OnboardingCard>
  );
}

import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GoalsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function GoalsStep({ onNext, onBack }: GoalsStepProps) {
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

      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          size="default"
          className="h-11 px-5 border-border/30 hover:bg-secondary/50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onNext}
          variant="gradient"
          size="default"
          className="h-11 px-6"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </OnboardingCard>
  );
}

import { useState } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillOption } from "../PillOption";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GoalsStepProps {
  goalCategory: string;
  goalName: string;
  onUpdateGoal: (category: string, name: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const GOAL_CATEGORIES = [
  { label: "Health", emoji: "💚" },
  { label: "Career", emoji: "💼" },
  { label: "Learning", emoji: "📚" },
  { label: "Fitness", emoji: "🏃" },
  { label: "Finance", emoji: "💰" },
  { label: "Personal", emoji: "✨" },
];

export function GoalsStep({
  goalCategory,
  goalName,
  onUpdateGoal,
  onNext,
  onBack,
  onSkip,
}: GoalsStepProps) {
  const [showGoalInput, setShowGoalInput] = useState(!!goalCategory);

  const handleCategorySelect = (category: string) => {
    onUpdateGoal(category, goalName);
    setShowGoalInput(true);
  };

  const handleSkipGoal = () => {
    onUpdateGoal("", "");
    onNext();
  };

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="🎯" size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          Set a medium-term goal
        </h2>
        <p className="text-muted-foreground text-sm">
          What do you want to achieve in the next few months?
        </p>
      </div>

      {!showGoalInput ? (
        <>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {GOAL_CATEGORIES.map((category) => (
              <PillOption
                key={category.label}
                label={category.label}
                emoji={category.emoji}
                selected={goalCategory === category.label}
                onClick={() => handleCategorySelect(category.label)}
              />
            ))}
          </div>

          <button
            onClick={handleSkipGoal}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 mb-6"
          >
            Skip for now
          </button>
        </>
      ) : (
        <div className="space-y-4 mb-6">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
              {GOAL_CATEGORIES.find(c => c.label === goalCategory)?.emoji} {goalCategory}
            </span>
          </div>
          
          <Input
            placeholder="e.g., Run a 5K marathon"
            value={goalName}
            onChange={(e) => onUpdateGoal(goalCategory, e.target.value)}
            className="h-12 bg-white/50 border-border/30 rounded-xl text-center"
          />

          <button
            onClick={() => setShowGoalInput(false)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Change category
          </button>
        </div>
      )}

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
          {goalName ? "Next" : "Skip"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <button
        onClick={onSkip}
        className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        Skip onboarding
      </button>
    </OnboardingCard>
  );
}

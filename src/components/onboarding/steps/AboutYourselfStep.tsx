import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { PillOption } from "../PillOption";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Variant = "focus" | "struggle" | "time";

interface AboutYourselfStepProps {
  variant: Variant;
  selectedItems: string[];
  preferredTime?: string;
  onToggleItem: (item: string) => void;
  onSetTime?: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const CONTENT = {
  focus: {
    emoji: "🎯",
    title: "What are you focusing on?",
    subtitle: "Select all that apply",
    options: [
      { label: "Health", emoji: "💪" },
      { label: "Career", emoji: "💼" },
      { label: "Finance", emoji: "💰" },
      { label: "Fitness", emoji: "🏃" },
      { label: "School", emoji: "📚" },
      { label: "Relationships", emoji: "💕" },
      { label: "Mental wellness", emoji: "🧘" },
      { label: "Other", emoji: "✨" },
    ],
  },
  struggle: {
    emoji: "🤔",
    title: "What's your biggest struggle right now?",
    subtitle: "Select all that apply",
    options: [
      { label: "Consistency", emoji: "🔄" },
      { label: "Motivation", emoji: "🔥" },
      { label: "Planning", emoji: "📋" },
      { label: "Distractions", emoji: "📱" },
      { label: "Overwhelm", emoji: "😰" },
      { label: "Time management", emoji: "⏰" },
    ],
  },
  time: {
    emoji: "📊",
    title: "What's the thing you're struggling with the most to track?",
    subtitle: "Select all that apply",
    options: [
      { label: "My progress", emoji: "🎯" },
      { label: "My mood", emoji: "😊" },
      { label: "My motivation", emoji: "🔥" },
      { label: "My habits", emoji: "📋" },
      { label: "My tasks", emoji: "✅" },
    ],
  },
};

export function AboutYourselfStep({
  variant,
  selectedItems,
  preferredTime,
  onToggleItem,
  onSetTime,
  onNext,
  onBack,
  onSkip,
}: AboutYourselfStepProps) {
  const content = CONTENT[variant];
  const isSelected = (item: string) => {
    return selectedItems.includes(item);
  };

  const handleSelect = (item: string) => {
    onToggleItem(item);
  };

  const canProceed = selectedItems.length > 0;

  // No skip for any of these screens - user must select an option
  const showBack = variant !== "focus";

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji={content.emoji} size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          {content.title}
        </h2>
        <p className="text-muted-foreground text-sm">
          {content.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {content.options.map((option) => (
          <PillOption
            key={option.label}
            label={option.label}
            emoji={option.emoji}
            selected={isSelected(option.label)}
            onClick={() => handleSelect(option.label)}
          />
        ))}
      </div>

      <div className={showBack ? "flex justify-between items-center" : ""}>
        {showBack && (
          <Button
            onClick={onBack}
            variant="outline"
            size="default"
            className="h-11 px-5 border-border/30 hover:bg-secondary/50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}
        <Button
          onClick={onNext}
          variant="gradient"
          size="default"
          className={showBack ? "h-11 px-6" : "w-full h-11"}
          disabled={!canProceed}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </OnboardingCard>
  );
}

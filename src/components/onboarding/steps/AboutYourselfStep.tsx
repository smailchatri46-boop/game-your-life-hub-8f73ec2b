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
    title: "What are you currently focusing on?",
    subtitle: "Select all that apply",
    options: [
      { label: "Health", emoji: "💚" },
      { label: "Career", emoji: "💼" },
      { label: "School", emoji: "📚" },
      { label: "Finance", emoji: "💰" },
      { label: "Relationships", emoji: "❤️" },
      { label: "Mental wellness", emoji: "🧠" },
      { label: "Fitness", emoji: "🏃" },
      { label: "Other", emoji: "✨" },
    ],
    multiSelect: true,
  },
  struggle: {
    emoji: "🤔",
    title: "What's your biggest struggle right now?",
    subtitle: "Select all that apply",
    options: [
      { label: "Consistency", emoji: "🔄" },
      { label: "Motivation", emoji: "⚡" },
      { label: "Planning", emoji: "📝" },
      { label: "Distractions", emoji: "📱" },
      { label: "Overwhelm", emoji: "😵" },
      { label: "Time management", emoji: "⏰" },
    ],
    multiSelect: true,
  },
  time: {
    emoji: "🕐",
    title: "When do you prefer to work on yourself?",
    subtitle: "Choose one",
    options: [
      { label: "Morning", emoji: "🌅" },
      { label: "Afternoon", emoji: "☀️" },
      { label: "Evening", emoji: "🌙" },
      { label: "No specific time", emoji: "🔀" },
    ],
    multiSelect: false,
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
  const isTimeVariant = variant === "time";

  const isSelected = (item: string) => {
    if (isTimeVariant) {
      return preferredTime === item;
    }
    return selectedItems.includes(item);
  };

  const handleSelect = (item: string) => {
    if (isTimeVariant && onSetTime) {
      onSetTime(item);
    } else {
      onToggleItem(item);
    }
  };

  const canProceed = isTimeVariant 
    ? !!preferredTime 
    : selectedItems.length > 0;

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

      <div className="flex flex-wrap justify-center gap-2 mb-8">
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
          disabled={!canProceed}
        >
          Next
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

import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, ChevronRight } from "lucide-react";

type Variant = 
  | "tracking-experience" 
  | "why-stopped" 
  | "current-situation" 
  | "progress-visibility" 
  | "emotional-checkin" 
  | "readiness-signal";

interface PastExperienceStepProps {
  variant: Variant;
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
  onNext: () => void;
}

const CONTENT: Record<Variant, {
  emoji: string;
  title: string;
  subtitle?: string;
  helperText?: string;
  multiSelect: boolean;
  options: string[];
}> = {
  "tracking-experience": {
    emoji: "🔍",
    title: "Have you ever tried tracking your life before?",
    helperText: "There's no right answer. This helps us understand where you're coming from.",
    multiSelect: false,
    options: [
      "Yes, and it worked for a while",
      "Yes, but I stopped",
      "I tried, but it felt overwhelming",
      "No, I've never really tracked anything",
    ],
  },
  "why-stopped": {
    emoji: "🤔",
    title: "What made you stop?",
    subtitle: "Select all that apply",
    multiSelect: true,
    options: [
      "I lost motivation",
      "It took too much effort",
      "I forgot to use it",
      "I didn't see real progress",
      "The app felt complicated",
      "Life just got busy",
    ],
  },
  "current-situation": {
    emoji: "📱",
    title: "Right now, how do you keep track of things?",
    multiSelect: false,
    options: [
      "I mostly keep everything in my head",
      "Notes / reminders scattered everywhere",
      "Multiple apps that don't connect",
      "I don't really track anything",
      "I have a system, but it's messy",
    ],
  },
  "progress-visibility": {
    emoji: "📊",
    title: "Do you feel like you can clearly see your progress?",
    multiSelect: false,
    options: [
      "Yes, very clearly",
      "Somewhat",
      "Not really",
      "I have no idea how I'm doing",
    ],
  },
  "emotional-checkin": {
    emoji: "💭",
    title: "How does that make you feel?",
    multiSelect: false,
    options: [
      "Motivated but inconsistent",
      "Frustrated",
      "Overwhelmed",
      "Calm, but unfocused",
      "Ready for something better",
    ],
  },
  "readiness-signal": {
    emoji: "✨",
    title: "What are you hoping for this time?",
    multiSelect: false,
    options: [
      "More consistency",
      "Less overthinking",
      "Clear progress",
      "Better habits",
      "A system that adapts to me",
    ],
  },
};

export function PastExperienceStep({
  variant,
  selectedOptions,
  onToggleOption,
  onNext,
}: PastExperienceStepProps) {
  const content = CONTENT[variant];
  
  const handleOptionClick = (option: string) => {
    if (content.multiSelect) {
      onToggleOption(option);
    } else {
      // For single-select, replace the selection
      if (!selectedOptions.includes(option)) {
        // Clear previous selections and add new one
        selectedOptions.forEach(opt => onToggleOption(opt));
        onToggleOption(option);
      }
    }
  };

  const canProceed = selectedOptions.length > 0;

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji={content.emoji} size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          {content.title}
        </h2>
        {content.subtitle && (
          <p className="text-muted-foreground text-sm">
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-4">
        {content.options.map((option) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-primary/30"
                  : "bg-white/50 border-2 border-border/20 hover:bg-secondary/30 hover:border-border/30"
              }`}
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${
                isSelected
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : "border-2 border-muted-foreground/30"
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      {content.helperText && (
        <p className="text-xs text-muted-foreground text-center mb-4">
          {content.helperText}
        </p>
      )}

      <Button
        onClick={onNext}
        variant="gradient"
        className="w-full h-11 hover:opacity-90"
        disabled={!canProceed}
      >
        Next <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </OnboardingCard>
  );
}

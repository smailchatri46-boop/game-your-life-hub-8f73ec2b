import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, ChevronRight } from "lucide-react";

type Variant = "tone" | "feedback-style" | "insight-depth";

interface AIPersonalizationStepProps {
  variant: Variant;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  onNext: () => void;
}

const CONTENT: Record<Variant, {
  emoji: string;
  title: string;
  options: { label: string; emoji: string }[];
}> = {
  "tone": {
    emoji: "🤖",
    title: "How should your AI Buddy talk to you?",
    options: [
      { label: "Calm & supportive", emoji: "🧘" },
      { label: "Direct & honest", emoji: "💬" },
      { label: "Motivational & energetic", emoji: "🔥" },
      { label: "Gentle & reflective", emoji: "🌙" },
    ],
  },
  "feedback-style": {
    emoji: "💭",
    title: "When you fall behind, you prefer…",
    options: [
      { label: "Encouragement", emoji: "💪" },
      { label: "Honest feedback", emoji: "🎯" },
      { label: "Actionable steps", emoji: "📋" },
      { label: "Gentle reminders", emoji: "🔔" },
    ],
  },
  "insight-depth": {
    emoji: "📊",
    title: "How deep should insights go?",
    options: [
      { label: "Simple summaries", emoji: "✨" },
      { label: "Balanced insights", emoji: "⚖️" },
      { label: "Deep analysis", emoji: "🔬" },
      { label: "Only when I ask", emoji: "🤫" },
    ],
  },
};

export function AIPersonalizationStep({
  variant,
  selectedOption,
  onSelectOption,
  onNext,
}: AIPersonalizationStepProps) {
  const content = CONTENT[variant];
  const canProceed = selectedOption !== null;

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji={content.emoji} size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          {content.title}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {content.options.map((option) => {
          const isSelected = selectedOption === option.label;
          return (
            <button
              key={option.label}
              onClick={() => onSelectOption(option.label)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-primary/30"
                  : "bg-white/50 border-2 border-border/20 hover:bg-secondary/30 hover:border-border/30"
              }`}
            >
              <div className="flex-shrink-0">
                <AppleEmoji emoji={option.emoji} size="md" />
              </div>
              <span className={`text-sm flex-1 ${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {option.label}
              </span>
              <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${
                isSelected
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : "border-2 border-muted-foreground/30"
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

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

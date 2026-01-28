import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";

interface AIProactivenessToggleProps {
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  onNext: () => void;
}

const OPTIONS = [
  { label: "Only when I ask", emoji: "🤫" },
  { label: "Occasionally check in", emoji: "👋" },
  { label: "Actively guide me", emoji: "🧭" },
];

export function AIProactivenessToggle({
  selectedOption,
  onSelectOption,
  onNext,
}: AIProactivenessToggleProps) {
  const canProceed = selectedOption !== null;

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="⚙️" size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          How proactive should your AI be?
        </h2>
      </div>

      {/* Segmented Control */}
      <div className="bg-secondary/30 rounded-xl p-1.5 mb-4">
        <div className="grid grid-cols-3 gap-1">
          {OPTIONS.map((option) => {
            const isSelected = selectedOption === option.label;
            return (
              <button
                key={option.label}
                onClick={() => onSelectOption(option.label)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg text-center transition-all ${
                  isSelected
                    ? "bg-white shadow-md"
                    : "hover:bg-white/50"
                }`}
                style={isSelected ? {
                  background: "linear-gradient(to bottom right, white, hsl(35, 95%, 98%))",
                } : undefined}
              >
                <AppleEmoji emoji={option.emoji} size="lg" />
                <span className={`text-xs leading-tight ${
                  isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                }`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center mb-4">
        You're always in control.
      </p>

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

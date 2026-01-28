import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, ChevronRight } from "lucide-react";

interface AIModeSelectorProps {
  selectedModes: string[];
  onToggleMode: (mode: string) => void;
  onNext: () => void;
}

const MODES = [
  { label: "Coach", emoji: "🏋️" },
  { label: "Planner", emoji: "🗂️" },
  { label: "Reflective listener", emoji: "🌱" },
  { label: "Accountability partner", emoji: "🎯" },
  { label: "Analyst", emoji: "📊" },
];

export function AIModeSelector({
  selectedModes,
  onToggleMode,
  onNext,
}: AIModeSelectorProps) {
  const canProceed = selectedModes.length > 0;

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="🎭" size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          Which modes do you want your AI to use?
        </h2>
        <p className="text-muted-foreground text-sm">
          Select all that apply.
        </p>
      </div>

      {/* Mode pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {MODES.map((mode) => {
          const isSelected = selectedModes.includes(mode.label);
          return (
            <button
              key={mode.label}
              onClick={() => onToggleMode(mode.label)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 relative ${
                isSelected
                  ? "bg-white text-foreground shadow-md"
                  : "bg-white/80 text-foreground border-2 border-border/30 hover:border-primary/40 hover:bg-white"
              }`}
              style={isSelected ? {
                background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, hsl(25, 95%, 53%), hsl(35, 95%, 60%)) border-box",
                border: "2px solid transparent",
              } : undefined}
            >
              <AppleEmoji emoji={mode.emoji} size="md" />
              {mode.label}
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center ml-1">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center mb-4">
        Your AI can switch modes depending on context.
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

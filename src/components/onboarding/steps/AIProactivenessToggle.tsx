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
  { label: "Short & quick", emoji: "⚡" },
  { label: "Balanced", emoji: "💬" },
  { label: "Detailed", emoji: "📝" },
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
          <AppleEmoji emoji="💭" size="4xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          How should your AI respond?
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose your preferred response style
        </p>
      </div>

      {/* Pill Options with gradient stroke and shadow */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {OPTIONS.map((option) => {
          const isSelected = selectedOption === option.label;
          return (
            <button
              key={option.label}
              onClick={() => onSelectOption(option.label)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-200 ${
                isSelected
                  ? "bg-white shadow-md"
                  : "bg-white/60 hover:bg-white/80 border-2 border-border/30"
              }`}
              style={isSelected ? {
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, hsl(25, 95%, 53%), hsl(35, 95%, 60%))",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              } : undefined}
            >
              <AppleEmoji emoji={option.emoji} size="lg" />
              <span className={`text-sm font-medium ${
                isSelected ? "text-foreground" : "text-muted-foreground"
              }`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center mb-6">
        You can always change this later.
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
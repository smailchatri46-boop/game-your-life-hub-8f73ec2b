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
    <OnboardingCard className="py-10 px-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-5">
          <AppleEmoji emoji="💭" size="7xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          How should your AI respond?
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose your preferred response style
        </p>
      </div>

      {/* Pill Options with gradient stroke */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {OPTIONS.map((option) => {
          const isSelected = selectedOption === option.label;
          return (
            <button
              key={option.label}
              onClick={() => onSelectOption(option.label)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${
                isSelected
                  ? "bg-white shadow-md"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              style={isSelected ? {
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, hsl(35, 95%, 55%), hsl(25, 95%, 55%))",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow: "0 4px 12px rgba(234, 88, 12, 0.15)",
              } : {
                border: "2px solid hsl(35, 20%, 88%)",
              }}
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

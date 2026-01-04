import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, ChevronRight } from "lucide-react";

interface SurveyOption {
  label: string;
}

interface SurveyQuestionStepProps {
  emoji: string;
  title: string;
  description?: string;
  options: SurveyOption[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  onNext: () => void;
}

export function SurveyQuestionStep({
  emoji,
  title,
  description,
  options,
  selectedOption,
  onSelectOption,
  onNext,
}: SurveyQuestionStepProps) {
  const canProceed = selectedOption !== null;

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji={emoji} size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option) => {
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
              <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${
                isSelected
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : "border-2 border-muted-foreground/30"
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                {option.label}
              </span>
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

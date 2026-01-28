import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight } from "lucide-react";

interface AIDirectnessSliderProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

export function AIDirectnessSlider({
  value,
  onChange,
  onNext,
}: AIDirectnessSliderProps) {
  const getLabel = () => {
    if (value <= 33) return "Very gentle";
    if (value <= 66) return "Balanced";
    return "Very direct";
  };

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="🎚️" size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          How direct should your AI Buddy be?
        </h2>
        <p className="text-muted-foreground text-sm">
          Slide to choose the right balance for you.
        </p>
      </div>

      {/* Slider */}
      <div className="mb-6 px-2">
        <div className="mb-4">
          <Slider
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Very gentle</span>
          <span>Balanced</span>
          <span>Very direct</span>
        </div>

        {/* Current value indicator */}
        <div className="text-center mt-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-primary/20">
            <span className="text-sm font-medium text-foreground">{getLabel()}</span>
          </span>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center mb-4">
        You can always change this later.
      </p>

      <Button
        onClick={onNext}
        variant="gradient"
        className="w-full h-11 hover:opacity-90"
      >
        Next <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </OnboardingCard>
  );
}

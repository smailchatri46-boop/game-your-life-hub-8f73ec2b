import { useEffect } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronRight } from "lucide-react";

interface AIDirectnessSliderProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

// Descriptions from gentle to direct
const DIRECTNESS_DESCRIPTIONS = [
  "Soft encouragement with gentle suggestions",
  "Supportive guidance with light nudges",
  "Balanced feedback with honest insights",
  "Direct advice with clear expectations",
  "Straight talk with no sugarcoating"
];

export function AIDirectnessSlider({
  value,
  onChange,
  onNext,
}: AIDirectnessSliderProps) {
  // Disable scrolling on this page
  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    
    return () => {
      document.documentElement.style.overflow = originalOverflow;
      document.body.style.overflow = "";
    };
  }, []);

  // Determine which description to show based on slider value (0-100)
  const getDescriptionIndex = () => {
    if (value <= 20) return 0;
    if (value <= 40) return 1;
    if (value <= 60) return 2;
    if (value <= 80) return 3;
    return 4;
  };

  const currentDescription = DIRECTNESS_DESCRIPTIONS[getDescriptionIndex()];

  return (
    <OnboardingCard className="py-10 px-8">
      {/* Title and subtitle at top */}
      <div className="text-center mb-8">
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
      </div>

      {/* Dynamic text description */}
      <div className="flex justify-center items-center min-h-[48px] my-6">
        <p className="text-muted-foreground text-sm text-center italic">
          "{currentDescription}"
        </p>
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center mb-6">
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

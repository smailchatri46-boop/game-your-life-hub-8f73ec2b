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

// 5 emojis from gentle to direct
const DIRECTNESS_EMOJIS = ["🌸", "🌿", "⚖️", "🔥", "💪"];

export function AIDirectnessSlider({
  value,
  onChange,
  onNext,
}: AIDirectnessSliderProps) {
  // Determine which emoji to show based on slider value (0-100)
  const getEmojiIndex = () => {
    if (value <= 20) return 0;
    if (value <= 40) return 1;
    if (value <= 60) return 2;
    if (value <= 80) return 3;
    return 4;
  };

  const currentEmoji = DIRECTNESS_EMOJIS[getEmojiIndex()];

  return (
    <OnboardingCard className="">
      {/* Title and subtitle at top (no emoji above) */}
      <div className="text-center mb-6">
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

        {/* Dynamic emoji indicator - much larger */}
        <div className="text-center mt-6 mb-2">
          <AppleEmoji emoji={currentEmoji} size="10xl" />
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

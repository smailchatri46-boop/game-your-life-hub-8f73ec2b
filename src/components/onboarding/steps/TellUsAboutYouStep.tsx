import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface TellUsAboutYouStepProps {
  uniqueAbout: string;
  onSetUniqueAbout: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TellUsAboutYouStep({
  uniqueAbout,
  onSetUniqueAbout,
  onNext,
  onBack,
}: TellUsAboutYouStepProps) {
  const canProceed = uniqueAbout.trim().length > 0;

  return (
    <OnboardingCard className="text-center">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="🌟" size="3xl" />
        </div>
        <h2 className="text-2xl font-bold font-display text-foreground mb-3">
          Tell us something unique about you.
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          What makes you different? Share something important so we can personalize your experience.
        </p>
      </div>

      <Textarea
        placeholder="Write something about yourself..."
        value={uniqueAbout}
        onChange={(e) => onSetUniqueAbout(e.target.value)}
        className="min-h-[120px] bg-white/50 border-border/30 rounded-xl text-base resize-none mb-6"
      />

      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          size="default"
          className="h-11 px-5 border-border/30 hover:bg-secondary/50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onNext}
          variant="gradient"
          size="default"
          className="h-11 px-6"
          disabled={!canProceed}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </OnboardingCard>
  );
}

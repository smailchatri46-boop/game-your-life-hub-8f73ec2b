import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronLeft, Check } from "lucide-react";

interface CommitmentStepProps {
  checkedAffirmations: string[];
  commitmentName: string;
  onToggleAffirmation: (affirmation: string) => void;
  onSetName: (name: string) => void;
  onComplete: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const AFFIRMATIONS = [
  "I will show up for myself.",
  "I will focus on progress, not perfection.",
  "I will stay consistent even when motivation fades.",
  "I will celebrate small wins along the way.",
];

export function CommitmentStep({
  checkedAffirmations,
  commitmentName,
  onToggleAffirmation,
  onSetName,
  onComplete,
  onBack,
  onSkip,
}: CommitmentStepProps) {
  const allChecked = AFFIRMATIONS.every(a => checkedAffirmations.includes(a));
  const canComplete = allChecked && commitmentName.trim().length > 0;

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="✍️" size="3xl" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">
          Sign your commitment
        </h2>
        <p className="text-muted-foreground text-sm">
          Make a promise to yourself
        </p>
      </div>

      {/* Affirmations */}
      <div className="space-y-3 mb-6">
        {AFFIRMATIONS.map((affirmation) => {
          const isChecked = checkedAffirmations.includes(affirmation);
          return (
            <button
              key={affirmation}
              onClick={() => onToggleAffirmation(affirmation)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                isChecked
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-primary/30"
                  : "bg-white/50 border-2 border-border/20 hover:border-border/40"
              }`}
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5 ${
                isChecked
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : "border-2 border-muted-foreground/30"
              }`}>
                {isChecked && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                {affirmation}
              </span>
            </button>
          );
        })}
      </div>

      {/* Signature */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2 text-center">
          Sign with your name
        </label>
        <Input
          placeholder="Your name"
          value={commitmentName}
          onChange={(e) => onSetName(e.target.value)}
          className="h-12 bg-white/50 border-border/30 rounded-xl text-center font-display text-lg italic"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          size="default"
          className="h-11 px-4 bg-white/50 border-border/30 hover:bg-secondary/50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onComplete}
          variant="gradient"
          className="flex-1 h-11"
          disabled={!canComplete}
        >
          Sign & Continue
        </Button>
      </div>

      <button
        onClick={onSkip}
        className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip onboarding
      </button>
    </OnboardingCard>
  );
}

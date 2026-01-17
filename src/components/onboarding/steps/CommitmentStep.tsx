import { useEffect } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview-optimized.jpg";

interface CommitmentStepProps {
  checkedAffirmations: string[];
  commitmentName: string;
  onToggleAffirmation: (affirmation: string) => void;
  onSetName: (name: string) => void;
  onComplete: () => void;
  onBack: () => void;
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
}: CommitmentStepProps) {
  const allChecked = AFFIRMATIONS.every(a => checkedAffirmations.includes(a));
  const canComplete = allChecked && commitmentName.trim().length > 0;

  // Preload the dashboard image early so it's ready for SuccessStep
  useEffect(() => {
    const img = new Image();
    img.src = dashboardPreview;
  }, []);

  return (
    <OnboardingCard>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="🤝" size="3xl" />
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
                  : "bg-white/50 border-2 border-border/20 hover:bg-secondary/30 hover:border-border/30"
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

      <Button
        onClick={onComplete}
        variant="gradient"
        className="w-full h-11 hover:opacity-90"
        disabled={!canComplete}
      >
        Sign & Continue
      </Button>
    </OnboardingCard>
  );
}

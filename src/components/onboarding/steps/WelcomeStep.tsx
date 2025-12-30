import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";

interface WelcomeStepProps {
  onCreateAccount: () => void;
  onLogin: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ onCreateAccount, onLogin, onSkip }: WelcomeStepProps) {
  return (
    <OnboardingCard className="text-center">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <AppleEmoji emoji="🔒" size="3xl" />
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground mb-3">
          Welcome to Locked
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Your personal space for building habits, tracking goals, and becoming the best version of yourself.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <Button
          onClick={onCreateAccount}
          className="w-full h-12 text-base"
          variant="gradient"
        >
          Create account
        </Button>
        <Button
          onClick={onLogin}
          variant="outline"
          className="w-full h-12 text-base bg-white/50 border-border/30"
        >
          Log in
        </Button>
      </div>

      <button
        onClick={onSkip}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        Skip onboarding
      </button>
    </OnboardingCard>
  );
}

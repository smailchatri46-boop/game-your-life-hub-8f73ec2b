import { useEffect, useState } from "react";
import { OnboardingCard } from "../OnboardingCard";

interface LoadingStepProps {
  onComplete: () => void;
}

const LOADING_MESSAGES = [
  "Analyzing your data…",
  "Preparing your dashboard…",
  "Personalizing your experience…",
  "Optimizing habit recommendations…",
];

export function LoadingStep({ onComplete }: LoadingStepProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    // Cycle through messages with fade transition
    const messageInterval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
        setFadeIn(true);
      }, 200);
    }, 2000);

    // Complete after all messages shown
    const completeTimeout = setTimeout(() => {
      clearInterval(messageInterval);
      onComplete();
    }, 8000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <OnboardingCard className="text-center">
      <div className="py-8">
        {/* Rotating orange circle loader */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-primary animate-spin" />
        </div>

        {/* Dynamic loading text with fade transition */}
        <h2 
          className={`text-xl font-bold font-display text-foreground transition-opacity duration-200 ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          {LOADING_MESSAGES[currentMessage]}
        </h2>
      </div>
    </OnboardingCard>
  );
}

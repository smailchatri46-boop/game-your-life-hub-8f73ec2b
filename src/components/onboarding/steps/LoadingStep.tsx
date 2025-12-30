import { useEffect, useState } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { AppleEmoji } from "@/components/AppleEmoji";

interface LoadingStepProps {
  onComplete: () => void;
}

const LOADING_MESSAGES = [
  { text: "Building your starting plan…", emoji: "🏗️" },
  { text: "Personalizing habits and reminders…", emoji: "✨" },
  { text: "Setting up your dashboard…", emoji: "📊" },
  { text: "Almost ready…", emoji: "🚀" },
];

export function LoadingStep({ onComplete }: LoadingStepProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 800);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const message = LOADING_MESSAGES[currentMessage];

  return (
    <OnboardingCard className="text-center">
      <div className="py-8">
        <div className="flex justify-center mb-6">
          <div className="animate-pulse">
            <AppleEmoji emoji={message.emoji} size="3xl" />
          </div>
        </div>

        <h2 className="text-xl font-bold font-display text-foreground mb-6">
          {message.text}
        </h2>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </OnboardingCard>
  );
}

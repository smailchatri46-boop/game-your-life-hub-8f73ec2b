import { useEffect, useState } from "react";
import { OnboardingCard } from "../OnboardingCard";
import { AppleEmoji } from "@/components/AppleEmoji";

interface LoadingStepProps {
  onComplete: () => void;
}

const LOADING_EMOJIS = ["✨", "🧠", "⚡️", "🎯", "🚀", "💫"];

const LOADING_STATES = [
  { title: "Setting up your tracker…", subtitle: "Personalizing goals, habits, and tasks." },
  { title: "Analyzing your preferences…", subtitle: "Building your personalized experience." },
  { title: "Preparing your dashboard…", subtitle: "Almost there!" },
  { title: "Optimizing for you…", subtitle: "Making everything perfect." },
];

export function LoadingStep({ onComplete }: LoadingStepProps) {
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    // Cycle through emojis slowly
    const emojiInterval = setInterval(() => {
      setCurrentEmoji(prev => (prev + 1) % LOADING_EMOJIS.length);
    }, 1800);

    // Cycle through messages with fade transition
    const messageInterval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentMessage(prev => (prev + 1) % LOADING_STATES.length);
        setFadeIn(true);
      }, 200);
    }, 2200);

    // Complete after longer loading animation
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 9000);

    return () => {
      clearInterval(emojiInterval);
      clearInterval(messageInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <OnboardingCard className="text-center">
      <div className="py-8 flex flex-col items-center justify-center min-h-[220px]">
        {/* Slowly pulsing emoji that cycles */}
        <div className="mb-6 animate-pulse-float-slow">
          <AppleEmoji emoji={LOADING_EMOJIS[currentEmoji]} size="3xl" />
        </div>

        {/* Modern pill progress loader */}
        <div className="w-48 h-3 rounded-full bg-secondary/60 overflow-hidden relative mb-6 shadow-inner">
          {/* Animated gradient fill */}
          <div 
            className="absolute inset-y-0 left-0 w-full rounded-full animate-progress-slide"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(38, 100%, 70%) 20%, hsl(24, 95%, 53%) 50%, hsl(38, 100%, 70%) 80%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
          {/* Shimmer overlay */}
          <div 
            className="absolute inset-0 rounded-full animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Cycling loading text with fade transition */}
        <div className={`transition-opacity duration-200 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
          <h2 className="text-xl font-bold font-display text-foreground mb-2">
            {LOADING_STATES[currentMessage].title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {LOADING_STATES[currentMessage].subtitle}
          </p>
        </div>
      </div>
    </OnboardingCard>
  );
}

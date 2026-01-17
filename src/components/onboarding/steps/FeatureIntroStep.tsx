import { useEffect, useState } from "react";

interface FeatureIntroStepProps {
  onComplete: () => void;
}

export function FeatureIntroStep({ onComplete }: FeatureIntroStepProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    // Phase 1: Enter animation (fade in the text)
    const enterTimer = setTimeout(() => {
      setPhase("visible");
    }, 100);

    // Phase 2: Keep visible for a moment
    const visibleTimer = setTimeout(() => {
      setPhase("exit");
    }, 2000);

    // Phase 3: Exit and move to next step
    const exitTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(visibleTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 w-full gradient-hero flex items-center justify-center"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* Animated text */}
      <div 
        className={`text-center px-6 transition-all duration-700 ease-out ${
          phase === "enter" 
            ? "opacity-0 translate-y-8 scale-95" 
            : phase === "visible"
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-105"
        }`}
      >
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground">
          Here's what you'll find <span className="gradient-text italic">inside</span>
        </h2>
      </div>
    </div>
  );
}


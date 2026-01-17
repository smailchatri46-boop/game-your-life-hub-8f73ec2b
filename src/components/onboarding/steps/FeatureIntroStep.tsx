import { useEffect, useState } from "react";

interface FeatureIntroStepProps {
  onComplete: () => void;
}

export function FeatureIntroStep({ onComplete }: FeatureIntroStepProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  // Preload images for the "All-in-one tracker" step
  useEffect(() => {
    const imagesToPreload = [
      "/images/apps-arrows.png",
      "/images/neyler-logo-full.png",
    ];
    
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // Phase 1: Enter animation (fade in the text) - start immediately
    const enterTimer = setTimeout(() => {
      setPhase("visible");
    }, 50);

    // Phase 2: Keep visible for a moment
    const visibleTimer = setTimeout(() => {
      setPhase("exit");
    }, 2200);

    // Phase 3: Exit and move to next step - longer exit for smoother transition
    const exitTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(visibleTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 w-full h-full gradient-hero flex items-center justify-center"
      style={{ 
        height: '100vh', 
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Perfectly centered animated text */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div 
          className={`text-center px-8 max-w-4xl ${
            phase === "enter" 
              ? "opacity-0 translate-y-6" 
              : phase === "visible"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
          style={{
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight">
            Here's what you'll find <span className="gradient-text italic">inside</span>
          </h2>
        </div>
      </div>
    </div>
  );
}


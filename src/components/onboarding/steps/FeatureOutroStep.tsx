import { useEffect, useState } from "react";

interface FeatureOutroStepProps {
  onComplete: () => void;
}

export function FeatureOutroStep({ onComplete }: FeatureOutroStepProps) {
  const [opacity, setOpacity] = useState(0);

  // Hide scrollbar on mount
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    
    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  useEffect(() => {
    // Fade in
    const fadeInTimer = setTimeout(() => {
      setOpacity(1);
    }, 50);

    // Start fade out
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
    }, 2200);

    // Move to next step after fade out completes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full gradient-hero grid place-items-center overflow-hidden"
      style={{ 
        zIndex: 50,
      }}
    >
      <h2 
        className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight text-center px-8 max-w-4xl"
        style={{
          opacity,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        And much more to help you <span className="gradient-text italic">succeed</span>.
      </h2>
    </div>
  );
}

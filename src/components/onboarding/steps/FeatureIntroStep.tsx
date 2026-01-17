import { useEffect, useState } from "react";

interface FeatureIntroStepProps {
  onComplete: () => void;
}

export function FeatureIntroStep({ onComplete }: FeatureIntroStepProps) {
  const [opacity, setOpacity] = useState(0);

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
      className="gradient-hero"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      <h2 
        className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight text-center px-8"
        style={{
          opacity,
          transition: 'opacity 0.8s ease-in-out',
          margin: 0,
        }}
      >
        Here's what you'll find <span className="gradient-text italic">inside</span>
      </h2>
    </div>
  );
}

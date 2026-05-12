import { useRef, useEffect, useState, useCallback } from "react";

interface MarqueeTextProps {
  text: string;
  className?: string;
  index?: number;
  hideOverlay?: boolean;
}

// Staggered animation configs for variety
const ANIMATION_CONFIGS = [
  { duration: 12, delay: 0 },
  { duration: 14, delay: 1.5 },
  { duration: 11, delay: 3 },
  { duration: 15, delay: 0.8 },
  { duration: 13, delay: 4 },
  { duration: 10, delay: 2.2 },
];

export function MarqueeText({ text, className = "", index = 0, hideOverlay = false }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const checkOverflow = useCallback(() => {
    if (containerRef.current && textRef.current) {
      const isNowOverflowing = textRef.current.scrollWidth > containerRef.current.clientWidth;
      setIsOverflowing(isNowOverflowing);
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      checkOverflow();
    });
    window.addEventListener("resize", checkOverflow);

    const el = containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (el) {
      observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold: 0 }
      );
      observer.observe(el);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", checkOverflow);
      observer?.disconnect();
    };
  }, [text, checkOverflow]);

  const config = ANIMATION_CONFIGS[index % ANIMATION_CONFIGS.length];

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {isOverflowing && !hideOverlay && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-card to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-card to-transparent z-10" />
        </>
      )}
      <span 
        ref={textRef}
        className="whitespace-nowrap block"
        style={isOverflowing ? {
          animation: `marquee-scroll ${config.duration}s linear ${config.delay}s infinite`,
          animationPlayState: isVisible ? 'running' : 'paused',
        } : undefined}
      >
        {text}
      </span>
    </div>
  );
}

import { useRef, useEffect, useState, useCallback } from "react";

interface MarqueeTextProps {
  text: string;
  className?: string;
  index?: number;
}

// Staggered animation configs for variety
const ANIMATION_CONFIGS = [
  { duration: 18, delay: 0 },
  { duration: 20, delay: 1.5 },
  { duration: 17, delay: 3 },
  { duration: 21, delay: 0.8 },
  { duration: 19, delay: 4 },
  { duration: 16, delay: 2.2 },
];

export function MarqueeText({ text, className = "", index = 0 }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

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
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [text, checkOverflow]);

  const config = ANIMATION_CONFIGS[index % ANIMATION_CONFIGS.length];

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {isOverflowing && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-card to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-card to-transparent z-10" />
        </>
      )}
      <span 
        ref={textRef}
        className="whitespace-nowrap block"
        style={isOverflowing ? {
          animation: `marquee-scroll ${config.duration}s ease-in-out ${config.delay}s infinite`,
        } : undefined}
      >
        {text}
      </span>
    </div>
  );
}

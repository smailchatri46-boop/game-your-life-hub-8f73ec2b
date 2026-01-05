import { useRef, useEffect, useState, useCallback } from "react";

interface MarqueeTextProps {
  text: string;
  className?: string;
  index?: number;
}

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
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text, checkOverflow]);

  if (!isOverflowing) {
    return (
      <div ref={containerRef} className={`overflow-hidden ${className}`}>
        <span ref={textRef} className="whitespace-nowrap block">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-card to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-card to-transparent z-10" />

      {/* Single text that scrolls out completely then reappears with staggered timing */}
      <span 
        className={`whitespace-nowrap block animate-marquee-single-${index % 6}`}
      >
        {text}
      </span>
    </div>
  );
}

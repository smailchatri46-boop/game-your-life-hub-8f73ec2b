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
    // Use requestAnimationFrame to ensure DOM is ready
    const raf = requestAnimationFrame(() => {
      checkOverflow();
    });
    window.addEventListener("resize", checkOverflow);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [text, checkOverflow]);

  const animationClass = isOverflowing ? `animate-marquee-single-${index % 6}` : "";

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
        className={`whitespace-nowrap block ${animationClass}`}
      >
        {text}
      </span>
    </div>
  );
}

import { useRef, useEffect } from "react";
import { AppleEmoji } from "@/components/AppleEmoji";

const suggestions = [
  { text: "Will I reach my goals if I keep going like this?", emoji: "1F642" },
  { text: "Which habits or tasks am I struggling with the most?", emoji: "1F914" },
  { text: "Analyze my last week and tell me what I should improve", emoji: "1F4CA" },
  { text: "What's the single habit that would help me the most right now?", emoji: "1F4A1" },
  { text: "How can I make my routine easier to stay consistent?", emoji: "1F331" },
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({ onSelect, disabled }: SuggestedQuestionsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPos = 0;
    const scrollSpeed = 0.2;

    const animate = () => {
      if (!container) return;
      
      scrollPos += scrollSpeed;
      
      // Reset when we've scrolled half (since we duplicate the content)
      if (scrollPos >= container.scrollWidth / 2) {
        scrollPos = 0;
      }
      
      container.scrollLeft = scrollPos;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Pause on hover/touch
    const handleMouseEnter = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    
    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleMouseEnter);
    container.addEventListener("touchend", handleMouseLeave);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleMouseEnter);
      container.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  const handleClick = (text: string, emoji: string) => {
    if (disabled) return;
    // Get the emoji character from the code
    const emojiChar = String.fromCodePoint(parseInt(emoji, 16));
    onSelect(`${text} ${emojiChar}`);
  };

  // Duplicate suggestions for seamless loop
  const duplicatedSuggestions = [...suggestions, ...suggestions];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {duplicatedSuggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.text}-${index}`}
            onClick={() => handleClick(suggestion.text, suggestion.emoji)}
            disabled={disabled}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-foreground/90 transition-all hover:opacity-80 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-orange-100/60"
            style={{ background: 'hsl(35 30% 97%)' }}
          >
            <span className="whitespace-nowrap">{suggestion.text}</span>
            <AppleEmoji emoji={String.fromCodePoint(parseInt(suggestion.emoji, 16))} size="sm" />
          </button>
        ))}
      </div>
    </div>
  );
}

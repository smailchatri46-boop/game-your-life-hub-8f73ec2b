import { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import GlowOrb from "@/components/GlowOrb";

const suggestedQuestions = [
  { text: "Which habit do I struggle with the most?", emoji: "🤔" },
  { text: "Analyze my last week and tell me what I should improve", emoji: "📊" },
  { text: "What's the single habit that would help me the most right now?", emoji: "💡" },
  { text: "How can I build better morning routines?", emoji: "🌅" },
  { text: "What patterns do you see in my productivity?", emoji: "⚡" },
];

export function AIBuddyShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.3; // Slower scrolling

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset when we've scrolled half (since content is duplicated)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Duplicate questions for seamless loop
  const duplicatedQuestions = [...suggestedQuestions, ...suggestedQuestions];

  return (
    <section className="py-12 px-4">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Title - centered at top, single line */}
        <h2 className="font-display text-2xl md:text-4xl font-semibold mb-6 whitespace-nowrap">
          Analyze your progress with the <span className="gradient-text italic">AI Buddy</span>
        </h2>

        {/* AI Buddy Chat Card - centered in middle, wider */}
        <div className="w-full mb-6">
          <div 
            className="w-full bg-card/40 backdrop-blur-xl rounded-3xl shadow-soft overflow-hidden flex flex-col relative border border-border/10" 
            style={{ height: "420px", maxWidth: "100%" }}
          >
            {/* Messages Area - Welcome state with GlowOrb */}
            <div className="flex-1 overflow-hidden px-6 py-10">
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                {/* Animated Glow Orb - Centered */}
                <div className="relative flex items-center justify-center mb-5">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0">
                    <GlowOrb />
                  </div>
                </div>
                
                <h2 className="font-display text-lg font-medium text-foreground mb-3">
                  Start a conversation
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                  I'm your wellness buddy <AppleEmoji emoji="🙂" size="sm" className="inline align-middle mx-0.5" /> I turn your habits into insights to help you reach your goals.
                </p>
              </div>
            </div>

            {/* Suggested Questions - Auto-scrolling with fade */}
            <div className="relative px-0 pb-4">
              {/* LEFT FADE - matches the peach/cream color on left side of card */}
              <div 
                className="absolute left-0 top-0 bottom-4 w-24 z-10 pointer-events-none" 
                style={{ background: 'linear-gradient(to right, hsl(32 55% 93%) 0%, transparent 100%)' }} 
              />
              {/* RIGHT FADE - matches the near-white color on right side of card */}
              <div 
                className="absolute right-0 top-0 bottom-4 w-24 z-10 pointer-events-none" 
                style={{ background: 'linear-gradient(to left, hsl(40 30% 97%) 0%, transparent 100%)' }} 
              />
              
              <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide px-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {duplicatedQuestions.map((q, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors text-xs text-foreground whitespace-nowrap"
                  >
                    <span>{q.text}</span>
                    <AppleEmoji emoji={q.emoji} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-5 pt-2">
              <div 
                className="flex items-center gap-3 rounded-full px-5 py-3.5 transition-all border border-orange-100/60" 
                style={{ background: 'hsl(35 30% 97%)' }}
              >
                <input
                  type="text"
                  placeholder="Message AI Buddy..."
                  className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  disabled
                />
                <button
                  className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full text-primary-foreground flex-shrink-0 shadow-[0_2px_8px_hsl(var(--primary)/0.3)] flex items-center justify-center p-0"
                  style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
                >
                  <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description - centered below card, wider to fit 2 lines */}
        <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl px-4">
          AI Buddy sees all your goals, tasks, habits, and daily reflections, analyzes them, and helps you see patterns, find weaknesses, and reach your goals faster.
        </p>
      </div>
    </section>
  );
}

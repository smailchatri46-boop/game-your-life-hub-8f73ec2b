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

const features = [
  { text: "Analyzes your habit patterns", emoji: "📊" },
  { text: "Provides personalized tips", emoji: "💡" },
  { text: "Helps you stay motivated", emoji: "🎯" },
];

export function AIBuddyShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.2; // Significantly slower scrolling

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
      <div className="max-w-6xl mx-auto">
        {/* Centered Section Heading - Above Chat */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Your AI That Sees All Your{" "}
            <span className="gradient-text italic">Goals & Habits</span>
          </h2>
        </div>

        {/* Centered Chat Interface */}
        <div className="flex justify-center mb-8">
          <div 
            className="w-full max-w-xl bg-card/40 backdrop-blur-xl rounded-3xl shadow-soft overflow-hidden flex flex-col relative border border-border/10" 
            style={{ height: "400px" }}
          >
            {/* Chat Header - Meet AI Buddy intro text */}
            <div className="px-6 py-4 border-b border-border/10">
              <p className="text-sm text-muted-foreground text-center">
                Meet AI Buddy - your supportive motivation buddy that turns your habits into insights to help you reach your goals.
              </p>
            </div>

            {/* Messages Area - Welcome state with GlowOrb */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                {/* Animated Glow Orb */}
                <div className="relative flex items-center justify-center mb-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0">
                    <GlowOrb />
                  </div>
                </div>
                
                <h3 className="font-display text-lg font-medium text-foreground mb-2">
                  Start a conversation
                </h3>
                <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
                  I'm your wellness buddy <AppleEmoji emoji="🙂" size="sm" className="inline align-middle mx-0.5" /> I turn your habits into insights to help you reach your goals.
                </p>
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

        {/* Features - Horizontal Layout Below Chat */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <AppleEmoji emoji={feature.emoji} size="md" />
              </div>
              <span className="text-sm text-foreground">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Suggested Questions Carousel - Below Features */}
        <div className="relative max-w-2xl mx-auto">
          {/* Fade edges - both left and right */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-6 py-2"
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
      </div>
    </section>
  );
}

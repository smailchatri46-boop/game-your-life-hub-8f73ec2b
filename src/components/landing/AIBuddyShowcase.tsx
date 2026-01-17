import { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import GlowOrb from "@/components/GlowOrb";
import { ScrollReveal } from "@/components/ScrollReveal";

const suggestedQuestions = [
  { text: "Which habit do I struggle with the most?", emoji: "🤔" },
  { text: "Analyze my last week and tell me what I should improve", emoji: "📊" },
  { text: "What's the single habit that would help me the most right now?", emoji: "💡" },
  { text: "How can I build better morning routines?", emoji: "🌅" },
  { text: "What patterns do you see in my productivity?", emoji: "⚡" },
];

interface AIBuddyShowcaseProps {
  isOnboarding?: boolean;
}

export function AIBuddyShowcase({ isOnboarding = false }: AIBuddyShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.3;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
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

  const duplicatedQuestions = [...suggestedQuestions, ...suggestedQuestions];

  // Adjust sizes for onboarding context - LARGER for onboarding to fill screen
  const chatboxHeight = isOnboarding ? "min(440px, 60vh)" : "min(380px, 55vh)";
  const titleSize = isOnboarding ? "text-xl md:text-4xl" : "text-2xl md:text-4xl";
  const descriptionSize = isOnboarding ? "text-xs md:text-sm" : "text-sm md:text-base";

  // Different title for onboarding vs homepage
  const titleContent = isOnboarding ? (
    <>Analyze Your Progress With <span className="gradient-text italic">the AI Buddy</span></>
  ) : (
    <>Ask the <span className="gradient-text italic">AI Buddy</span> <span className="font-sans not-italic">&</span> Get Deep Insights</>
  );

  return (
    <section className={isOnboarding ? "py-2 px-4 w-full h-full flex flex-col" : "py-2 px-4"}>
      {/* Title - outside chat box container, full section width */}
      <ScrollReveal animation="fade-up">
        <h2 
          className={`font-display ${titleSize} font-semibold ${isOnboarding ? 'mb-5' : 'mb-3'} text-center max-w-4xl mx-auto`}
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          {titleContent}
        </h2>
      </ScrollReveal>

      {/* Chat box container */}
      <ScrollReveal animation="zoom-in" delay={100} className={isOnboarding ? "flex-1 flex flex-col justify-center" : ""}>
        <div className={`max-w-3xl mx-auto ${isOnboarding ? 'mb-0' : 'mb-2'}`}>
          {/* AI Buddy Chat Card - matching dashboard style */}
          <div className="w-full">
            <div 
              className="w-full bg-card/40 backdrop-blur-xl rounded-3xl shadow-soft flex flex-col relative border border-border/10" 
              style={{ height: chatboxHeight, maxWidth: "100%", overflow: 'hidden' }}
            >
              {/* Messages Area - Welcome state with GlowOrb */}
              <div className="flex-1 px-4 md:px-6 py-4" style={{ overflow: 'hidden' }}>
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  {/* Animated Glow Orb - perfectly centered */}
                  <div className="relative flex items-center justify-center mb-3">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0">
                      <GlowOrb />
                    </div>
                  </div>
                  
                  <h2 className="font-display text-lg font-medium text-foreground mb-2">
                    Start a conversation
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    I'm your wellness buddy <AppleEmoji emoji="🙂" size="sm" className="inline align-middle mx-0.5" /> I turn your habits into insights to help you reach your goals.
                  </p>
                </div>
              </div>

              {/* Suggested Questions Carousel - with transparency mask fade */}
              <div className="px-0 pb-2">
                <div 
                  ref={scrollRef}
                  className="flex gap-3 px-4"
                  style={{ 
                    overflow: 'hidden',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                    maskRepeat: 'no-repeat',
                    maskSize: '100% 100%'
                  }}
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

              {/* Input Area - matching dashboard style */}
              <div className="p-4 pt-2">
                <div 
                  className="flex items-center gap-3 rounded-full px-5 py-3 transition-all border border-orange-100/60" 
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
        </div>
      </ScrollReveal>

      {/* Description - outside chat box container, at bottom for onboarding */}
      <ScrollReveal animation="fade-up" delay={200}>
        <p className={`text-muted-foreground ${descriptionSize} leading-relaxed text-center max-w-4xl mx-auto px-4 ${isOnboarding ? 'flex-shrink-0 pb-2' : ''}`}>
          AI Buddy sees all your goals, tasks, habits, and daily reflections, analyzes them, and helps you see patterns.
        </p>
      </ScrollReveal>
    </section>
  );
}

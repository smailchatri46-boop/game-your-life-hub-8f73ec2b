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

  // Adjust sizes - smaller title for onboarding, taller chatbox
  const chatboxHeight = isOnboarding ? "min(420px, 55vh)" : "min(400px, 55vh)";
  const titleSize = isOnboarding ? "text-xl md:text-4xl" : "text-3xl md:text-5xl";
  const descriptionSize = isOnboarding ? "text-sm md:text-base" : "text-base md:text-lg";

  // Different title for onboarding vs homepage
  const titleContent = isOnboarding ? (
    <>Analyze Your Progress With the <span className="gradient-text italic">AI Buddy</span></>
  ) : (
    <>Ask the <span className="gradient-text italic">AI Buddy</span> <span className="font-sans not-italic">&</span> Get Deep Insights</>
  );

  return (
    <section className={`${isOnboarding ? 'py-4' : 'py-12'} px-4 overflow-hidden w-full`}>
      {/* Title - centered at top with more space below */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <ScrollReveal animation="fade-up">
          <h2 
            className={`font-display ${titleSize} font-semibold`}
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {titleContent}
          </h2>
        </ScrollReveal>
      </div>

      {/* Chat box container - with more space below */}
      <div className={`w-full ${isOnboarding ? 'mb-6' : 'mb-10'}`}>
        <ScrollReveal animation="zoom-in" delay={100}>
          <div className="max-w-3xl mx-auto">
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
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0">
                        <GlowOrb />
                      </div>
                    </div>
                    
                    <h2 className="font-display text-base md:text-lg font-medium text-foreground mb-2">
                      Start a conversation
                    </h2>
                    <p className="text-muted-foreground text-xs md:text-sm max-w-sm">
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
                <div className="p-3 pt-2">
                  <div 
                    className="flex items-center gap-3 rounded-full px-4 py-2.5 transition-all border border-orange-100/60" 
                    style={{ background: 'hsl(35 30% 97%)' }}
                  >
                    <input
                      type="text"
                      placeholder="Message AI Buddy..."
                      className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
                      disabled
                    />
                    <button
                      className="w-9 h-9 min-w-[2.25rem] min-h-[2.25rem] rounded-full text-primary-foreground flex-shrink-0 shadow-[0_2px_8px_hsl(var(--primary)/0.3)] flex items-center justify-center p-0"
                      style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}
                    >
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Description - centered below content, matching GoalsShowcase */}
      <div className="max-w-3xl mx-auto text-center mt-4">
        <ScrollReveal animation="fade-up" delay={200}>
          <p className={`text-muted-foreground ${descriptionSize} leading-relaxed`}>
            {isOnboarding 
              ? "Chat with your AI Buddy to understand your habits, goals, tasks, and reflections in a smarter way. Get personalized insights from your real data and make better decisions without overthinking everything."
              : "Your personal AI companion that sees all your goals, tasks, habits, and journal entries. Get personalized insights and actionable advice based on your real data."
            }
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

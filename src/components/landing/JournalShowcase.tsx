import { useRef, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ScrollReveal } from "@/components/ScrollReveal";

interface JournalShowcaseProps {
  isOnboarding?: boolean;
}

export function JournalShowcase({ isOnboarding = false }: JournalShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.4;

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

  const demoJournals = [
    {
      emoji: "😊",
      date: "January 15, 2026",
      content: "Today was a good day. I managed to complete my morning routine and felt really productive. Started the day with meditation, then worked on my project without any distractions. Feeling grateful for the progress I'm making.",
      bgColor: "from-amber-50 to-orange-50",
    },
    {
      emoji: "🌟",
      date: "January 14, 2026",
      content: "Had an amazing breakthrough at work today! Finally solved that problem I've been stuck on for days. Sometimes stepping away and coming back with fresh eyes really helps. Celebrated with a nice walk in the evening.",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      emoji: "🧘",
      date: "January 13, 2026",
      content: "Focused on mindfulness today. Spent 30 minutes in quiet reflection and journaling. Realized I need to be more patient with myself. Progress isn't always linear, and that's okay. Small steps lead to big changes.",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      emoji: "💪",
      date: "January 12, 2026",
      content: "Pushed through a tough workout even though I didn't feel like it. Proud of myself for showing up anyway. The hardest part is always getting started. Once I'm moving, the energy follows.",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      emoji: "📚",
      date: "January 11, 2026",
      content: "Spent the evening reading and learning. Finished two chapters of the book I've been working through. Knowledge compounds over time, and I'm building habits that will serve me for years to come.",
      bgColor: "from-rose-50 to-red-50",
    },
    {
      emoji: "🎯",
      date: "January 10, 2026",
      content: "Set my intentions for the week ahead. Breaking down big goals into smaller tasks makes everything feel more achievable. Feeling organized and ready to tackle whatever comes my way this week.",
      bgColor: "from-yellow-50 to-amber-50",
    },
  ];

  // Duplicate journals for seamless loop
  const duplicatedJournals = [...demoJournals, ...demoJournals];

  // Adjust sizes - LARGER for onboarding to fill screen
  const titleSize = isOnboarding ? "text-2xl md:text-5xl" : "text-3xl md:text-5xl";
  const cardSize = isOnboarding ? "w-[320px] md:w-[360px]" : "w-[300px] md:w-[340px]";
  const descriptionSize = isOnboarding ? "text-sm md:text-base" : "text-base md:text-lg";

  return (
    <section className={`${isOnboarding ? 'py-4' : 'py-12'} px-4 overflow-hidden w-full`}>
      {/* Title - centered at top */}
      <div className="max-w-6xl mx-auto text-center mb-6">
        <ScrollReveal animation="fade-up">
          <h2 className={`font-display ${titleSize} font-semibold`}>
            Add Journals <span className="gradient-text italic">with Ease</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Journal Cards - scrolling carousel with transparency mask fade - full width */}
      <div className={`w-full ${isOnboarding ? 'mb-4' : 'mb-10'}`}>
        <ScrollReveal animation="zoom-in" delay={100}>
          <div 
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide py-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              maskRepeat: 'no-repeat',
              maskSize: '100% 100%'
            }}
          >
            {duplicatedJournals.map((journal, index) => (
              <GlassCard 
                key={index} 
                className={`p-5 hover:shadow-large transition-all duration-300 flex-shrink-0 ${cardSize} bg-gradient-to-br ${journal.bgColor}`}
              >
                {/* Header with emoji and date */}
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    {journal.date}
                  </p>
                  <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm">
                    <AppleEmoji emoji={journal.emoji} size="xl" />
                  </div>
                </div>

                {/* Journal content */}
                <div className="text-left">
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-6">
                    {journal.content}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Description - centered below cards, wider */}
      <div className="max-w-3xl mx-auto text-center mt-4">
        <ScrollReveal animation="fade-up" delay={200}>
          <p className={`text-muted-foreground ${descriptionSize} leading-relaxed`}>
            Capture your thoughts, reflections, and daily wins in beautiful journal entries. Express yourself with emojis, track your mood over time, and build a personal archive of your growth journey.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
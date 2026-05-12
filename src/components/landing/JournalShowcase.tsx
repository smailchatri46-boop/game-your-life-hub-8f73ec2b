import { useRef, useEffect } from "react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ScrollReveal } from "@/components/ScrollReveal";

interface JournalShowcaseProps {
  isOnboarding?: boolean;
}

export function JournalShowcase({ isOnboarding = false }: JournalShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(scrollContainer);

    let scrollPosition = 0;
    const scrollSpeed = 0.4;

    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
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
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const demoJournals = [
    {
      emoji: "😊",
      date: "January 15, 2026",
      time: "9:30 AM",
      content: "Today was a good day. I managed to complete my morning routine and felt really productive. Started the day with meditation, then worked on my project without any distractions. Feeling grateful for the progress I'm making.",
      bgColor: "bg-journal-green",
    },
    {
      emoji: "🌟",
      date: "January 14, 2026",
      time: "8:15 PM",
      content: "Had an amazing breakthrough at work today! Finally solved that problem I've been stuck on for days. Sometimes stepping away and coming back with fresh eyes really helps. Celebrated with a nice walk in the evening.",
      bgColor: "bg-journal-yellow",
    },
    {
      emoji: "🧘",
      date: "January 13, 2026",
      time: "7:00 PM",
      content: "Focused on mindfulness today. Spent 30 minutes in quiet reflection and journaling. Realized I need to be more patient with myself. Progress isn't always linear, and that's okay. Small steps lead to big changes.",
      bgColor: "bg-journal-purple",
    },
    {
      emoji: "💪",
      date: "January 12, 2026",
      time: "6:45 PM",
      content: "Pushed through a tough workout even though I didn't feel like it. Proud of myself for showing up anyway. The hardest part is always getting started. Once I'm moving, the energy follows.",
      bgColor: "bg-journal-pink",
    },
    {
      emoji: "📚",
      date: "January 11, 2026",
      time: "10:00 PM",
      content: "Spent the evening reading and learning. Finished two chapters of the book I've been working through. Knowledge compounds over time, and I'm building habits that will serve me for years to come.",
      bgColor: "bg-journal-yellow",
    },
    {
      emoji: "🎯",
      date: "January 10, 2026",
      time: "9:00 AM",
      content: "Set my intentions for the week ahead. Breaking down big goals into smaller tasks makes everything feel more achievable. Feeling organized and ready to tackle whatever comes my way this week.",
      bgColor: "bg-journal-orange",
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
            Write Journals and <span className="gradient-text italic">Reflections</span>
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
              <div
                key={index}
                className={`${journal.bgColor} rounded-3xl p-5 shadow-soft transition-all duration-300 hover:shadow-medium flex-shrink-0 ${cardSize} flex flex-col`}
              >
                {/* Header with emoji and date - matching Journal.tsx exactly */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AppleEmoji emoji={journal.emoji} size="xl" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{journal.date}</p>
                      <p className="text-xs text-muted-foreground">{journal.time}</p>
                    </div>
                  </div>
                </div>

                {/* Journal content */}
                <p className="text-foreground leading-relaxed text-sm flex-1">
                  {journal.content}
                </p>
              </div>
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
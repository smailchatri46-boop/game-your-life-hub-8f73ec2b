import { useRef, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Calendar } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

interface GoalsShowcaseProps {
  isOnboarding?: boolean;
}

export function GoalsShowcase({ isOnboarding = false }: GoalsShowcaseProps) {
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

  const demoGoals = [
    {
      name: "Complete 90-Day Fitness Challenge",
      category: "Health & Fitness",
      category_emoji: "💪",
      progress: 68,
      completed_count: 61,
      target_count: 90,
      start_date: "Jan 1, 2025",
      end_date: "Mar 31, 2025",
      pace: "On track",
      linkedHabits: [
        { id: "1", name: "Exercise", icon: "🏃" },
        { id: "2", name: "Drink Water", icon: "💧" },
      ],
    },
    {
      name: "Read 24 Books This Year",
      category: "Learning",
      category_emoji: "📚",
      progress: 42,
      completed_count: 10,
      target_count: 24,
      start_date: "Jan 1, 2025",
      end_date: "Dec 31, 2025",
      pace: "On track",
      linkedHabits: [
        { id: "3", name: "Read 30 min", icon: "📖" },
      ],
    },
    {
      name: "Save $5,000 Emergency Fund",
      category: "Finance",
      category_emoji: "💰",
      progress: 85,
      completed_count: 4250,
      target_count: 5000,
      start_date: "Jan 1, 2025",
      end_date: "Jun 30, 2025",
      pace: "Ahead",
      linkedHabits: [
        { id: "4", name: "Track spending", icon: "📊" },
        { id: "5", name: "No impulse buys", icon: "🛑" },
      ],
    },
    {
      name: "Learn Spanish Fluently",
      category: "Personal Growth",
      category_emoji: "🌍",
      progress: 35,
      completed_count: 105,
      target_count: 300,
      start_date: "Jan 1, 2025",
      end_date: "Dec 31, 2025",
      pace: "On track",
      linkedHabits: [
        { id: "6", name: "Practice 20 min", icon: "🗣️" },
        { id: "7", name: "Flashcards", icon: "🃏" },
      ],
    },
    {
      name: "Meditate 100 Days",
      category: "Mindfulness",
      category_emoji: "🧘",
      progress: 72,
      completed_count: 72,
      target_count: 100,
      start_date: "Jan 1, 2025",
      end_date: "Apr 10, 2025",
      pace: "Ahead",
      linkedHabits: [
        { id: "8", name: "Morning meditation", icon: "🌅" },
      ],
    },
    {
      name: "Run a Half Marathon",
      category: "Fitness",
      category_emoji: "🏅",
      progress: 55,
      completed_count: 110,
      target_count: 200,
      start_date: "Feb 1, 2025",
      end_date: "Jun 15, 2025",
      pace: "On track",
      linkedHabits: [
        { id: "9", name: "Run 5km", icon: "🏃" },
        { id: "10", name: "Stretch", icon: "🤸" },
      ],
    },
  ];

  // Duplicate goals for seamless loop
  const duplicatedGoals = [...demoGoals, ...demoGoals];

  // Adjust sizes - LARGER for onboarding to fill screen
  const titleSize = isOnboarding ? "text-2xl md:text-5xl" : "text-2xl md:text-4xl";
  const cardSize = isOnboarding ? "w-[320px] md:w-[360px]" : "w-[300px] md:w-[340px]";
  const descriptionSize = isOnboarding ? "text-sm md:text-base" : "text-base md:text-lg";

  return (
    <section className={`${isOnboarding ? 'py-4' : 'py-12'} px-4 overflow-hidden w-full`}>
      {/* Title - centered at top */}
      <div className="max-w-6xl mx-auto text-center mb-6">
        <ScrollReveal animation="fade-up">
          <h2 className={`font-display ${titleSize} font-semibold`}>
            Long-Term Goals Made <span className={`gradient-text ${isOnboarding ? 'italic' : ''}`}>ADHD-Friendly</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Goal Cards - scrolling carousel with transparency mask fade - full width */}
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
            {duplicatedGoals.map((goal, index) => (
              <GlassCard key={index} className={`p-4 hover:shadow-large transition-all duration-300 flex-shrink-0 ${cardSize}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <AppleEmoji emoji={goal.category_emoji} size="xl" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-body text-base font-semibold text-foreground line-clamp-2">
                        {goal.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{goal.category}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold gradient-text">{goal.progress}%</span>
                    <span className="text-xs font-medium text-primary">{goal.pace}</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full progress-bar-orange rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{goal.completed_count} completed</span>
                    <span>{goal.target_count} target</span>
                  </div>
                </div>

                {/* Date range */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {goal.start_date} — {goal.end_date}
                  </span>
                </div>

                {/* Linked habits */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 text-left">Linked habits:</p>
                  <div className="flex flex-wrap gap-2">
                    {goal.linkedHabits.map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/80 text-xs"
                      >
                        <AppleEmoji emoji={habit.icon} size="sm" />
                        <span className="text-foreground">{habit.name}</span>
                      </div>
                    ))}
                  </div>
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
            Break the "overcommit → burnout → quit" cycle. Goals link to daily habits with progressive buildup—start small, build gradually, actually finish things.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

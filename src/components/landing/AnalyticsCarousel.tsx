import { useEffect, useRef } from "react";
import { TrendingUp, Target, Heart, BarChart3 } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ScrollReveal } from "@/components/ScrollReveal";

// Exact replica of Overview dashboard cards
function OverviewCard({ 
  title, 
  value, 
  suffix,
  subtitle,
  icon: Icon,
  iconColor = "text-accent",
  progress,
  emoji
}: {
  title: string;
  value?: number | string;
  suffix?: string;
  subtitle?: string;
  icon: React.ElementType;
  iconColor?: string;
  progress?: number;
  emoji?: string;
}) {
  return (
    <div className="glass-card p-5 min-w-[180px] flex-shrink-0 hover:shadow-large transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        <div className={`p-2 rounded-xl bg-secondary ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      {emoji ? (
        <div className="flex items-center gap-2 mb-2">
          <AppleEmoji emoji={emoji} size="3xl" />
        </div>
      ) : (
        <div className="flex items-baseline gap-0.5 mb-2">
          <span className="text-3xl font-bold gradient-text">{value}</span>
          {suffix && <span className="text-lg font-medium text-primary/70">{suffix}</span>}
        </div>
      )}
      
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full progress-bar-orange rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Matches exact cards from Overview.tsx dashboard
const analyticsCards = [
  {
    title: "Perfect Days",
    value: 5,
    suffix: " / 7",
    subtitle: "Days completed fully this week",
    icon: Target,
    iconColor: "text-accent",
    progress: 71,
  },
  {
    title: "Mood Average",
    emoji: "🤗",
    subtitle: "Your average mood is Happy.",
    icon: Heart,
    iconColor: "text-primary",
  },
  {
    title: "Mood Stability",
    value: 7,
    suffix: " / 10",
    subtitle: "Consistency of mood",
    icon: BarChart3,
    iconColor: "text-accent",
    progress: 70,
  },
  {
    title: "This Month",
    value: 74,
    suffix: "%",
    subtitle: "December progress so far",
    icon: TrendingUp,
    iconColor: "text-primary",
    progress: 74,
  },
  {
    title: "This Week",
    value: 80,
    suffix: "%",
    subtitle: "Last 7 days",
    icon: TrendingUp,
    iconColor: "text-accent",
    progress: 80,
  },
  {
    title: "Daily Progress",
    value: 95,
    suffix: "%",
    subtitle: "Yesterday's completion",
    icon: TrendingUp,
    iconColor: "text-primary",
    progress: 95,
  },
];

interface AnalyticsCarouselProps {
  isOnboarding?: boolean;
}

export function AnalyticsCarousel({ isOnboarding = false }: AnalyticsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const speed = 0.5;

    const animate = () => {
      scrollPosition += speed;
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

  // Adjust sizes - match other screens
  const titleSize = isOnboarding ? "text-2xl md:text-4xl" : "text-2xl md:text-4xl";
  const descriptionSize = isOnboarding ? "text-sm md:text-base" : "text-base md:text-lg";
  const cardScale = isOnboarding ? "scale-110" : "";

  return (
    <section className={`${isOnboarding ? 'py-6' : 'py-8'} px-4 overflow-hidden w-full`}>
      {/* Title - centered with less space below to get closer to cards */}
      <div className={`max-w-6xl mx-auto text-center ${isOnboarding ? 'mb-2' : 'mb-6'}`}>
        <ScrollReveal animation="fade-up">
          <h2 className={`font-display ${titleSize} font-semibold`}>
            See Patterns Your <span className={`gradient-text ${isOnboarding ? 'italic' : ''}`}>ADHD Brain</span> Misses
          </h2>
        </ScrollReveal>
      </div>

      {/* Cards carousel */}
      <div className={`w-full ${isOnboarding ? 'mb-4' : 'mb-4'}`}>
        <ScrollReveal animation="zoom-in" delay={100}>
          <div 
            className="relative"
            style={isOnboarding ? { 
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            } : undefined}
          >
          <div
            ref={scrollRef}
            className={`flex gap-6 overflow-x-hidden py-2 w-full ${cardScale}`}
            style={{ 
              scrollBehavior: "auto",
              ...(isOnboarding ? {} : {
                maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              }),
              transformOrigin: 'center center',
            }}
          >
            {/* Duplicate cards for infinite scroll effect */}
            {[...analyticsCards, ...analyticsCards].map((card, index) => (
              <OverviewCard
                key={index}
                title={card.title}
                value={card.value}
                suffix={card.suffix}
                subtitle={card.subtitle}
                icon={card.icon}
                iconColor={card.iconColor}
                progress={card.progress}
                emoji={card.emoji}
              />
            ))}
          </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Description - below the cards */}
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal animation="fade-up" delay={200}>
          <p className={`text-muted-foreground ${descriptionSize} leading-relaxed`}>
            {isOnboarding 
              ? "Time blindness solved. See exactly what happened, when, and why some days felt harder. AI connects mood, habits, and consistency so you finally understand your patterns."
              : "Time blindness solved. AI shows patterns across mood, habits, and consistency—finally understand why some days feel impossible."
            }
          </p>
        </ScrollReveal>
      </div>

    </section>
  );
}
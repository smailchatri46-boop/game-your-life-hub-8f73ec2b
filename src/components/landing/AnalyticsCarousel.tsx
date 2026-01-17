import { useEffect, useRef } from "react";
import { TrendingUp, Calendar, Target, Heart, BarChart3 } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ScrollReveal } from "@/components/ScrollReveal";

// Reusing exact StatCard design from the app
function StatCardPreview({ 
  title, 
  subtitle, 
  value, 
  suffix = "%", 
  icon: Icon,
  iconColor = "text-primary",
  progress 
}: {
  title: string;
  subtitle?: string;
  value: number | string;
  suffix?: string;
  icon: React.ElementType;
  iconColor?: string;
  progress?: number;
}) {
  return (
    <div className="glass-card p-5 min-w-[200px] flex-shrink-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-xl bg-secondary ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-0.5 mb-3">
        <span className="text-3xl font-bold gradient-text">{value}</span>
        <span className="text-lg font-medium text-primary/70">{suffix}</span>
      </div>
      
      {progress !== undefined && (
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full progress-bar-orange rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Overview-style stat cards
function OverviewStatCard({ 
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
    <div className="glass-card p-5 min-w-[200px] flex-shrink-0">
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

const analyticsCards = [
  {
    component: "stat",
    title: "This Month",
    subtitle: "December progress so far",
    value: 74,
    icon: TrendingUp,
    iconColor: "text-primary",
    progress: 74,
  },
  {
    component: "stat",
    title: "This Week Average",
    subtitle: "Last 7 days",
    value: 80,
    icon: Calendar,
    iconColor: "text-accent",
    progress: 80,
  },
  {
    component: "stat",
    title: "Today",
    subtitle: "Today's progress",
    value: 95,
    icon: Target,
    iconColor: "text-primary",
    progress: 95,
  },
  {
    component: "overview",
    title: "Perfect Days",
    value: 5,
    suffix: " / 7",
    subtitle: "Days completed fully this week",
    icon: Target,
    iconColor: "text-accent",
    progress: 71,
  },
  {
    component: "overview",
    title: "Mood Average",
    emoji: "😊",
    subtitle: "Your average mood is Happy.",
    icon: Heart,
    iconColor: "text-primary",
  },
  {
    component: "overview",
    title: "Mood Stability",
    value: 7,
    suffix: " / 10",
    subtitle: "Consistency of mood",
    icon: BarChart3,
    iconColor: "text-accent",
    progress: 70,
  },
];

export function AnalyticsCarousel() {
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

    // Don't pause on hover - continue scrolling

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <section className="py-2 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4">
          Get Deep <span className="gradient-text italic">Insights</span> About Your Life
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
          Understand your progress and patterns with beautiful analytics that show you the full picture.
        </p>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-hidden py-4"
          style={{ 
            scrollBehavior: "auto",
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          }}
        >
          {/* Duplicate cards for infinite scroll effect */}
          {[...analyticsCards, ...analyticsCards].map((card, index) => (
            card.component === "stat" ? (
              <StatCardPreview 
                key={index}
                title={card.title}
                subtitle={card.subtitle}
                value={card.value!}
                icon={card.icon}
                iconColor={card.iconColor}
                progress={card.progress}
              />
            ) : (
              <OverviewStatCard
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
            )
          ))}
        </div>
      </div>
    </section>
  );
}
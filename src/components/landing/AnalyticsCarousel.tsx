import { useEffect, useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";

const analyticsCards = [
  {
    title: "This Month",
    subtitle: "December Progress So Far",
    value: "74%",
    type: "progress" as const,
  },
  {
    title: "This Week Average",
    value: "80%",
    type: "progress" as const,
  },
  {
    title: "Today's Progress",
    value: "95%",
    type: "progress" as const,
  },
  {
    title: "Perfect Days",
    value: "5/7",
    type: "stat" as const,
  },
  {
    title: "Mood Average",
    emoji: "😊",
    type: "emoji" as const,
  },
  {
    title: "Mood Stability",
    value: "7/10",
    type: "stat" as const,
  },
];

function ProgressRing({ value, size = 80 }: { value: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--secondary))"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(38 100% 70%)" />
          <stop offset="100%" stopColor="hsl(24 95% 53%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AnalyticsCard({ card }: { card: typeof analyticsCards[0] }) {
  return (
    <GlassCard className="min-w-[180px] p-5 flex flex-col items-center text-center">
      {card.type === "progress" && (
        <div className="relative mb-3">
          <ProgressRing value={parseInt(card.value || "0")} />
          <span className="absolute inset-0 flex items-center justify-center font-semibold text-lg text-foreground">
            {card.value}
          </span>
        </div>
      )}
      {card.type === "emoji" && (
        <div className="mb-3">
          <AppleEmoji emoji={card.emoji || "😊"} size="3xl" />
        </div>
      )}
      {card.type === "stat" && (
        <div className="mb-3 w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
          <span className="font-display text-2xl font-semibold gradient-text">{card.value}</span>
        </div>
      )}
      <h4 className="font-semibold text-foreground text-sm">{card.title}</h4>
      {card.subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
      )}
    </GlassCard>
  );
}

export function AnalyticsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const speed = 0.5;

    const animate = () => {
      scrollPosition += speed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
          Get Deep <span className="gradient-text italic">Insights</span> About Your Life
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Understand your progress and patterns with beautiful analytics that show you the full picture.
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-hidden py-4"
          style={{ scrollBehavior: "auto" }}
        >
          {/* Duplicate cards for infinite scroll effect */}
          {[...analyticsCards, ...analyticsCards].map((card, index) => (
            <AnalyticsCard key={index} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

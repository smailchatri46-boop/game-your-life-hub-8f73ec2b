import { OnboardingCard } from "../OnboardingCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { GlassCard } from "@/components/GlassCard";
import { MarqueeText } from "@/components/MarqueeText";
import { Check, GripVertical, Plus, ArrowUp, TrendingUp, Calendar, Target, Heart, BarChart3 } from "lucide-react";
import GlowOrb from "@/components/GlowOrb";
import { useRef, useEffect } from "react";

type FeatureVariant = "all-in-one" | "goals" | "habits" | "ai-buddy" | "insights";

interface FeatureShowcaseStepProps {
  variant: FeatureVariant;
  onNext: () => void;
  onBack: () => void;
  currentIndex: number;
  totalFeatures: number;
}

// Demo data reused from landing page
const CATEGORY_COLORS: Record<string, string> = {
  Mind: "#8B5CF6",
  Health: "#22C55E",
  Growth: "#EC4899",
  Focus: "#3B82F6",
};

const demoHabits = [
  { name: "Morning Meditation", icon: "🧘", category: "Mind", completions: [true, true, true, true, true, true, true], progress: 94 },
  { name: "Exercise", icon: "💪", category: "Health", completions: [false, true, true, false, true, true, true], progress: 68 },
  { name: "Read 30 mins", icon: "📚", category: "Growth", completions: [true, true, true, true, true, false, true], progress: 74 },
  { name: "Deep Work", icon: "🎯", category: "Focus", completions: [true, true, false, true, true, true, true], progress: 79 },
];

const demoGoals = [
  { name: "Save $5,000 Emergency Fund", category: "Finance", emoji: "💰", progress: 85, pace: "Ahead" },
  { name: "Learn Spanish Fluently", category: "Personal Growth", emoji: "🌍", progress: 35, pace: "On track" },
  { name: "Meditate 100 Days", category: "Mindfulness", emoji: "🧘", progress: 72, pace: "Ahead" },
];

const analyticsCards = [
  { title: "This Month", value: 74, icon: TrendingUp },
  { title: "This Week", value: 80, icon: Calendar },
  { title: "Today", value: 95, icon: Target },
  { title: "Perfect Days", value: "5/7", icon: Target },
  { title: "Mood", emoji: "😊", icon: Heart },
];

const suggestedQuestions = [
  { text: "Which habit do I struggle with?", emoji: "🤔" },
  { text: "Analyze my last week", emoji: "📊" },
  { text: "How can I improve?", emoji: "💡" },
];

function AllInOneContent() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <img 
          src="/images/apps-arrows.png" 
          alt="Apps flowing into Neyler" 
          className="h-32 object-contain"
        />
        <img 
          src="/images/neyler-logo-full.png" 
          alt="Neyler" 
          className="h-10 object-contain"
        />
      </div>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)] w-full max-w-[260px]">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">To-Do List</h3>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <AppleEmoji emoji="😌" size="lg" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 shadow-sm">
            <AppleEmoji emoji="💬" size="sm" />
            <span className="text-xs flex-1 text-muted-foreground line-through">Call mom</span>
            <div className="w-5 h-5 rounded-full bg-[hsl(25,60%,70%)] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white/50 text-muted-foreground border border-dashed border-muted-foreground/20">
            <Plus className="w-3 h-3" />
            <span className="text-xs">Add task</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalsContent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.4;

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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const duplicatedGoals = [...demoGoals, ...demoGoals];

  return (
    <div 
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto scrollbar-hide py-2 -mx-4 px-4"
      style={{ 
        scrollbarWidth: 'none',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      {duplicatedGoals.map((goal, index) => (
        <GlassCard key={index} className="p-3 flex-shrink-0 w-[180px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <AppleEmoji emoji={goal.emoji} size="md" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{goal.name}</p>
              <p className="text-[10px] text-muted-foreground">{goal.category}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-lg font-bold gradient-text">{goal.progress}%</span>
            <span className="text-[10px] font-medium text-primary">{goal.pace}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full progress-bar-orange rounded-full" style={{ width: `${goal.progress}%` }} />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function HabitsContent() {
  return (
    <GlassCard className="p-2 overflow-x-auto">
      <table className="w-full" style={{ minWidth: '280px' }}>
        <thead>
          <tr>
            <th className="text-left p-1.5" style={{ width: '100px' }}>
              <span className="text-[10px] font-semibold text-foreground">Habits</span>
            </th>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <th key={day} className="p-0.5 text-center">
                <span className={`text-[10px] ${day === 7 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{day}</span>
              </th>
            ))}
            <th className="p-1 text-right" style={{ width: '32px' }}>
              <span className="text-[10px] font-semibold">%</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {demoHabits.map((habit, habitIndex) => (
            <tr key={habitIndex} className="border-t border-border/30">
              <td className="p-1">
                <div className="flex items-center gap-1">
                  <AppleEmoji emoji={habit.icon} size="sm" />
                  <div className="min-w-0 flex-1">
                    <MarqueeText text={habit.name} className="text-[10px] font-medium" index={habitIndex} hideOverlay />
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[habit.category] }} />
                      <p className="text-[8px] text-muted-foreground">{habit.category}</p>
                    </div>
                  </div>
                </div>
              </td>
              {habit.completions.map((completed, dayIndex) => (
                <td key={dayIndex} className="p-0.5">
                  <div className={`w-4 h-4 mx-auto rounded flex items-center justify-center ${completed ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {completed && <Check className="w-2.5 h-2.5" />}
                  </div>
                </td>
              ))}
              <td className="p-1 text-right">
                <span className="text-[10px] font-bold gradient-text">{habit.progress}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}

function AIBuddyContent() {
  return (
    <div className="bg-card/40 backdrop-blur-xl rounded-2xl shadow-soft overflow-hidden border border-border/10 p-4">
      <div className="flex flex-col items-center justify-center text-center mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2">
          <GlowOrb />
        </div>
        <h3 className="font-display text-sm font-medium text-foreground mb-1">Start a conversation</h3>
        <p className="text-muted-foreground text-xs max-w-[200px]">
          I'm your wellness buddy <AppleEmoji emoji="🙂" size="sm" className="inline mx-0.5" /> I turn your habits into insights.
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3" style={{ scrollbarWidth: 'none' }}>
        {suggestedQuestions.map((q, i) => (
          <div key={i} className="flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-full bg-secondary/60 text-[10px] text-foreground whitespace-nowrap">
            <span>{q.text}</span>
            <AppleEmoji emoji={q.emoji} size="sm" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-full px-3 py-2 border border-orange-100/60" style={{ background: 'hsl(35 30% 97%)' }}>
        <input type="text" placeholder="Message AI Buddy..." className="flex-1 bg-transparent border-0 focus:outline-none text-xs text-foreground placeholder:text-muted-foreground" disabled />
        <button className="w-7 h-7 rounded-full text-primary-foreground flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(38 100% 70%) 0%, hsl(24 95% 53%) 100%)' }}>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function InsightsContent() {
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const duplicatedCards = [...analyticsCards, ...analyticsCards];

  return (
    <div 
      ref={scrollRef}
      className="flex gap-3 overflow-x-hidden py-2 -mx-4 px-4"
      style={{ 
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      {duplicatedCards.map((card, index) => (
        <div key={index} className="glass-card p-3 min-w-[120px] flex-shrink-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-[10px] font-semibold text-foreground">{card.title}</h4>
            <div className="p-1 rounded-lg bg-secondary text-primary">
              <card.icon className="w-3 h-3" />
            </div>
          </div>
          {card.emoji ? (
            <AppleEmoji emoji={card.emoji} size="2xl" />
          ) : (
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold gradient-text">{card.value}</span>
              {typeof card.value === 'number' && <span className="text-sm text-primary/70">%</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const FEATURE_CONFIG: Record<FeatureVariant, { emoji: string; title: React.ReactNode; description: string }> = {
  "all-in-one": {
    emoji: "🎯",
    title: <>Your all in <span className="gradient-text italic">one tracker</span></>,
    description: "Replace scattered spreadsheets, multiple AI apps, and messy notes with one beautiful solution.",
  },
  "goals": {
    emoji: "🏆",
    title: <>Set Goals and <span className="gradient-text italic">Track Them</span></>,
    description: "Create meaningful goals, link them to your daily habits, and watch your progress grow.",
  },
  "habits": {
    emoji: "📋",
    title: <>Organize Your Daily Routine <span className="gradient-text italic">Effortlessly</span></>,
    description: "Track habits and tasks in a beautiful clean style. See your progress at a glance.",
  },
  "ai-buddy": {
    emoji: "🤖",
    title: <>Analyze your progress with the <span className="gradient-text italic">AI Buddy</span></>,
    description: "AI Buddy sees all your goals, tasks, habits, and helps you see patterns and reach your goals faster.",
  },
  "insights": {
    emoji: "📊",
    title: <>Get Deep <span className="gradient-text italic">Insights</span> About Your Life</>,
    description: "Understand your progress and patterns with beautiful analytics that show you the full picture.",
  },
};

export function FeatureShowcaseStep({ variant, onNext, onBack, currentIndex, totalFeatures }: FeatureShowcaseStepProps) {
  const config = FEATURE_CONFIG[variant];

  const renderContent = () => {
    switch (variant) {
      case "all-in-one": return <AllInOneContent />;
      case "goals": return <GoalsContent />;
      case "habits": return <HabitsContent />;
      case "ai-buddy": return <AIBuddyContent />;
      case "insights": return <InsightsContent />;
    }
  };

  return (
    <OnboardingCard className="overflow-visible">
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-4">
        {Array.from({ length: totalFeatures }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-border'
            }`}
          />
        ))}
      </div>

      <div className="text-center mb-4">
        <h2 className="text-lg font-bold font-display text-foreground mb-2">
          {config.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {config.description}
        </p>
      </div>

      <div className="mb-6">
        {renderContent()}
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          size="default"
          className="h-11 px-5 border-border/30 hover:bg-secondary/50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={onNext}
          variant="gradient"
          size="default"
          className="h-11 px-6"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </OnboardingCard>
  );
}

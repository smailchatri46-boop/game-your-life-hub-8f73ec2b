import { Button } from "@/components/ui/button";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ChevronRight, Check, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
type FeatureProofVariant = 
  | "goals" 
  | "habits" 
  | "journal" 
  | "insights" 
  | "ai-buddy";

interface FeatureProofStepProps {
  variant: FeatureProofVariant;
  onNext: () => void;
  currentIndex: number;
  totalFeatures: number;
}

const CONTENT: Record<FeatureProofVariant, {
  title: string;
  subtitle: string;
}> = {
  "goals": {
    title: "Set goals and actually see progress",
    subtitle: "Turn big goals into clear steps and track them visually over time.",
  },
  "habits": {
    title: "Build habits without stress",
    subtitle: "Simple daily habits and tasks that feel doable, not overwhelming.",
  },
  "journal": {
    title: "Reflect, don't just track",
    subtitle: "Capture thoughts, moods, and reflections — all connected to your habits and goals.",
  },
  "insights": {
    title: "Understand what's really working",
    subtitle: "See patterns across mood, consistency, focus, and progress.",
  },
  "ai-buddy": {
    title: "Your AI Buddy connects the dots",
    subtitle: "Ask questions, get insights, and understand yourself better — powered by your real data.",
  },
};

// Goals Preview Component
function GoalsPreview() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)] rounded-2xl p-4 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AppleEmoji emoji="🎯" size="lg" />
            <span className="font-semibold text-foreground text-sm">Run a marathon</span>
          </div>
          <span className="text-xs text-primary font-medium">68%</span>
        </div>
        <div className="h-2 bg-white/60 rounded-full overflow-hidden">
          <div className="h-full w-[68%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-primary" />
            <span>Run 3x per week</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-primary" />
            <span>Increase distance weekly</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Habits Preview Component
function HabitsPreview() {
  const habits = [
    { emoji: "🏃", name: "Morning run", completed: true },
    { emoji: "📚", name: "Read 20 pages", completed: true },
    { emoji: "🧘", name: "Meditate", completed: false },
    { emoji: "💧", name: "Drink water", completed: true },
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-3">
        {habits.map((habit, i) => (
          <div 
            key={i}
            className={`rounded-2xl p-3 transition-all ${
              habit.completed 
                ? "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-primary/20" 
                : "bg-white/60 border-2 border-border/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <AppleEmoji emoji={habit.emoji} size="md" />
              <span className={`text-xs font-medium ${habit.completed ? "text-foreground" : "text-muted-foreground"}`}>
                {habit.name}
              </span>
            </div>
            <div className="mt-2 flex justify-end">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                habit.completed 
                  ? "bg-gradient-to-r from-amber-400 to-orange-500" 
                  : "border-2 border-muted-foreground/30"
              }`}>
                {habit.completed && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Journal Preview Component (using same style as Journal page)
function JournalPreview() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <div className="bg-journal-yellow rounded-2xl p-4 shadow-soft">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <AppleEmoji emoji="😌" size="lg" />
            <div>
              <p className="font-semibold text-foreground text-xs">January 28, 2026</p>
              <p className="text-[10px] text-muted-foreground">9:30 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-50">
            <Pencil className="w-3 h-3" />
            <Trash2 className="w-3 h-3" />
          </div>
        </div>
        <p className="text-foreground text-xs leading-relaxed">
          Feeling good about my progress today. Finally stuck with my morning routine for a whole week! 🎉
        </p>
      </div>
      <div className="bg-journal-green rounded-2xl p-4 shadow-soft">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <AppleEmoji emoji="🙏" size="lg" />
            <div>
              <p className="font-semibold text-foreground text-xs">January 27, 2026</p>
              <p className="text-[10px] text-muted-foreground">8:15 PM</p>
            </div>
          </div>
        </div>
        <p className="text-foreground text-xs leading-relaxed">
          Grateful for small wins today. Sometimes progress is quiet.
        </p>
      </div>
    </div>
  );
}

// Insights Preview Component
function InsightsPreview() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white/80 rounded-2xl p-4 shadow-soft border border-border/20">
        <div className="flex items-center gap-2 mb-4">
          <AppleEmoji emoji="📈" size="lg" />
          <span className="font-semibold text-foreground text-sm">Weekly Overview</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Habit Consistency</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-border/20 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
              </div>
              <span className="text-xs font-medium text-primary">85%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Mood Average</span>
            <div className="flex items-center gap-1">
              <AppleEmoji emoji="😊" size="sm" />
              <span className="text-xs font-medium">Happy</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Goals Progress</span>
            <span className="text-xs font-medium text-primary">+12% this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Buddy Preview Component
function AIBuddyPreview() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white/80 rounded-2xl p-4 shadow-soft border border-border/20">
        <div className="flex items-center gap-2 mb-4">
          <AppleEmoji emoji="🤖" size="lg" />
          <span className="font-semibold text-foreground text-sm">AI Buddy</span>
        </div>
        <div className="space-y-3">
          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl rounded-br-md px-3 py-2 max-w-[80%]">
              <p className="text-white text-xs">Why am I struggling with my morning routine?</p>
            </div>
          </div>
          {/* AI response */}
          <div className="flex justify-start">
            <div className="bg-secondary/50 rounded-2xl rounded-bl-md px-3 py-2 max-w-[85%]">
              <p className="text-foreground text-xs leading-relaxed">
                Looking at your data, you tend to skip mornings when you sleep less than 7 hours. Try setting a bedtime reminder! 💡
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureProofStep({ 
  variant, 
  onNext, 
  currentIndex, 
  totalFeatures 
}: FeatureProofStepProps) {
  const content = CONTENT[variant];

  // Hide scrollbar when active
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalZoom = html.style.zoom;
    
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.zoom = '1';
    
    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      html.style.zoom = originalZoom;
    };
  }, []);

  const renderPreview = () => {
    switch (variant) {
      case "goals": return <GoalsPreview />;
      case "habits": return <HabitsPreview />;
      case "journal": return <JournalPreview />;
      case "insights": return <InsightsPreview />;
      case "ai-buddy": return <AIBuddyPreview />;
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full gradient-hero flex flex-col"
      style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden' }}
    >
      {/* Top: Progress dots */}
      <div className="flex-shrink-0 flex justify-center pt-4 pb-3">
        <div className="flex gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
          {Array.from({ length: totalFeatures }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === currentIndex 
                  ? 'w-8 progress-bar-orange' 
                  : 'w-2 bg-border/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Middle: Content area */}
      <div 
        className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 py-6"
        style={{ overflow: 'hidden' }}
      >
        {/* Title & Subtitle */}
        <div className="text-center mb-6 max-w-md">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
            {content.title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {content.subtitle}
          </p>
        </div>

        {/* Preview Component */}
        <div className="animate-fade-in">
          {renderPreview()}
        </div>
      </div>

      {/* Bottom: CTA Button */}
      <div className="flex-shrink-0 flex justify-center py-5 pb-8 bg-gradient-to-t from-white/20 to-transparent">
        <Button
          onClick={onNext}
          variant="gradient"
          size="lg"
          className="h-14 px-12 text-lg shadow-xl"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}

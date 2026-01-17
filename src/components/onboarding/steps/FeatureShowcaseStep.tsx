import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";

// Import the landing page components directly
import { GoalsShowcase } from "@/components/landing/GoalsShowcase";
import { HabitsShowcase } from "@/components/landing/HabitsShowcase";
import { AIBuddyShowcase } from "@/components/landing/AIBuddyShowcase";
import { AnalyticsCarousel } from "@/components/landing/AnalyticsCarousel";

// All-in-one section from Landing page
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, Plus } from "lucide-react";

type FeatureVariant = "all-in-one" | "goals" | "habits" | "ai-buddy" | "insights";

interface FeatureShowcaseStepProps {
  variant: FeatureVariant;
  onNext: () => void;
  currentIndex: number;
  totalFeatures: number;
}

function AllInOneShowcase() {
  return (
    <section className="px-4 w-full">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display text-2xl md:text-4xl font-semibold mb-4">
          Your all in <span className="italic gradient-text">one tracker</span>
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-4">
          <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
            <img 
              src="/images/apps-arrows.png" 
              alt="Apps flowing into Neyler" 
              className="h-24 md:h-36 object-contain"
            />
            <img 
              src="/images/neyler-logo-full.png" 
              alt="Neyler" 
              className="h-8 md:h-12 object-contain"
            />
          </div>
          
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)] w-[240px] md:w-[280px]">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">To-Do List</h3>
                <p className="text-xs text-muted-foreground">
                  1 décembre 2025
                </p>
              </div>
              <AppleEmoji emoji="😌" size="lg" />
            </div>
            
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/80 shadow-sm">
                <AppleEmoji emoji="💬" size="sm" />
                <span className="text-xs flex-1 text-muted-foreground line-through text-left">
                  Call mom
                </span>
                <button className="w-4 h-4 rounded-full border-2 flex items-center justify-center bg-[hsl(25,60%,70%)] border-[hsl(25,60%,70%)]">
                  <Check className="w-2.5 h-2.5 text-white" />
                </button>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 p-2 rounded-2xl bg-white/50 hover:bg-white/70 transition-colors text-muted-foreground border-2 border-dashed border-muted-foreground/20"
              >
                <Plus className="w-3 h-3" />
                <span className="text-xs">Add task</span>
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Replace scattered spreadsheets, multiple AI apps, and messy notes with one beautiful solution.
        </p>
      </div>
    </section>
  );
}

export function FeatureShowcaseStep({ variant, onNext, currentIndex, totalFeatures }: FeatureShowcaseStepProps) {
  // Hide scrollbar on html/body when this step is active
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Store original styles
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlHeight = html.style.height;
    const originalBodyHeight = body.style.height;
    
    // Apply overflow hidden
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.height = '100%';
    body.style.height = '100%';
    
    return () => {
      // Restore original styles
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      html.style.height = originalHtmlHeight;
      body.style.height = originalBodyHeight;
    };
  }, []);

  const renderContent = () => {
    switch (variant) {
      case "all-in-one": return <AllInOneShowcase />;
      case "goals": return <GoalsShowcase isOnboarding />;
      case "habits": return <HabitsShowcase isOnboarding />;
      case "ai-buddy": return <AIBuddyShowcase isOnboarding />;
      case "insights": return <AnalyticsCarousel isOnboarding />;
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full gradient-hero flex flex-col"
      style={{ height: '100dvh', overflow: 'hidden' }}
    >
      {/* Top: Progress dots */}
      <div className="flex-shrink-0 flex justify-center pt-3 pb-2">
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

      {/* Middle: Content area - flex-1 with min-h-0 to allow shrinking */}
      <div 
        className="flex-1 min-h-0 flex items-center justify-center px-4 animate-in fade-in slide-in-from-right-4 duration-500"
        style={{ overflow: 'hidden' }}
      >
        {renderContent()}
      </div>

      {/* Bottom: CTA Button - fixed at bottom */}
      <div className="flex-shrink-0 flex justify-center py-4 pb-6">
        <Button
          onClick={onNext}
          variant="gradient"
          size="lg"
          className="h-12 px-10 text-base shadow-lg"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}

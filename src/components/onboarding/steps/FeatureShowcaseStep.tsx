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
        <h2 className="font-display text-2xl md:text-5xl font-semibold mb-6">
          Your all in <span className="italic gradient-text">one tracker</span>
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
            <img 
              src="/images/apps-arrows.png" 
              alt="Apps flowing into Neyler" 
              className="h-28 md:h-44 object-contain"
            />
            <img 
              src="/images/neyler-logo-full.png" 
              alt="Neyler" 
              className="h-10 md:h-14 object-contain"
            />
          </div>
          
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)] w-[280px] md:w-[320px]">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">To-Do List</h3>
                <p className="text-xs text-muted-foreground">
                  1 décembre 2025
                </p>
              </div>
              <AppleEmoji emoji="😌" size="xl" />
            </div>
            
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/80 shadow-sm">
                <AppleEmoji emoji="💬" size="md" />
                <span className="text-sm flex-1 text-muted-foreground line-through text-left">
                  Call mom
                </span>
                <button className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-[hsl(25,60%,70%)] border-[hsl(25,60%,70%)]">
                  <Check className="w-3 h-3 text-white" />
                </button>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-white/50 hover:bg-white/70 transition-colors text-muted-foreground border-2 border-dashed border-muted-foreground/20"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add task</span>
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Replace scattered spreadsheets, multiple AI apps, and messy notes with one beautiful solution.
        </p>
      </div>
    </section>
  );
}

export function FeatureShowcaseStep({ variant, onNext, currentIndex, totalFeatures }: FeatureShowcaseStepProps) {
  // Hide scrollbar and reset zoom on html/body when this step is active
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Store original styles
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlHeight = html.style.height;
    const originalBodyHeight = body.style.height;
    const originalZoom = html.style.zoom;
    
    // Apply overflow hidden and reset zoom for proper viewport calculation
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.height = '100%';
    body.style.height = '100%';
    html.style.zoom = '1'; // Reset zoom to prevent button from being pushed off screen
    
    return () => {
      // Restore original styles
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      html.style.height = originalHtmlHeight;
      body.style.height = originalBodyHeight;
      html.style.zoom = originalZoom;
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

      {/* Middle: Content area - flex-1 with min-h-0 to allow shrinking */}
      <div 
        className="flex-1 min-h-0 flex items-center justify-center px-4 animate-in fade-in slide-in-from-right-4 duration-500"
        style={{ overflow: 'hidden' }}
      >
        {renderContent()}
      </div>

      {/* Bottom: CTA Button - ALWAYS visible */}
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

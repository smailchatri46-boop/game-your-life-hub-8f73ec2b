import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRef, useEffect } from "react";

// Import the landing page components directly
import { GoalsShowcase } from "@/components/landing/GoalsShowcase";
import { HabitsShowcase } from "@/components/landing/HabitsShowcase";
import { AIBuddyShowcase } from "@/components/landing/AIBuddyShowcase";
import { AnalyticsCarousel } from "@/components/landing/AnalyticsCarousel";

// All-in-one section from Landing page
import { AppleEmoji } from "@/components/AppleEmoji";
import { Check, Plus } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

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
        <h2 className="font-display text-3xl md:text-5xl font-semibold mb-8">
          Your all in <span className="italic gradient-text">one tracker</span>
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
            <img 
              src="/images/apps-arrows.png" 
              alt="Apps flowing into Neyler" 
              className="h-32 md:h-48 object-contain"
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
  const renderContent = () => {
    switch (variant) {
      case "all-in-one": return <AllInOneShowcase />;
      case "goals": return <GoalsShowcase />;
      case "habits": return <HabitsShowcase />;
      case "ai-buddy": return <AIBuddyShowcase />;
      case "insights": return <AnalyticsCarousel />;
    }
  };

  return (
    <div className="h-screen flex flex-col gradient-hero overflow-hidden fixed inset-0">
      {/* Progress dots at top with white background pill */}
      <div className="flex justify-center pt-6 pb-4">
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

      {/* Main content - centered, no scroll */}
      <div className="flex-1 flex items-center justify-center overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
        {renderContent()}
      </div>

      {/* Centered Next button at bottom - fixed position */}
      <div className="flex justify-center pb-8 pt-4 flex-shrink-0">
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

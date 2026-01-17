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
    <section className="py-10 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <ScrollReveal animation="fade-up">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">
            Your all in <span className="italic gradient-text">one tracker</span>
          </h2>
        </ScrollReveal>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-8">
          <ScrollReveal animation="fade-right" delay={100}>
            <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
              <img 
                src="/images/apps-arrows.png" 
                alt="Apps flowing into Neyler" 
                className="h-48 md:h-64 object-contain"
              />
              <img 
                src="/images/neyler-logo-full.png" 
                alt="Neyler" 
                className="h-12 md:h-16 object-contain"
              />
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-left" delay={200}>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[hsl(30,70%,96%)] to-[hsl(25,60%,92%)] w-[320px] md:w-[360px]">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">To-Do List</h3>
                  <p className="text-sm text-muted-foreground">
                    1 décembre 2025
                  </p>
                </div>
                <AppleEmoji emoji="😌" size="2xl" />
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-sm">
                  <AppleEmoji emoji="💬" size="lg" />
                  <span className="text-sm flex-1 text-muted-foreground line-through text-left">
                    Call mom
                  </span>
                  <button className="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[hsl(25,60%,70%)] border-[hsl(25,60%,70%)]">
                    <Check className="w-4 h-4 text-white" />
                  </button>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/50 hover:bg-white/70 transition-colors text-muted-foreground border-2 border-dashed border-muted-foreground/20"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add task</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
        
        <ScrollReveal animation="fade-up" delay={300}>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Replace scattered spreadsheets, multiple AI apps, and messy notes with one beautiful solution.
          </p>
        </ScrollReveal>
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
    <div className="min-h-screen flex flex-col gradient-hero">
      {/* Progress dots at top */}
      <div className="flex justify-center gap-2 pt-6 pb-4">
        {Array.from({ length: totalFeatures }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border/60'
            }`}
          />
        ))}
      </div>

      {/* Main content - full width, exact landing page layout */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-right-4 duration-500">
        {renderContent()}
      </div>

      {/* Centered Next button at bottom */}
      <div className="flex justify-center pb-8 pt-4">
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

import { Target, Heart, BarChart3, TrendingUp } from "lucide-react";
import { AppleEmoji } from "@/components/AppleEmoji";
import { ScrollReveal } from "@/components/ScrollReveal";

export function OverviewCardsShowcase() {
  return (
    <section className="py-8 px-4 overflow-hidden w-full">
      {/* Title */}
      <div className="max-w-6xl mx-auto text-center mb-6">
        <ScrollReveal animation="fade-up">
          <h2 className="font-display text-2xl md:text-4xl font-semibold">
            See Patterns Your <span className="gradient-text">ADHD Brain</span> Misses
          </h2>
        </ScrollReveal>
      </div>

      {/* Cards grid - exact same layout as Overview page */}
      <div className="max-w-6xl mx-auto">
        <ScrollReveal animation="zoom-in" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 - Today */}
            <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Today</h3>
                </div>
                <div className="p-2 rounded-xl bg-secondary text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-0.5 mb-2">
                <span className="text-3xl font-bold gradient-text">92</span>
                <span className="text-lg font-medium text-primary/70">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Today's progress</p>
              <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full progress-bar-orange rounded-full transition-all duration-500"
                  style={{ width: '92%' }}
                />
              </div>
            </div>

            {/* Card 2 - Perfect Days */}
            <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Perfect Days</h3>
                </div>
                <div className="p-2 rounded-xl bg-secondary text-accent">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-0.5 mb-2">
                <span className="text-3xl font-bold gradient-text">6</span>
                <span className="text-lg font-medium text-primary/70"> / 7</span>
              </div>
              <p className="text-xs text-muted-foreground">Days completed fully this week</p>
              <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full progress-bar-orange rounded-full transition-all duration-500"
                  style={{ width: `${(6 / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* Card 3 - Mood Average */}
            <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Mood Average</h3>
                </div>
                <div className="p-2 rounded-xl bg-secondary text-primary">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <AppleEmoji emoji="😊" size="3xl" />
              </div>
              <p className="text-xs text-muted-foreground">
                Your average mood is <span className="font-bold">Happy</span>.
              </p>
            </div>

            {/* Card 4 - Mood Stability */}
            <div className="glass-card p-5 min-w-[180px] hover:shadow-large transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Mood Stability</h3>
                </div>
                <div className="p-2 rounded-xl bg-secondary text-accent">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-0.5 mb-2">
                <span className="text-3xl font-bold gradient-text">8</span>
                <span className="text-lg font-medium text-primary/70"> / 10</span>
              </div>
              <p className="text-xs text-muted-foreground">Consistency of mood</p>
              <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full progress-bar-orange rounded-full transition-all duration-500"
                  style={{ width: '80%' }}
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Description */}
      <div className="max-w-3xl mx-auto text-center mt-6">
        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Time blindness solved. AI shows patterns across mood, habits, and consistency—finally understand why some days feel impossible.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

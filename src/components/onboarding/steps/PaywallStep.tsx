import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { cn } from "@/lib/utils";
import { usePolarCheckout } from "@/hooks/use-polar-checkout";
import type { BillingPeriod } from "@/lib/polar";

interface PaywallStepProps {
  commitmentName: string;
}

const FEATURES = [
  { text: "Unlimited habits & tasks", included: true },
  { text: "Unlimited goals", included: true },
  { text: "Unlimited to-do lists", included: true },
  { text: "Full AI Buddy chat access", included: true },
  { text: "AI habit insights & recommendations", included: true },
  { text: "AI trend analysis", included: true },
  { text: "Deep analytics dashboard", included: true },
  { text: "Streak protection", included: true },
  { text: "Priority updates", included: true },
];

const FEATURE_CARDS = [
  {
    emoji: "🎯",
    title: "Habits & Tasks Tracking",
    description: "Track your daily habits and tasks with a beautiful spreadsheet-style grid.",
  },
  {
    emoji: "🎯",
    title: "Set Goals & Track Them",
    description: "Create meaningful goals, connect them to your daily habits.",
  },
  {
    emoji: "🤖",
    title: "AI-Powered Deep Analytics",
    description: "AI analyzes all your goals, tasks, and habits for personalized insights.",
  },
  {
    emoji: "📊",
    title: "Analytics",
    description: "Beautiful charts and insights to understand your patterns and growth.",
  },
  {
    emoji: "📝",
    title: "Add One-Time Tasks Too",
    description: "Add to-do lists and one-time tasks to track your entire day.",
  },
  {
    emoji: "💬",
    title: "AI Buddy Chat",
    description: "Get personalized guidance and motivation from your AI companion.",
  },
];

export function PaywallStep({ commitmentName }: PaywallStepProps) {
  const [isYearly, setIsYearly] = useState(true);
  const { openCheckout, isLoading } = usePolarCheckout({ theme: "light" });

  const monthlyPrice = 9;
  const yearlyPrice = 49;
  const displayPrice = isYearly ? Math.floor(yearlyPrice / 12) : monthlyPrice;

  const handleSubscribe = () => {
    const period: BillingPeriod = isYearly ? "yearly" : "monthly";
    openCheckout("pro", period);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto gradient-hero">
      <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8 max-w-2xl">
          <div className="flex justify-center mb-4">
            <AppleEmoji emoji="✨" size="3xl" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            It's time to invest in <span className="gradient-text italic">yourself</span>
            {commitmentName ? `, ${commitmentName}` : ""}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            You've taken the first step. Now unlock everything you need to transform your life.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-md mb-10">
          <div className="relative rounded-3xl p-6 lg:p-8 glass-card">
            {/* Gradient border */}
            <div 
              className="absolute inset-0 rounded-3xl -z-10 p-[2px]"
              style={{
                background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
              }}
            >
              <div className="w-full h-full rounded-3xl bg-background" />
            </div>

            {/* Plan Header */}
            <div className="text-center mb-5">
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-1.5">
                Pro
              </h3>
              <p className="text-muted-foreground text-sm">Unlock the full experience</p>
            </div>

            {/* Monthly/Yearly Toggle */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  !isYearly ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-transparent [&[data-state=checked]>span]:bg-white"
                style={{
                  background: isYearly 
                    ? 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))'
                    : undefined,
                }}
              />
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isYearly ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Yearly
                <span className="ml-1.5 text-xs text-primary font-semibold">
                  Save 55%
                </span>
              </span>
            </div>

            {/* Price */}
            <div className="text-center mb-5">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl lg:text-5xl font-bold text-foreground">
                  ${displayPrice}
                </span>
                <span className="text-muted-foreground text-sm">
                  / month
                </span>
              </div>
              {isYearly && (
                <p className="text-primary text-sm font-medium mt-1.5">
                  Pay only ${yearlyPrice}/year
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-5" />

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="text-sm leading-tight text-foreground">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              variant="gradient"
              className="w-full h-12 text-base shadow-md hover:shadow-lg hover:opacity-90"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              Start your journey now
            </Button>

            {/* Guarantee Text */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Cancel anytime • 7-day money-back guarantee
            </p>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="w-full max-w-5xl mb-10">
          <h2 className="font-display text-xl md:text-2xl font-semibold text-center mb-6">
            Everything you need to <span className="gradient-text italic">succeed</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURE_CARDS.map((card, index) => (
              <GlassCard key={index} className="p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-3">
                  <AppleEmoji emoji={card.emoji} size="xl" />
                </div>
                <h3 className="font-display text-base font-semibold mb-1.5">{card.title}</h3>
                <p className="text-muted-foreground text-xs">
                  {card.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="w-full max-w-md text-center pb-8">
          <Button
            variant="gradient"
            className="w-full h-12 text-base shadow-md hover:shadow-lg hover:opacity-90"
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            Start your journey now
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

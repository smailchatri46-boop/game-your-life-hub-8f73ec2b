import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { cn } from "@/lib/utils";
import { usePolarCheckout } from "@/hooks/use-polar-checkout";
import type { BillingPeriod } from "@/lib/polar";

interface PaywallStepProps {
  commitmentName?: string;
}

const FEATURE_CARDS = [
  {
    emoji: "🎯",
    title: "Habits & Tasks Tracking",
    description: "Track your daily habits and one-time tasks with a beautiful spreadsheet-style grid. See your progress at a glance and link them directly to your goals.",
  },
  {
    emoji: "🎯",
    title: "Set Goals & Track Them",
    description: "Create meaningful goals, connect them to your daily habits, and see your progress toward them in a clear, visual way that keeps you motivated.",
  },
  {
    emoji: "🤖",
    title: "AI-Powered Deep Analytics",
    description: "AI analyzes all your goals, tasks, and habits to give you personalized structure, actionable insights, and expert guidance to achieve your goals faster.",
  },
  {
    emoji: "📊",
    title: "Beautiful Analytics",
    description: "Beautiful charts and insights to understand your patterns, mood trends, and growth over time. See the full picture of your progress.",
  },
  {
    emoji: "📝",
    title: "Add One-Time Tasks Too",
    description: "Add to-do lists and one-time tasks alongside your habits, so you don't need any other app to track what you do throughout your day.",
  },
  {
    emoji: "💬",
    title: "AI Buddy",
    description: "Your personal AI companion that understands your habits, goals, and journal entries to provide personalized motivation and insights.",
  },
];

const COUNTDOWN_MINUTES = 45;

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const stored = localStorage.getItem("paywall_countdown_end");
    if (stored) {
      const endTime = parseInt(stored, 10);
      const remaining = Math.max(0, endTime - Date.now());
      return remaining;
    }
    // Set new countdown (45 minutes)
    const endTime = Date.now() + COUNTDOWN_MINUTES * 60 * 1000;
    localStorage.setItem("paywall_countdown_end", endTime.toString());
    return COUNTDOWN_MINUTES * 60 * 1000;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("paywall_countdown_end");
      if (stored) {
        const endTime = parseInt(stored, 10);
        const remaining = Math.max(0, endTime - Date.now());
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isExpired: timeLeft === 0 };
}

export function PaywallStep({ commitmentName }: PaywallStepProps) {
  const [step, setStep] = useState<"features" | "payment">("features");
  const [isYearly, setIsYearly] = useState(true);
  const { openCheckout, isLoading } = usePolarCheckout({ theme: "light" });
  const { minutes, seconds } = useCountdown();

  const monthlyPrice = 14;
  const yearlyPrice = 7;
  const originalPrice = 29;

  const displayPrice = isYearly ? yearlyPrice : monthlyPrice;

  const handleSubscribe = () => {
    const period: BillingPeriod = isYearly ? "yearly" : "monthly";
    openCheckout("pro", period);
  };

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  // Step 1: Features Section
  if (step === "features") {
    return (
      <div className="fixed inset-0 overflow-y-auto gradient-hero">
        <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
          {/* Feature Cards Section */}
          <div className="w-full max-w-5xl">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-center mb-10">
              Unlock everything you need to succeed
            </h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {FEATURE_CARDS.map((card, index) => (
                <GlassCard key={index} className="p-6 h-full" hover>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center mb-4">
                    <AppleEmoji emoji={card.emoji} size="2xl" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">
                    {card.title.includes("&") ? (
                      <>
                        {card.title.split("&")[0]}
                        <span className="font-body">&amp;</span>
                        {card.title.split("&")[1]}
                      </>
                    ) : (
                      card.title
                    )}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.description}
                  </p>
                </GlassCard>
              ))}
            </div>

            {/* CTA Button */}
            <div className="w-full max-w-[540px] mx-auto">
              <Button
                variant="gradient"
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
                onClick={() => setStep("payment")}
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Payment Section
  return (
    <div className="fixed inset-0 overflow-y-auto gradient-hero">
      <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2 tracking-tight">
            It's time to invest in yourself
            {commitmentName ? `, ${commitmentName}` : ""}
          </h1>
        </div>

        {/* Pricing Card with Badge */}
        <div className="w-full max-w-[540px] relative">
          {/* Countdown Badge - positioned at top of card */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 -top-5 z-10 rounded-full px-5 py-2.5 text-white font-medium text-sm shadow-lg whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
            }}
          >
            This discount ends in{" "}
            <span className="font-bold">
              {formatTime(minutes)}:{formatTime(seconds)}
            </span>
          </div>
          
          <div className="relative rounded-2xl p-8 lg:p-10 bg-card border border-border/50 shadow-xl flex flex-col justify-center pt-10">
            {/* Monthly/Yearly Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
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
                  Save 50%
                </span>
              </span>
            </div>

            {/* Price Display */}
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="relative text-3xl text-muted-foreground">
                  ${originalPrice}
                  <span 
                    className="absolute left-[-4px] right-[-4px] top-1/2 h-[2px] bg-destructive rounded-full"
                    style={{ transform: 'rotate(-12deg)' }}
                  />
                </span>
                <span className="text-5xl lg:text-6xl font-bold text-foreground">
                  ${displayPrice}
                </span>
                <span className="text-muted-foreground text-lg">
                  /mo
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isYearly ? "Billed yearly" : "Billed monthly"}
              </p>
            </div>

            {/* CTA Button */}
            <Button
              variant="gradient"
              className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

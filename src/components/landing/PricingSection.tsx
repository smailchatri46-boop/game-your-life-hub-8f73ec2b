import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  subtitle: string;
  features: PlanFeature[];
  benefitText: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    subtitle: "Good for people just starting out",
    benefitText: "Perfect if you're just beginning your self-improvement journey.",
    features: [
      { text: "Up to 2 habits & tasks", included: true },
      { text: "Up to 1 quarterly or yearly goal", included: true },
      { text: "Add up to 3 one-time tasks per day", included: true },
      { text: "Mood tracking", included: true },
      { text: "Progress charts and streaks", included: true },
      { text: "Reflections & basic analytics", included: true },
      { text: "AI chat access", included: false },
    ],
  },
  {
    name: "Core",
    monthlyPrice: 5,
    yearlyPrice: 25,
    subtitle: "Great for people getting serious about their habits",
    benefitText: "Great if you want more structure and motivation day-to-day.",
    features: [
      { text: "Up to 6 habits & tasks", included: true },
      { text: "Unlimited to-do lists", included: true },
      { text: "Up to 4 quarterly or yearly goals", included: true },
      { text: "Mood tracking", included: true },
      { text: "Reflections journal", included: true },
      { text: "Progress charts and streaks", included: true },
      { text: "Basic analytics", included: true },
      { text: "AI chat access", included: false },
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 9,
    yearlyPrice: 49,
    subtitle: "Unlock the full AI experience",
    benefitText: "Everything in Neyler unlocked, plus full AI guidance.",
    popular: true,
    features: [
      { text: "Unlimited habits & tasks", included: true },
      { text: "Unlimited goals", included: true },
      { text: "Unlimited to-do lists", included: true },
      { text: "Full AI Buddy chat access", included: true },
      { text: "AI habit insights & recommendations", included: true },
      { text: "AI trend analysis", included: true },
      { text: "Deep analytics dashboard", included: true },
      { text: "Streak protection", included: true },
      { text: "Priority updates", included: true },
    ],
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const getPrice = (plan: Plan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getPriceLabel = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return "Free";
    return `$${getPrice(plan)}`;
  };

  const getPeriodLabel = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return "forever";
    return isYearly ? "/ year" : "/ month";
  };

  const getSavings = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return null;
    const yearlySavings = plan.monthlyPrice * 12 - plan.yearlyPrice;
    return yearlySavings;
  };

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Plans & Pricing
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Choose the plan that fits your journey
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
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
              className="data-[state=checked]:bg-primary"
            />
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Yearly
              <span className="ml-1.5 text-xs text-primary font-semibold">
                Save more
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-3xl p-6 lg:p-8 transition-all duration-300",
                plan.popular
                  ? "bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 shadow-xl scale-[1.02] md:scale-105 border-2 border-primary/30"
                  : "glass-card hover:shadow-lg"
              )}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl lg:text-5xl font-bold text-foreground">
                    {getPriceLabel(plan)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {getPeriodLabel(plan)}
                  </span>
                </div>
                {isYearly && getSavings(plan) && (
                  <p className="text-primary text-sm font-medium mt-2">
                    Save ${getSavings(plan)} per year
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        feature.included
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Benefit Text */}
              <p className="text-xs text-muted-foreground text-center mb-6 italic">
                {plan.benefitText}
              </p>

              {/* CTA Button */}
              <Button
                variant={plan.popular ? "gradient" : "outline"}
                className={cn(
                  "w-full",
                  plan.popular
                    ? "shadow-md hover:shadow-lg"
                    : "hover:bg-primary/10 hover:border-primary/50"
                )}
              >
                {plan.monthlyPrice === 0 ? "Start for free" : "Get started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

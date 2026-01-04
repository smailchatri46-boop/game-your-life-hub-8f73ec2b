import { useState } from "react";
import { Check, X } from "lucide-react";
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

  const getMonthlyEquivalent = (plan: Plan) => {
    if (plan.monthlyPrice === 0 || !isYearly) return null;
    const monthlyEquivalent = (plan.yearlyPrice / 12).toFixed(2);
    return `Pay only $${monthlyEquivalent}/month`;
  };

  return (
    <section className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            <span className="font-display">Plans</span>
            <span className="font-body">&nbsp;&amp;&nbsp;</span>
            <span className="font-display">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Choose the plan that fits your journey
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-3xl p-5 lg:p-6 transition-all duration-300",
                plan.popular
                  ? "bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 shadow-xl scale-[1.02] md:scale-105"
                  : "glass-card hover:shadow-lg"
              )}
              style={plan.popular ? {
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
                position: 'relative',
              } : undefined}
            >
              {/* Gradient border for Pro plan */}
              {plan.popular && (
                <div 
                  className="absolute inset-0 rounded-3xl -z-10"
                  style={{
                    background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                    margin: '-2px',
                    borderRadius: 'calc(1.5rem + 2px)',
                  }}
                />
              )}

              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center justify-center bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-4">
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl lg:text-4xl font-bold text-foreground">
                    {getPriceLabel(plan)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {getPeriodLabel(plan)}
                  </span>
                </div>
                {getMonthlyEquivalent(plan) && (
                  <p className="text-primary text-sm font-medium mt-1.5">
                    {getMonthlyEquivalent(plan)}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

              {/* Features */}
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    {feature.included ? (
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-muted flex items-center justify-center mt-0.5">
                        <X className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                    )}
                    <span
                      className={cn(
                        "text-sm leading-tight",
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
              <p className="text-xs text-muted-foreground text-center mb-4 italic">
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

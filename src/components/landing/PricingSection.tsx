import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { usePolarCheckout } from "@/hooks/use-polar-checkout";
import { useAuth } from "@/contexts/AuthContext";
import type { PlanType, BillingPeriod } from "@/lib/polar";

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
    name: "Pro",
    monthlyPrice: 9,
    yearlyPrice: 49,
    subtitle: "Unlock the full experience",
    benefitText: "Everything in Neyler unlocked.",
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
  const [isYearly, setIsYearly] = useState(true);
  const { openCheckout, isLoading } = usePolarCheckout({ theme: "light" });
  const { user } = useAuth();
  const navigate = useNavigate();

  const getPrice = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return 0;
    // When yearly is selected, show the monthly equivalent as the main price
    if (isYearly) {
      return Math.floor(plan.yearlyPrice / 12);
    }
    return plan.monthlyPrice;
  };

  const getPriceLabel = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return "Free";
    return `$${getPrice(plan)}`;
  };

  const getPeriodLabel = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return "forever";
    return "/ month";
  };

  const getYearlyTotal = (plan: Plan) => {
    if (plan.monthlyPrice === 0 || !isYearly) return null;
    return `Pay only $${plan.yearlyPrice}/year`;
  };

  const handleGetStarted = () => {
    const period: BillingPeriod = isYearly ? "yearly" : "monthly";

    // If user is not logged in, store the selected plan and redirect to auth
    if (!user) {
      localStorage.setItem("neyler_pending_plan", JSON.stringify({ plan: "pro", period }));
      navigate("/auth");
      return;
    }

    // Open Pro checkout
    openCheckout("pro", period);
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
                Save more
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex justify-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{ maxWidth: '400px' }}
              className={cn(
                "relative rounded-3xl p-6 lg:p-8 transition-all duration-300 glass-card flex flex-col",
                plan.popular
                  ? "shadow-xl scale-[1.02] md:scale-105"
                  : "hover:shadow-lg"
              )}
            >
              {/* Gradient border for Pro plan */}
              {plan.popular && (
                <div 
                  className="absolute inset-0 rounded-3xl -z-10 p-[2px]"
                  style={{
                    background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                  }}
                >
                  <div className="w-full h-full rounded-3xl bg-background" />
                </div>
              )}

              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div 
                    className="flex items-center justify-center text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                    }}
                  >
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-5">
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-1.5">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-5">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl lg:text-4xl font-bold text-foreground">
                    {getPriceLabel(plan)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {getPeriodLabel(plan)}
                  </span>
                </div>
                {getYearlyTotal(plan) && (
                  <p className="text-primary text-sm font-medium mt-1.5">
                    {getYearlyTotal(plan)}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-5" />

              {/* Features - flex-grow to push content below to bottom */}
              <ul className="space-y-3 mb-5 flex-grow">
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
              <p className="text-xs text-muted-foreground text-center mb-5 italic">
                {plan.benefitText}
              </p>

              {/* CTA Button */}
              <Button
                variant={plan.popular ? "gradient" : "outline"}
                className={cn(
                  "w-full mt-auto",
                  plan.popular
                    ? "shadow-md hover:shadow-lg hover:opacity-90"
                    : "hover:bg-muted hover:border-muted-foreground/30"
                )}
                onClick={() => handleGetStarted()}
                disabled={isLoading}
              >
                Get started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

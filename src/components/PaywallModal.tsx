import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LimitType } from "@/hooks/use-plan-limits";

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
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "Core",
    monthlyPrice: 5,
    yearlyPrice: 25,
    subtitle: "Ideal for tracking your whole life",
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
    subtitle: "Build lasting habits with AI coaching",
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

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType: LimitType;
  limitMessage: string;
}

export function PaywallModal({ open, onOpenChange, limitType, limitMessage }: PaywallModalProps) {
  const [isYearly, setIsYearly] = useState(true);
  const [showOtherPlans, setShowOtherPlans] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  const proPlan = plans.find(p => p.name === "Pro")!;
  const corePlan = plans.find(p => p.name === "Core")!;

  // Reset countdown and state when modal opens
  useEffect(() => {
    if (open) {
      setCountdown(5);
      setCanClose(false);
      setShowOtherPlans(false);
    }
  }, [open]);

  // Countdown timer
  useEffect(() => {
    if (!open || canClose) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, canClose]);

  const handleClose = () => {
    if (canClose) {
      onOpenChange(false);
    }
  };

  const getPrice = (plan: Plan) => {
    if (isYearly) {
      return (plan.yearlyPrice / 12).toFixed(2);
    }
    return plan.monthlyPrice;
  };

  const getSavingsPercent = (plan: Plan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = ((monthlyTotal - plan.yearlyPrice) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  return (
    <Dialog open={open} onOpenChange={canClose ? onOpenChange : () => {}}>
      <DialogContent 
        className="w-[90vw] max-w-[720px] max-h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-[hsl(30,100%,98%)] to-[hsl(25,80%,95%)] border-0" 
        hideCloseButton={!canClose}
      >
        <div className="p-5 md:p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
              Subscribe to unlock more
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto">
              {limitMessage}
            </p>

            {/* Monthly/Yearly Toggle */}
            <div className="flex items-center justify-center gap-3 mt-3 mb-6">
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
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
                  "text-xs font-medium transition-colors flex items-center gap-1.5",
                  isYearly ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Yearly
                <span 
                  className="text-[10px] text-white font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                  }}
                >
                  55% off
                </span>
              </span>
            </div>
          </div>

          {/* Pro Plan - Primary View */}
          {!showOtherPlans ? (
            <div className="max-w-sm mx-auto">
              <div
                className="relative rounded-xl p-5 transition-all duration-300 bg-white/80 backdrop-blur-sm flex flex-col shadow-lg"
              >
                {/* Gradient border for Pro plan */}
                <div 
                  className="absolute inset-0 rounded-xl -z-10 p-[2px]"
                  style={{
                    background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                  }}
                >
                  <div className="w-full h-full rounded-xl bg-white" />
                </div>

                {/* Best Value Badge */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <div 
                    className="flex items-center justify-center text-primary-foreground px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                    }}
                  >
                    Best Value
                  </div>
                </div>

                {/* Plan Header */}
                <div className="text-center mb-2 pt-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {proPlan.name}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-tight">{proPlan.subtitle}</p>
                </div>

                {/* Price - fixed height container */}
                <div className="text-center mb-3 h-[52px] flex flex-col justify-center">
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="text-3xl font-bold text-foreground">
                      {isYearly ? "$4" : `$${proPlan.monthlyPrice}`}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /{isYearly ? "month" : "mo"}
                    </span>
                  </div>
                  <p className={cn(
                    "text-primary text-xs font-medium mt-0.5",
                    isYearly ? "visible" : "invisible"
                  )}>
                    Pay only $49/year
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-3" />

                {/* Features */}
                <ul className="space-y-1.5 mb-4">
                  {proPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <span className="text-xs leading-tight text-foreground">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant="gradient"
                  size="default"
                  className="w-full shadow-md hover:shadow-lg hover:opacity-90"
                >
                  Unlock Pro
                </Button>

                {/* Trust Line - closer to button */}
                <p className="text-center text-[10px] text-muted-foreground mt-2">
                  Cancel anytime.
                </p>
              </div>

              {/* View other plans - always visible below card */}
              <div className="text-center mt-5 pb-2">
                <button
                  onClick={() => setShowOtherPlans(true)}
                  className="text-sm text-muted-foreground hover:font-semibold transition-all px-4 py-2"
                >
                  View other plans
                </button>
              </div>
            </div>
          ) : (
            /* Both Plans View */
            <div>
              <div className="grid grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={cn(
                      "relative rounded-xl p-4 transition-all duration-300 bg-white/80 backdrop-blur-sm flex flex-col",
                      plan.popular
                        ? "shadow-lg"
                        : "hover:shadow-md"
                    )}
                  >
                    {/* Gradient border for Pro plan */}
                    {plan.popular && (
                      <div 
                        className="absolute inset-0 rounded-xl -z-10 p-[2px]"
                        style={{
                          background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                        }}
                      >
                        <div className="w-full h-full rounded-xl bg-white" />
                      </div>
                    )}

                    {/* Best Value Badge for Pro */}
                    {plan.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <div 
                          className="flex items-center justify-center text-primary-foreground px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                          }}
                        >
                          Best Value
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-2 pt-1">
                      <h3 className="text-base font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-muted-foreground text-[10px] leading-tight">{plan.subtitle}</p>
                    </div>

                    {/* Price - fixed height */}
                    <div className="text-center mb-2 h-[44px] flex flex-col justify-center">
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-2xl font-bold text-foreground">
                          {isYearly ? `$${Math.round(plan.yearlyPrice / 12)}` : `$${plan.monthlyPrice}`}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          /{isYearly ? "mo" : "mo"}
                        </span>
                      </div>
                      <p className={cn(
                        "text-primary text-[10px] font-medium",
                        isYearly ? "visible" : "invisible"
                      )}>
                        Pay only ${plan.yearlyPrice}/year
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-2" />

                    {/* Features */}
                    <ul className="space-y-1 mb-3 flex-grow">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          {feature.included ? (
                            <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                              <Check className="w-2 h-2 text-primary" />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                              <X className="w-2 h-2 text-muted-foreground" />
                            </div>
                          )}
                          <span
                            className={cn(
                              "text-[11px] leading-tight",
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

                    {/* CTA Button */}
                    <Button
                      variant={plan.popular ? "gradient" : "outline"}
                      size="sm"
                      className={cn(
                        "w-full text-xs h-9",
                        plan.popular
                          ? "shadow-md hover:shadow-lg hover:opacity-90"
                          : "hover:bg-muted hover:border-muted-foreground/30"
                      )}
                    >
                      {plan.popular ? "Unlock Pro" : "Get Core"}
                    </Button>

                    {/* Trust Line */}
                    <p className={cn(
                      "text-center text-[9px] text-muted-foreground mt-2",
                      plan.popular ? "visible" : "invisible"
                    )}>
                      Cancel anytime.
                    </p>
                  </div>
                ))}
              </div>

              {/* Back link */}
              <div className="text-center mt-5 pb-2">
                <button
                  onClick={() => setShowOtherPlans(false)}
                  className="text-sm text-muted-foreground hover:font-semibold transition-all px-4 py-2"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

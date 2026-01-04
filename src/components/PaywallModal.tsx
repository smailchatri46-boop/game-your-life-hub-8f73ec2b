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
    subtitle: "Great for people getting serious about tracking their lives",
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
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  // Reset countdown when modal opens
  useEffect(() => {
    if (open) {
      setCountdown(5);
      setCanClose(false);
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
      return Math.floor(plan.yearlyPrice / 12);
    }
    return plan.monthlyPrice;
  };

  const getYearlyTotal = (plan: Plan) => {
    if (!isYearly) return null;
    return `Pay only $${plan.yearlyPrice}/year`;
  };

  return (
    <Dialog open={open} onOpenChange={canClose ? onOpenChange : () => {}}>
      <DialogContent 
        className="sm:max-w-2xl p-0 overflow-hidden bg-gradient-to-br from-[hsl(30,100%,98%)] to-[hsl(25,80%,95%)] border-0" 
        hideCloseButton={!canClose}
      >
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
              Subscribe to unlock more
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto">
              {limitMessage}
            </p>

            {/* Monthly/Yearly Toggle */}
            <div className="flex items-center justify-center gap-3 mt-3">
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
                className="data-[state=checked]:bg-transparent [&[data-state=checked]>span]:bg-white scale-90"
                style={{
                  background: isYearly 
                    ? 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))'
                    : undefined,
                }}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isYearly ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Yearly
                <span className="ml-1 text-[10px] text-primary font-semibold">
                  Save more
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-2 gap-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-xl p-3 transition-all duration-300 bg-white/80 backdrop-blur-sm flex flex-col",
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

                {/* Most Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <div 
                      className="flex items-center justify-center text-primary-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, hsl(25 95% 60%), hsl(35 100% 65%), hsl(25 95% 55%))',
                      }}
                    >
                      Most Popular
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

                {/* Price */}
                <div className="text-center mb-2">
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="text-2xl font-bold text-foreground">
                      ${getPrice(plan)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      /mo
                    </span>
                  </div>
                  {getYearlyTotal(plan) && (
                    <p className="text-primary text-[10px] font-medium">
                      {getYearlyTotal(plan)}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-2" />

                {/* Features */}
                <ul className="space-y-1 mb-2 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      {feature.included ? (
                        <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <Check className="w-2 h-2 text-primary" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-3 h-3 rounded-full bg-muted flex items-center justify-center mt-0.5">
                          <X className="w-2 h-2 text-muted-foreground" />
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-[10px] leading-tight",
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
                    "w-full mt-auto text-xs h-8",
                    plan.popular
                      ? "shadow-md hover:shadow-lg hover:opacity-90"
                      : "hover:bg-muted hover:border-muted-foreground/30"
                  )}
                >
                  Get started
                </Button>
              </div>
            ))}
          </div>

          {/* Close button with countdown */}
          <div className="mt-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={!canClose}
              className="text-muted-foreground hover:text-foreground text-xs h-7"
            >
              {canClose ? "Close" : `Wait ${countdown}s to close`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

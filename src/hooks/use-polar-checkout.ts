import { useState, useCallback, useRef } from "react";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { getCheckoutLink, type PlanType, type BillingPeriod } from "@/lib/polar";
import { toast } from "sonner";

interface UsePolarCheckoutOptions {
  theme?: "light" | "dark";
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePolarCheckout(options: UsePolarCheckoutOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme = "light", onSuccess, onError } = options;
  const currentPlanRef = useRef<PlanType | null>(null);

  const openCheckout = useCallback(
    async (plan: PlanType, period: BillingPeriod) => {
      setIsLoading(true);
      currentPlanRef.current = plan;

      try {
        const checkoutLink = getCheckoutLink(plan, period);
        const checkout = await PolarEmbedCheckout.create(checkoutLink, theme);

        // Listen for when checkout is loaded
        checkout.addEventListener("loaded", () => {
          console.log("Checkout loaded");
        });

        // Listen for when checkout has been confirmed (payment processing)
        checkout.addEventListener("confirmed", () => {
          console.log("Order confirmed, processing payment");
        });

        // Listen for successful payment
        checkout.addEventListener("success", () => {
          // Update the plan in localStorage
          if (currentPlanRef.current) {
            localStorage.setItem("neyler_current_plan", currentPlanRef.current);
          }
          toast.success("Payment successful! Welcome to your new plan.");
          onSuccess?.();
        });

        // Listen for when checkout is closed
        checkout.addEventListener("close", () => {
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Failed to open checkout:", error);
        const err = error instanceof Error ? error : new Error("Checkout failed");
        toast.error("Failed to open checkout. Please try again.");
        onError?.(err);
        setIsLoading(false);
      }
    },
    [theme, onSuccess, onError]
  );

  return {
    openCheckout,
    isLoading,
  };
}

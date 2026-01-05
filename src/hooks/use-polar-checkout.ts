import { useState, useCallback } from "react";
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
  const { theme = "dark", onSuccess, onError } = options;

  const openCheckout = useCallback(
    async (plan: PlanType, period: BillingPeriod) => {
      setIsLoading(true);

      try {
        const checkoutLink = getCheckoutLink(plan, period);
        const checkout = await PolarEmbedCheckout.create(checkoutLink, theme);
        
        // Listen for successful payment
        checkout.addEventListener("success", () => {
          toast.success("Payment successful! Welcome to your new plan.");
          onSuccess?.();
        });

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

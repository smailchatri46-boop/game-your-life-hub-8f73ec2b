import { useState, useCallback } from "react";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { getProductId, type PlanType, type BillingPeriod } from "@/lib/polar";
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
        const productId = getProductId(plan, period);
        // Polar checkout link format
        const checkoutLink = `https://polar.sh/checkout/${productId}`;

        await PolarEmbedCheckout.create(checkoutLink, theme);
        onSuccess?.();
      } catch (error) {
        console.error("Failed to open checkout:", error);
        const err = error instanceof Error ? error : new Error("Checkout failed");
        toast.error("Failed to open checkout. Please try again.");
        onError?.(err);
      } finally {
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

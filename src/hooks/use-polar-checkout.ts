import { useState, useCallback } from "react";
import { getCheckoutLink, type PlanType, type BillingPeriod } from "@/lib/polar";
import { toast } from "sonner";

interface UsePolarCheckoutOptions {
  theme?: "light" | "dark";
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePolarCheckout(options: UsePolarCheckoutOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme = "light", onError } = options;

  const openCheckout = useCallback(
    async (plan: PlanType, period: BillingPeriod) => {
      setIsLoading(true);

      try {
        const checkoutLink = getCheckoutLink(plan, period);
        
        // Add theme parameter and redirect to full page checkout
        const url = new URL(checkoutLink);
        url.searchParams.set("theme", theme);
        
        // Redirect to full-page Polar checkout
        window.location.href = url.toString();
      } catch (error) {
        console.error("Failed to open checkout:", error);
        const err = error instanceof Error ? error : new Error("Checkout failed");
        toast.error("Failed to open checkout. Please try again.");
        onError?.(err);
        setIsLoading(false);
      }
    },
    [theme, onError]
  );

  return {
    openCheckout,
    isLoading,
  };
}

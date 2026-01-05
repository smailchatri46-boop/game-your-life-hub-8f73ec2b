import { useState, useCallback, useRef, useEffect } from "react";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { getCheckoutLink, type PlanType, type BillingPeriod } from "@/lib/polar";
import { toast } from "sonner";

interface UsePolarCheckoutOptions {
  theme?: "light" | "dark";
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type CheckoutInstance = Awaited<ReturnType<typeof PolarEmbedCheckout.create>>;

export function usePolarCheckout(options: UsePolarCheckoutOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme = "dark", onSuccess, onError } = options;
  const checkoutInstanceRef = useRef<CheckoutInstance | null>(null);

  // Clean up checkout instance on unmount
  useEffect(() => {
    return () => {
      if (checkoutInstanceRef.current) {
        checkoutInstanceRef.current.close();
        checkoutInstanceRef.current = null;
      }
    };
  }, []);

  const openCheckout = useCallback(
    async (plan: PlanType, period: BillingPeriod) => {
      setIsLoading(true);

      try {
        const checkoutLink = getCheckoutLink(plan, period);
        const checkout = await PolarEmbedCheckout.create(checkoutLink, theme);
        
        checkoutInstanceRef.current = checkout;

        // Listen for when checkout is loaded
        checkout.addEventListener("loaded", () => {
          console.log("Checkout loaded");
        });

        // Listen for when checkout has been confirmed (payment processing)
        checkout.addEventListener("confirmed", () => {
          console.log("Order confirmed, processing payment");
        });

        // Listen for successful payment
        checkout.addEventListener("success", (event) => {
          toast.success("Payment successful! Welcome to your new plan.");
          onSuccess?.();
          checkoutInstanceRef.current = null;
        });

        // Listen for when checkout is closed
        checkout.addEventListener("close", () => {
          setIsLoading(false);
          checkoutInstanceRef.current = null;
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

  const closeCheckout = useCallback(() => {
    if (checkoutInstanceRef.current) {
      checkoutInstanceRef.current.close();
    }
  }, []);

  return {
    openCheckout,
    closeCheckout,
    isLoading,
  };
}

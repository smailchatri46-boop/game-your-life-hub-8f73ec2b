import { useState, useCallback, useEffect, useRef } from "react";
import { getCheckoutLink, type PlanType, type BillingPeriod } from "@/lib/polar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getReferralId, clearReferralId } from "@/hooks/use-referral";

interface UsePolarCheckoutOptions {
  theme?: "light" | "dark";
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Track referral when a purchase is made
async function trackReferralConversion(email: string | null, amount: number) {
  const referralId = getReferralId();

  if (!referralId) {
    console.log("No referral ID found, skipping affiliate tracking");
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke("track-referral", {
      body: {
        referralId,
        email: email || undefined,
        amount,
      },
    });

    if (error) {
      console.error("Failed to track referral:", error);
      return;
    }

    console.log("Referral tracked successfully:", data);
    clearReferralId();
  } catch (err) {
    console.error("Error tracking referral:", err);
  }
}

export function usePolarCheckout(options: UsePolarCheckoutOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme = "light", onError } = options;
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetLoading = useCallback(() => {
    setIsLoading(false);
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  // Reset loading state whenever the user returns to the tab/window
  // (e.g. comes back from Polar checkout without completing payment)
  useEffect(() => {
    const handleFocus = () => resetLoading();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") resetLoading();
    };
    const handlePageShow = () => resetLoading();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handlePageShow);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [resetLoading]);

  const openCheckout = useCallback(
    async (plan: PlanType, period: BillingPeriod, userEmail?: string | null) => {
      setIsLoading(true);

      // Safety timeout: never let the button stay disabled forever
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 10000);

      try {
        const checkoutLink = getCheckoutLink(plan, period);

        const url = new URL(checkoutLink);
        url.searchParams.set("theme", theme);

        const successUrl = `${window.location.origin}/payment-success`;
        url.searchParams.set("success_url", successUrl);

        let amount = 0;
        if (plan === "pro") {
          amount = period === "yearly" ? 34.99 : 4.9;
        }

        if (amount > 0) {
          await trackReferralConversion(userEmail || null, amount);
        }

        window.location.href = url.toString();
      } catch (error) {
        console.error("Failed to open checkout:", error);
        const err = error instanceof Error ? error : new Error("Checkout failed");
        toast.error("Failed to open checkout. Please try again.");
        onError?.(err);
        resetLoading();
      }
    },
    [theme, onError, resetLoading]
  );

  return {
    openCheckout,
    isLoading,
  };
}

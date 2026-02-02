import { useState, useCallback, useEffect } from "react";
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
        amount, // in dollars
      },
    });

    if (error) {
      console.error("Failed to track referral:", error);
      return;
    }

    console.log("Referral tracked successfully:", data);
    // Clear the referral ID after successful tracking
    clearReferralId();
  } catch (err) {
    console.error("Error tracking referral:", err);
  }
}

export function usePolarCheckout(options: UsePolarCheckoutOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme = "light", onError } = options;

  const openCheckout = useCallback(
    async (plan: PlanType, period: BillingPeriod, userEmail?: string | null) => {
      setIsLoading(true);

      try {
        const checkoutLink = getCheckoutLink(plan, period);
        
        // Add theme parameter and redirect to full page checkout
        const url = new URL(checkoutLink);
        url.searchParams.set("theme", theme);
        
        // Add success URL to redirect to payment success page after payment
        const successUrl = `${window.location.origin}/payment-success`;
        url.searchParams.set("success_url", successUrl);
        
        // Calculate the amount based on plan and period for affiliate tracking
        // These amounts should match your Polar pricing
        let amount = 0;
        if (plan === "pro") {
          amount = period === "yearly" ? 85 : 14; // $85/year or $14/month
        }
        
        // Track the referral before redirecting
        if (amount > 0) {
          await trackReferralConversion(userEmail || null, amount);
        }
        
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

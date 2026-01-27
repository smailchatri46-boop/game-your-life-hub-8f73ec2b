import { useEffect } from "react";

const REFERRAL_STORAGE_KEY = "endorsely_referral";

declare global {
  interface Window {
    endorsely_referral?: string;
  }
}

/**
 * Hook to capture and store Endorsely referral ID from affiliate links
 */
export function useReferral() {
  useEffect(() => {
    // Check for referral ID from Endorsely script
    const checkForReferral = () => {
      const referralId = window.endorsely_referral;
      
      if (referralId) {
        // Store in localStorage for later use during checkout
        localStorage.setItem(REFERRAL_STORAGE_KEY, referralId);
        console.log("Referral ID captured:", referralId);
      }
    };

    // Check immediately
    checkForReferral();

    // Also check after a short delay (script may load async)
    const timeout = setTimeout(checkForReferral, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
}

/**
 * Get the stored referral ID
 */
export function getReferralId(): string | null {
  return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

/**
 * Clear the stored referral ID (after successful tracking)
 */
export function clearReferralId(): void {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

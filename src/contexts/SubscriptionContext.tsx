import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionInfo {
  isActive: boolean;
  plan: "monthly" | "yearly" | null;
  customerId: string | null;
  subscriptionId: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  status: string | null;
}

interface SubscriptionContextType {
  subscription: SubscriptionInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
  applyDiscount: (discountCode: string) => Promise<{ success: boolean; error?: string }>;
}

const defaultSubscription: SubscriptionInfo = {
  isActive: false,
  plan: null,
  customerId: null,
  subscriptionId: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  status: null,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user?.email || !session?.access_token) {
      setSubscription(defaultSubscription);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the user's JWT token for authentication
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscription?action=status`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch subscription status");
      }

      const subscriptionData = await response.json();
      setSubscription(subscriptionData);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch subscription");
      setSubscription(defaultSubscription);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email, session?.access_token]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const cancelSubscription = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!subscription?.subscriptionId || !session?.access_token) {
      return { success: false, error: "No active subscription" };
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscription`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "cancel",
            subscriptionId: subscription.subscriptionId,
          }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        await fetchSubscription();
      }
      
      return result;
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      return { success: false, error: err instanceof Error ? err.message : "Failed to cancel" };
    }
  }, [subscription?.subscriptionId, session?.access_token, fetchSubscription]);

  const applyDiscount = useCallback(async (discountCode: string): Promise<{ success: boolean; error?: string }> => {
    if (!subscription?.subscriptionId || !session?.access_token) {
      return { success: false, error: "No active subscription" };
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscription`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "apply-discount",
            subscriptionId: subscription.subscriptionId,
            discountCode,
          }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        await fetchSubscription();
      }
      
      return result;
    } catch (err) {
      console.error("Error applying discount:", err);
      return { success: false, error: err instanceof Error ? err.message : "Failed to apply discount" };
    }
  }, [subscription?.subscriptionId, session?.access_token, fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        refetch: fetchSubscription,
        cancelSubscription,
        applyDiscount,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

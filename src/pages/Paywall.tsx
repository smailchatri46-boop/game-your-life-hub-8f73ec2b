import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PaywallStep } from "@/components/onboarding/steps/PaywallStep";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Paywall() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { subscription, isLoading: subLoading } = useSubscription();

  useEffect(() => {
    // If not authenticated, redirect to auth
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
      return;
    }

    // If user has active subscription, redirect to dashboard
    if (!subLoading && subscription?.isActive) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, subscription, subLoading, navigate]);

  // Show loading while checking
  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render paywall if user has subscription (will redirect)
  if (subscription?.isActive) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Upgrade to Pro | Neyler</title>
        <meta
          name="description"
          content="Unlock unlimited habits, goals, AI coaching and more with Neyler Pro."
        />
      </Helmet>
      <PaywallStep commitmentName="" />
    </>
  );
}

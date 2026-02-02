import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { OnboardingFlow } from "@/components/onboarding";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Onboarding() {
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
    // They've already paid, so they should go straight to the app
    if (!subLoading && subscription?.isActive) {
      localStorage.setItem("locked_onboarding_complete", "true");
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

  // Don't render onboarding if user has subscription (will redirect)
  if (subscription?.isActive) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Welcome to Locked | Start Your Journey</title>
        <meta
          name="description"
          content="Get started with Locked - your personal space for building habits, tracking goals, and becoming the best version of yourself."
        />
      </Helmet>
      <OnboardingFlow />
    </>
  );
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useEffect, useState } from "react";
import { hasCompletedOnboarding as checkDbOnboarding } from "@/services/supabase/onboarding";

/**
 * Handles root path redirect for authenticated users.
 * - Authenticated users without onboarding -> /onboarding
 * - Authenticated users without subscription -> /paywall
 * - Authenticated users with subscription -> /dashboard
 * - Unauthenticated users → Landing page (passed as children)
 */
interface AuthRedirectProps {
  children: React.ReactNode;
}

// Helper to check if onboarding has been completed locally
function hasCompletedOnboardingLocally(): boolean {
  return (
    localStorage.getItem("locked_onboarding_complete") === "true" ||
    localStorage.getItem("locked_onboarding_skipped") === "true"
  );
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  // Check onboarding status for authenticated users
  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user?.id) {
        setCheckingOnboarding(false);
        return;
      }

      // First check localStorage for quick response
      if (hasCompletedOnboardingLocally()) {
        setOnboardingComplete(true);
        setCheckingOnboarding(false);
        return;
      }

      // Then check database
      try {
        const dbComplete = await checkDbOnboarding(user.id);
        if (dbComplete) {
          localStorage.setItem("locked_onboarding_complete", "true");
        }
        setOnboardingComplete(dbComplete);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setOnboardingComplete(false);
      } finally {
        setCheckingOnboarding(false);
      }
    }

    if (user?.id) {
      checkOnboardingStatus();
    } else {
      setCheckingOnboarding(false);
    }
  }, [user?.id]);

  // Show loading spinner while checking auth/subscription for authenticated users
  if (loading || (user && (checkingOnboarding || subscriptionLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is authenticated and on root, redirect appropriately
  if (user && location.pathname === "/") {
    // Step 1: Users who haven't completed onboarding go to onboarding
    if (!onboardingComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // Step 2: Users who completed onboarding but have no subscription go to paywall
    if (!subscription?.isActive) {
      return <Navigate to="/paywall" replace />;
    }
    
    // Step 3: Users with active subscription go to /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, show the landing page
  return <>{children}</>;
}

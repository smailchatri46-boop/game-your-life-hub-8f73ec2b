import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { hasCompletedOnboarding as checkDbOnboarding } from "@/services/supabase/onboarding";
import { useSubscription } from "@/contexts/SubscriptionContext";

/**
 * Redirects authenticated users away from auth pages.
 * New users -> onboarding
 * Users without subscription -> paywall (after onboarding)
 * Users with subscription -> /dashboard
 */
interface AuthGuardProps {
  children: React.ReactNode;
}

// Helper to check if onboarding has been completed locally
function hasCompletedOnboardingLocally(): boolean {
  return (
    localStorage.getItem("locked_onboarding_complete") === "true" ||
    localStorage.getItem("locked_onboarding_skipped") === "true"
  );
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  // Check database for onboarding completion status
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
          // Sync localStorage with database
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

  // Show loading state
  if (loading || checkingOnboarding || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is authenticated, redirect appropriately
  if (user) {
    // Step 1: Users who haven't completed onboarding go to onboarding
    if (!onboardingComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // Step 2: Users who completed onboarding but have no active subscription go to paywall
    if (!subscription?.isActive) {
      return <Navigate to="/paywall" replace />;
    }
    
    // Step 3: Returning users with active subscription go to /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated, show the auth page
  return <>{children}</>;
}

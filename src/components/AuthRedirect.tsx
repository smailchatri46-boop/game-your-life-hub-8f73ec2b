import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

/**
 * Handles root path redirect for authenticated users.
 * Uses the centralized onboarding check from AuthContext (no duplicate DB calls).
 */
interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading, isNewUser, onboardingChecked } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Show nothing while loading to prevent flash
  if (loading || !onboardingChecked || subscriptionLoading) {
    return null;
  }

  // If user is authenticated and on root, redirect appropriately
  if (user && location.pathname === "/") {
    // Step 1: Users who haven't completed onboarding go to onboarding
    if (isNewUser) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // Step 2: Users who completed onboarding but have no subscription go to paywall
    if (!subscription?.isActive) {
      return <Navigate to="/paywall" replace />;
    }
    
    // Step 3: Users with active subscription go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, show the landing page
  return <>{children}</>;
}

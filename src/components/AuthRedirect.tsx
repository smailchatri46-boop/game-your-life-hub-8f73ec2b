import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

/**
 * Handles root path redirect for authenticated users.
 * Uses cached onboarding status from AuthContext (no extra DB calls).
 * - Authenticated users without onboarding -> /onboarding
 * - Authenticated users without subscription -> /paywall
 * - Authenticated users with subscription -> /dashboard
 * - Unauthenticated users → Landing page (passed as children)
 */
interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading, onboardingComplete } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Show nothing while auth is loading to prevent flash
  if (loading) {
    return null;
  }

  // If user is authenticated and on root, redirect appropriately
  if (user && location.pathname === "/") {
    // Step 1: Users who haven't completed onboarding go to onboarding
    if (onboardingComplete === false) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // Step 2: Wait for subscription only after onboarding is confirmed complete
    if (onboardingComplete === true) {
      // Still loading subscription? Show nothing briefly
      if (subscriptionLoading) {
        return null;
      }
      
      // Users who completed onboarding but have no subscription go to paywall
      if (!subscription?.isActive) {
        return <Navigate to="/paywall" replace />;
      }
      
      // Users with active subscription go to dashboard
      return <Navigate to="/dashboard" replace />;
    }
    
    // Onboarding status still loading (null) - show nothing
    if (onboardingComplete === null) {
      return null;
    }
  }

  // Otherwise, show the landing page
  return <>{children}</>;
}

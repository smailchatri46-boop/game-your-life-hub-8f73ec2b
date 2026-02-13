import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

/**
 * Redirects authenticated users away from auth pages.
 * Uses the centralized onboarding check from AuthContext (no duplicate DB calls).
 */
interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, isNewUser, onboardingChecked } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Show loading state
  if (loading || !onboardingChecked || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is authenticated, redirect appropriately
  if (user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    
    // Step 1: Users who haven't completed onboarding go to onboarding
    if (isNewUser) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // Step 2: Users who completed onboarding but have no active subscription go to paywall
    if (!subscription?.isActive) {
      return <Navigate to="/paywall" replace />;
    }
    
    // Step 3: If there's a valid "from" destination, redirect there
    if (from && from !== "/auth" && from !== "/login" && from !== "/signup" && from !== "/onboarding" && from !== "/paywall") {
      return <Navigate to={from} replace />;
    }
    
    // Step 4: Returning users with active subscription go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated, show the auth page
  return <>{children}</>;
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

/**
 * Redirects authenticated users away from auth pages.
 * Uses cached onboarding status from AuthContext (no extra DB calls).
 * New users -> onboarding
 * Users without subscription -> paywall (after onboarding)
 * Users with subscription -> dashboard
 */
interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, onboardingComplete } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Show loading state only while auth is loading
  // Don't wait for subscription if user hasn't completed onboarding
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is authenticated, redirect appropriately
  if (user) {
    // Check if there's an intended destination (but not auth pages)
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    
    // Step 1: Users who haven't completed onboarding go to onboarding
    if (onboardingComplete === false) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // Step 2: Wait for subscription check only after onboarding is complete
    if (onboardingComplete === true) {
      // Still loading subscription? Show spinner briefly
      if (subscriptionLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        );
      }
      
      // Users who completed onboarding but have no active subscription go to paywall
      if (!subscription?.isActive) {
        return <Navigate to="/paywall" replace />;
      }
      
      // If there's a valid "from" destination, redirect there
      if (from && from !== "/auth" && from !== "/login" && from !== "/signup" && from !== "/onboarding" && from !== "/paywall") {
        return <Navigate to={from} replace />;
      }
      
      // Returning users with active subscription go to dashboard
      return <Navigate to="/dashboard" replace />;
    }
    
    // Onboarding status still loading (null) - wait briefly
    if (onboardingComplete === null) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
  }

  // Not authenticated, show the auth page
  return <>{children}</>;
}

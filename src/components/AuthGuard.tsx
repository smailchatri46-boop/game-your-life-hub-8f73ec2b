import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Redirects authenticated users away from auth pages.
 * Preserves intended destination for post-login redirect.
 * New users are always sent to onboarding first.
 */
interface AuthGuardProps {
  children: React.ReactNode;
}

// Helper to check if onboarding has been completed
function hasCompletedOnboarding(): boolean {
  return (
    localStorage.getItem("locked_onboarding_complete") === "true" ||
    localStorage.getItem("locked_onboarding_skipped") === "true"
  );
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, isNewUser } = useAuth();
  const location = useLocation();

  // Show loading state
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
    
    // Check if user has completed onboarding
    const onboardingComplete = hasCompletedOnboarding();
    
    // New users OR users who haven't completed onboarding go to onboarding
    if (isNewUser === true || !onboardingComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // If there's a valid "from" destination, redirect there
    if (from && from !== "/auth" && from !== "/login" && from !== "/signup" && from !== "/onboarding") {
      return <Navigate to={from} replace />;
    }
    
    // Returning users who completed onboarding go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated, show the auth page
  return <>{children}</>;
}

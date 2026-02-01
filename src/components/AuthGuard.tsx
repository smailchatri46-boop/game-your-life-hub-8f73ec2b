import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Redirects authenticated users away from auth pages.
 * Preserves intended destination for post-login redirect.
 */
interface AuthGuardProps {
  children: React.ReactNode;
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
    // Check if there's an intended destination
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    
    if (from && from !== "/auth" && from !== "/login" && from !== "/signup") {
      return <Navigate to={from} replace />;
    }

    // New users go to onboarding, returning users go to dashboard
    if (isNewUser === true) {
      return <Navigate to="/onboarding" replace />;
    }
    
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated, show the auth page
  return <>{children}</>;
}

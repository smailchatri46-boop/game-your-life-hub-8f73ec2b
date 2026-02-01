import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Handles root path redirect for authenticated users.
 * - Authenticated users → /dashboard
 * - Unauthenticated users → Landing page (passed as children)
 */
interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while loading to prevent flash
  if (loading) {
    return null;
  }

  // If user is authenticated and on root, redirect to dashboard
  if (user && location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, show the landing page
  return <>{children}</>;
}

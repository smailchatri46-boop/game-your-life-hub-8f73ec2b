import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionGateProps {
  children: ReactNode;
}

// Map URL paths to internal page names for localStorage sync
const pathToPage: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/overview': 'overview',
  '/journal': 'journal',
  '/goals': 'goals',
  '/tutorials': 'tutorials',
  '/video-tutorial': 'video-tutorial',
  '/settings': 'settings',
};

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { subscription, isLoading } = useSubscription();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  // Sync URL path to localStorage for page persistence when accessing via legacy URLs
  useEffect(() => {
    const page = pathToPage[location.pathname];
    if (page) {
      localStorage.setItem('neyler_current_page', page);
    }
  }, [location.pathname]);

  // Replace URL with /app for clean URL experience (only once after navigation is stable)
  useEffect(() => {
    if (location.pathname !== '/app' && pathToPage[location.pathname]) {
      // Use timeout to avoid interfering with React Router's navigation
      const timer = setTimeout(() => {
        window.history.replaceState(null, '', '/app');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Show loading while checking auth and subscription
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to paywall if no active subscription
  if (!subscription?.isActive) {
    return <Navigate to="/paywall" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

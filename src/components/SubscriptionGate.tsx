import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionGateProps {
  children: ReactNode;
}

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { subscription, isLoading } = useSubscription();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

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

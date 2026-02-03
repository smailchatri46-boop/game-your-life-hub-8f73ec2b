import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import { CheckCircle } from "lucide-react";

/**
 * Payment success callback page.
 * After Polar checkout completes, users are redirected here.
 * This page polls for subscription status and redirects to dashboard once active.
 */
export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { subscription, isLoading: subLoading, refetch } = useSubscription();
  const [pollCount, setPollCount] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const MAX_POLLS = 15; // Poll up to 15 times (30 seconds total)
  const POLL_INTERVAL = 2000; // 2 seconds

  // Mark onboarding as complete immediately when landing on this page
  // since they've just completed payment
  useEffect(() => {
    localStorage.setItem("locked_onboarding_complete", "true");
  }, []);

  useEffect(() => {
    // If not authenticated, redirect to auth
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
      return;
    }
  }, [user, authLoading, navigate]);

  // Stable redirect function
  const redirectToDashboard = useCallback(() => {
    if (redirecting) return;
    setRedirecting(true);
    console.log("Payment confirmed! Redirecting to dashboard...");
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1000);
  }, [navigate, redirecting]);

  useEffect(() => {
    // If subscription is already active, redirect immediately
    if (!subLoading && subscription?.isActive) {
      redirectToDashboard();
      return;
    }

    // Poll for subscription status if not active yet
    if (!subLoading && !subscription?.isActive && pollCount < MAX_POLLS && user && !redirecting) {
      const timer = setTimeout(() => {
        console.log(`Polling for subscription status... (${pollCount + 1}/${MAX_POLLS})`);
        refetch();
        setPollCount((prev) => prev + 1);
      }, POLL_INTERVAL);

      return () => clearTimeout(timer);
    }

    // If max polls reached without success, still redirect to dashboard
    // The subscription edge function might have a delay, but user has paid
    if (pollCount >= MAX_POLLS && !redirecting) {
      console.log("Max polls reached, redirecting to dashboard anyway (payment completed)");
      redirectToDashboard();
    }
  }, [subscription, subLoading, pollCount, refetch, user, redirecting, redirectToDashboard]);

  return (
    <>
      <Helmet>
        <title>Payment Successful | Neyler</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-muted-foreground text-lg">
            {redirecting 
              ? "Redirecting you to your dashboard..."
              : "Setting up your account..."}
          </p>
          
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          
          {pollCount > 5 && !subscription?.isActive && !redirecting && (
            <p className="text-sm text-muted-foreground">
              This may take a moment. Please don't close this page.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

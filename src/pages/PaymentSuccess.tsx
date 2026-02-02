import { useEffect, useState } from "react";
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
  const MAX_POLLS = 10; // Poll up to 10 times (20 seconds total)

  useEffect(() => {
    // If not authenticated, redirect to auth
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // If subscription is already active, redirect immediately
    if (!subLoading && subscription?.isActive) {
      setRedirecting(true);
      // Mark onboarding as complete since they've paid
      localStorage.setItem("locked_onboarding_complete", "true");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500); // Brief delay to show success message
      return;
    }

    // Poll for subscription status if not active yet
    if (!subLoading && !subscription?.isActive && pollCount < MAX_POLLS && user) {
      const timer = setTimeout(() => {
        console.log(`Polling for subscription status... (${pollCount + 1}/${MAX_POLLS})`);
        refetch();
        setPollCount((prev) => prev + 1);
      }, 2000); // Poll every 2 seconds

      return () => clearTimeout(timer);
    }

    // If max polls reached without success, redirect to dashboard anyway
    // The subscription gate will handle the redirect if still not active
    if (pollCount >= MAX_POLLS && !redirecting) {
      console.log("Max polls reached, redirecting to dashboard");
      localStorage.setItem("locked_onboarding_complete", "true");
      navigate("/dashboard", { replace: true });
    }
  }, [subscription, subLoading, pollCount, refetch, navigate, user, redirecting]);

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
          
          {pollCount > 3 && !subscription?.isActive && (
            <p className="text-sm text-muted-foreground">
              This may take a moment. Please don't close this page.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

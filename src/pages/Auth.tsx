import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { usePolarCheckout } from "@/hooks/use-polar-checkout";
import { toast } from "sonner";
import googleLogo from "@/assets/google-logo.png";
import type { PlanType, BillingPeriod } from "@/lib/polar";

interface PendingPlan {
  plan: PlanType | "starter";
  period: BillingPeriod;
}

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [checkoutShown, setCheckoutShown] = useState(false);
  
  const { openCheckout } = usePolarCheckout({ 
    theme: "light",
    onSuccess: () => {
      // After successful payment, clear pending plan and go to onboarding
      localStorage.removeItem("neyler_pending_plan");
      navigate("/onboarding");
    }
  });

  useEffect(() => {
    if (!loading && user && !checkoutShown) {
      // User just logged in - check for pending plan
      const pendingPlanStr = localStorage.getItem("neyler_pending_plan");
      
      if (pendingPlanStr) {
        try {
          const pendingPlan: PendingPlan = JSON.parse(pendingPlanStr);
          
          if (pendingPlan.plan === "starter") {
            // Free plan - just go to onboarding
            localStorage.setItem("neyler_current_plan", "free");
            localStorage.removeItem("neyler_pending_plan");
            navigate("/onboarding");
          } else {
            // Paid plan - show checkout
            setCheckoutShown(true);
            // Update the plan in localStorage based on selection
            const planType = pendingPlan.plan === "core" ? "core" : "pro";
            localStorage.setItem("neyler_current_plan", planType);
            openCheckout(pendingPlan.plan, pendingPlan.period);
          }
        } catch {
          // Invalid pending plan, go to onboarding
          localStorage.removeItem("neyler_pending_plan");
          navigate("/onboarding");
        }
      } else {
        // No pending plan, go to dashboard
        navigate("/dashboard");
      }
    }
  }, [user, loading, navigate, openCheckout, checkoutShown]);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error("Failed to sign in with Google. Please try again.");
      console.error("Google sign-in error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero overflow-hidden flex flex-col">
      <LandingNavbar />
      
      <section className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <GlassCard className="p-8" glow>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-display text-3xl font-semibold">Welcome to</span>
                <img 
                  src="/images/neyler-logo-full.png" 
                  alt="Neyler" 
                  className="h-8 w-auto object-contain"
                  loading="eager"
                />
              </div>
              <p className="text-muted-foreground">
                {isSignUp ? "Sign up to start your journey to a better life" : "Sign in to continue your journey"}
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full gap-3"
                onClick={handleGoogleSignIn}
              >
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <img src={googleLogo} alt="Google" className="w-4 h-4" loading="eager" width={16} height={16} />
                </span>
                Continue with Google
              </Button>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
            
            <p className="text-center text-xs text-muted-foreground mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

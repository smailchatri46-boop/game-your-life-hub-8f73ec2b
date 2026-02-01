import { useState } from "react";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import googleLogo from "@/assets/google-logo.png";

export default function Auth() {
  const { loading, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error("Failed to sign in with Google. Please try again.");
      console.error("Google sign-in error:", error);
      setIsSigningIn(false);
    }
    // Note: Don't set isSigningIn to false on success because we're redirecting
  };

  if (loading || isSigningIn) {
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

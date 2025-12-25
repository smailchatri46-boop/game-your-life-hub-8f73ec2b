import { LandingNavbar } from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSkipToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      <LandingNavbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <GlassCard className="p-8" glow>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-semibold mb-2">
                Join <span className="gradient-text">Locked.</span>
              </h1>
              <p className="text-muted-foreground">
                Start your journey to a better life
              </p>
            </div>
            
            <div className="space-y-4">
              <Button variant="gradient" size="lg" className="w-full gap-3">
                <span>👤</span>
                Sign up with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    or for testing
                  </span>
                </div>
              </div>
              
              <Button 
                variant="glass" 
                size="lg" 
                className="w-full"
                onClick={handleSkipToDashboard}
              >
                Skip to Dashboard →
              </Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

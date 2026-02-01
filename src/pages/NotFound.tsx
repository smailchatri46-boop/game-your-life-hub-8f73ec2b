import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { AppleEmoji } from "@/components/AppleEmoji";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full text-center p-8">
        <div className="mb-6">
          <AppleEmoji emoji="🔍" size="3xl" />
        </div>
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! This page doesn't exist
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for might have been moved or doesn't exist.
        </p>
        <Button asChild variant="gradient" size="lg" className="gap-2">
          <Link to="/">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </GlassCard>
    </div>
  );
};

export default NotFound;

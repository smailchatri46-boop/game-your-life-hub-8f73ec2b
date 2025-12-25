import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="glass-card px-4 py-3 flex items-center justify-between">
        <Link to="/" className="px-2 font-display text-xl font-semibold gradient-text">
          Locked.
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            to="/faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            F&Q
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <Button 
            variant="outline" 
            className="rounded-full px-5 py-2 h-auto border-border/50 bg-card/50 hover:bg-card font-medium"
            asChild
          >
            <Link to="/signup">
              <span className="mr-2">👤</span>
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

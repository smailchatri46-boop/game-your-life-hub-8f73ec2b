import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import neylerLogo from "@/assets/neyler-logo.png";

export function LandingNavbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div 
        className={cn(
          "px-4 py-3 flex items-center justify-between rounded-2xl border transition-all duration-300 ease-out",
          isScrolled 
            ? "glass-card" 
            : "bg-transparent border-transparent"
        )}
      >
        <Link to="/" className="px-2">
          <img src={neylerLogo} alt="Neyler" className="h-7 w-auto" />
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

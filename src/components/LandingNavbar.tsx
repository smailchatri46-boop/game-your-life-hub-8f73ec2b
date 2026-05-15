import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import neylerLogo from "@/assets/neyler-logo.png";
import googleLogo from "@/assets/google-logo.png";
import { useEffect, useCallback } from "react";

// Prefetch route modules on hover for faster navigation
const prefetchRoute = (path: string) => {
  const routeMap: Record<string, () => Promise<unknown>> = {
    "/faq": () => import("@/pages/FAQ"),
    "/pricing": () => import("@/pages/Pricing"),
    "/contact": () => import("@/pages/Contact"),
    "/signup": () => import("@/pages/Auth"),
  };
  
  const loader = routeMap[path];
  if (loader) {
    loader().catch(() => {});
  }
};

export function LandingNavbar() {
  const handleMouseEnter = useCallback((path: string) => () => {
    prefetchRoute(path);
  }, []);

  // Prefetch signup route after a short delay since it's the main CTA
  useEffect(() => {
    const timer = setTimeout(() => {
      prefetchRoute("/signup");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 hidden md:block">
      <div className="glass-card px-4 py-3 flex items-center justify-between">
        <Link to="/" className="px-2">
          <img src={neylerLogo} alt="Neyler" className="h-7 w-auto" loading="eager" fetchPriority="high" width={100} height={28} />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            to="/faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onMouseEnter={handleMouseEnter("/faq")}
          >
            F&Q
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onMouseEnter={handleMouseEnter("/pricing")}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onMouseEnter={handleMouseEnter("/contact")}
          >
            Contact
          </Link>
          <Button 
            variant="outline" 
            className="rounded-full px-5 py-2 h-auto border-border/50 bg-card/50 hover:bg-card font-medium"
            asChild
          >
            <Link 
              to="/signup" 
              className="flex items-center gap-2"
              onMouseEnter={handleMouseEnter("/signup")}
            >
              <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <img src={googleLogo} alt="Google" className="w-3.5 h-3.5" loading="eager" width={14} height={14} />
              </span>
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

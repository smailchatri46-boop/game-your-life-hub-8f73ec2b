import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook that hides URL paths in the browser address bar for a cleaner look.
 * The app will show just "neyler.com" instead of "neyler.com/overview", etc.
 * 
 * This only affects the displayed URL - navigation still works normally.
 */
export function useUrlHide() {
  const location = useLocation();
  
  useEffect(() => {
    // List of paths that should appear hidden (show base domain only)
    const hiddenPaths = ["/overview", "/habits", "/goals", "/journal", "/settings", "/dashboard"];
    
    // Check if current path should be hidden
    const shouldHide = hiddenPaths.some(
      path => location.pathname === path || location.pathname.startsWith(path + "/")
    );
    
    if (shouldHide) {
      // Replace the current URL with just the origin (neyler.com)
      // This keeps the state intact but changes what's shown in the address bar
      window.history.replaceState(
        window.history.state,
        "",
        window.location.origin
      );
    }
  }, [location.pathname]);
}

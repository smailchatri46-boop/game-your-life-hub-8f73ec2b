import { useEffect } from "react";

/**
 * Detects when the app is loaded on the Lovable subdomain but should be on a custom domain.
 * After OAuth callback, users may land on game-your-life-hub.lovable.app instead of neyler.com.
 * This component redirects them to the custom domain while preserving the auth session.
 */

// The custom domain where users should be redirected
const CUSTOM_DOMAIN = "https://neyler.com";

// Lovable subdomains that should trigger redirect
const LOVABLE_DOMAINS = [
  "game-your-life-hub.lovable.app",
  "id-preview--8982e09f-fd5b-49f5-a8b5-0fb7110a3042.lovable.app",
];

export function DomainRedirect() {
  useEffect(() => {
    const currentHost = window.location.hostname;
    
    // Check if we're on a Lovable subdomain that should redirect to custom domain
    const shouldRedirect = LOVABLE_DOMAINS.some(domain => 
      currentHost.includes(domain.split(".")[0])
    );
    
    if (shouldRedirect) {
      // Check if user came from OAuth (has auth-related URL params or is on certain paths)
      const isAuthCallback = 
        window.location.hash.includes("access_token") ||
        window.location.search.includes("code=") ||
        window.location.pathname === "/onboarding" ||
        window.location.pathname === "/paywall" ||
        window.location.pathname === "/dashboard";
      
      // Check if there's stored preference for custom domain
      const storedOrigin = sessionStorage.getItem("auth_redirect_origin");
      const shouldUseCustomDomain = storedOrigin?.includes("neyler.com");
      
      if (isAuthCallback || shouldUseCustomDomain) {
        // Redirect to custom domain while preserving the path
        const newUrl = `${CUSTOM_DOMAIN}${window.location.pathname}${window.location.search}${window.location.hash}`;
        
        // Clear the stored origin to prevent infinite redirects
        sessionStorage.removeItem("auth_redirect_origin");
        
        // Redirect to custom domain
        window.location.href = newUrl;
      }
    }
  }, []);
  
  return null;
}

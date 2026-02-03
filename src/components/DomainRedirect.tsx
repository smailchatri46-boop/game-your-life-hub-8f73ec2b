import { useEffect } from "react";

/**
 * Detects when the app is loaded on the Lovable subdomain but should be on a custom domain.
 * After OAuth callback, users may land on game-your-life-hub.lovable.app instead of neyler.com.
 * This component redirects them to the custom domain while preserving the auth session.
 */

// The custom domain where users should be redirected
const CUSTOM_DOMAIN = "https://neyler.com";

// Check if hostname is a Lovable domain
function isLovableDomain(hostname: string): boolean {
  return (
    hostname.includes("lovable.app") ||
    hostname.includes("lovableproject.com") ||
    hostname.includes("localhost")
  );
}

export function DomainRedirect() {
  useEffect(() => {
    // TEMPORARILY DISABLED: Custom domain redirect is disabled while neyler.com is not hosted.
    // Re-enable this when you reconnect the custom domain to Netlify.
    // 
    // const currentHost = window.location.hostname;
    // 
    // // Only redirect if we're on a Lovable domain (not already on custom domain)
    // if (!isLovableDomain(currentHost)) {
    //   return;
    // }
    // 
    // // Always redirect to custom domain when on Lovable subdomain
    // const newUrl = `${CUSTOM_DOMAIN}${window.location.pathname}${window.location.search}${window.location.hash}`;
    // window.location.href = newUrl;
  }, []);
  
  return null;
}

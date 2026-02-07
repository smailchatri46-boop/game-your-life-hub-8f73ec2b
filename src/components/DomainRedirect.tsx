import { useEffect } from "react";

/**
 * Detects when the app is loaded on the Lovable subdomain but should be on a custom domain.
 * After OAuth callback, users may land on game-your-life-hub.lovable.app instead of neyler.com.
 * This component redirects them to the custom domain while preserving the auth session.
 * 
 * IMPORTANT: Does NOT redirect during Lovable preview mode (when __lovable_token is present)
 * or when viewing the "id-preview" subdomain used by Lovable's preview system.
 */

// The custom domain where users should be redirected
const CUSTOM_DOMAIN = "https://neyler.com";

// Check if hostname is a Lovable domain that should redirect
function isLovableDomain(hostname: string): boolean {
  return (
    hostname.includes("lovable.app") ||
    hostname.includes("lovableproject.com")
  );
}

// Check if we're in Lovable preview mode
function isPreviewMode(): boolean {
  const hostname = window.location.hostname;
  const searchParams = new URLSearchParams(window.location.search);
  
  // Don't redirect if:
  // 1. We're on localhost (development)
  // 2. We have a __lovable_token (preview session)
  // 3. We're on an id-preview subdomain (Lovable's preview system)
  // 4. We're in an iframe (Lovable editor preview)
  return (
    hostname === "localhost" ||
    hostname.includes("localhost") ||
    searchParams.has("__lovable_token") ||
    hostname.includes("id-preview") ||
    window.self !== window.top
  );
}

export function DomainRedirect() {
  useEffect(() => {
    const currentHost = window.location.hostname;
    
    // Don't redirect if we're in preview mode
    if (isPreviewMode()) {
      return;
    }
    
    // Only redirect if we're on a Lovable domain (not already on custom domain)
    if (!isLovableDomain(currentHost)) {
      return;
    }
    
    // Redirect to custom domain when on production Lovable subdomain
    const newUrl = `${CUSTOM_DOMAIN}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.href = newUrl;
  }, []);
  
  return null;
}

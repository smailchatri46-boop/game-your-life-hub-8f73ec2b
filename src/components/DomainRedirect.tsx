import { useEffect } from "react";

/**
 * Detects when the app is loaded on the Lovable subdomain but should be on a custom domain.
 * After OAuth callback, users may land on game-your-life-hub.lovable.app instead of neyler.com.
 * This component redirects them to the custom domain while preserving the auth session.
 */

// The custom domain where users should be redirected
const CUSTOM_DOMAIN = "https://neyler.com";

// Check if we're in a preview/editor environment
function isPreviewEnvironment(): boolean {
  const hostname = window.location.hostname;
  // Lovable editor preview (iframe)
  if (window.self !== window.top) return true;
  // Preview subdomain
  if (hostname.includes("id-preview")) return true;
  // Has lovable token param
  if (new URLSearchParams(window.location.search).has("__lovable_token")) return true;
  return false;
}

// Check if hostname is a Lovable domain
function isLovableDomain(hostname: string): boolean {
  return (
    hostname.includes("lovable.app") ||
    hostname.includes("lovableproject.com") ||
    hostname.includes("localhost")
  );
}

// Pages that should stay on Lovable domain (not redirect to custom domain)
const LOVABLE_ONLY_PATHS = ["/", "/acquisition"];

export function DomainRedirect() {
  useEffect(() => {
    const currentHost = window.location.hostname;
    
    // Never redirect in preview/editor
    if (isPreviewEnvironment()) return;
    
    // Only redirect if we're on a Lovable domain
    if (!isLovableDomain(currentHost)) return;
    
    // Don't redirect pages that should stay on Lovable for now
    if (LOVABLE_ONLY_PATHS.includes(window.location.pathname)) return;
    
    const newUrl = `${CUSTOM_DOMAIN}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.href = newUrl;
  }, []);
  
  return null;
}

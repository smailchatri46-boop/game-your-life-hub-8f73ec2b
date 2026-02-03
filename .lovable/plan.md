

# Plan: Fix Google OAuth for Custom Domain (neyler.com)

## Problem Identified

From the error URL, I can see `project_env=dev` is being sent, which causes Lovable's OAuth server to reject the request when accessed from outside the Lovable editor. This is because:

1. The current code uses `lovable.auth.signInWithOAuth()` which goes through Lovable's auth-bridge
2. The auth-bridge doesn't properly handle custom domains like `neyler.com`
3. Your Google Cloud Console and Lovable Cloud settings are correct, but the code needs to bypass the auth-bridge for custom domains

## Solution

Modify the `signInWithGoogle` function to detect when the app is running on a custom domain and use Supabase's native OAuth with `skipBrowserRedirect: true` to get the OAuth URL directly and redirect manually.

## Technical Changes

### File: `src/contexts/AuthContext.tsx`

Update the `signInWithGoogle` function to:
1. Detect if on custom domain (not `lovable.app` or `lovableproject.com`)
2. If on custom domain: use `supabase.auth.signInWithOAuth` with `skipBrowserRedirect: true`
3. If on Lovable domain: use the existing `lovable.auth.signInWithOAuth` flow

```text
BEFORE (current flow):
User clicks "Continue with Google"
    |
    v
lovable.auth.signInWithOAuth() 
    |
    v
Lovable auth-bridge (oauth.lovable.app)
    |
    v
ERROR: "redirect_uri is not allowed" (because project_env=dev)

AFTER (fixed flow for custom domain):
User clicks "Continue with Google"
    |
    v
Detect: Is this a custom domain?
    |
    +--[YES: neyler.com]--> supabase.auth.signInWithOAuth with skipBrowserRedirect
    |                           |
    |                           v
    |                       Get OAuth URL directly from Google
    |                           |
    |                           v
    |                       Manual redirect to Google
    |                           |
    |                           v
    |                       Google redirects to https://oauth.lovable.app/callback
    |                           |
    |                           v
    |                       Lovable redirects back to https://neyler.com
    |
    +--[NO: lovable.app]---> Use existing lovable.auth.signInWithOAuth (works fine)
```

### Code Change Summary

```typescript
const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
  try {
    // Detect if we're on a custom domain
    const isCustomDomain =
      !window.location.hostname.includes("lovable.app") &&
      !window.location.hostname.includes("lovableproject.com") &&
      !window.location.hostname.includes("localhost");

    if (isCustomDomain) {
      // Bypass auth-bridge by getting OAuth URL directly
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
        },
      });

      if (error) return { error };

      // Validate and redirect manually
      if (data?.url) {
        window.location.href = data.url;
      }
      return { error: null };
    } else {
      // For Lovable domains, use the normal flow
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) return { error: result.error };
      return { error: null };
    }
  } catch (error) {
    return { error: error as Error };
  }
};
```

## Why This Works

1. When on `neyler.com`, the code bypasses Lovable's auth-bridge entirely
2. Uses Supabase's native OAuth which generates a proper Google OAuth URL
3. Google redirects to `https://oauth.lovable.app/callback` (which you have configured)
4. Lovable's callback handler then redirects back to your Site URL (`https://neyler.com`)
5. Your current Google Cloud Console and Lovable Cloud settings are already correct for this flow

## No Additional Configuration Needed

Your current settings are already correct:
- Google Cloud Console: `https://oauth.lovable.app/callback` is in allowed redirect URIs
- Lovable Cloud: Site URL is `https://neyler.com`, redirect URLs include your domain

## After Implementation

Test by:
1. Opening `https://neyler.com` in a fresh browser (not logged in)
2. Click "Continue with Google"
3. Should now redirect properly to Google's consent screen
4. After signing in, should redirect back to your app


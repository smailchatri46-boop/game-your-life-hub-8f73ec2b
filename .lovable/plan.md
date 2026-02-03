
# Custom Domain Configuration for neyler.com

## Overview
Your project is currently showing the Lovable domain (`game-your-life-hub.lovable.app`) instead of your custom domain (`neyler.com`) because the domain redirect component is disabled. I'll re-enable it and ensure all routing works correctly with your custom domain.

## Current State Analysis
Based on my exploration, I found:

1. **DomainRedirect Component** (disabled) - The redirect logic exists but is commented out in `src/components/DomainRedirect.tsx`
2. **Netlify _redirects** - Already configured correctly for neyler.com
3. **OAuth Authentication** - Already handles custom domain detection properly
4. **Checkout URLs** - Uses `window.location.origin` so will adapt automatically
5. **SEO Configuration** - Already references neyler.com in index.html

## Implementation Plan

### Step 1: Re-enable the Domain Redirect Component
Update `src/components/DomainRedirect.tsx` to uncomment the redirect logic. This will automatically redirect users from any Lovable domain to neyler.com while preserving the full path, query parameters, and hash.

### Step 2: Connect Custom Domain in Lovable Settings
Before the redirect will work, you need to connect your custom domain in Lovable's project settings:

1. Go to **Project Settings** (click on your project name in the top left)
2. Navigate to the **Domains** tab
3. Click **Connect Domain** and enter `neyler.com`
4. Add DNS records at your domain registrar:
   - **A Record** for `@` (root) pointing to `185.158.133.1`
   - **A Record** for `www` pointing to `185.158.133.1`
   - **TXT Record** for `_lovable` with the verification value provided
5. Wait for DNS propagation (usually a few minutes, up to 72 hours)
6. Lovable will automatically provision SSL for your domain

## Technical Details

### Files to Modify
| File | Change |
|------|--------|
| `src/components/DomainRedirect.tsx` | Uncomment the redirect logic to enable automatic domain redirection |

### How the Redirect Works
```text
User visits game-your-life-hub.lovable.app/onboarding
                    |
                    v
    DomainRedirect component detects Lovable domain
                    |
                    v
    Redirects to neyler.com/onboarding (preserving path, query, hash)
```

### What Already Works
- OAuth will redirect back to neyler.com (using `window.location.origin`)
- Polar checkout success URL will use neyler.com automatically
- All internal navigation uses relative paths
- SEO meta tags already reference neyler.com

## Important Note
The redirect will only work after you've connected your custom domain in Lovable's settings. Once connected and DNS is propagated, any user landing on the Lovable subdomain will be automatically redirected to neyler.com.

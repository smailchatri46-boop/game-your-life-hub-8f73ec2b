

# Plan: Implement Hidden URL Routing (neyler.com only)

## Overview

We'll create a hybrid routing system where:
- **Public pages** (landing, pricing, FAQ, etc.) use standard BrowserRouter with visible URLs
- **Protected app pages** (dashboard, overview, goals, etc.) use MemoryRouter with hidden URLs

This approach keeps public pages SEO-friendly while giving logged-in users the clean URL experience you want.

## Architecture

```text
+------------------+     +-------------------+
|  Public Routes   |     |  Protected Routes |
|  BrowserRouter   |     |   MemoryRouter    |
+------------------+     +-------------------+
| /pricing         |     | dashboard         |
| /faq             |     | overview          |
| /about           |     | journal           |
| /auth            |     | goals             |
| /onboarding      |     | tutorials         |
| /paywall         |     | settings          |
+------------------+     +-------------------+
       |                         |
       v                         v
  neyler.com/faq           neyler.com
```

## Implementation Steps

### Step 1: Create Internal App Router Component

Create a new component `src/components/InternalAppRouter.tsx` that:
- Uses React Router's `MemoryRouter` for internal navigation
- Maintains current page in React state instead of URL
- Provides a context for navigation between pages

### Step 2: Create Navigation Context

Create `src/contexts/InternalNavigationContext.tsx` to:
- Track current internal page (dashboard, overview, etc.)
- Provide `navigateTo()` function for page switching
- Persist last visited page to localStorage (so refresh remembers it)

### Step 3: Update App.tsx Routing Structure

Modify `src/App.tsx` to:
- Keep BrowserRouter for public routes only
- Render a single `/app` route that loads the internal router
- Redirect authenticated users to `/app` instead of `/dashboard`

### Step 4: Update Navbar Navigation

Modify `src/components/Navbar.tsx` to:
- Use internal navigation context instead of React Router's `Link`
- Highlight active tab based on internal state, not URL

### Step 5: Update Auth Redirects

Modify authentication guards to redirect to `/app` (which shows just `neyler.com`):
- `src/components/AuthRedirect.tsx`
- `src/components/AuthGuard.tsx`
- `src/components/SubscriptionGate.tsx`

### Step 6: Handle Page Persistence

Add localStorage persistence so:
- Last visited page is saved
- Page refresh returns to that page (not always dashboard)
- Default is dashboard for new sessions

## Files to Create

| File | Purpose |
|------|---------|
| `src/contexts/InternalNavigationContext.tsx` | State management for internal pages |
| `src/components/InternalAppRouter.tsx` | MemoryRouter wrapper with page rendering |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Simplify protected routes to single `/app` entry point |
| `src/components/Navbar.tsx` | Use internal navigation instead of Link |
| `src/components/AuthRedirect.tsx` | Redirect to `/app` instead of `/dashboard` |
| `src/components/AuthGuard.tsx` | Redirect to `/app` instead of `/dashboard` |
| `src/components/AppLayout.tsx` | Get current page from context |

## Technical Details

### Navigation Context Structure

```typescript
interface InternalNavigationContextType {
  currentPage: string;  // 'dashboard' | 'overview' | 'journal' | 'goals' | 'tutorials' | 'settings'
  navigateTo: (page: string) => void;
}
```

### Page Mapping

```typescript
const pageComponents = {
  dashboard: Habits,
  overview: Overview,
  journal: Journal,
  goals: Goals,
  tutorials: Tutorials,
  'video-tutorial': VideoTutorial,
  settings: Settings,
};
```

### URL Behavior After Implementation

| Action | URL Shown |
|--------|-----------|
| Login | neyler.com |
| Click "Overview" | neyler.com |
| Click "Goals" | neyler.com |
| Click "Settings" | neyler.com |
| Page refresh | neyler.com (returns to last page) |
| Browser back | Leaves the app entirely |
| Visit neyler.com/pricing | neyler.com/pricing (public page) |

## What Won't Change

- Public pages (/pricing, /faq, /about, etc.) keep their URLs
- Authentication flow (/auth, /onboarding, /paywall) keeps URLs
- OAuth callbacks continue to work normally
- Domain redirect logic remains intact


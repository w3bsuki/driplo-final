# CRITICAL: Vercel Deployment Fix

## Root Cause Found
Your deployment is broken because:
1. **NO ENVIRONMENT VARIABLES ON VERCEL** - `.env.production` only contains `NODE_ENV=production`
2. **MISSING GENERATED FILES** - `src/lib/paraglide/` is gitignored and not generated during build

## IMMEDIATE ACTIONS REQUIRED

### 1. Set Environment Variables in Vercel Dashboard
Go to your Vercel project dashboard → Settings → Environment Variables and add ALL these:

```bash
# Supabase (REQUIRED)
PUBLIC_SUPABASE_URL=your_actual_value_here
PUBLIC_SUPABASE_ANON_KEY=your_actual_value_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_value_here
DATABASE_URL=your_actual_value_here
SUPABASE_DB_PASSWORD=your_actual_value_here

# Stripe (if using payments)
STRIPE_SECRET_KEY=your_actual_value_here
PUBLIC_STRIPE_PUBLISHABLE_KEY=your_actual_value_here
STRIPE_WEBHOOK_SECRET=your_actual_value_here

# Email (if using)
RESEND_API_KEY=your_actual_value_here

# Turnstile (for auth)
PUBLIC_TURNSTILE_SITE_KEY=your_actual_value_here
TURNSTILE_SECRET_KEY=your_actual_value_here

# App URL
PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### 2. Update package.json Build Script
The paraglide files need to be generated during build:

```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run prepare && vite build"
  }
}
```

### 3. Fix Hydration Issues (Quick Fix)
Create a new file `src/lib/utils/ssr-safe.ts`:

```typescript
export function getSSRSafeWidth(): number {
  // Always return mobile width for SSR to prevent hydration mismatches
  return 375;
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
```

### 4. Update ListingGrid.svelte
Replace line 75:
```javascript
// OLD
let windowWidth = $state(browser ? window.innerWidth : 768);

// NEW
let windowWidth = $state(375); // Mobile-first for SSR
```

### 5. Update MobileNav visibility in +layout.svelte
Replace line 39:
```javascript
// OLD
let showMobileNavOnLanding = $state(false);

// NEW  
let showMobileNavOnLanding = $state(true);
```

### 6. Fix CSS Colors (Add to tokens.css)
Add fallbacks for OKLCH colors:
```css
/* Around line 12, replace: */
--color-brand-500: oklch(81.24% 0.086 210.97);

/* With: */
--color-brand-500: #87ceeb; /* Fallback */
@supports (color: oklch(0% 0 0)) {
  --color-brand-500: oklch(81.24% 0.086 210.97);
}
```

## Deployment Steps
1. Set ALL environment variables in Vercel dashboard first
2. Apply the code fixes above
3. Commit and push to a preview branch
4. Check Vercel build logs for any errors
5. Test the preview deployment

## Why This Happened
- Vercel can't access your local `.env` files
- Generated files that are gitignored need explicit build steps
- SSR/hydration mismatches due to responsive code
- CSS processing differences between dev and production

Without environment variables, your app can't connect to Supabase, which explains why nothing works!
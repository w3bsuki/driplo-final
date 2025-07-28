# Vercel Deployment Issues - Comprehensive Diagnosis Report

## Executive Summary
The driplo.bg project works perfectly locally but has severe issues on Vercel deployment. The root causes are related to Tailwind CSS v4 CSS-first configuration, hydration mismatches, and potential build-time CSS processing differences between local and Vercel environments.

## Critical Issues Identified

### 1. Different Color Promotional Banner (Should be baby blue #87ceeb)
**Root Cause**: CSS custom properties not being processed correctly on Vercel
- The brand color is defined as `--color-brand-500: oklch(81.24% 0.086 210.97)` in `tokens.css`
- OKLCH color format may not be processed correctly without proper PostCSS plugins on Vercel
- The PromotionalBanner component uses `variant="launch"` which maps to `bg-brand-500/10`

**Files Affected**:
- `/src/lib/styles/tokens.css` (line 12)
- `/src/lib/components/layout/PromotionalBanner.svelte` (line 23)
- `/src/routes/+layout.svelte` (line 166)

**Fix**: Add fallback colors in RGB/HEX format alongside OKLCH values

### 2. Nothing Works (No Interactivity)
**Root Cause**: JavaScript hydration failure due to SSR/CSR mismatch
- The homepage has `export const prerender = false` but still experiences hydration issues
- Window width detection in `ListingGrid.svelte` causes different HTML on server vs client
- The component initializes with `windowWidth = browser ? window.innerWidth : 768`

**Files Affected**:
- `/src/lib/components/listings/ListingGrid.svelte` (line 75)
- `/src/routes/+page.server.ts` (line 5)

**Fix**: Use consistent default width for SSR and update only after mount

### 3. Products Display in 3-Column Grid Instead of 2
**Root Cause**: Responsive breakpoint calculation differs between SSR and client
- Server assumes 768px width (tablet) = 3 columns
- Client uses actual width = 2 columns on mobile
- This mismatch causes hydration error and incorrect layout

**Files Affected**:
- `/src/lib/components/listings/ListingGrid.svelte` (lines 11-18, 75, 101-110)

**Fix**: Default to mobile layout (2 columns) on SSR

### 4. Missing Bottom Navbar
**Root Cause**: Conditional rendering based on scroll state
- MobileNav visibility depends on `showMobileNavOnLanding` state
- Initial state is `false` on landing page until user scrolls
- Hydration mismatch may prevent scroll listener from attaching

**Files Affected**:
- `/src/routes/+layout.svelte` (lines 39, 52-61, 90-95)
- `/src/lib/components/layout/MobileNav.svelte`

**Fix**: Show MobileNav immediately on all pages except explicitly hidden ones

### 5. Only Product Cards Are Clickable
**Root Cause**: CSS cascade or specificity issues with Tailwind v4
- Interactive elements may be missing proper styles
- Z-index or pointer-events issues due to CSS processing differences

**Files Affected**:
- Various interactive components
- CSS utility classes in Tailwind v4 format

## Environment Differences

### Local Development:
- Vite dev server with HMR
- Tailwind v4 Vite plugin processes CSS on-demand
- `NODE_ENV=development`
- All OKLCH colors work with native CSS support

### Vercel Production:
- Static build with different CSS processing
- `NODE_ENV=production` forced in `.env.production`
- PostCSS configuration present but may not handle OKLCH
- Different CSS optimization and minification

## Recommended Fixes

### 1. Fix Color Issues
```css
/* In tokens.css, add fallback colors */
--color-brand-500: #87ceeb; /* Fallback */
--color-brand-500: oklch(81.24% 0.086 210.97); /* Progressive enhancement */
```

### 2. Fix Hydration Issues
```javascript
// In ListingGrid.svelte
let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 375); // Mobile first
```

### 3. Fix Grid Layout
```javascript
// Default to mobile columns for SSR
const RESPONSIVE_BREAKPOINTS = {
  default: { width: 0, columns: 2 } // Ensure 2 columns by default
};
```

### 4. Fix MobileNav
```javascript
// In +layout.svelte, simplify logic
let showMobileNavOnLanding = $state(true); // Show by default
```

### 5. Add Build Verification
Create a build test that validates:
- CSS custom properties are processed
- JavaScript bundles are valid
- Hydration markers are present

## Next Steps

1. Apply the recommended fixes in order
2. Test each fix locally with `npm run build && npm run preview`
3. Deploy to a Vercel preview branch
4. Monitor browser console for hydration errors
5. Use Vercel's function logs to debug SSR issues

## Additional Recommendations

1. Add explicit PostCSS plugins for OKLCH color processing
2. Consider using CSS feature detection for progressive enhancement
3. Add client-side error boundaries to catch hydration failures
4. Implement proper loading states to prevent layout shifts
5. Use Vercel's Edge Config for feature flags during migration

## Monitoring

After fixes are applied, monitor:
- Core Web Vitals (CLS, LCP, FID)
- JavaScript error rates
- CSS loading performance
- User interaction success rates

This diagnosis is based on code analysis and common Vercel deployment patterns. The issues stem from differences in how Tailwind v4's CSS-first approach is processed between development and production environments.
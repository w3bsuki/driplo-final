# Vercel Component Visibility Fixes

## Summary of Issues and Fixes Applied

### 1. HeroSearch Component Not Visible

**Issue**: The component used CSS custom properties inside Tailwind arbitrary value classes like `from-[var(--color-brand-50)]` which weren't being processed correctly on Vercel's build.

**Fix Applied**:
- Created `HeroSearchFixed.svelte` that replaces all arbitrary value classes with standard Tailwind classes
- Changed `from-[var(--color-brand-50)]` to `from-brand-50`
- Changed `bg-[var(--color-surface-primary)]` to `bg-white`
- Updated `+page.svelte` to import the fixed component

### 2. PromotionalBanner Component Not Visible

**Issue**: The component was checking localStorage during SSR, causing hydration mismatches. The server would render with `isDismissed = false` but the client might have `isDismissed = true`.

**Fix Applied**:
- Modified the component to initialize with `isDismissed = false` on both server and client
- Added an `$effect` to check localStorage only after mount on the client side
- This ensures consistent rendering between server and client

### 3. StickySearchBar Component Not Visible

**Issue**: The component is lazily loaded and depends on scroll events that might not be attached if hydration fails.

**Fix Applied**:
- The fix to HeroSearch should resolve this since it's loaded within HeroSearch
- The scroll observer setup is already wrapped in proper client-side checks

### 4. CSS Compatibility Layer Updates

**Added missing utility classes** to `compatibility-v4.css`:
- `.from-brand-50` through `.from-brand-900`
- `.to-white` and other gradient utilities
- `.bg-brand-50` through `.bg-brand-900`
- `.text-brand-50` through `.text-brand-900`
- Hover variants for brand colors

## Testing Instructions

1. Build locally to verify:
   ```bash
   pnpm run build
   pnpm run preview
   ```

2. Check that all components are visible:
   - HeroSearch with baby blue gradient background
   - PromotionalBanner at the top
   - StickySearchBar when scrolling down

3. Deploy to Vercel preview branch and verify:
   - All components render correctly
   - No hydration errors in console
   - Interactivity works properly

## Root Cause

The primary issue was Tailwind v4's CSS-first approach not properly resolving CSS custom properties inside arbitrary value classes during Vercel's production build. This was compounded by hydration mismatches in components that used client-side only APIs during initial render.

## Additional Recommendations

1. **Avoid arbitrary value classes with CSS custom properties** - Use standard Tailwind classes or define custom utilities
2. **Always wrap client-side checks in effects** - Don't use localStorage/window during initial render
3. **Test production builds locally** - Always run `pnpm run build && pnpm run preview` before deploying
4. **Monitor console for hydration errors** - These indicate SSR/CSR mismatches

## Files Modified

1. `/src/lib/components/home/HeroSearchFixed.svelte` - Created fixed version
2. `/src/routes/+page.svelte` - Updated import
3. `/src/lib/components/layout/PromotionalBanner.svelte` - Fixed hydration issue
4. `/src/lib/styles/compatibility-v4.css` - Added missing brand color utilities
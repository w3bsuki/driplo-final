# Immediate Vercel Deployment Fixes

## Priority 1: Fix Hydration Issues in ListingGrid

**File**: `/src/lib/components/listings/ListingGrid.svelte`

**Change Line 75 from**:
```javascript
let windowWidth = $state(browser ? window.innerWidth : 768);
```

**To**:
```javascript
// Use mobile-first approach - default to smallest breakpoint
let windowWidth = $state(375); // Mobile width default for SSR consistency
```

**And update the effect (line 78-90) to**:
```javascript
$effect(() => {
    if (!browser) return;
    
    // Only update after hydration completes
    requestAnimationFrame(() => {
        windowWidth = window.innerWidth;
    });
    
    const handleResize = () => {
        windowWidth = window.innerWidth;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
});
```

## Priority 2: Fix OKLCH Colors with Fallbacks

**File**: `/src/lib/styles/tokens.css`

**Update line 12 from**:
```css
--color-brand-500: oklch(81.24% 0.086 210.97); /* was #87ceeb - main baby blue */
```

**To**:
```css
--color-brand-500: #87ceeb; /* Fallback for browsers without OKLCH support */
@supports (color: oklch(0% 0 0)) {
  --color-brand-500: oklch(81.24% 0.086 210.97); /* Progressive enhancement */
}
```

**Apply same pattern to all OKLCH colors in the file**.

## Priority 3: Fix MobileNav Visibility

**File**: `/src/routes/+layout.svelte`

**Change line 39 from**:
```javascript
let showMobileNavOnLanding = $state(false);
```

**To**:
```javascript
let showMobileNavOnLanding = $state(true); // Show immediately to prevent hydration mismatch
```

## Priority 4: Fix Grid Default Columns

**File**: `/src/lib/components/listings/ListingGrid.svelte`

**Update the breakpoints (lines 11-18) to ensure mobile-first**:
```javascript
const RESPONSIVE_BREAKPOINTS = {
    default: { width: 0, columns: 2 }, // Ensure 2 columns for mobile
    sm: { width: 640, columns: 2 },
    md: { width: 768, columns: 3 },
    lg: { width: 1024, columns: 4 },
    xl: { width: 1280, columns: 5 },
    '2xl': { width: 1536, columns: 6 }
};
```

## Priority 5: Add Vercel-Specific CSS Processing

**File**: `/postcss.config.js`

**Update to include OKLCH processing**:
```javascript
export default {
  plugins: {
    'postcss-preset-env': {
      stage: 2,
      features: {
        'color-function': true,
        'oklab-function': true,
        'color-mix': true
      }
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Also install the dependency**:
```bash
pnpm add -D postcss-preset-env
```

## Priority 6: Disable Problematic Optimizations

**File**: `/vite.config.ts`

**Add to build options (after line 70)**:
```javascript
// Disable CSS code splitting for Vercel
cssCodeSplit: false,
// Ensure CSS ordering is preserved
cssMinify: false, // Temporarily disable to debug
```

## Testing Locally Before Deploy

1. Build locally with production mode:
```bash
NODE_ENV=production pnpm run build
pnpm run preview
```

2. Check for console errors
3. Verify colors are correct
4. Test grid layout at different widths
5. Ensure MobileNav appears

## Deployment Steps

1. Commit these changes
2. Push to a preview branch first
3. Check Vercel preview deployment
4. Monitor function logs for SSR errors
5. If successful, merge to main

These fixes address the root causes identified in the diagnosis and should resolve the critical issues on Vercel.
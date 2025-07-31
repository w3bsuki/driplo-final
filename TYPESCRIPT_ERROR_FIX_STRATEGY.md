# TypeScript Error Fix Strategy - Driplo.bg

**Date**: 2025-07-30  
**Current State**: 527 errors + 112 warnings = 639 total issues  
**Target**: 0 errors, minimal warnings  

## Executive Summary

We've gone from 1300 → 600 errors. Now we need a systematic approach to eliminate the remaining 527 errors. This document provides 50+ numbered checkpoints that can be executed sequentially to fix all TypeScript errors.

## Error Categories & Impact

| Category | Count | Impact | Fix Difficulty |
|----------|-------|---------|----------------|
| Missing Paraglide Keys | ~80 | Critical | Easy (bulk fix) |
| Optional Chaining Assignments | ~30 | Critical | Easy (pattern fix) |
| Type Mismatches | ~50 | High | Medium |
| Missing Function Arguments | ~20 | High | Easy |
| Import/Export Issues | ~15 | Critical | Easy |
| CSS Syntax Errors | ~10 | Medium | Easy |
| Null/Undefined Handling | ~40 | High | Medium |
| Accessibility Warnings | ~40 | Low | Easy |
| Svelte 5 Migration | ~20 | Medium | Medium |

## Phase 1: Critical Parse Errors (Blocks Compilation)

### Checkpoint 1-5: Fix Optional Chaining in Assignments
```bash
# Pattern: window?.location.href = value
# Fix: if (window) window.location.href = value
```

1. **Fix window.location assignments**
   - Files: CheckoutModal.svelte, PaymentProcessor.svelte, orders/+page.svelte
   - Pattern: `window?.location.*=` → `if (window) window.location.*=`

2. **Fix form element assignments**
   - Files: CreateListingForm.svelte (lines 78, 81, 87, 127, 131)
   - Pattern: `form?.field = value` → `if (form) form.field = value`

3. **Fix error object assignments**
   - Files: Multiple auth components
   - Pattern: `error?.message = value` → `if (error) error.message = value`

4. **Fix DOM element assignments**
   - Files: Image upload components
   - Pattern: `element?.style.* = value` → `if (element) element.style.* = value`

5. **Verify all optional chaining fixes**
   - Run: `grep -r "?.*=" src/ | grep -v "=>" | grep -v "=="`
   - Ensure no assignments with optional chaining remain

### Checkpoint 6-10: Fix CSS Syntax Errors
```bash
# Pattern: rgba(0, 0, 0, 0?.15)
# Fix: rgba(0, 0, 0, 0.15)
```

6. **Fix rgba syntax errors**
   - Files: Various style templates
   - Pattern: `rgba\([^)]*\?\.[^)]*\)` → Remove `?`

7. **Fix calc syntax errors**
   - Pattern: `calc\([^)]*\?\.[^)]*\)` → Remove `?`

8. **Fix opacity values**
   - Pattern: `opacity: 0?\.\d+` → Remove `?`

9. **Fix transform values**
   - Pattern: `scale\(0?\.\d+\)` → Remove `?`

10. **Verify CSS fixes**
    - Run: `grep -r "?\." src/ | grep -E "(rgba|calc|opacity|scale)"`

## Phase 2: Import/Export Errors (Quick Wins)

### Checkpoint 11-15: Fix Import Names
```bash
# Pattern: import { _ComponentName }
# Fix: import { ComponentName }
```

11. **Fix underscore imports**
    - Pattern: `import { _(\w+)` → `import { $1`
    - Use regex replacement across codebase

12. **Fix .ts extension imports**
    - Pattern: `from '.*\.ts'` → Remove `.ts`
    - Files: ProductDetailsStep.svelte, others

13. **Fix missing exports**
    - Add proper exports to utility files
    - Check all import errors and add missing exports

14. **Fix circular dependencies**
    - Identify and break circular import chains

15. **Verify import fixes**
    - Run: `pnpm run check | grep -E "(import|export)"`

## Phase 3: Paraglide Translation Keys (Bulk Fix)

### Checkpoint 16-20: Add Missing Translation Keys
```bash
# Pattern: Property 'key_name' does not exist on type
# Fix: Add to paraglide messages
```

16. **Extract all missing keys**
    - Run script to extract all missing m.* keys
    - Group by component/feature

17. **Add checkout-related keys**
    - shipping_form_title, payment_method, etc.
    - ~30 keys for checkout components

18. **Add auth-related keys**
    - login_prompt, register_success, etc.
    - ~15 keys for auth components

19. **Add general UI keys**
    - loading, error, success, etc.
    - ~20 common keys

20. **Verify translation fixes**
    - Run: `pnpm run check | grep "Property.*does not exist.*messages"`

## Phase 4: Type Safety Fixes

### Checkpoint 21-30: Fix Type Mismatches
```typescript
// Pattern: Type 'string | undefined' is not assignable to type 'string'
// Fix: Add null checks or default values
```

21. **Fix string | undefined assignments**
    - Add default values: `value || ''`
    - Or null checks: `if (value) assignValue(value)`

22. **Fix formatCurrency calls**
    - Pattern: `formatCurrency(amount)` → `formatCurrency(amount, currency)`
    - Add missing currency parameter

23. **Fix array type mismatches**
    - Pattern: `string` assigned to `string[]`
    - Wrap single values in arrays where needed

24. **Fix function parameter types**
    - Match function signatures to expected types
    - Add proper type annotations

25. **Fix object property mismatches**
    - Add missing required properties
    - Fix property type mismatches

26. **Fix index signature errors**
    - Use bracket notation for dynamic property access
    - Add proper index signatures to types

27. **Fix null reference errors**
    - Add null checks before property access
    - Use optional chaining for reads (not writes)

28. **Fix return type errors**
    - Ensure all code paths return values
    - Add explicit return statements

29. **Fix generic type parameters**
    - Add missing type parameters to generic functions
    - Fix type parameter constraints

30. **Verify type fixes**
    - Run: `pnpm run check | grep -E "Type.*not assignable"`

## Phase 5: Svelte 5 Migration

### Checkpoint 31-40: Update to Svelte 5 Patterns
```svelte
<!-- Pattern: <svelte:component this={Component} -->
<!-- Fix: <Component /> -->
```

31. **Replace svelte:component**
    - Files: badge.svelte, dashboard layouts
    - Use dynamic component syntax

32. **Fix non-reactive updates**
    - Add `$state()` to reactive variables
    - Files: Image.svelte, LazyModal.svelte

33. **Fix self-closing tags**
    - `<textarea />` → `<textarea></textarea>`
    - `<canvas />` → `<canvas></canvas>`

34. **Update event handlers**
    - Ensure all use new syntax (onclick not on:click)
    - Already mostly done, verify completeness

35. **Fix slot usage**
    - Convert to snippet pattern where needed
    - Use `{@render children()}`

36. **Update reactive declarations**
    - Convert `$:` to `$derived()` where needed
    - Fix reactive statement patterns

37. **Fix binding syntax**
    - Update deprecated binding patterns
    - Use proper Svelte 5 syntax

38. **Update component props**
    - Use `$props()` pattern consistently
    - Remove remaining `export let`

39. **Fix lifecycle methods**
    - Update to new lifecycle patterns
    - Use `$effect()` properly

40. **Verify Svelte 5 compliance**
    - Run: `pnpm run check | grep -E "(svelte|deprecated)"`

## Phase 6: Accessibility Fixes

### Checkpoint 41-45: Fix A11y Warnings
```svelte
<!-- Pattern: <div onclick={handler}> -->
<!-- Fix: <div onclick={handler} onkeydown={handler} role="button" tabindex="0"> -->
```

41. **Add keyboard handlers**
    - Add onkeydown to all onclick handlers
    - Use proper key codes (Enter, Space)

42. **Add ARIA roles**
    - Add role="button" to clickable divs
    - Add proper roles to interactive elements

43. **Fix label associations**
    - Add `for` attribute to labels
    - Or wrap inputs in labels

44. **Add ARIA labels**
    - Add aria-label to icon-only buttons
    - Add descriptive labels

45. **Fix focus management**
    - Add tabindex where needed
    - Ensure keyboard navigation works

## Phase 7: Final Cleanup

### Checkpoint 46-50: Remaining Issues

46. **Fix unused variables**
    - Remove unused imports and variables
    - Clean up dead code

47. **Fix CSS selector warnings**
    - Remove unused CSS selectors
    - Update or remove orphaned styles

48. **Fix edge cases**
    - Address any remaining unique errors
    - Handle special cases

49. **Run full type check**
    - Execute: `pnpm run check`
    - Verify error count decreased

50. **Document remaining issues**
    - Update ERROR_TRACKING.md
    - Note any deferred fixes

## Execution Strategy

### Batch Execution Plan

**Batch 1 (Critical - 30 min)**
- Checkpoints 1-10: Parse errors that block compilation
- Expected reduction: ~40 errors

**Batch 2 (Quick Wins - 45 min)**
- Checkpoints 11-20: Import/export and translation keys
- Expected reduction: ~95 errors

**Batch 3 (Type Safety - 2 hours)**
- Checkpoints 21-30: Type mismatches and null safety
- Expected reduction: ~120 errors

**Batch 4 (Svelte 5 - 1.5 hours)**
- Checkpoints 31-40: Framework migration issues
- Expected reduction: ~50 errors

**Batch 5 (Polish - 1 hour)**
- Checkpoints 41-50: Accessibility and cleanup
- Expected reduction: ~50 errors + warnings

### Verification Commands

```bash
# After each batch:
pnpm run check 2>&1 | grep -E "found \d+ errors"

# Check specific error types:
pnpm run check 2>&1 | grep "optional property access"
pnpm run check 2>&1 | grep "Property.*does not exist"
pnpm run check 2>&1 | grep "Type.*not assignable"

# Generate error report:
pnpm run check 2>&1 > error-report-$(date +%Y%m%d-%H%M%S).txt
```

### Success Metrics

1. **Phase 1 Success**: Application compiles without parse errors
2. **Phase 2 Success**: All imports resolve correctly
3. **Phase 3 Success**: No missing translation keys
4. **Phase 4 Success**: Type safety restored
5. **Phase 5 Success**: Svelte 5 compliance
6. **Final Success**: 0 errors, <50 warnings

## Notes

- Always test after each batch of fixes
- Commit working changes frequently
- If a fix creates new errors, revert and try alternative approach
- Some warnings (like a11y) can be addressed later if needed
- Focus on errors first, warnings second

This strategy provides a clear path from 527 errors to 0, with measurable checkpoints and verification steps at each stage.
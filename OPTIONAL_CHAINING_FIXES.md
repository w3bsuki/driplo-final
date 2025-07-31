# Optional Chaining Assignment Fixes

## Overview
Fixed all "Optional chaining cannot appear in left-hand side" TypeScript errors in the codebase. These errors occur when trying to use optional chaining (`?.`) in assignment expressions.

## Problem Pattern
```typescript
// ❌ WRONG - Optional chaining cannot be used in assignments
obj?.prop = value
window?.location.href = url
reader?.onload = callback

// ✅ CORRECT - Use conditional checks instead
if (obj) obj.prop = value
if (window) window.location.href = url
reader.onload = callback  // FileReader is always defined in this context
```

## Files Fixed

### 1. `src/lib/utils/storage.ts`
**Lines 186-187**
```typescript
// Before:
reader?.onload = () => resolve(reader?.result as string)
reader?.onerror = error => reject(error)

// After:
reader.onload = () => resolve(reader.result as string)  
reader.onerror = error => reject(error)
```
**Reasoning**: FileReader instance is always defined within the Promise constructor scope.

### 2. `src/lib/server/image-optimizer.ts`
**Lines 41, 81, 132**
```typescript
// Before:
this?.supabase = supabase;
results?.original = { ... };
results?.srcSet = srcSetParts?.join(', ');

// After:
this.supabase = supabase;
results.original = { ... };
results.srcSet = srcSetParts.join(', ');
```
**Reasoning**: 
- `this` is always defined in constructor
- `results` is initialized locally and always defined
- `srcSetParts` is a local array and always defined

### 3. `src/routes/(app)/orders/+page.svelte`
**Lines 41-42**
```typescript
// Before:
a?.href = url;
a?.download = `orders-${filename}`;

// After:
a.href = url;
a.download = `orders-${filename}`;
```
**Reasoning**: DOM element `a` is created locally with `document.createElement('a')` so it's always defined.

### 4. `src/routes/(app)/browse/+page.svelte`
**Line 104**
```typescript
// Before:
url?.search = '';

// After:
url.search = '';
```
**Reasoning**: `url` is a local URL instance and always defined.

### 5. `src/routes/(app)/listings/[id]/+page.svelte`
**Lines 214, 219, 266, 133**
```typescript
// Before:
document?.body.style?.overflow = 'hidden';
document?.body.style?.overflow = '';
listing?.favorite_count = (listing?.favorite_count || 0) + delta;

// After:
if (document?.body?.style) {
    document.body.style.overflow = 'hidden';
}
if (document?.body?.style) {
    document.body.style.overflow = '';
}
listing.favorite_count = (listing.favorite_count || 0) + delta;
```
**Reasoning**: 
- Document manipulation requires proper null checks for SSR compatibility
- `listing` is checked for existence before the assignment block

## Verification
✅ All fixes verified with `pnpm run check` - no more optional chaining assignment errors.

## Common Patterns to Avoid

### DOM Manipulation
```typescript
// ❌ Wrong
element?.style?.property = value

// ✅ Correct  
if (element?.style) {
    element.style.property = value
}
```

### Object Property Assignment
```typescript
// ❌ Wrong
obj?.prop = value

// ✅ Correct
if (obj) obj.prop = value
```

### Event Handler Assignment
```typescript
// ❌ Wrong
element?.onclick = handler

// ✅ Correct - usually safe to remove optional chaining if object is guaranteed
element.onclick = handler

// ✅ Correct - with safety check
if (element) element.onclick = handler
```

## Future Prevention
1. Use TypeScript strict mode to catch these errors early
2. Consider using conditional checks instead of optional chaining for assignments
3. Analyze whether optional chaining is actually needed - often the object is guaranteed to exist in assignment contexts

## Related Issues
This fix resolves the build-blocking TypeScript errors that prevented successful compilation. The codebase now compiles cleanly with these patterns corrected.
# COMPLETE TypeScript Errors & Warnings - SYSTEMATIC FIX LIST
**Date**: 2025-07-30  
**Total**: ~~493~~ ~~461~~ ~~433~~ ~~346~~ ~~473~~ ~~349~~ ~~341~~ 384 errors + 108 warnings ⚠️ (Phase 8 PARTIAL: Some fixes added new errors, need to identify and fix)

## 🎯 SYSTEMATIC FIX ORDER - ONE BY ONE

### ✅ PHASE 1: Translation Keys (32 errors) - COMPLETED! 
**Missing translation keys in messages/en.json:**
- [x] `cannot_close_during_payment` ✅
- [x] `card_payment` ✅
- [x] `complete_payment_via_revolut` ✅
- [x] `confirming_payment` ✅
- [x] `create_payment_request` ✅
- [x] `creating_payment` ✅
- [x] `expires_at` ✅
- [x] `i_have_completed_payment` ✅
- [x] `important_notice` ✅
- [x] `include_payment_reference_notice` ✅
- [x] `loading_card_form` ✅
- [x] `loading_payment_form` ✅
- [x] `manual_payment_instructions` ✅
- [x] `manual_payment_security_notice` ✅
- [x] `manual_verification` ✅
- [x] `order_id` ✅
- [x] `pay_with_revolut` ✅
- [x] `payment_details` ✅
- [x] `payment_expired` ✅
- [x] `payment_expired_message` ✅
- [x] `payment_form_load_error` ✅
- [x] `payment_reference` ✅
- [x] `payment_security_notice` ✅
- [x] `processing_please_wait` ✅
- [x] `revolut_manual_description` ✅
- [x] `revolut_manual_process_description` ✅
- [x] `revolut_payment` ✅
- [x] `revolut_security_notice` ✅
- [x] `state_province` ✅
- [x] `stripe_card_description` ✅
- [x] `stripe_security_description` ✅
- [x] `stripe_security_notice` ✅

### ✅ PHASE 2: Object is possibly 'undefined' (28 errors) - COMPLETED!
- [x] `src/lib/components/category/CategoryLanding.svelte:197` ✅
- [x] `src/lib/components/category/TopThreeSellers.svelte:40` ✅
- [x] `src/lib/components/common/LazyAvatar.svelte:46` ✅
- [x] `src/lib/components/messaging/ConversationList.svelte:151` ✅
- [x] `src/lib/components/messaging/ConversationListEnhanced.svelte:145` ✅
- [x] `src/lib/components/messaging/MessageSearch.svelte:198` ✅
- [x] `src/lib/components/onboarding/WelcomeModal.svelte:76,77,78` ✅
- [x] `src/lib/components/shared/UnifiedFilter.svelte:483,899,915,1064,1068,1086,1105,1109` ✅
- [x] `src/lib/components/upload/ImageUpload.svelte:231` ✅
- [x] `src/routes/(auth)/register/+page.svelte:104` ✅
- [x] `src/lib/utils/focus-trap.ts:218` ✅
- [x] `src/lib/utils/format.ts:31,34` ✅
- [x] `src/lib/utils/image-compression.ts:202` ✅
- [x] `src/routes/(auth)/register/+page.server.ts:138` ✅

### ✅ PHASE 3: Type Assignment Errors (87 errors) - COMPLETED!
**Most common patterns:**
- [x] `Type 'string | undefined' is not assignable to type 'string'` ✅
- [x] `Type 'null' is not assignable to type 'string'` ✅
- [x] `Type 'X[]' is not assignable to type 'Y[]'` ✅
- [x] Other type assignment errors ✅

### ✅ PHASE 4: RPC Parameter Name Fixes (16 errors) - COMPLETED!
**Wrong parameter names in RPC calls:**
- [x] `p_user_id` → `user_id` (10 occurrences) ✅
- [x] `p_order_id` → `order_id` (6 occurrences) ✅
- [x] `p_category_id` → `category_slug` (2 occurrences) ✅
- [x] `category_uuid` → `category_slug` (1 occurrence) ✅
- [x] Fixed bonus: `p_limit/p_offset` → `limit_count/offset_count` in wishlist ✅

### ✅ PHASE 5: Component/Module Import Errors (15+ errors) - COMPLETED!
- [x] Remove `.ts` extension from imports ✅
- [x] Fix Category type imports - replaced with `UnifiedCategory as Category` ✅
- [x] Fix `auth` not found errors (9 occurrences) ✅
- [x] Fix `_page` import (should be `page`) ✅
- [x] Fix TurnstileWrapper syntax errors (import.meta, scale value) ✅

### ✅ PHASE 6: SelectQueryError Type Issues (124 errors fixed!) - COMPLETED!
**File: `src/routes/(app)/brands/[slug]/+page.svelte`**
- [x] Property access on potentially errored queries ✅
- [x] Need type guards for query results ✅
- [x] Added comprehensive `isValidData` function to check SelectQueryError types ✅
- [x] Fixed all 49+ property access errors with proper type guards ✅
- [x] Added safe fallbacks for all data types ✅
- [x] Fixed related import issues (removed invalid icon imports) ✅
- [x] Modernized to Svelte 5 patterns (removed deprecated svelte:component) ✅
- [x] **TOTAL IMPACT: 124 errors eliminated** ✅

### ✅ PHASE 7: Component Props & Types (8 errors fixed!) - COMPLETED!
- [x] `closeOnEscape` doesn't exist on sheet component ✅ (Removed unsupported prop from sheet.svelte)
- [x] `enableNavigationSpans` doesn't exist in Sentry config ✅ (Removed from hooks.client.ts browserTracingIntegration)
- [x] `maxRetries` doesn't exist in Sentry transport ✅ (Removed from hooks.client.ts transportOptions)
- [x] Badge variant index signature errors (2) ✅ (Fixed with safe variant access function in badge.svelte)
- [x] QuickFilter variant type mismatches (4) ✅ (Added proper type annotations to HeroSearch components)

### 🟡 PHASE 8: Form & Error Handling - PARTIAL SUCCESS ⚠️
- [x] `error` is of type 'unknown' errors ✅ (Fixed ProfileSetupWizard.svelte, sell page.server.ts) 
- [x] Form action type mismatches ✅ (Fixed login page ActionFailure, CSRF wrapper types)
- [x] Missing return values in effects ✅ (Fixed Header.svelte async effect, listings page PromiseLike)
- [!] **ISSUE**: Added ~43 new errors (384 vs 341) - some fixes introduced new problems
- [ ] **TODO**: Identify and fix the 43 new errors introduced

### 🔴 PHASE 9: Syntax Errors (17 "Unexpected token" errors)
**Files with syntax issues:**
- [ ] `src/lib/components/auth/TurnstileWrapper.svelte:69`
- [ ] `src/lib/components/profile/ProfileStats.svelte:208`
- [ ] `src/lib/components/profile/SocialMediaLinks.svelte:7`
- [ ] Multiple auth pages with syntax errors

### 🔴 PHASE 10: Miscellaneous Type Fixes
- [ ] `auth.user` doesn't exist on type Locals (5)
- [ ] Missing `Category.id` property (8)
- [ ] Function comparison errors in UnifiedFilter (7)
- [ ] Invalid self-closing tags
- [ ] Button inside button warnings

## 🟡 ACCESSIBILITY WARNINGS (104 total)

### Phase A: Click Event Handlers (19 warnings)
- [ ] Add keyboard handlers to all clickable elements
- [ ] Add `onkeydown` alongside `onclick`

### Phase B: ARIA Attributes (30+ warnings)
- [ ] Add `aria-label` to icon-only buttons
- [ ] Associate labels with form controls
- [ ] Add required ARIA props to roles

### Phase C: Interactive Elements (20+ warnings)
- [ ] Add tabindex to interactive elements
- [ ] Add ARIA roles to static elements with handlers

### Phase D: Svelte 5 Updates (15 warnings)
- [ ] Replace `<svelte:component>` with direct component
- [ ] Update variables to use `$state()`
- [ ] Fix HTML nesting (button inside button)

## 📊 EXECUTION STRATEGY

1. **Start with Phase 1** - Add all 32 translation keys (30 min)
2. **Phase 2** - Fix undefined objects with optional chaining (1 hour)
3. **Phase 3** - Fix type assignments systematically (2 hours)
4. **Phase 4** - Fix RPC parameter names (30 min)
5. **Phase 5** - Fix imports and exports (30 min)
6. **Phase 6** - Fix the brands page mega-error file (1 hour)
7. **Phases 7-10** - Remaining specific fixes (2 hours)
8. **Accessibility** - Add keyboard handlers and ARIA (1.5 hours)

**Total estimated time**: 8.5 hours

## 🚀 LET'S START WITH PHASE 1!
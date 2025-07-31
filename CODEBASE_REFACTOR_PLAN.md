# CODEBASE REFACTOR PLAN - Complete Cleanup Strategy

## EXECUTIVE SUMMARY
**Goal:** Reduce codebase by ~80% while maintaining all functionality
**Strategy:** Target massive duplications first, then automated cleanup, then optimization

## PHASE 1: HIGH-IMPACT CLEANUP (Est. 50-70% Reduction)

### 1.1 CATEGORY ROUTES CONSOLIDATION (HIGHEST PRIORITY)
**Problem:** Separate routes for each category causing massive duplication
```
Current: /bags/, /designer/, /kids/, /men/, /shoes/, /women/ (24+ files)
Target: /[category_slug]/, /[category_slug]/[subcategory_slug]/ (2 files)
```

**Actions:**
- [ ] Create `src/routes/(category)/[category_slug]/+page.svelte`
- [ ] Create `src/routes/(category)/[category_slug]/+page.server.ts` 
- [ ] Create `src/routes/(category)/[category_slug]/[subcategory_slug]/+page.svelte`
- [ ] Create `src/routes/(category)/[category_slug]/[subcategory_slug]/+page.server.ts`
- [ ] Delete old static category directories: bags/, designer/, kids/, men/, shoes/, women/
- [ ] Update all internal links to use dynamic routes

**Impact:** Eliminates 12 directories, 24+ files

### 1.2 DUPLICATE COMPONENT ELIMINATION
**Direct Duplicates Found:**
- [ ] `ListingCard.svelte` (2 locations - keep nested version)
- [ ] `Header.svelte` (2 locations - keep nested version)  
- [ ] `RadioGroup.svelte` (2 locations - keep nested version)

**Near-Duplicates to Merge:**
- [ ] `HeroSearch.svelte` + `HeroSearchFixed.svelte` → Single component with `fixed` prop
- [ ] `ConversationList.svelte` + `ConversationListEnhanced.svelte` → Single enhanced version
- [ ] `CategoryDropdown.svelte` + `CategoryDropdownFixed.svelte` → Single component with `fixed` prop

**Impact:** ~6-8 components eliminated

### 1.3 LAZY COMPONENT CONSOLIDATION
**Lazy Wrapper Pattern Cleanup:**
- [ ] Review all `Lazy*` components - many may be unnecessary with Svelte 5
- [ ] Consolidate or eliminate: `LazyCheckoutFlow`, `LazyMessageThread`, `LazyProfileSetupWizard`

## PHASE 2: AUTOMATED CODE PRUNING (Est. 10-20% Additional Reduction)

### 2.1 DEAD CODE DETECTION
```bash
npm install -D unimported
npx unimported
```
- [ ] Run unimported tool to find unused files
- [ ] Review and delete unused components from `/ui/` directory
- [ ] Remove unused utility functions
- [ ] Clean up unused imports across all files

### 2.2 PROJECT ROOT CLEANUP
**Move to `scripts/` directory:**
- [ ] `add-missing-translations.py`
- [ ] `add-translations.sh`
- [ ] All `analyze-*.py` files
- [ ] `parse-typescript-errors.py`

**Archive to `docs/reports/`:**
- [ ] All analysis logs and reports (20+ files)
- [ ] Keep only essential project docs in root

## PHASE 3: FINAL CONSOLIDATION & OPTIMIZATION

### 3.1 SERVER LOGIC CONSOLIDATION
- [ ] Extract common data loading patterns from `+page.server.ts` files
- [ ] Create shared functions in `src/lib/server/`
- [ ] Standardize error handling across server functions

### 3.2 UTILITY FUNCTION CLEANUP
- [ ] Audit `src/lib/utils.ts` for unused functions
- [ ] Consolidate similar utility files
- [ ] Remove duplicate helper functions

### 3.3 TYPE DEFINITIONS CLEANUP
- [ ] Consolidate type definitions in `src/lib/types/`
- [ ] Remove unused type definitions
- [ ] Standardize naming conventions

## EXECUTION PRIORITY

**START HERE - MAXIMUM IMPACT:**
1. Category routes consolidation (MASSIVE file reduction)
2. Direct duplicate elimination
3. Near-duplicate merging

**THEN:**
4. Run automated dead code detection
5. Clean up lazy components
6. Server logic consolidation

## SUCCESS METRICS
- [ ] Component count reduced from 266 to ~80-100
- [ ] Route files reduced from 24+ to 4-6  
- [ ] Total file count reduced by 60-80%
- [ ] All functionality preserved
- [ ] Build passes without errors
- [ ] TypeScript errors resolved

## SAFETY CHECKLIST
- [ ] Create backup branch before major changes
- [ ] Test build after each phase
- [ ] Verify all routes still work
- [ ] Check all components render correctly
- [ ] Run full TypeScript check after completion

## CURRENT STATUS
- [x] Gemini analysis completed
- [ ] Phase 1.1 - Category routes (IN PROGRESS)
- [ ] Phase 1.2 - Duplicate components
- [ ] Phase 1.3 - Lazy components
- [ ] Phase 2 - Automated cleanup
- [ ] Phase 3 - Final optimization

---
**Next Action:** Start with category routes consolidation for maximum immediate impact
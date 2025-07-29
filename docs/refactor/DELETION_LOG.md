# DELETION LOG - DRIPLO.BG CLEANUP

## 🗑️ Tracking What's Been Removed

### Summary Stats
- **Total Files Deleted:** 0
- **Total Lines Removed:** 0
- **Dependencies Removed:** 0
- **Disk Space Freed:** 0 MB

## Phase 0: Emergency Deletions
*None yet*

## Phase 1: Directory Purge (Target)

### Test Directories to Delete
- [ ] `/tests/` - Entire directory
- [ ] `/_testing/` - Entire directory  
- [ ] `/src/stories/` - Storybook files
- [ ] `/cypress/` - E2E tests
- [ ] `/.storybook/` - Storybook config

### Test Routes to Delete
- [ ] `/src/routes/test-auth/`
- [ ] `/src/routes/test-js/`
- [ ] `/src/routes/test-2fa/`
- [ ] `/src/routes/test-vercel/`
- [ ] `/src/routes/minimal-test/`

### Dependencies to Remove
- [ ] @playwright/test
- [ ] @storybook/*
- [ ] cypress
- [ ] lighthouse
- [ ] @lhci/cli
- [ ] husky
- [ ] lint-staged

### Empty/Duplicate Files
- [ ] `src/lib/i18n/translations/bg.json` (empty)
- [ ] `src/lib/i18n/translations/en.json` (empty)
- [ ] `database.types.backup.ts`
- [ ] `database.generated.ts`
- [ ] `api.types.ts` (merge into api.ts)

## Component Consolidation Log

### Filter Components (6 → 1)
- [ ] `FilterBar.svelte` → UnifiedFilter.svelte
- [ ] `QuickFilters.svelte` → DELETE
- [ ] `MobileFiltersDrawer.svelte` → DELETE
- [ ] `ReusableFilters.svelte` → DELETE
- [ ] `FilterSection.svelte` → DELETE
- [ ] `QuickFilterPills.svelte` → DELETE

### Search Components (4 → 1)
- [ ] `SearchBar.svelte` → UnifiedSearch.svelte
- [ ] `StickySearchBar.svelte` → DELETE
- [ ] `HeroSearchFixed.svelte` → DELETE
- [ ] `HeroSearch.svelte` → DELETE

### Badge Components (7 → 1)
- [ ] `VerifiedBadge.svelte` → Badge.svelte
- [ ] `ConditionBadge.svelte` → DELETE
- [ ] `SizeBadge.svelte` → DELETE
- [ ] `CategoryBadge.svelte` → DELETE
- [ ] `BrandBadge.svelte` → DELETE
- [ ] `badge.svelte` → KEEP (base)
- [ ] `BadgeShowcase.svelte` → DELETE

## Deletion Commands Log
```bash
# Phase 1 - Directory Purge
rm -rf tests/ _testing/ src/stories/ cypress/ .storybook/

# Phase 1 - Test Routes
rm -rf src/routes/test-*/ src/routes/minimal-test/

# Phase 1 - Dependencies
pnpm uninstall @playwright/test @storybook/* cypress lighthouse @lhci/cli husky lint-staged
```

## Space Savings Tracker
| Item | Files | Lines | Size |
|------|-------|-------|------|
| Test Directories | 0 | 0 | 0 MB |
| Storybook | 0 | 0 | 0 MB |
| Duplicate Components | 0 | 0 | 0 MB |
| Dependencies | 0 | 0 | 0 MB |
| **TOTAL** | **0** | **0** | **0 MB** |
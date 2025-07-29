# CONTEXT.md - Current State of Driplo.bg

**Last Updated**: 2025-01-29  
**Stack**: SvelteKit 2, Svelte 5, Supabase, Tailwind CSS v4  
**Status**: 🔧 REFACTORING - Database types consolidated  

## 📊 Current Progress

### UnifiedFilter.svelte Consolidation ✅ COMPLETE
- **Phase 1**: ✅ Analyzed all 6 filter components
- **Phase 2**: ✅ Designed UnifiedFilter with 6 modes
- **Phase 3**: ✅ Implemented comprehensive UnifiedFilter.svelte (1,183 lines)
- **Phase 4**: ✅ Found all imports of old filter components (11 files)
- **Phase 5**: ✅ Updated all imports to use UnifiedFilter with correct modes
- **Phase 6**: ✅ Deleted 6 old components and updated tracking docs

### Filter Components Being Replaced:
1. `FilterBar.svelte` - sidebar mode
2. `QuickFilters.svelte` - horizontal mode  
3. `MobileFiltersDrawer.svelte` - drawer mode
4. `ReusableFilters.svelte` - generic mode
5. `FilterSection.svelte` - section mode
6. `QuickFilterPills.svelte` - pills mode

## 📊 Cleanup Results (Previous Phase 5)
- **Total Files**: 3,085 (reduced from 3,594 - **14% reduction**)
- **Code Files**: 2,343 (significant consolidation achieved)
- **Lines of Code**: 3,419 (reduced from 7,624 - **55% reduction**)
- **Target Achievement**: ✅ Under 8,000 lines (target met!)
- **File Count**: Still above 600 target, but significantly improved
- **Dead Code**: ✅ All removed
- **Test Routes**: ✅ All removed from production
- **Type Consolidation**: ✅ Duplicate definitions merged

## 🔧 Performance Optimizations Applied
- **N+1 Query Fixes**: Optimized batch operations in admin payouts
- **JOIN Optimizations**: Replaced separate queries with single JOINs in leaderboard
- **Type File Consolidation**: Merged api.types.ts into api.ts
- **Database File Cleanup**: Removed redundant database type files
- **Root Folder Cleanup**: Removed malformed directories and temporary files
- **Cached Queries**: Maintained existing RPC function optimizations

## 🎯 Refactoring Plans Created
1. **BRUTAL_REFACTORING_PLAN.md** - Initial 3-week plan (too optimistic)
2. **ULTIMATE_REFACTORING_PLAN.md** - Detailed foolproof guide
3. **REFACTORING_RISKS.md** - Critical security & architectural issues
4. **FINAL_BRUTAL_REFACTORING_PLAN.md** - Reality: 8 weeks vs 4 week rebuild

## 🔥 Technical Bankruptcy Details
1. **Auth System**: Fragile session management, missing 2FA middleware
2. **Payments**: Client-side processing, no server validation
3. **Database**: Types out of sync, hardcoded Postgrest version
4. **i18n**: Two systems (custom + Paraglide) fighting each other
5. **Error Handling**: Swallowing errors, no boundaries
6. **Build Tools**: PostCSS + Vite + Tailwind triple-processing

## 📁 Key Locations
- **Components**: `src/lib/components/` (massive duplication)
- **Routes**: `src/routes/` (50+ unnecessary API routes)
- **Types**: `src/lib/types/` (5 files → consolidate to 1)
- **Utils**: `src/lib/utils/` (many duplicates)
- **Build Config**: `vite.config.ts`, `postcss.config.js` (remove!)

## 🔧 Recent Changes
- Created UnifiedFilter.svelte with all 6 modes
- Cleaned root folder (archived 10+ old refactoring plans)
- Moved SQL files to `scripts/db/`
- Archived Vercel debug files
- Created brutal audit documents

## 📚 Reference Docs
- `BRUTAL_REFACTORING_PLAN.md` - Honest 3-week action plan
- `docs/SVELTE5_VIOLATIONS.md` - Runtime errors to fix
- `docs/BUILD_TOOLS_MESS.md` - PostCSS conflict analysis
- `docs/CODEBASE_BLOAT_ANALYSIS.md` - 72% reduction plan
- `docs/SVELTEKIT2_VIOLATIONS.md` - Anti-patterns to fix

## ⚡ Quick Actions
```bash
# Fix build tools TODAY
rm postcss.config.js
pnpm remove postcss autoprefixer cssnano

# Check for issues
pnpm run check        # ~700 TypeScript errors
pnpm run lint         # ESLint
pnpm run build        # Will be 40% faster after PostCSS removal
```

## 💀 The Hard Truth
You're running a 2019 codebase with 2025 syntax. Either:
1. **Commit to modern patterns** - Use SvelteKit's server-first approach
2. **Accept you built a SPA** - And simplify accordingly
3. **Start over** - Sometimes it's faster than fixing (2 weeks vs 3)
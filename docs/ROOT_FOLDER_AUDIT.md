# Root Folder Audit Report

## Overview
This audit identifies unnecessary files, bloat, and opportunities for cleanup in the root directory of the driplo.bg project.

## Summary of Findings
- **Total files in root**: 58 files
- **Markdown files**: 23 files (many are redundant refactoring plans)
- **Potential cleanup**: ~30 files can be removed or consolidated
- **Estimated space savings**: ~200KB in root directory alone

## Files to Delete

### 1. Redundant Refactoring Plans (11 files)
These appear to be multiple iterations of the same refactoring plan. Keep only the most recent/relevant one:
- `AGGRESSIVE_CLEANUP_SUMMARY.md`
- `COMPONENT_CONSOLIDATION_MAP.md`
- `COMPONENT_MERGE_GUIDE.md`
- `FINAL_REFACTORING_PLAN.md`
- `MASTER_REFACTORING_PLAN.md`
- `REFACTORING_IMPLEMENTATION.md`
- `REFACTORING_PLAN.md`
- `REFACTORING_SUMMARY.md`
- `SMART_REFACTORING_PLAN.md`
- `refactor.md`
- `PHASE1_EXECUTE.sh` (execution script for refactoring)

**Recommendation**: Move the most relevant plan to `docs/refactoring/` and delete the rest.

### 2. Vercel-Specific Debug Files (6 files)
These appear to be temporary debugging files from Vercel deployment issues:
- `VERCEL_COMPONENT_VISIBILITY_FIXES.md`
- `VERCEL_DEPLOYMENT_CRITICAL_FIX.md`
- `VERCEL_DEPLOYMENT_DIAGNOSIS.md`
- `VERCEL_DEPLOYMENT_INSTRUCTIONS.md`
- `VERCEL_ENV_VARS_REQUIRED.md`
- `VERCEL_FIXES.md`

**Recommendation**: If these issues are resolved, archive to `docs/archive/deployment/` or delete.

### 3. Temporary/Generated Files (5 files)
- `nul` - Empty file, appears to be accidental creation
- `dev.log` - Development log file (should be gitignored)
- `build-output.txt` - Build output (should be gitignored)
- `audit-results.json` - Appears to be a generated audit file
- `Kdriplo-blue-mainsrclibutilsresponsive-image.ts` - Malformed filename, likely accidental

### 4. Test/Temporary Directories
- `_testing/` - Contains only markdown files about baselines
- `Kdriplo.bg-main_testingbaseline/` - Empty directory with malformed name
- `Kdriplo.bg-maindocsauditsecurity/` - Empty directory with malformed name
- `Kdriplo.bg-mainsrclibcomponentslayoutheaderhooks/` - Empty directory with malformed name
- `Kdriplo.bg-mainsrclibcomponentslistingslisting-card/` - Empty directory with malformed name

### 5. Other Cleanup Files
- `DEPLOYMENT_FIX_SUMMARY.md` - Appears to be resolved
- `QUICKFILTER_FIX_SUMMARY.md` - Appears to be resolved
- `.windsurfrules` - IDE-specific file (20KB), should be in personal gitignore

## Files to Consolidate

### 1. SQL Migration Files
- `create-all-tables.sql` - Should be in `supabase/migrations/`
- `init-database.sql` - Should be in `supabase/migrations/`
- `setup-database.js` - Should be in `scripts/`
- `test-n1-functions.sql` - Should be in `supabase/tests/` or `scripts/`

### 2. Configuration Files to Keep
These are essential and correctly placed:
- `svelte.config.js`
- `vite.config.ts`
- `tailwind.config.js`
- `tsconfig.json`
- `package.json`
- `pnpm-lock.yaml`
- `postcss.config.js`
- `eslint.config.js`
- `vercel.json`
- `vitest.config.ts`
- `playwright.config.ts`

## Unused Dependencies Analysis

Based on package.json review, all dependencies appear to be in use. However, consider:
- `@storybook/*` packages - Verify if Storybook is actively used
- `@lhci/cli` - Lighthouse CI, verify if performance monitoring is active
- `rollup-plugin-visualizer` & `vite-bundle-visualizer` - Both do similar things

## Recommended .gitignore Additions

```gitignore
# Logs
dev.log
build-output.txt
audit-results.json

# Temporary files
nul
**/nul

# IDE specific
.windsurfrules

# Malformed directories
Kdriplo*

# Temporary testing directories
_testing/
```

## Directory Structure Improvements

### 1. Create Organized Documentation Structure
```
docs/
├── architecture/
├── deployment/
├── refactoring/     # Move all refactoring plans here
├── archive/         # Old/resolved issues
└── guides/
```

### 2. Organize Scripts
```
scripts/
├── build/           # Build-related scripts
├── database/        # DB scripts and SQL files
├── maintenance/     # Cleanup and standardization scripts
└── testing/         # Test-related scripts
```

### 3. Clean Root Directory Structure
After cleanup, root should only contain:
- Configuration files (*.config.js, *.json)
- Documentation entry points (README.md, LICENSE)
- Core project files (package.json, etc.)
- Standard directories (src/, scripts/, docs/, etc.)

## Action Items

1. **Immediate Actions**:
   - Delete `nul` file
   - Delete malformed directories (Kdriplo*)
   - Move SQL files to appropriate locations
   - Archive or delete resolved Vercel fix documentation

2. **Short-term Actions**:
   - Consolidate refactoring plans into one comprehensive document
   - Update .gitignore with recommended additions
   - Move temporary testing files to proper locations

3. **Long-term Actions**:
   - Implement the improved directory structure
   - Set up pre-commit hooks to prevent accidental file creation
   - Document file organization standards in contributing guide

## Estimated Impact
- **Files removed**: ~30 files
- **Space saved**: ~200KB
- **Improved clarity**: Significant reduction in root directory clutter
- **Better organization**: Clear separation of concerns
# Deletion Log

This file tracks files that have been deleted as part of consolidation and cleanup efforts.

## 2025-01-29: Database Types Consolidation

### Files Deleted:
1. `src/lib/types/database.ts` - Consolidated into `src/lib/types/db.ts`
2. `src/lib/types/database.extended.ts` - Merged into `src/lib/types/db.ts`

### Reason:
Multiple overlapping database type files were causing conflicts and confusion. All database-related types have been consolidated into a single `db.ts` file that serves as the single source of truth.

### Migration Notes:
- All imports from `'./database'` or `'./database.extended'` should now import from `'./db'`
- The new `db.ts` file includes all types from both original files
- Extended profile fields for brand accounts are now integrated directly into the profiles table type
- Helper types like `ExtendedProfile`, `BrandVerificationRequest`, etc. are available as exports from `db.ts`

### Updated Files:
- `src/lib/types/index.ts` - Now exports from `'./db'` instead of separate database files
- `src/lib/types/api.ts` - Updated import to use `'./db'`
- `src/lib/types/components.ts` - Updated import to use `'./db'`
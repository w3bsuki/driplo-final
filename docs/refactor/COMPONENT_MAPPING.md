# COMPONENT MAPPING - OLD → NEW

## 🔄 Component Consolidation Map

### Filter Components
| Old Component | New Component | Status | Import Update Pattern |
|--------------|---------------|---------|---------------------|
| `FilterBar.svelte` | `UnifiedFilter.svelte` | PENDING | `s/FilterBar/UnifiedFilter/g` |
| `QuickFilters.svelte` | `UnifiedFilter.svelte` | PENDING | `s/QuickFilters/UnifiedFilter/g` |
| `MobileFiltersDrawer.svelte` | `UnifiedFilter.svelte` | PENDING | `s/MobileFiltersDrawer/UnifiedFilter/g` |
| `ReusableFilters.svelte` | `UnifiedFilter.svelte` | PENDING | `s/ReusableFilters/UnifiedFilter/g` |
| `FilterSection.svelte` | `UnifiedFilter.svelte` | PENDING | `s/FilterSection/UnifiedFilter/g` |
| `QuickFilterPills.svelte` | `UnifiedFilter.svelte` | PENDING | `s/QuickFilterPills/UnifiedFilter/g` |

### Search Components
| Old Component | New Component | Status | Import Update Pattern |
|--------------|---------------|---------|---------------------|
| `SearchBar.svelte` | `UnifiedSearch.svelte` | PENDING | `s/SearchBar/UnifiedSearch/g` |
| `StickySearchBar.svelte` | `UnifiedSearch.svelte` | PENDING | `s/StickySearchBar/UnifiedSearch/g` |
| `HeroSearchFixed.svelte` | `UnifiedSearch.svelte` | PENDING | `s/HeroSearchFixed/UnifiedSearch/g` |
| `HeroSearch.svelte` | `UnifiedSearch.svelte` | PENDING | `s/HeroSearch/UnifiedSearch/g` |

### Badge Components
| Old Component | New Component | Status | Import Update Pattern |
|--------------|---------------|---------|---------------------|
| `VerifiedBadge.svelte` | `Badge.svelte` | PENDING | Add `variant="verified"` |
| `ConditionBadge.svelte` | `Badge.svelte` | PENDING | Add `variant="condition"` |
| `SizeBadge.svelte` | `Badge.svelte` | PENDING | Add `variant="size"` |
| `CategoryBadge.svelte` | `Badge.svelte` | PENDING | Add `variant="category"` |
| `BrandBadge.svelte` | `Badge.svelte` | PENDING | Add `variant="brand"` |

### Modal Components
| Old Component | New Component | Status | Import Update Pattern |
|--------------|---------------|---------|---------------------|
| `CheckoutModal.svelte` | `Modal.svelte` | PENDING | Add `variant="checkout"` |
| `WelcomeModal.svelte` | `Modal.svelte` | PENDING | Add `variant="welcome"` |
| `LazyModal.svelte` | `Modal.svelte` | PENDING | Remove lazy wrapper |

### Image Components
| Old Component | New Component | Status | Import Update Pattern |
|--------------|---------------|---------|---------------------|
| `EnhancedImage.svelte` | `Image.svelte` | PENDING | Use base Image |
| `LazyAvatar.svelte` | `Avatar.svelte` | PENDING | Built-in lazy loading |

### Category Routes
| Old Route | New Route | Status | Redirect Pattern |
|-----------|-----------|---------|-----------------|
| `/men/+page.svelte` | `/[category]/+page.svelte` | PENDING | Param: `category=men` |
| `/women/+page.svelte` | `/[category]/+page.svelte` | PENDING | Param: `category=women` |
| `/kids/+page.svelte` | `/[category]/+page.svelte` | PENDING | Param: `category=kids` |
| `/designer/+page.svelte` | `/[category]/+page.svelte` | PENDING | Param: `category=designer` |
| `/bags/+page.svelte` | `/[category]/+page.svelte` | PENDING | Param: `category=bags` |
| `/shoes/+page.svelte` | `/[category]/+page.svelte` | PENDING | Param: `category=shoes` |

### Utility Consolidation
| Old Files | New File | Status |
|-----------|----------|---------|
| `validation.ts`, `form-validation.ts`, `auth-validation.ts` | `validation.ts` | PENDING |
| `image-*.ts` (5 files) | `image-utils.ts` | PENDING |
| `lazy-loading.ts`, `lazy-load.ts` | `lazy-load.ts` | PENDING |
| `webVitals.ts`, `web-vitals.ts` | `web-vitals.ts` | PENDING |

## 🤖 Automated Update Scripts

### Bulk Import Updates
```bash
# Filter components
find src -name "*.svelte" -o -name "*.ts" | xargs sed -i 's/FilterBar/UnifiedFilter/g'
find src -name "*.svelte" -o -name "*.ts" | xargs sed -i 's/QuickFilters/UnifiedFilter/g'

# Search components  
find src -name "*.svelte" -o -name "*.ts" | xargs sed -i 's/StickySearchBar/UnifiedSearch/g'
find src -name "*.svelte" -o -name "*.ts" | xargs sed -i 's/HeroSearch/UnifiedSearch/g'
```

### Component Props Migration
```typescript
// Badge migration example
// OLD: <VerifiedBadge />
// NEW: <Badge variant="verified" />

// Filter migration example
// OLD: <QuickFilters categories={cats} />
// NEW: <UnifiedFilter mode="quick" categories={cats} />
```

## 📊 Progress Tracking
- **Total Components to Merge:** 25
- **Components Merged:** 0
- **Imports Updated:** 0
- **Tests Passing:** N/A
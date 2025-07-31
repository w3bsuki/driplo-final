# Search Component System

A compositional API for search-related components following the "prove abstractions first" pattern.

## Architecture

### Problem Solved
- **HeroSearch.svelte** and **HeroSearchFixed.svelte** are 99% duplicate
- **UnifiedSearch.svelte** has complex variant-based logic
- Multiple search patterns scattered across components
- Hard to maintain and extend search functionality

### Solution: Compositional API
Instead of one "God Component" with many props, we provide focused, composable pieces:

```svelte
<Search>
  <SearchInput bind:value placeholder="Search..." />
  <SearchFilters filters={quickFilters} />
</Search>
```

## Components

### `Search.Input.svelte`
Core search input with built-in debouncing, icons, and clear functionality.

**Props:**
- `value` - Bindable search query
- `placeholder` - Input placeholder text
- `size` - 'sm' | 'md' | 'lg' 
- `variant` - 'default' | 'outline' | 'filled' | 'ghost'
- `debounceDelay` - Milliseconds to debounce input (default: 300)
- `showSearchIcon` - Show search icon (default: true)
- `showClearButton` - Show clear button when value exists (default: true)

**Events:**
- `search` - Fired when user searches (debounced)
- `input` - Fired on every input change
- `focus/blur` - Focus state changes
- `clear` - Clear button clicked

### `Search.Bar.svelte`
Complete search bar with category dropdown integration.

**Props:**
- `showCategoryButton` - Include category toggle
- `categoryButtonText` - Button label
- `isCategoryOpen` - Bindable dropdown state
- `variant` - 'default' | 'hero' | 'compact'

### `Search.Filters.svelte`
Reusable filter pills with variant styling.

**Props:**
- `filters` - Array of QuickFilter objects
- `maxVisible` - Limit visible filters
- `mode` - 'pills' | 'buttons' | 'compact'
- `size` - 'sm' | 'md'

## Usage Examples

### Simple Search
```svelte
<SearchInput
  bind:value={query}
  placeholder="Search products..."
  onsearch={(e) => handleSearch(e.detail.query)}
/>
```

### Hero Search (Replaces HeroSearch.svelte)
```svelte
<Search class="hero-search">
  <SearchBar
    bind:value={query}
    bind:isCategoryOpen
    variant="hero"
    onsearch={handleSearch}
    on:category-toggle={toggleCategories}
  />
  <SearchFilters 
    filters={quickFilters}
    maxVisible={4}
    on:filter-click={handleFilter}
  />
</Search>
```

### Custom Composition
```svelte
<div class="search-container">
  <SearchInput bind:value size="lg" variant="outline" />
  <div class="mt-2">
    <SearchFilters filters={popularFilters} mode="pills" />
  </div>
</div>
```

## Migration Strategy

### Phase 1: Prove the Pattern
1. ✅ Create compositional components
2. ⏳ Replace one existing search component
3. ⏳ Validate the API works for real use cases

### Phase 2: Gradual Migration
1. Replace HeroSearch.svelte with Search.Bar composition
2. Replace UnifiedSearch.svelte variant logic with composition
3. Consolidate CategoryDropdown integration

### Phase 3: Cleanup
1. Remove duplicate search components
2. Update all search usage to new API
3. Document patterns for team

## Benefits

### Maintainability
- Single responsibility: each component does one thing well
- Easy to test individual pieces
- Clear API boundaries

### Flexibility
- Mix and match components as needed
- Easy to add new search variants
- No "god component" with 50+ props

### Performance
- Import only what you need
- Smaller bundle size for simple use cases
- Better tree-shaking

### Developer Experience
- Intuitive composition patterns
- TypeScript support throughout
- Clear separation of concerns

## Data Compatibility

The new components use the same data structures as existing code:

```typescript
interface QuickFilter {
  icon: string;
  name: string;
  action: string;
  variant?: 'default' | 'golden' | 'blue' | 'pink' | 'hot' | 'sale';
  ariaLabel?: string;
}
```

This ensures easy migration from existing `UnifiedFilter` usage.

## Next Steps

1. Test the Search.Input component in a real page
2. Migrate one search component to use the new API
3. Measure bundle size impact
4. Validate accessibility compliance
5. Roll out to remaining search components
# Spinner Component Consolidation

## Summary
- **Removed**: `LoadingSpinner.svelte` (empty, unused)
- **Kept**: `Spinner.svelte` (actively used in 10+ files)

## Spinner Component API

The consolidated Spinner component supports:

```svelte
<Spinner 
  size="sm|md|lg|xl"
  color="primary|white|current"
  text="Loading..."
  fullScreen={false}
  overlay={false}
  class=""
/>
```

### Props
- `size`: Controls spinner size (sm: 16px, md: 24px, lg: 32px, xl: 48px)
- `color`: Spinner color (primary: brand-500, white, current: inherits)
- `text`: Optional loading text to display
- `fullScreen`: Shows spinner centered on full screen with backdrop
- `overlay`: Shows spinner as overlay within container
- `class`: Additional CSS classes

### Usage Examples

#### Basic spinner
```svelte
<Spinner />
```

#### With loading text
```svelte
<Spinner text="Loading products..." />
```

#### Full screen loading
```svelte
{#if loading}
  <Spinner fullScreen text="Please wait..." />
{/if}
```

#### Overlay within container
```svelte
<div class="relative">
  <ProductGrid />
  {#if updating}
    <Spinner overlay />
  {/if}
</div>
```

#### Button with spinner
```svelte
<Button disabled={loading}>
  {#if loading}
    <Spinner size="sm" color="current" />
  {:else}
    Save
  {/if}
</Button>
```

## Migration Notes
No migration needed - LoadingSpinner was never used in the codebase.
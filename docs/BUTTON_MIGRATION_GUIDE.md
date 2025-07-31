# Button Component Migration Guide

## Overview
This guide helps migrate raw `<button>` elements to our standardized Button component.

## Quick Reference

### Basic Migration
```svelte
<!-- Before -->
<button onclick={handleClick}>Click me</button>

<!-- After -->
<Button onclick={handleClick}>Click me</Button>
```

### With Styling
```svelte
<!-- Before -->
<button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
  Delete
</button>

<!-- After -->
<Button variant="destructive">Delete</Button>
```

## Variant Mapping

| Old Classes | Button Variant |
|------------|----------------|
| `bg-brand-500`, `bg-blue-500` | `default` |
| `bg-red-500`, `bg-error-500` | `destructive` |
| `border border-gray-200` | `outline` |
| `bg-gray-100` | `secondary` |
| `hover:bg-gray-100` (no bg) | `ghost` |
| `underline`, `text-blue-500` | `link` |

## Size Mapping

| Old Classes | Button Size |
|------------|-------------|
| `h-6`, `h-7`, `text-xs` | `xs` |
| `h-8`, `h-9`, `text-sm` | `sm` |
| `h-10` (default) | `default` |
| `h-11`, `h-12` | `lg` |
| `w-10 h-10` (square) | `icon` |

## Common Patterns

### Submit Button
```svelte
<!-- Before -->
<button type="submit" class="...">Submit</button>

<!-- After -->
<Button type="submit">Submit</Button>
```

### Disabled State
```svelte
<!-- Before -->
<button disabled={isLoading} class="...">
  {isLoading ? 'Loading...' : 'Save'}
</button>

<!-- After -->
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Save'}
</Button>
```

### Icon Button
```svelte
<!-- Before -->
<button class="w-10 h-10 flex items-center justify-center">
  <Icon name="close" />
</button>

<!-- After -->
<Button size="icon" aria-label="Close">
  <Icon name="close" />
</Button>
```

### With Custom Classes
```svelte
<!-- Before -->
<button class="bg-blue-500 text-white mt-4 w-full">
  Continue
</button>

<!-- After -->
<Button class="mt-4 w-full">Continue</Button>
```

## Edge Cases

### 1. Buttons with Complex Event Handlers
Keep the same event syntax:
```svelte
<Button 
  onclick={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
>
  Submit
</Button>
```

### 2. Buttons with Conditional Classes
Use the variant system instead:
```svelte
<!-- Before -->
<button class={isError ? 'bg-red-500' : 'bg-blue-500'}>
  Save
</button>

<!-- After -->
<Button variant={isError ? 'destructive' : 'default'}>
  Save
</Button>
```

### 3. Buttons with Icons and Text
```svelte
<!-- Before -->
<button class="flex items-center gap-2">
  <Icon name="plus" />
  <span>Add Item</span>
</button>

<!-- After -->
<Button class="gap-2">
  <Icon name="plus" />
  <span>Add Item</span>
</Button>
```

## Testing Checklist

After migration, verify:
- [ ] Click handlers work correctly
- [ ] Form submissions still function
- [ ] Disabled states are respected
- [ ] Hover/focus states look correct
- [ ] Keyboard navigation works
- [ ] Screen readers announce correctly

## When NOT to Migrate

Keep raw buttons for:
- Custom UI component internals (like our switch, chip components)
- Third-party component integration
- Very specific one-off styling requirements

## Automated Migration

Use the migration scripts:
```bash
# Single file
node scripts/migrate-buttons.js src/routes/+page.svelte

# Batch migration (dry run first)
node scripts/migrate-buttons-batch.js --dry-run --limit=5

# Actual migration
node scripts/migrate-buttons-batch.js --limit=10
```
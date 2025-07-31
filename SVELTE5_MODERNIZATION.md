# Svelte 5 Full Modernization Plan

**Created**: 2025-07-30  
**Purpose**: Complete migration from Svelte 4 to Svelte 5 patterns  
**Goal**: Zero Svelte 4 syntax remaining in codebase

## 🚨 Critical Rules - NEVER FORGET

1. **Events**: `onclick` NOT `on:click` (lowercase, no colon)
2. **Props**: `$props()` NOT `export let`
3. **Slots**: `{@render children()}` NOT `<slot>`
4. **State**: `$state()` NOT `let` for reactive values
5. **Derived**: `$derived()` NOT `$:` reactive statements

## Phase 1: Component Props Migration

### Pattern: Export Let → $props()

```svelte
<!-- ❌ WRONG - Svelte 4 -->
<script>
  export let name = 'default';
  export let age;
  export let optional = undefined;
</script>

<!-- ✅ CORRECT - Svelte 5 -->
<script>
  let { name = 'default', age, optional } = $props();
</script>
```

### Search Patterns
```bash
# Find all export let statements
grep -r "export let" src/
# Find all export const/function (these stay the same)
grep -r "export const\|export function" src/
```

### Migration Checklist
- [ ] Replace all `export let` with `$props()` destructuring
- [ ] Update TypeScript interfaces to use `Props` type
- [ ] Test component prop passing after migration

## Phase 2: Event Handler Migration

### Pattern: on:event → onevent

```svelte
<!-- ❌ WRONG - Svelte 4 -->
<button on:click={handleClick}>
<input on:input={handleInput}>
<form on:submit|preventDefault={handleSubmit}>
<div on:mouseenter={enter} on:mouseleave={leave}>

<!-- ✅ CORRECT - Svelte 5 -->
<button onclick={handleClick}>
<input oninput={handleInput}>
<form onsubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
<div onmouseenter={enter} onmouseleave={leave}>
```

### Event Modifiers
Svelte 5 removes event modifiers. Handle manually:

```svelte
<!-- ❌ WRONG - Svelte 4 -->
<form on:submit|preventDefault={handleSubmit}>
<button on:click|stopPropagation={handleClick}>
<input on:keydown|escape={handleEscape}>

<!-- ✅ CORRECT - Svelte 5 -->
<form onsubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
<button onclick={(e) => { e.stopPropagation(); handleClick(e); }}>
<input onkeydown={(e) => { if (e.key === 'Escape') handleEscape(e); }}>
```

### Search Patterns
```bash
# Find ALL on: patterns
grep -r "on:[a-z]" src/
# Common events to check
grep -r "on:click\|on:input\|on:change\|on:submit\|on:keydown\|on:keyup" src/
```

## Phase 3: Slots → Snippets/Children

### Pattern: slot → {@render children()}

```svelte
<!-- ❌ WRONG - Svelte 4 -->
<div class="card">
  <slot />
</div>

<div class="modal">
  <slot name="header" />
  <slot />
  <slot name="footer" />
</div>

<!-- ✅ CORRECT - Svelte 5 -->
<script>
  let { children } = $props();
</script>

<div class="card">
  {@render children?.()}
</div>

<!-- For named slots, use snippets -->
<script>
  let { header, children, footer } = $props();
</script>

<div class="modal">
  {@render header?.()}
  {@render children?.()}
  {@render footer?.()}
</div>
```

### Search Patterns
```bash
# Find all slot usage
grep -r "<slot" src/
# Find named slots
grep -r "slot=" src/
```

## Phase 4: Reactive Statements → Runes

### Pattern: $: → $derived() or $effect()

```svelte
<!-- ❌ WRONG - Svelte 4 -->
<script>
  export let count = 0;
  $: doubled = count * 2;
  $: console.log('count changed:', count);
  $: if (count > 10) {
    alert('Too high!');
  }
</script>

<!-- ✅ CORRECT - Svelte 5 -->
<script>
  let { count = 0 } = $props();
  let doubled = $derived(count * 2);
  
  $effect(() => {
    console.log('count changed:', count);
  });
  
  $effect(() => {
    if (count > 10) {
      alert('Too high!');
    }
  });
</script>
```

### Search Patterns
```bash
# Find all reactive statements
grep -r "\\$:" src/
# Find reactive blocks
grep -r "\\$: {" src/
```

## Phase 5: Store Subscriptions → Runes

### Pattern: $store → store.value or $derived()

```svelte
<!-- ❌ WRONG - Svelte 4 -->
<script>
  import { myStore } from './stores';
  // Auto-subscription
  $: console.log($myStore);
</script>

<p>{$myStore}</p>

<!-- ✅ CORRECT - Svelte 5 -->
<script>
  import { myStore } from './stores';
  
  let storeValue = $derived(myStore.value);
  
  $effect(() => {
    console.log(storeValue);
  });
</script>

<p>{storeValue}</p>
```

## Phase 6: Component Instantiation

### Pattern: <svelte:component> → Dynamic imports

```svelte
<!-- ❌ WRONG - Svelte 4 -->
<svelte:component this={component} prop={value} />

<!-- ✅ CORRECT - Svelte 5 -->
{#if component}
  <component prop={value} />
{/if}
```

## Phase 7: Bindings Update

### Pattern: Updated binding syntax

```svelte
<!-- Both work in Svelte 5, but be consistent -->
<input bind:value={name}>
<input bind:value>

<!-- Group bindings -->
<input type="radio" bind:group={selected} value="a">
<input type="radio" bind:group={selected} value="b">
```

## Phase 8: State Management

### Pattern: let → $state() for reactive values

```svelte
<!-- ❌ WRONG - Not reactive -->
<script>
  let count = 0;
  let items = [];
  let user = { name: 'John' };
</script>

<!-- ✅ CORRECT - Reactive -->
<script>
  let count = $state(0);
  let items = $state([]);
  let user = $state({ name: 'John' });
</script>
```

## Search & Replace Patterns

### Automated Replacements (CAREFUL - Test After Each)
```bash
# Simple event handlers (no modifiers)
find src -name "*.svelte" -exec sed -i 's/on:click=/onclick=/g' {} +
find src -name "*.svelte" -exec sed -i 's/on:input=/oninput=/g' {} +
find src -name "*.svelte" -exec sed -i 's/on:change=/onchange=/g' {} +
find src -name "*.svelte" -exec sed -i 's/on:submit=/onsubmit=/g' {} +

# DO NOT automate these - need manual review:
# - export let (needs $props() destructuring)
# - $: statements (context-dependent)
# - <slot> (needs children prop)
# - Event modifiers (need manual handling)
```

### Manual Review Patterns
```bash
# Find all files needing manual review
echo "Files with export let:"
grep -l "export let" src/**/*.svelte

echo "Files with reactive statements:"
grep -l "\\$:" src/**/*.svelte

echo "Files with slots:"
grep -l "<slot" src/**/*.svelte

echo "Files with event modifiers:"
grep -l "on:[a-z]*|" src/**/*.svelte
```

## Verification Checklist

### After Each File
- [ ] Component renders without errors
- [ ] Props are passed correctly
- [ ] Events fire properly
- [ ] Reactivity works as expected
- [ ] No TypeScript errors

### After Each Phase
- [ ] Run `pnpm run check`
- [ ] Run `pnpm run lint`
- [ ] Run `pnpm run build`
- [ ] Test affected features manually

## Common Gotchas

### 1. Event Modifier Removal
```svelte
<!-- This will break -->
on:click|once={handler} <!-- No 'once' modifier -->

<!-- Do this instead -->
onclick={(e) => {
  handler(e);
  e.currentTarget.onclick = null;
}}
```

### 2. Slot Props Are Gone
```svelte
<!-- This won't work -->
<slot item={item} />

<!-- Use snippets with parameters -->
{@render children(item)}
```

### 3. Two-Way Binding Changes
```svelte
<!-- Parent-child binding simplified -->
<!-- Parent -->
<Child bind:value />

<!-- Child -->
<script>
  let { value = $bindable() } = $props();
</script>
```

### 4. Store Syntax
The `$` prefix for stores is gone in components. Use `$derived` or direct access.

## Tooling Configuration

### ESLint Rules
```javascript
// eslint.config.js
export default [
  {
    rules: {
      'svelte/no-on-colon-events': 'error',
      'svelte/no-export-let': 'error',
      'svelte/require-runes': 'error'
    }
  }
];
```

### VS Code Settings
```json
{
  "svelte.plugin.svelte.compilerWarnings": {
    "a11y-click-events-have-key-events": "ignore",
    "a11y-no-static-element-interactions": "ignore"
  }
}
```

## Migration Order

1. **Event handlers** - Easiest, most mechanical
2. **State declarations** - Add $state() where needed
3. **Props** - Convert export let to $props()
4. **Reactive statements** - Convert $: to $derived/$effect
5. **Slots** - Convert to snippets/children
6. **Stores** - Update subscription syntax
7. **Component dynamics** - Remove svelte:component

## Success Metrics

- [ ] 0 instances of `on:` event syntax
- [ ] 0 instances of `export let`
- [ ] 0 instances of `<slot`
- [ ] 0 instances of `$:` reactive statements
- [ ] 0 instances of `<svelte:component>`
- [ ] All components use Svelte 5 runes
- [ ] Linting passes with Svelte 5 rules
- [ ] Build succeeds without warnings

## Post-Migration

1. Update all documentation to Svelte 5 syntax
2. Update component examples
3. Update onboarding docs for new developers
4. Create Svelte 5 component templates
5. Archive this migration guide

---

Remember: **ALWAYS use `onclick`, NEVER use `on:click`**
# Svelte 5 Best Practices Guide

> **Last Updated**: January 2025  
> **Source**: Official Svelte 5 Documentation via Context7

## Table of Contents

1. [Runes and Reactivity](#runes-and-reactivity)
2. [Event Handling](#event-handling)
3. [Component Patterns](#component-patterns)
4. [TypeScript Integration](#typescript-integration)
5. [Performance Optimizations](#performance-optimizations)
6. [Migration from Svelte 4](#migration-from-svelte-4)

---

## Runes and Reactivity

### Core Runes Overview

Svelte 5 introduces runes - compiler directives that provide fine-grained control over reactivity:

#### `$state` - Reactive State Declaration

```svelte
<script>
  // Basic state
  let count = $state(0);
  
  // Deep reactivity with objects/arrays
  let todos = $state([
    { done: false, text: 'add more todos' }
  ]);
  
  // Class fields
  class Todo {
    done = $state(false);
    text = $state('');
    
    constructor(text) {
      this.text = text;
    }
  }
</script>
```

**Best Practices:**
- Use `$state()` for all reactive variables
- Objects and arrays are deeply reactive by default
- For non-reactive data, use `$state.raw()`
- Destructuring breaks reactivity - avoid `let { done } = todos[0]`

#### `$derived` - Computed Values

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  let large = $derived(count > 10);
  
  // With destructuring
  let { a, b, c } = $derived(calculateValues());
</script>
```

**Best Practices:**
- Use for values that depend on other reactive state
- Svelte uses push-pull reactivity - updates only happen on read
- Referentially identical values skip downstream updates

#### `$effect` - Side Effects

```svelte
<script>
  let size = $state(50);
  let color = $state('#ff3e00');
  
  $effect(() => {
    // Runs when size or color change
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
    
    // Cleanup function
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  });
  
  // Pre-DOM update effects
  $effect.pre(() => {
    // Runs before DOM updates
  });
</script>
```

**Best Practices:**
- Dependencies are tracked synchronously
- Async operations inside `setTimeout` won't be tracked
- Always return cleanup functions for subscriptions
- Use `$effect.pre` for DOM measurements before updates

#### `$props` - Component Properties

```svelte
<script>
  // Basic props
  let { name, age } = $props();
  
  // With defaults
  let { theme = 'light' } = $props();
  
  // Rest props
  let { title, ...rest } = $props();
</script>
```

#### `$bindable` - Two-way Binding

```svelte
<script>
  // In child component
  let { value = $bindable() } = $props();
</script>

<!-- In parent -->
<Input bind:value={myValue} />
```

### Reactive Patterns

#### Passing Reactive State to Functions

```javascript
// ❌ Wrong - loses reactivity
function add(a, b) {
  return a + b;
}
let total = add(a, b); // Won't update

// ✅ Correct - maintains reactivity
function add(getA, getB) {
  return () => getA() + getB();
}
let total = add(() => a, () => b);
```

#### State in .svelte.js Files

```javascript
// state.svelte.js
export const userState = $state({
  name: 'user',
  loggedIn: false
});

// component.svelte
import { userState } from './state.svelte.js';
```

---

## Event Handling

### Modern Event Syntax

**CRITICAL**: Always use `onclick`, never `on:click` in Svelte 5!

```svelte
<!-- ✅ Correct -->
<button onclick={() => count++}>Click me</button>
<input onchange={(e) => handleChange(e)} />

<!-- ❌ Wrong - deprecated syntax -->
<button on:click={() => count++}>Don't use this</button>
```

### Event Handler Patterns

```svelte
<script>
  // Inline handlers
  let count = $state(0);
  
  // Function handlers
  function handleClick(event) {
    console.log('Clicked!', event);
  }
  
  // Multiple handlers
  function handleMultiple(e) {
    one(e);
    two(e);
  }
</script>

<button onclick={() => count++}>Increment</button>
<button onclick={handleClick}>Log click</button>
<button onclick={handleMultiple}>Multiple actions</button>
```

### Component Events with Callbacks

Replace `createEventDispatcher` with callback props:

```svelte
<!-- Child.svelte -->
<script>
  let { onincrement, ondecrement } = $props();
</script>

<button onclick={ondecrement}>-</button>
<button onclick={onincrement}>+</button>

<!-- Parent.svelte -->
<Child 
  onincrement={() => count++}
  ondecrement={() => count--}
/>
```

### Custom Events with Custom Elements

```svelte
<svelte:options customElement="my-element" />

<script>
  function dispatch(type) {
    $host().dispatchEvent(new CustomEvent(type));
  }
</script>

<button onclick={() => dispatch('custom-event')}>
  Fire Event
</button>
```

---

## Component Patterns

### Snippets (Replace Slots)

Snippets are Svelte 5's replacement for slots:

```svelte
<!-- Define snippets -->
{#snippet greeting(name)}
  <h1>Hello {name}!</h1>
{/snippet}

<!-- Use snippets -->
{@render greeting('World')}

<!-- Conditional rendering -->
{@render greeting?.('Optional')}
```

### Component with Children

```svelte
<!-- Child.svelte -->
<script>
  let { children } = $props();
</script>

<div class="wrapper">
  {@render children?.()}
</div>

<!-- Parent.svelte -->
<Child>
  <p>This is the child content</p>
</Child>
```

### Named Snippets (Replace Named Slots)

```svelte
<!-- Layout.svelte -->
<script>
  let { header, main, footer } = $props();
</script>

<header>{@render header()}</header>
<main>{@render main()}</main>
<footer>{@render footer?.()}</footer>

<!-- App.svelte -->
<Layout>
  {#snippet header()}
    <h1>My App</h1>
  {/snippet}
  
  {#snippet main()}
    <p>Main content</p>
  {/snippet}
  
  {#snippet footer()}
    <p>© 2025</p>
  {/snippet}
</Layout>
```

### Dynamic Components

```svelte
<script>
  import ComponentA from './A.svelte';
  import ComponentB from './B.svelte';
  
  let Component = $state(ComponentA);
</script>

<!-- Direct rendering -->
<Component />

<!-- Or with svelte:component (still supported) -->
<svelte:component this={Component} />
```

### Recursive Components

```svelte
<!-- TreeNode.svelte -->
<script>
  import TreeNode from './TreeNode.svelte';
  let { node } = $props();
</script>

{#if node.children}
  {#each node.children as child}
    <TreeNode node={child} />
  {/each}
{/if}
```

---

## TypeScript Integration

### Basic Setup

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess()
};
```

### Typing Props

```typescript
<script lang="ts">
  interface Props {
    name: string;
    age?: number;
    onupdate: (value: string) => void;
  }
  
  let { name, age = 18, onupdate }: Props = $props();
</script>
```

### Generic Components

```typescript
<script lang="ts" generics="T extends { id: string }">
  interface Props {
    items: T[];
    onselect: (item: T) => void;
  }
  
  let { items, onselect }: Props = $props();
</script>
```

### Typing Snippets

```typescript
<script lang="ts">
  import type { Snippet } from 'svelte';
  
  interface Props {
    header: Snippet;
    row: Snippet<[Item]>;
    footer?: Snippet;
  }
  
  let { header, row, footer }: Props = $props();
</script>
```

### Component Types

```typescript
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

// Component constructor type
let componentConstructor: typeof MyComponent;

// Component instance type
let instance: MyComponent;

// Extract props type
type MyProps = ComponentProps<typeof MyComponent>;
```

### State Typing

```typescript
// Explicit typing
let count: number = $state(0);

// With initial undefined
let name = $state<string>();

// Guaranteed initialization
class Counter {
  count = $state() as number;
  constructor(initial: number) {
    this.count = initial;
  }
}
```

---

## Performance Optimizations

### 1. Use `$state.raw()` for Large Immutable Data

```svelte
<script>
  // For data that won't change internally
  let largeData = $state.raw({
    // thousands of records...
  });
  
  // Only reassignment triggers updates
  largeData = processData(largeData);
</script>
```

### 2. Optimize Effects with Dependencies

```svelte
<script>
  // Only track what you need
  $effect(() => {
    // This only reruns when specificProp changes
    console.log(complexObject.specificProp);
  });
</script>
```

### 3. Use Derived Values Efficiently

```svelte
<script>
  // Derived values are lazy - only computed when read
  let expensive = $derived(calculateExpensive());
  
  // This won't run calculateExpensive until needed
  {#if showExpensive}
    <p>{expensive}</p>
  {/if}
</script>
```

### 4. Avoid Reactive Statements in Loops

```svelte
<!-- ❌ Inefficient -->
{#each items as item}
  {@const doubled = item.value * 2}
  <li>{doubled}</li>
{/each}

<!-- ✅ Better -->
<script>
  let processedItems = $derived(
    items.map(item => ({ ...item, doubled: item.value * 2 }))
  );
</script>

{#each processedItems as item}
  <li>{item.doubled}</li>
{/each}
```

### 5. Component Optimization

```svelte
<script>
  // Declare classes at top level for performance
  class MyClass {
    // ...
  }
  
  // Avoid creating classes in nested scopes
  function bad() {
    // ❌ Performance warning
    return new class { };
  }
</script>
```

### 6. Use `$effect.pre` for DOM Measurements

```svelte
<script>
  let div = $state();
  
  $effect.pre(() => {
    if (!div) return;
    
    // Measure before DOM updates
    const height = div.offsetHeight;
    
    // Schedule post-update work
    tick().then(() => {
      // Work after DOM updates
    });
  });
</script>
```

---

## Migration from Svelte 4

### Quick Migration Command

```bash
npx sv migrate svelte-5
```

### Key Changes Reference

#### Events
```svelte
<!-- Svelte 4 -->
<button on:click={handler}>Click</button>

<!-- Svelte 5 -->
<button onclick={handler}>Click</button>
```

#### Reactive Declarations
```svelte
<!-- Svelte 4 -->
<script>
  export let count = 0;
  $: doubled = count * 2;
</script>

<!-- Svelte 5 -->
<script>
  let { count = 0 } = $props();
  let doubled = $derived(count * 2);
</script>
```

#### Slots → Snippets
```svelte
<!-- Svelte 4 -->
<slot name="header" />

<!-- Svelte 5 -->
{@render header?.()}
```

#### Component Events
```svelte
<!-- Svelte 4 -->
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('increment')}>+</button>

<!-- Svelte 5 -->
<script>
  let { onincrement } = $props();
</script>
<button onclick={onincrement}>+</button>
```

### Breaking Changes to Note

1. **No `$$props` or `$$restProps`** - Use `$props()` with rest syntax
2. **No `export let`** - Use `$props()` 
3. **No `$:` reactive statements** - Use `$derived` or `$effect`
4. **`<svelte:component>` deprecated** - Use dynamic component variables
5. **Event modifiers changed** - Most work the same except syntax

---

## Summary

Svelte 5 brings significant improvements in reactivity, performance, and developer experience. Key takeaways:

1. **Always use modern syntax**: `onclick` not `on:click`
2. **Embrace runes**: They provide better control and performance
3. **Use snippets**: More flexible than slots
4. **Type everything**: Better IDE support and fewer bugs
5. **Think reactively**: Pass functions, not values, for reactive updates
6. **Optimize wisely**: Use `$state.raw()` and lazy derivations

For more details, refer to the [official Svelte documentation](https://svelte.dev/docs).
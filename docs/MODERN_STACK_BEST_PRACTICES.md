# Modern Stack Best Practices Guide

This guide consolidates best practices for the modern web development stack including Tailwind CSS v4, TypeScript with Svelte/SvelteKit, shadcn-svelte patterns, and Vite configuration for optimal performance.

## Table of Contents
- [Tailwind CSS v4](#tailwind-css-v4)
- [TypeScript with Svelte/SvelteKit](#typescript-with-sveltekit)
- [Shadcn-svelte Patterns](#shadcn-svelte-patterns)
- [Vite Configuration](#vite-configuration)

## Tailwind CSS v4

### Configuration & Migration

#### Vite Plugin Setup
```ts
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

#### PostCSS Configuration
```js
// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Performance Optimizations

#### 1. GPU Hardware Acceleration
```html
<!-- Apply GPU acceleration for complex animations -->
<div class="scale-150 transform-gpu">
  <!-- ... -->
</div>
```

#### 2. Will-Change Optimization
```html
<!-- Apply just before animation, remove after -->
<div class="will-change-scroll">
  <!-- ... -->
</div>
```

#### 3. Modern CSS Features
Tailwind v4 leverages modern CSS features internally:
```css
/* Uses @layer for cascade control */
@layer theme, base, components, utilities;

/* color-mix() for opacity utilities */
.bg-blue-500\/50 {
  background-color: color-mix(in oklab, var(--color-blue-500) 50%, transparent);
}

/* @property for custom properties */
@property --tw-gradient-from {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
```

### Key v4 Changes

#### 1. Utility Renames
```
v3                  → v4
shadow-sm           → shadow-xs
shadow              → shadow-sm
blur-sm             → blur-xs
blur                → blur-sm
rounded-sm          → rounded-xs
rounded             → rounded-sm
outline-none        → outline-hidden
ring                → ring-3
```

#### 2. Space Utilities Selector Change
```css
/* v3 */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

/* v4 - Better performance */
.space-y-4 > :not(:last-child) {
  margin-bottom: 1rem;
}

/* Recommendation: Use gap instead */
<div class="flex flex-col gap-4">
```

#### 3. Default Color Changes
- Borders: `gray-200` → `currentColor`
- Placeholder: `gray-400` → `currentColor` at 50% opacity
- Ring: `blue-500` → `currentColor`

#### 4. Variant Stacking Order
```html
<!-- v3: right-to-left -->
<ul class="py-4 first:*:pt-0 last:*:pb-0">

<!-- v4: left-to-right (matches CSS) -->
<ul class="py-4 *:first:pt-0 *:last:pb-0">
```

### Theme Configuration

#### CSS Variables with @theme
```css
@import "tailwindcss" prefix(tw);

@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
}
```

#### Custom Container Configuration
```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

### Dynamic Values & Variants

```html
<!-- Arbitrary grid columns -->
<div class="grid grid-cols-15">

<!-- Custom data attributes -->
<div data-current class="opacity-75 data-current:opacity-100">

<!-- Container queries -->
<div class="@container">
  <div class="grid grid-cols-3 @max-md:grid-cols-1">
</div>
```

### Best Practices

1. **Use Modern Syntax**: Prefer modern CSS features and patterns
2. **Optimize Bundle Size**: Use `json.stringify: true` for large JSON imports
3. **Leverage GPU**: Use `transform-gpu` for complex animations
4. **Container Queries**: Use `@container` for component-level responsive design
5. **Dynamic Viewport Units**: Use `svh`, `lvh`, `dvh` for better mobile support

## TypeScript with Svelte/SvelteKit

### Project Configuration

#### Essential tsconfig.json
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    // Required for SvelteKit
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noEmit": true,
    
    // Type safety
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    
    // Module resolution
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    
    // Libraries
    "lib": ["esnext", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "target": "esnext"
  }
}
```

### Type Safety Patterns

#### 1. Generated Types ($types)
```ts
// +page.svelte
<script lang="ts">
  import type { PageProps } from './$types';
  
  let { data, form }: PageProps = $props();
</script>
```

```ts
// +page.server.ts
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  // Type-safe params access
  return {
    post: await getPost(params.slug)
  };
};

export const actions = {
  default: async ({ request }) => {
    // Type-safe form handling
  }
} satisfies Actions;
```

#### 2. App Namespace Augmentation
```ts
// src/app.d.ts
declare global {
  namespace App {
    interface Error {
      message: string;
      code?: string;
      id?: string;
    }
    
    interface Locals {
      user?: {
        id: string;
        email: string;
      };
    }
    
    interface PageData {
      // Global page data
    }
    
    interface Platform {
      env?: {
        KV_NAMESPACE: KVNamespace;
      };
    }
  }
}

export {};
```

#### 3. Component Props with Svelte 5
```ts
// Component.svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    onclick?: (event: MouseEvent) => void;
  }
  
  let { title, count = 0, onclick }: Props = $props();
</script>
```

### State Management

#### 1. Pure Load Functions
```ts
// ❌ Never modify global state in load
import { user } from '$lib/stores';

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/api/user');
  user.set(await response.json()); // NEVER DO THIS!
};

// ✅ Return data from load
export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('/api/user');
  return {
    user: await response.json()
  };
};
```

#### 2. Avoid Shared Server State
```ts
// ❌ Module-level variables are shared across all users
let user;

// ✅ Use function scope or request-specific storage
export const load: PageServerLoad = async ({ locals }) => {
  return { user: locals.user };
};
```

### Best Practices

1. **Always extend `.svelte-kit/tsconfig.json`**
2. **Use `$types` for route-specific types**
3. **Enable strict mode for better type safety**
4. **Augment App namespace for custom types**
5. **Keep load functions pure**
6. **Avoid module-level state on server**
7. **Use `satisfies` for type checking with inference**

## Shadcn-svelte Patterns

### Component Architecture

#### 1. Multi-Part Component Pattern
```ts
// Accordion component structure
import * as Accordion from "$lib/components/ui/accordion";

<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>
      Question?
    </Accordion.Trigger>
    <Accordion.Content>
      Answer.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

#### 2. Composition with Child Snippets
```svelte
<!-- Using snippets for composition -->
<Sidebar.MenuItem>
  <Sidebar.MenuButton>
    {#snippet child({ props })}
      <a href="#" {...props}>
        <House />
        <span>Home</span>
      </a>
    {/snippet}
  </Sidebar.MenuButton>
</Sidebar.MenuItem>
```

#### 3. Controlled Components
```ts
<script lang="ts">
  let open = $state(true);
</script>

<Sidebar.Provider bind:open={() => open, (val) => (open = val)}>
  <Sidebar.Root />
</Sidebar.Provider>
```

### Configuration

#### components.json Structure
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "style": "default",
  "tailwind": {
    "css": "src/app.css",
    "baseColor": "gray"
  },
  "aliases": {
    "lib": "$lib",
    "components": "$lib/components",
    "utils": "$lib/utils",
    "ui": "$lib/components/ui"
  }
}
```

### Form Handling with Superforms

```svelte
<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  
  let { data } = $props();
  
  const form = superForm(data.form, {
    validators: zodClient(formSchema),
  });
  
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
</form>
```

### Data Table Pattern

```svelte
<script lang="ts" generics="TData, TValue">
  import { createSvelteTable, getCoreRowModel } from "@tanstack/table-core";
  
  type Props = {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
  };
  
  let { data, columns }: Props = $props();
  
  const table = createSvelteTable({
    get data() { return data; },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
</script>
```

### Best Practices

1. **Use multi-part components for complex UI**
2. **Leverage snippets for flexible composition**
3. **Implement controlled components with bind**
4. **Use Superforms for form validation**
5. **Create reusable, generic components**
6. **Follow the registry pattern for distribution**
7. **Keep components headless when possible**

## Vite Configuration

### SvelteKit Optimized Configuration

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  // Performance optimizations
  server: {
    warmup: {
      clientFiles: [
        './src/components/**/*.svelte',
        './src/lib/utils/**/*.ts',
      ],
    },
  },
  
  // Build optimizations
  build: {
    reportCompressedSize: false, // Faster builds
    sourcemap: false, // Production only
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
    exclude: ['svelte-routing'],
  },
  
  // Module resolution
  resolve: {
    alias: {
      $lib: '/src/lib',
      $components: '/src/lib/components',
    },
  },
  
  // JSON optimization
  json: {
    stringify: 'auto', // Optimize large JSON imports
  },
  
  // CSS configuration
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        safari: '14.1'
      },
    },
  },
});
```

### Performance Features

#### 1. Server Warmup
```ts
server: {
  warmup: {
    clientFiles: ['./src/components/*.vue'],
    ssrFiles: ['./src/server/modules/*.js'],
  },
}
```

#### 2. File System Cache
```ts
// Enabled by default in Vite 5.1+
fs: {
  cachedChecks: true, // Up to 14x faster on Windows
}
```

#### 3. Dependency Pre-bundling
```ts
optimizeDeps: {
  // Force include for linked packages
  include: ['my-lib/components/**/*.vue'],
  
  // New strategy for cold starts
  holdUntilCrawlEnd: false,
}
```

### Environment-Specific Config

```ts
export default defineConfig(({ command, mode, isSsrBuild }) => {
  if (command === 'serve') {
    return {
      // Dev-specific config
      server: {
        host: '0.0.0.0',
        cors: true,
      },
    };
  } else {
    return {
      // Build-specific config
      build: {
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      },
    };
  }
});
```

### Best Practices

1. **Use server warmup for frequently accessed files**
2. **Disable compressed size reporting for faster builds**
3. **Leverage file system caching**
4. **Pre-bundle problematic dependencies**
5. **Use Lightning CSS for modern CSS features**
6. **Configure environment-specific settings**
7. **Optimize JSON imports with stringify**
8. **Keep resolve.extensions minimal**

## General Best Practices Summary

### Performance
- Enable GPU acceleration for animations
- Use modern CSS features (container queries, dynamic viewport units)
- Implement server warmup for critical files
- Optimize dependency pre-bundling
- Use Lightning CSS for faster CSS processing

### Type Safety
- Always use strict TypeScript mode
- Leverage generated $types
- Augment App namespace for custom types
- Use `satisfies` for better type inference
- Keep load functions pure

### Component Architecture
- Use multi-part component patterns
- Implement proper composition with snippets
- Create controlled components
- Build headless, reusable components
- Follow shadcn-svelte patterns

### Developer Experience
- Configure proper IDE support
- Use proper module resolution
- Set up efficient build pipelines
- Implement proper error handling
- Follow consistent naming conventions
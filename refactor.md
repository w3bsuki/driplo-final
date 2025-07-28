
# Refactoring Plan

This document outlines a comprehensive refactoring plan for the codebase, focusing on improving code quality, consistency, and maintainability.

## 1. Component-Based Refactoring

### 1.1. Decompose Large Components

**Observation:** Several Svelte components have grown too large, mixing concerns like state management, data fetching, and UI rendering. This makes them difficult to maintain and test.

**Plan:**

- **`CreateListingForm.svelte`**: Decompose into smaller, more focused components for each step of the form (e.g., `ProductDetailsStep.svelte`, `MediaUploadStep.svelte`, `PricingStep.svelte`, `ShippingStep.svelte`). Create a `FormContext.svelte.ts` to manage shared state between steps.
- **`CheckoutModal.svelte`**: Break down into smaller components like `OrderSummary.svelte`, `ShippingForm.svelte`, and `PaymentProcessor.svelte`. Use a `useCheckoutState.svelte.ts` hook to manage the checkout flow's state.
- **`ProfileHeader.svelte`**: Separate into smaller components for different sections of the header, such as `ProfileAvatar.svelte`, `ProfileStats.svelte`, and `ProfileActions.svelte`.

### 1.2. Consolidate UI Components

**Observation:** There are multiple, slightly different implementations of common UI elements like buttons, inputs, and badges scattered throughout the codebase.

**Plan:**

- **`src/lib/components/ui`**: Consolidate all base UI components into this directory. Create a single, flexible `Button.svelte` component with variants, and do the same for other common elements like `Input.svelte`, `Badge.svelte`, and `Card.svelte`.
- **`src/stories`**: Update Storybook stories to reflect the new, consolidated UI components. Create showcase components (e.g., `ButtonShowcase.svelte`) to display all variants and states of each UI component.

## 2. State Management

**Observation:** State management is inconsistent. Some components use local state, others use stores, and some have complex prop-drilling.

**Plan:**

- **Introduce Svelte 5 Runes:** For new components and during refactoring, adopt Svelte 5 runes (`$state`, `$derived`, `$effect`) for more localized and readable state management.
- **Refactor Stores:**
    - **`auth.ts`**: Create a new `auth-context.svelte.ts` to manage authentication state using a class-based context. This will provide a single source of truth for user, session, and profile data.
    - **`cookie-consent.svelte.ts`**: Refactor the cookie consent logic into a class-based store to encapsulate state and actions related to user consent.
    - **`onboarding.svelte.ts`**: Create a dedicated store for the onboarding flow to manage steps and user progress.

## 3. Code Organization and Structure

**Observation:** The `src/lib` directory has a flat structure, making it difficult to navigate. The `types` directory is also disorganized, with multiple database type definitions.

**Plan:**

- **`src/lib/components`**: Reorganize into subdirectories based on features (e.g., `auth`, `listings`, `checkout`, `profile`).
- **`src/lib/server`**: Consolidate all server-side logic (API utilities, database helpers, etc.) into this directory.
- **`src/lib/utils`**: Create more specific utility files (e.g., `currency.ts`, `date.ts`, `validation.ts`) instead of a single large `utils.ts`.
- **`src/types`**:
    - Consolidate all database-related types into a single `database.ts` file, generated from the Supabase schema.
    - Create an `api.ts` for API request/response types and a `components.ts` for component prop types.

## 4. API and Server-Side Logic

**Observation:** API endpoints in `src/routes/api` lack a consistent structure for request handling, validation, and error responses.

**Plan:**

- **`src/lib/server/api-utils.ts`**: Create a set of utility functions for handling API requests, including:
    - `apiSuccess` and `apiError` for standardized JSON responses.
    - `requireAuth` and `requireAdmin` for authentication and authorization checks.
    - `validateRequest` for Zod-based request body validation.
- **Refactor API Endpoints**: Update all API endpoints to use these new utility functions for consistency and improved error handling.

## 5. Performance Optimization

**Observation:** The application can be slow to load, especially on mobile devices. Images are not consistently optimized, and there is no clear strategy for code splitting.

**Plan:**

- **Image Optimization**:
    - Implement a server-side `image-optimizer.ts` using `sharp` to create multiple responsive image sizes on upload.
    - Create an `EnhancedImage.svelte` component that uses the `<picture>` element and `srcset` to serve optimized images in modern formats (WebP, AVIF).
- **Code Splitting**:
    - Create a `route-splitting.ts` utility to define which routes should be dynamically imported.
    - Implement lazy loading for heavy components using a `createLazyComponent` utility.
- **Web Vitals**:
    - Implement `web-vitals` to track Core Web Vitals and send performance data to an analytics service. Create a `webVitals.ts` utility to manage this.

## 6. Database and Types

**Observation:** There are multiple, conflicting database type definitions (`database.ts`, `database.types.ts`, `database.extended.ts`).

**Plan:**

- **Single Source of Truth**: Use `supabase gen types typescript` to generate a single, authoritative `database.ts` file.
- **Extended Types**: Create an `database.extended.ts` file that imports the generated types and extends them with any necessary application-specific types (e.g., for brand accounts).
- **RPC Function Types**: Create an `rpc.types.ts` file to define types for all database RPC functions, ensuring type safety for server-side calls.

This refactoring plan will be implemented incrementally to minimize disruption and ensure a stable, high-quality codebase.

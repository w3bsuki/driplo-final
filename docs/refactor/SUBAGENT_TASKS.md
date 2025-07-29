# SUBAGENT TASKS - AUTOMATED CLEANUP

## 🤖 Phase 0: Emergency Fix Agent

### Task 1: Fix createEventDispatcher Usage
```
Task: Find and fix ALL createEventDispatcher usage in Svelte 5 components
Context: 
- createEventDispatcher doesn't exist in Svelte 5
- Must convert to callback props pattern
- Known files: TwoFactorSetup.svelte
- Pattern: dispatch('event', data) → onevent?.(data)
Success Criteria:
- Zero createEventDispatcher imports
- All components use callback props
- Authentication flow works
- No runtime errors
```

### Task 2: Fix Runtime Errors
```
Task: Fix NotificationPopup.svelte undefined reference error
Context:
- Line 55 has onclick={handleNotification.action.callback}
- handleNotification is undefined, should be notification
- This causes runtime crashes
Success Criteria:
- No undefined references
- Component renders without errors
- Click handlers work properly
```

## 🔒 Phase 0: Security Agent

### Task 3: Server-Side Payment Processing
```
Task: Move ALL payment processing logic to server-side
Context:
- Current client-side Stripe/Revolut = PCI violation
- Need server actions for all payment operations
- Files: PaymentProcessor.svelte, useStripePayment.svelte.ts, useRevolutPayment.svelte.ts
Success Criteria:
- No payment keys in client code
- All payment logic in +page.server.ts
- Form actions handle payment intents
- Client only handles UI state
```

## 🧹 Phase 1: Deletion Agent

### Task 4: Purge Dead Directories
```
Task: Delete all test and storybook directories
Context:
- Remove: tests/, _testing/, src/stories/, cypress/, .storybook/
- Remove test routes: test-auth/, test-js/, test-2fa/, test-vercel/, minimal-test/
- Update any imports that reference these
Success Criteria:
- Directories completely removed
- No broken imports remain
- Git tracks all deletions
- Update DELETION_LOG.md with counts
```

### Task 5: Uninstall Unused Dependencies
```
Task: Remove all testing and unused dev dependencies
Context:
- Uninstall: @playwright/test, @storybook/*, cypress, lighthouse, @lhci/cli
- Remove from package.json scripts
- Clean up any config files
Success Criteria:
- Dependencies removed from package.json
- node_modules cleaned
- No reference to removed packages
- Build still works
```

## 🔄 Phase 1: Component Consolidation Agent

### Task 6: Merge Filter Components
```
Task: Create UnifiedFilter.svelte and replace all filter components
Context:
- 6 filter components doing same thing
- Need single component with mode prop
- Update ALL imports across codebase
- Components: FilterBar, QuickFilters, MobileFiltersDrawer, etc.
Success Criteria:
- One UnifiedFilter.svelte exists
- All 6 old components deleted
- All imports updated
- Filtering still works
```

### Task 7: Merge Search Components
```
Task: Create UnifiedSearch.svelte and replace all search bars
Context:
- 4 search components with minor differences
- Need single component with variant prop
- Must maintain all functionality
Success Criteria:
- One UnifiedSearch.svelte exists
- All 4 old components deleted
- Search works everywhere
- Responsive behavior maintained
```

## 🛠️ Phase 2: Build Optimization Agent

### Task 8: Remove PostCSS
```
Task: Remove PostCSS and configure Tailwind v4 direct with Vite
Context:
- PostCSS causing 40% slower builds
- Tailwind v4 works directly with Vite
- Need to update vite.config.ts
Success Criteria:
- postcss.config.js deleted
- Tailwind works without PostCSS
- Build time improved by >30%
- All styles still work
```

## 🔍 Phase 2: TypeScript Fixer Agent

### Task 9: Auto-Fix TypeScript Errors
```
Task: Systematically fix TypeScript errors by category
Context:
- ~700 errors currently ignored
- Group by error type and fix in batches
- Start with undefined/null checks
- Then type mismatches
Success Criteria:
- <100 TypeScript errors remain
- No new errors introduced
- Code still runs properly
- Update REFACTOR_PROGRESS.md
```

## 📋 Subagent Execution Template

```typescript
// Example subagent invocation
await Task({
  description: "Fix createEventDispatcher",
  subagent_type: "general-purpose",
  prompt: `
    Task: ${task.description}
    Context: ${task.context}
    Success Criteria: ${task.criteria}
    
    Steps:
    1. Find all instances using grep/Glob
    2. Analyze the pattern
    3. Create replacement code
    4. Update all instances
    5. Verify no errors
    6. Update tracking documents
  `
});
```

## 🎯 Priority Order
1. **CRITICAL:** Tasks 1-3 (Breaking fixes)
2. **HIGH:** Tasks 4-5 (Cleanup)
3. **MEDIUM:** Tasks 6-7 (Consolidation)
4. **LOW:** Tasks 8-9 (Optimization)

## 📊 Success Metrics
- Each task completes in <2 hours
- No manual intervention needed
- All tests pass after completion
- Progress automatically logged
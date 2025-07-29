# UNIFIED REFACTORING PLAN - Driplo.bg Final Sprint

## 🎯 Mission: Ship Working Code Fast

This plan consolidates all previous refactoring plans into a single, executable strategy. Each phase will be handled by a dedicated subagent to ensure focused execution.

## 📊 Current State Analysis

### Critical Metrics:
- **25,702 lines** → Target: **~7,000 lines**
- **3,594 files** → Target: **~500 files**
- **~700 TypeScript errors** being ignored
- **Triple CSS processing** killing performance
- **Client-side payment processing** = security breach
- **createEventDispatcher** breaking Svelte 5 components

## 🚨 Phase 0: Emergency Stabilization (TODAY)

### Subagent Task: Fix Breaking Changes
```
Task: Find and fix ALL createEventDispatcher usage in Svelte 5 components
Context: 
- createEventDispatcher doesn't exist in Svelte 5
- Must convert to callback props pattern
- Focus on TwoFactorSetup.svelte first
- Check ALL auth components
Success Criteria:
- Zero createEventDispatcher imports
- All components use callback props
- Authentication flow works
```

## 🔒 Phase 1: Security & Error Management (Days 2-3)

### Subagent Task: Secure Payment & Auth
```
Task: Move ALL payment processing server-side and fix auth session management
Context:
- Client-side payment = PCI violation
- Auth session management issues reported
- Need server-side validation on ALL forms
Success Criteria:
- No payment logic in client components
- All payment processing in server actions
- Auth sessions properly managed
- Server validation on every form
```

## 🛠️ Phase 2: Build Tools & TypeScript (Days 4-5)

### Subagent Task: Fix Build Pipeline
```
Task: Remove PostCSS triple-processing and resolve critical TypeScript errors
Context:
- PostCSS + Vite = 40% slower builds
- ~700 TypeScript errors ignored
- Need clean Tailwind v4 setup
Success Criteria:
- PostCSS completely removed
- Tailwind v4 working directly with Vite
- <100 TypeScript errors remaining
- Build time improved by 40%
```

## 🔄 Phase 3: Component Consolidation (Week 2)

### Subagent Task: Merge Duplicate Components
```
Task: Consolidate duplicate components into single, configurable versions
Context:
- 6 filter components → 1 dynamic filter
- 4 search bars → 1 search component
- 7 badge variants → 1 configurable badge
- 5 modals → 1 modal with variants
Success Criteria:
- Single version of each component type
- All imports updated automatically
- Zero broken imports
- Component count reduced by 60%
```

## 🚀 Phase 4: SvelteKit Migration (Week 3)

### Subagent Task: Implement Proper Patterns
```
Task: Convert API routes to form actions and add SvelteKit best practices
Context:
- 50+ API routes should be form actions
- Zero prerendering currently
- No progressive enhancement
- Missing error boundaries
Success Criteria:
- Forms work without JavaScript
- Error boundaries prevent crashes
- Proper load functions everywhere
- Prerendering enabled where appropriate
```

## 🧹 Phase 5: Performance & Cleanup (Week 4)

### Subagent Task: Final Optimization
```
Task: Remove dead code, optimize performance, and clean file structure
Context:
- Test routes in production
- Empty translation files
- Duplicate type definitions
- N+1 query issues
Success Criteria:
- File count <600
- Codebase <8,000 lines
- Zero dead code
- Query performance optimized
```

## 📋 Execution Strategy

### For Each Phase:
1. Update todo status to "in_progress"
2. Launch dedicated subagent with specific task
3. Verify success criteria met
4. Update CONTEXT.md with changes
5. Mark todo as "completed"
6. Move to next phase

### Critical Rules:
- **ONE phase at a time** - No parallel phases
- **Test after EVERY change** - No accumulating bugs
- **Working code > perfect code** - Ship fast
- **Update documentation** - Keep CONTEXT.md current

## 🎯 Success Metrics

### After Phase 0-1 (Emergency):
- Zero runtime errors
- Secure payment flow
- Working authentication

### After Phase 2-3 (Stabilization):
- Build 40% faster
- <100 TypeScript errors
- 60% fewer components

### After Phase 4-5 (Optimization):
- True SvelteKit app
- <8,000 lines of code
- Progressive enhancement
- Zero technical debt

## 🚀 Ready to Execute

Each subagent will receive:
- Clear, specific task
- Relevant context
- Measurable success criteria
- Authority to make changes

No more planning. Time to execute.
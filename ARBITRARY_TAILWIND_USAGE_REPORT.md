# Arbitrary Tailwind Values & Non-Tailwind CSS Report

## Summary
Found extensive usage of arbitrary Tailwind values, inline styles, and custom CSS across the codebase.

## 1. Arbitrary Tailwind Values

### Color Values
- **Hex Colors:**
  - `text-[#4F9FC5]` - Multiple occurrences in sellers page
  - `text-[#3d7a96]` - Hover state color
  - `text-[#6BB6D8]`, `bg-[#6BB6D8]` - Various gradient colors
  - `stroke-[3]` - Custom stroke width

### Spacing Values
- **Fixed Heights:**
  - `max-h-[90vh]`, `max-h-[80vh]`, `max-h-[60vh]` - Modal heights
  - `h-[75vh]` - Message page layout
  - `min-h-[100dvh]`, `min-h-[60px]`, `min-h-[44px]`, `min-h-[200px]`
  - `max-h-[600px]`, `max-h-[calc(90vh-200px)]`

- **Fixed Widths:**
  - `w-[48px]`, `w-[70px]`, `w-[100px]`
  - `min-w-[64px]`, `min-w-[96px]`, `min-w-[140px]`, `min-w-[20px]`
  - `max-w-[4rem]`, `max-w-[70%]`, `max-w-[400px]`

- **Z-Index:**
  - `z-[100]`, `z-[9999]`, `z-[10000]` - Various overlay and modal layers

### CSS Variable References
Extensive use of CSS variables wrapped in square brackets:
- `bg-[var(--color-surface-primary)]`
- `text-[var(--color-text-primary)]`
- `rounded-[var(--border-radius-2xl)]`
- `p-[var(--spacing-4)]`
- `gap-[var(--spacing-2)]`
- `shadow-[var(--box-shadow-dropdown)]`

### Animation Values
- `animate-[loading-bar_1s_ease-in-out_infinite]` - Custom loading animation

### Background Images
- Complex SVG pattern: `bg-[url('data:image/svg+xml,...')]`

## 2. Inline Styles

Found 8 instances of inline styles:
1. `style="width: {completionPercentage}%"` - Progress bars
2. `style="width: {imageUpload.uploadProgress}%"` - Upload progress
3. `style="display: none;"` - Hidden elements (3 occurrences)
4. `style="min-height: 200px;"` - Image container
5. `style="padding-left: 2.5rem;"` - Search inputs (2 occurrences)
6. `style:object-fit={objectFit}` - Dynamic object-fit

## 3. Components with <style> Blocks

47 Svelte files contain custom CSS in `<style>` blocks:
- Layout components (Header, MobileNav)
- UI components (Image, Input, Button, Badge)
- Feature components (CheckoutFlow, ProfileSetupWizard)
- Brand components (BrandOnboardingWizard, BrandLogoStep)

### Common CSS Patterns in Style Blocks:
- Focus styles for accessibility
- Transition animations
- Loading states
- Custom scrollbar styles
- Hover effects
- Grid/flexbox layouts

## 4. Pattern Categories

### High-Priority Refactoring Targets:
1. **Fixed pixel values** → Tailwind spacing scale
2. **Hex colors** → Design system colors
3. **CSS variables in brackets** → Direct Tailwind classes or custom utilities
4. **Z-index values** → Standardized z-index scale
5. **Inline styles** → Tailwind classes or component props

### Component-Specific Issues:
- **CheckoutFlow.svelte**: Heavy use of CSS variable references
- **Messages pages**: Fixed viewport heights
- **Modals**: Arbitrary max-height values
- **Sellers page**: Hard-coded brand colors

## Recommendations

1. **Create a design system** with standardized:
   - Color palette (replace hex values)
   - Spacing scale (replace arbitrary px values)
   - Z-index scale (replace arbitrary z-values)

2. **Extend Tailwind config** for:
   - Custom height/width values used repeatedly
   - Brand colors (#4F9FC5, #6BB6D8, etc.)
   - Animation keyframes

3. **Replace CSS variables** with:
   - Direct Tailwind utilities where possible
   - Custom Tailwind plugins for complex patterns

4. **Refactor inline styles** to:
   - Dynamic Tailwind classes
   - CSS-in-JS solutions for truly dynamic values
   - Data attributes for state-based styling
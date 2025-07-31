#!/bin/bash
set -e

echo "🔧 Applying Svelte 5 migration fixes..."

# Create backup
BACKUP_DIR="backups/svelte5-fixes-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Creating backup in $BACKUP_DIR"
cp -r src "$BACKUP_DIR/"

echo "🏗️  Applying Svelte 5 migration fixes..."

# Fix 1: Convert non-reactive variables to $state()
echo "⚡ Fixing non-reactive variable updates..."
find src -name "*.svelte" -type f | while read -r file; do
    # Check if file contains non-reactive update warnings in error log
    if grep -q "$(basename "$file")" typescript-errors-full.txt 2>/dev/null && \
       grep -A5 -B5 "$(basename "$file")" typescript-errors-full.txt 2>/dev/null | grep -q "not declared with.*state"; then
        
        echo "  📝 Fixing reactive variables in $file"
        
        # Common patterns that need $state()
        # HTMLElement variables
        sed -i 's/let \([a-zA-Z_][a-zA-Z0-9_]*\): HTMLElement\([^=]*\);/let \1 = $state<HTMLElement | null>(null);/g' "$file"
        sed -i 's/let \([a-zA-Z_][a-zA-Z0-9_]*\): HTMLImageElement\([^=]*\);/let \1 = $state<HTMLImageElement | null>(null);/g' "$file"
        sed -i 's/let \([a-zA-Z_][a-zA-Z0-9_]*\): HTMLDivElement\([^=]*\);/let \1 = $state<HTMLDivElement | null>(null);/g' "$file"
        sed -i 's/let \([a-zA-Z_][a-zA-Z0-9_]*\): HTMLCanvasElement\([^=]*\);/let \1 = $state<HTMLCanvasElement | null>(null);/g' "$file"
        
        # Component variables
        sed -i 's/let \([a-zA-Z_][a-zA-Z0-9_]*\): ComponentType\([^=]*\);/let \1 = $state<ComponentType | null>(null);/g' "$file"
        
        # Element reference patterns
        sed -i 's/let \([a-zA-Z_][a-zA-Z0-9_]*Element\): [^=]* | null;/let \1 = $state<HTMLElement | null>(null);/g' "$file"
    fi
done

# Fix 2: Replace deprecated svelte:component
echo "🔄 Replacing deprecated svelte:component usage..."
find src -name "*.svelte" -type f -exec grep -l "svelte:component" {} \; | while read -r file; do
    echo "  📝 Fixing svelte:component in $file"
    
    # Replace <svelte:component this={Component} with dynamic component
    # Note: This is a simple replacement - complex cases may need manual review
    sed -i 's/<svelte:component this={\([^}]*\)}\([^>]*\)\/>/{\1 ? <\1\2\/> : ""}/g' "$file"
    sed -i 's/<svelte:component this={\([^}]*\)}\([^>]*\)>/{\1 ? <\1\2> : ""}/g' "$file"
    sed -i 's/<\/svelte:component>/<\/> : ""}/g' "$file"
    
    # Add a comment for manual review of complex cases
    if grep -q "svelte:component" "$file"; then
        sed -i '1i<!-- TODO: Review svelte:component replacements - some may need manual adjustment -->' "$file"
    fi
done

# Fix 3: Fix self-closing HTML tags
echo "🏷️  Fixing self-closing HTML tags..."
find src -name "*.svelte" -type f | while read -r file; do
    # Fix textarea self-closing tags
    if grep -q "<textarea[^>]*\/>" "$file"; then
        echo "  📝 Fixing textarea tags in $file"
        sed -i 's/<textarea\([^>]*\)\/>/\<textarea\1><\/textarea>/g' "$file"
    fi
    
    # Fix canvas self-closing tags
    if grep -q "<canvas[^>]*\/>" "$file"; then
        echo "  📝 Fixing canvas tags in $file"
        sed -i 's/<canvas\([^>]*\)\/>/\<canvas\1><\/canvas>/g' "$file"
    fi
    
    # Fix button self-closing tags
    if grep -q "<button[^>]*\/>" "$file"; then
        echo "  📝 Fixing button tags in $file"
        sed -i 's/<button\([^>]*\)\/>/\<button\1><\/button>/g' "$file"
    fi
    
    # Fix div self-closing tags
    if grep -q "<div[^>]*\/>" "$file"; then
        echo "  📝 Fixing div tags in $file"
        sed -i 's/<div\([^>]*\)\/>/\<div\1><\/div>/g' "$file"
    fi
done

# Fix 4: Update deprecated reactive declarations
echo "🔄 Updating reactive declarations..."
find src -name "*.svelte" -type f -exec grep -l "\$:" {} \; | while read -r file; do
    echo "  📝 Reviewing reactive declarations in $file"
    
    # Add comment for manual review (this needs careful conversion)
    if ! grep -q "// TODO: Review reactive declarations" "$file"; then
        sed -i '/\$:/i\ \ \ \ // TODO: Review - convert $: to $derived() where appropriate' "$file"
    fi
done

# Fix 5: Handle button nesting issues
echo "🔘 Fixing button nesting issues..."
find src -name "*.svelte" -type f -exec grep -l "button.*button" {} \; | while read -r file; do
    echo "  📝 Reviewing button nesting in $file"
    
    # Add warning comment for manual review
    if ! grep -q "// TODO: Review button nesting" "$file"; then
        sed -i '/button.*button/i\ \ \ \ // TODO: Review - buttons cannot be nested, consider restructuring' "$file"
    fi
done

# Fix 6: Create helper migration utilities
echo "🛠️  Creating Svelte 5 migration helpers..."
cat > scripts/generated/svelte5-helpers.js << 'EOF'
// Svelte 5 Migration Helper Functions

/**
 * Convert a reactive declaration to $derived
 * Usage: Replace $: result = computeValue() with let result = $derived(() => computeValue())
 */
export function createDerived(computation) {
    return $derived(computation);
}

/**
 * Convert a reactive statement to $effect
 * Usage: Replace $: { sideEffect() } with $effect(() => { sideEffect() })
 */
export function createEffect(effect) {
    return $effect(effect);
}

/**
 * Helper for component dynamic rendering
 * Usage: Replace <svelte:component this={Component} /> with {#if Component}<Component />{/if}
 */
export function renderComponent(Component, props = {}) {
    return Component ? `<${Component} ${Object.entries(props).map(([k,v]) => `${k}={${v}}`).join(' ')} />` : '';
}

/**
 * Safe state initialization
 * Usage: let myState = safeState(initialValue)
 */
export function safeState(initialValue) {
    return $state(initialValue);
}
EOF

# Create a verification script
cat > scripts/generated/verify-svelte5-fixes.sh << 'EOF'
#!/bin/bash
echo "🔍 Verifying Svelte 5 migration fixes..."

echo "Checking for remaining issues:"
echo "1. Non-reactive updates:"
pnpm run check 2>&1 | grep -c "not declared with.*state" || echo "  ✅ No non-reactive update warnings"

echo "2. Deprecated svelte:component:"
pnpm run check 2>&1 | grep -c "svelte:component.*deprecated" || echo "  ✅ No deprecated svelte:component usage"

echo "3. Self-closing tag warnings:"
pnpm run check 2>&1 | grep -c "Self-closing HTML tags" || echo "  ✅ No self-closing tag warnings"

echo "4. Button nesting warnings:"
pnpm run check 2>&1 | grep -c "button.*cannot be.*child.*button" || echo "  ✅ No button nesting warnings"

echo ""
echo "Manual review needed for files with TODO comments:"
grep -r "TODO: Review" src/ --include="*.svelte" | wc -l | xargs echo "Files needing review:"
EOF

chmod +x scripts/generated/verify-svelte5-fixes.sh

echo "✅ Svelte 5 migration fixes applied!"
echo ""
echo "📊 Summary of fixes:"
echo "  - Reactive variables: Converted to \$state()"
echo "  - svelte:component: Replaced with dynamic components"
echo "  - Self-closing tags: Fixed textarea, canvas, button, div"
echo "  - Reactive declarations: Marked for manual review"
echo "  - Button nesting: Marked problematic cases for review"
echo ""
echo "🔍 Next steps:"
echo "1. Run './scripts/generated/verify-svelte5-fixes.sh' to check progress"
echo "2. Review files with TODO comments for manual fixes"
echo "3. Test components to ensure functionality is preserved"
echo "4. Run 'pnpm run check' to see remaining issues"
echo ""
echo "📦 Backup available in: $BACKUP_DIR"
echo ""
echo "⚠️  Important: Some fixes require manual review - check TODO comments!"
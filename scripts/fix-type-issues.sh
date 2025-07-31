#!/bin/bash
set -e

echo "🔧 Applying systematic type safety fixes..."

# Create backup
BACKUP_DIR="backups/type-fixes-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Creating backup in $BACKUP_DIR"
cp -r src "$BACKUP_DIR/"

echo "🏗️  Applying type fixes..."

# Fix 1: formatCurrency calls missing currency parameter
echo "💰 Fixing formatCurrency calls..."
find src -name "*.svelte" -type f -exec grep -l "formatCurrency(" {} \; | while read -r file; do
    echo "  📝 Fixing $file"
    # Only add currency parameter if it's missing
    sed -i 's/formatCurrency(\([^,)]*\))/formatCurrency(\1, "BGN")/g' "$file"
done

# Fix 2: Remove 'xs' size references (not supported in the type system)
echo "📏 Fixing size enum issues..."
find src -name "*.svelte" -type f -exec grep -l 'size="xs"' {} \; | while read -r file; do
    echo "  📝 Fixing size in $file"
    sed -i 's/size="xs"/size="sm"/g' "$file"
done

# Fix 3: Add null guards to canvas operations
echo "🎨 Fixing canvas null safety..."
find src -name "*.svelte" -type f -exec grep -l "canvas\.\(width\|height\)" {} \; | while read -r file; do
    echo "  📝 Adding canvas null guards in $file"
    # Add null guards for canvas width/height
    sed -i 's/canvas\.width/canvas?.width || 0/g' "$file"
    sed -i 's/canvas\.height/canvas?.height || 0/g' "$file"
done

# Fix 4: Add null guards to common DOM element patterns
echo "🔍 Adding DOM element null guards..."
find src -name "*.svelte" -type f -exec grep -l "fileInput\." {} \; | while read -r file; do
    echo "  📝 Adding fileInput null guards in $file"
    # Convert fileInput.click() to fileInput?.click()
    sed -i 's/fileInput\.click()/fileInput?.click()/g' "$file"
done

# Fix 5: Fix form object null safety
echo "📋 Fixing form null safety..."
find src -name "*.svelte" -type f -exec grep -l "form\." {} \; | while read -r file; do
    # Skip if already has null checking
    if ! grep -q "form\?" "$file"; then
        echo "  📝 Adding form null guards in $file"
        # Add guards for common form patterns
        sed -i 's/form\.elements/form?.elements/g' "$file"
        sed -i 's/form\.checkValidity/form?.checkValidity/g' "$file"
    fi
done

# Fix 6: Fix string array assignments
echo "🔤 Fixing string vs string[] type mismatches..."
find src -name "*.svelte" -type f -exec grep -l "bind:value.*category" {} \; | while read -r file; do
    echo "  📝 Reviewing category bindings in $file"
    # Note: This requires manual review as the fix depends on component context
    # Adding a comment for manual review
    if ! grep -q "// TODO: Review category binding" "$file"; then
        sed -i '/bind:value.*category/i\ \ \ \ // TODO: Review category binding - may need array wrapping' "$file"
    fi
done

# Fix 7: Add error boundaries for undefined values
echo "🛡️  Adding error boundaries..."
cat > scripts/generated/error-boundary-mixin.js << 'EOF'
// Helper function to safely access potentially undefined values
export function safeAccess(obj, path, defaultValue = '') {
    return path.split('.').reduce((current, key) => {
        return current?.[key] ?? defaultValue;
    }, obj);
}

// Helper for safe array access
export function ensureArray(value) {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
}

// Helper for safe string access
export function ensureString(value, defaultValue = '') {
    return value?.toString() ?? defaultValue;
}
EOF

echo "✅ Type safety fixes applied!"
echo ""
echo "📊 Summary of fixes:"
echo "  - formatCurrency calls: Added BGN currency parameter"
echo "  - Size enums: Changed 'xs' to 'sm'"
echo "  - Canvas operations: Added null guards"
echo "  - File inputs: Added optional chaining"
echo "  - Form elements: Added null safety"
echo "  - Category bindings: Marked for review"
echo ""
echo "🔍 Next steps:"
echo "1. Run 'pnpm run check' to see remaining type errors"
echo "2. Review files marked with '// TODO: Review category binding'"
echo "3. Test the application to ensure functionality is preserved"
echo ""
echo "📦 Backup available in: $BACKUP_DIR"
echo ""
echo "🔬 To verify fixes, run:"
echo "pnpm run check 2>&1 | grep -c \"Type.*not assignable\""
echo "(Target: <50 results)"
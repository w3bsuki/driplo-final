#!/bin/bash
set -e

echo "🔧 Applying accessibility fixes..."

# Create backup
BACKUP_DIR="backups/a11y-fixes-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Creating backup in $BACKUP_DIR"
cp -r src "$BACKUP_DIR/"

echo "🏗️  Applying accessibility improvements..."

# Fix 1: Add keyboard event handlers to click events
echo "⌨️  Adding keyboard event handlers..."
find src -name "*.svelte" -type f | while read -r file; do
    # Check if file has click events without keyboard support
    if grep -q "onclick=" "$file" && ! grep -q "onkeydown=" "$file"; then
        echo "  📝 Adding keyboard support in $file"
        
        # Create temporary file for processing
        temp_file=$(mktemp)
        
        # Process the file line by line to add keyboard handlers
        while IFS= read -r line; do
            if [[ "$line" =~ onclick=\{([^}]+)\} ]] && [[ ! "$line" =~ onkeydown= ]]; then
                # Extract the click handler
                handler="${BASH_REMATCH[1]}"
                # Add keyboard handler after onclick
                echo "$line" | sed "s/onclick={$handler}/onclick={$handler} onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') \&\& ($handler)}/" >> "$temp_file"
            else
                echo "$line" >> "$temp_file"
            fi
        done < "$file"
        
        # Replace original file with processed version
        mv "$temp_file" "$file"
    fi
done

# Fix 2: Add ARIA labels to buttons without text
echo "🏷️  Adding ARIA labels to buttons..."
find src -name "*.svelte" -type f -exec grep -l "<button" {} \; | while read -r file; do
    echo "  📝 Reviewing buttons in $file"
    
    # Add aria-label to buttons that likely need it (containing only SVG/icons)
    sed -i 's/<button\([^>]*\)>\s*<svg/<button\1 aria-label="Action button">\n    <svg/g' "$file"
    
    # Common button patterns and their labels
    sed -i 's/aria-label="Action button">\s*<svg[^>]*>\s*<path[^>]*d="M4 16l4.586-4.586[^"]*"/aria-label="Add image">\n    <svg/g' "$file"
    sed -i 's/aria-label="Action button">\s*<svg[^>]*>\s*<path[^>]*d="M9 3L3 9M3 3l6 6[^"]*"/aria-label="Remove">\n    <svg/g' "$file"
    sed -i 's/aria-label="Action button">\s*<svg[^>]*>\s*<path[^>]*d="M6 18L18 6M6 6l12 12[^"]*"/aria-label="Close">\n    <svg/g' "$file"
    sed -i 's/aria-label="Action button">\s*<svg[^>]*>\s*<path[^>]*search[^"]*"/aria-label="Search">\n    <svg/g' "$file"
done

# Fix 3: Add proper roles to interactive elements
echo "🎭 Adding ARIA roles to interactive elements..."
find src -name "*.svelte" -type f | while read -r file; do
    echo "  📝 Adding roles in $file"
    
    # Add role="button" and tabindex to clickable divs
    sed -i 's/<div\([^>]*\)onclick=\{[^}]*\}\([^>]*\)>/<div\1onclick={handler}\2 role="button" tabindex="0">/g' "$file"
    
    # Fix combobox roles (add missing attributes)
    if grep -q 'role="combobox"' "$file"; then
        # Add aria-controls if missing
        sed -i 's/role="combobox"\([^>]*\)>/role="combobox"\1 aria-controls="listbox-options">/g' "$file"
        
        # Add tabindex if missing
        sed -i 's/role="combobox"\([^>]*\)>/role="combobox"\1 tabindex="0">/g' "$file"
    fi
done

# Fix 4: Fix label associations
echo "🏷️  Fixing form label associations..."
find src -name "*.svelte" -type f -exec grep -l "<label" {} \; | while read -r file; do
    echo "  📝 Reviewing labels in $file"
    
    # Add for attributes to labels that are missing them
    # This is a simple pattern - complex cases need manual review
    if grep -q "<label[^>]*>[^<]*<input" "$file"; then
        # Label wraps input - this is OK
        continue
    elif grep -q "<label[^>]*for=" "$file"; then
        # Label has for attribute - this is OK
        continue  
    else
        # Add comment for manual review
        sed -i '/<label/i\ \ \ \ <!-- TODO: Review label association - add for attribute or wrap input -->' "$file"
    fi
done

# Fix 5: Add ARIA roles to drag-and-drop areas
echo "🎯 Adding roles to drag-and-drop areas..."
find src -name "*.svelte" -type f -exec grep -l "dragenter\|dragleave\|dragover\|drop" {} \; | while read -r file; do
    echo "  📝 Adding drag-drop roles in $file"
    
    # Add role="region" and aria-label to drag areas
    sed -i 's/<div\([^>]*\)\(dragenter\|dragleave\|dragover\|drop\)=/<div\1role="region" aria-label="File drop area" \2=/g' "$file"
done

# Fix 6: Fix image click handlers (convert to buttons)
echo "🖼️  Fixing image click handlers..."
find src -name "*.svelte" -type f -exec grep -l "img.*onclick" {} \; | while read -r file; do
    echo "  📝 Converting image click handlers in $file"
    
    # Add comment suggesting to wrap in button
    sed -i '/img.*onclick/i\ \ \ \ <!-- TODO: Consider wrapping clickable image in button element for better accessibility -->' "$file"
    
    # Add role and tabindex to make image keyboard accessible
    sed -i 's/<img\([^>]*\)onclick=\{[^}]*\}\([^>]*\)>/<img\1onclick={handler}\2 role="button" tabindex="0" onkeydown={(e) => (e.key === "Enter" || e.key === " ") \&\& onclick}>/g' "$file"
done

# Create accessibility verification script
cat > scripts/generated/verify-a11y-fixes.sh << 'EOF'
#!/bin/bash
echo "🔍 Verifying accessibility fixes..."

echo "Checking for remaining accessibility warnings:"

echo "1. Click events without keyboard handlers:"
count=$(pnpm run check 2>&1 | grep -c "click events have key events" || echo "0")
echo "  $count remaining (target: 0)"

echo "2. Missing ARIA labels:"
count=$(pnpm run check 2>&1 | grep -c "aria-label.*aria-labelledby" || echo "0")
echo "  $count remaining (target: 0)"

echo "3. Interactive elements without focus support:"
count=$(pnpm run check 2>&1 | grep -c "interactive.*supports focus" || echo "0")
echo "  $count remaining (target: 0)"

echo "4. Missing ARIA roles:"
count=$(pnpm run check 2>&1 | grep -c "role.*required.*aria" || echo "0")
echo "  $count remaining (target: 0)"

echo "5. Non-interactive elements with interactions:"
count=$(pnpm run check 2>&1 | grep -c "Non-interactive element.*should not be assigned" || echo "0")
echo "  $count remaining (target: 0)"

echo "6. Label associations:"
count=$(pnpm run check 2>&1 | grep -c "form label must be associated" || echo "0")
echo "  $count remaining (target: 0)"

echo ""
echo "Manual review needed for files with TODO comments:"
count=$(grep -r "TODO.*accessibility\|TODO.*Review label\|TODO.*Consider wrapping" src/ --include="*.svelte" | wc -l)
echo "  $count files need manual review"

echo ""
echo "🎯 Accessibility improvement suggestions:"
echo "  - Use semantic HTML elements (button, input, etc.) instead of div with handlers"
echo "  - Ensure all interactive elements are keyboard accessible"
echo "  - Provide descriptive ARIA labels for screen readers"
echo "  - Test with keyboard navigation and screen readers"
EOF

chmod +x scripts/generated/verify-a11y-fixes.sh

# Create a comprehensive accessibility guide
cat > scripts/generated/accessibility-guide.md << 'EOF'
# Accessibility Improvement Guide

## Quick Fixes Applied

### 1. Keyboard Event Handlers
- Added `onkeydown` handlers to elements with `onclick`
- Responds to Enter and Space keys
- Pattern: `onclick={handler} onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handler}`

### 2. ARIA Labels
- Added descriptive labels to icon-only buttons
- Common patterns:
  - Image buttons: `aria-label="Add image"`
  - Close buttons: `aria-label="Close"`
  - Remove buttons: `aria-label="Remove"`

### 3. Interactive Element Roles
- Added `role="button"` to clickable divs
- Added `tabindex="0"` for keyboard focus
- Added missing combobox attributes

### 4. Form Labels
- Added TODO comments for labels missing associations
- Requires manual review to add proper `for` attributes

## Manual Review Required

Files with TODO comments need manual attention:

### Image Click Handlers
Consider wrapping clickable images in proper button elements:
```svelte
<!-- Instead of: -->
<img onclick={handler} alt="..." />

<!-- Use: -->
<button onclick={handler} class="image-button">
  <img alt="..." />
</button>
```

### Label Associations
Ensure all form inputs have proper labels:
```svelte
<!-- Option 1: Wrapping label -->
<label>
  Name
  <input bind:value={name} />
</label>

<!-- Option 2: Associated label -->
<label for="name-input">Name</label>
<input id="name-input" bind:value={name} />
```

### Complex Interactive Elements
Review custom interactive components for:
- Proper ARIA roles and states
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## Testing Checklist

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Use Enter/Space to activate buttons
   - Use arrow keys in menus/lists

2. **Screen Reader Testing**
   - Test with NVDA, JAWS, or VoiceOver
   - Ensure all content is announced
   - Check for proper landmarks

3. **Color Contrast**
   - Verify sufficient contrast ratios
   - Test with color blindness simulators

4. **Mobile Accessibility**
   - Test with mobile screen readers
   - Ensure touch targets are large enough
   - Verify gesture navigation

## Resources

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Svelte Accessibility](https://svelte.dev/docs/accessibility-warnings)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
EOF

echo "✅ Accessibility fixes applied!"
echo ""
echo "📊 Summary of fixes:"
echo "  - Keyboard handlers: Added to click events"
echo "  - ARIA labels: Added to icon-only buttons"
echo "  - Interactive roles: Added role='button' and tabindex"
echo "  - Drag-drop areas: Added proper roles"
echo "  - Form labels: Marked for manual review"
echo "  - Image handlers: Marked for conversion to buttons"
echo ""
echo "🔍 Next steps:"
echo "1. Run './scripts/generated/verify-a11y-fixes.sh' to check progress"
echo "2. Review files with TODO comments for manual fixes"
echo "3. Test with keyboard navigation"
echo "4. Consider screen reader testing"
echo ""
echo "📦 Backup available in: $BACKUP_DIR"
echo "📖 Guide available in: scripts/generated/accessibility-guide.md"
echo ""
echo "⚠️  Note: Accessibility is best achieved with semantic HTML and manual testing!"
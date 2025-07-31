#!/bin/bash
set -e

echo "🔧 Extracting missing translation keys from TypeScript errors..."

# Create scripts directory if it doesn't exist
mkdir -p scripts/generated

# Extract missing translation keys from error log
if [ ! -f "typescript-errors-full.txt" ]; then
    echo "❌ Error: typescript-errors-full.txt not found. Run 'pnpm run check > typescript-errors-full.txt' first."
    exit 1
fi

echo "📝 Finding all missing paraglide keys..."
grep -o "Property '[^']*' does not exist" typescript-errors-full.txt | \
  sed "s/Property '//" | sed "s/' does not exist//" | \
  sort -u > scripts/generated/missing-keys.txt

KEY_COUNT=$(wc -l < scripts/generated/missing-keys.txt)
echo "📊 Found $KEY_COUNT missing translation keys"

echo "🏗️  Generating translation entries..."
cat > scripts/generated/new-translations.json << 'EOF'
{
EOF

# Process each key and generate translation entry
while IFS= read -r key; do
    # Convert snake_case to Title Case for display
    display_name=$(echo "$key" | sed 's/_/ /g' | sed 's/\b\w/\U&/g')
    
    # Add appropriate context based on key patterns
    case "$key" in
        *_address*|*_line*|*city*|*postal*|*phone*)
            display_name="$display_name"
            ;;
        *payment*|*card*|*cvv*|*expiry*)
            display_name="$display_name"
            ;;
        *shipping*|*delivery*)
            display_name="$display_name"
            ;;
        *order*|*cart*)
            display_name="$display_name"
            ;;
        *processing*|*loading*)
            display_name="$display_name..."
            ;;
        *successful*|*success*)
            display_name="$display_name!"
            ;;
        *failed*|*error*)
            display_name="$display_name"
            ;;
    esac
    
    echo "  \"$key\": \"$display_name\"," >> scripts/generated/new-translations.json
done < scripts/generated/missing-keys.txt

# Remove trailing comma from last entry
sed -i '$ s/,$//' scripts/generated/new-translations.json

cat >> scripts/generated/new-translations.json << 'EOF'
}
EOF

echo "✅ Translation entries generated in scripts/generated/new-translations.json"
echo ""
echo "📋 Next steps:"
echo "1. Review the generated translations in scripts/generated/new-translations.json"
echo "2. Add these entries to your paraglide messages file (usually messages/en.json)"
echo "3. Run 'pnpm run check' to verify the translation errors are resolved"
echo ""
echo "🔍 Preview of generated translations:"
head -10 scripts/generated/new-translations.json

# Create a quick verification command
echo ""
echo "🔬 To verify fixes, run:"
echo "pnpm run check 2>&1 | grep -c \"Property.*does not exist.*messages\""
echo "(Target: 0 results)"
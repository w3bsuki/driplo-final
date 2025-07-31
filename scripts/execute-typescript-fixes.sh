#!/bin/bash
set -e

# TypeScript Error Fix Master Execution Script
# Based on TYPESCRIPT_ERROR_FIX_STRATEGY_V2.md

echo "🚀 Starting TypeScript Error Fix Process"
echo "========================================"

# Ensure we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: Must be run from project root directory"
    exit 1
fi

# Create directories
mkdir -p scripts/generated
mkdir -p backups
mkdir -p logs

# Initialize log file
LOG_FILE="logs/typescript-fix-$(date +%Y%m%d-%H%M%S).log"
touch "$LOG_FILE"

# Helper function for logging
log() {
    echo "$1" | tee -a "$LOG_FILE"
}

# Helper function to check error count
check_errors() {
    local phase="$1"
    log "📊 Checking error count after $phase..."
    
    pnpm run check 2>&1 | tee "logs/errors-after-$phase-$(date +%Y%m%d-%H%M%S).txt"
    
    local errors=$(pnpm run check 2>&1 | grep -oE "found [0-9]+ errors" | grep -oE "[0-9]+" || echo "0")
    local warnings=$(pnpm run check 2>&1 | grep -oE "found [0-9]+ warnings" | grep -oE "[0-9]+" || echo "0")
    
    log "  Errors: $errors, Warnings: $warnings"
    echo "$phase,$errors,$warnings" >> "logs/progress-tracker.csv"
    
    return 0
}

# Initialize progress tracker
echo "Phase,Errors,Warnings" > "logs/progress-tracker.csv"

log "🔍 Initial error assessment..."
check_errors "initial"

# Make scripts executable
chmod +x scripts/*.sh

log ""
log "🎯 PHASE 1: Critical Blockers (ETA: 2 hours)"
log "============================================="

# Phase 1.1: Translation Keys
log "📝 Step 1: Fixing translation keys..."
if [ -f "scripts/fix-translation-keys.sh" ]; then
    bash scripts/fix-translation-keys.sh | tee -a "$LOG_FILE"
    
    # Apply the generated translations (manual step noted)
    if [ -f "scripts/generated/new-translations.json" ]; then
        log "⚠️  Manual step required: Add translations from scripts/generated/new-translations.json to your paraglide messages file"
        log "   Pausing for manual intervention..."
        read -p "Press Enter after adding translations to continue..."
    fi
    
    check_errors "translation-keys"
else
    log "⚠️  Translation fix script not found, skipping..."
fi

# Phase 1.2: Type Issues
log ""
log "🔧 Step 2: Fixing type assignment issues..."
if [ -f "scripts/fix-type-issues.sh" ]; then
    bash scripts/fix-type-issues.sh | tee -a "$LOG_FILE"
    check_errors "type-issues"
else
    log "⚠️  Type fix script not found, skipping..."
fi

# Phase 1.3: Svelte 5 Migration
log ""
log "⚡ Step 3: Applying Svelte 5 migration fixes..."
if [ -f "scripts/fix-svelte5-issues.sh" ]; then
    bash scripts/fix-svelte5-issues.sh | tee -a "$LOG_FILE"
    check_errors "svelte5-migration"
else
    log "⚠️  Svelte 5 fix script not found, skipping..."
fi

log ""
log "🎯 PHASE 2: High-Impact Files (ETA: 2.5 hours)"
log "==============================================="

# Create high-impact file fixes
log "🎯 Targeting high-error-count files..."

# List of top error files from analysis
high_impact_files=(
    "src/lib/components/shared/UnifiedFilter.svelte"
    "src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte"
    "src/lib/components/checkout/checkout-modal/ShippingForm.svelte"
    "src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte"
    "src/lib/components/profile/SocialMediaLinks.svelte"
    "src/lib/components/checkout/CheckoutFlow.svelte"
    "src/routes/brands/settings/+page.svelte"
    "src/lib/components/checkout/checkout-modal/PaymentSelector.svelte"
    "src/lib/components/shared/UnifiedSearch.svelte"
    "src/routes/(app)/onboarding/+page.svelte"
)

log "📋 High-impact files to focus on:"
for file in "${high_impact_files[@]}"; do
    if [ -f "$file" ]; then
        error_count=$(pnpm run check 2>&1 | grep "$file" | wc -l || echo "0")
        log "  - $file ($error_count errors)"
    fi
done

log ""
log "⚠️  Manual intervention recommended for high-impact files:"
log "   These files contain complex issues that need careful review"
log "   Consider using an IDE with TypeScript support for detailed fixes"

# Phase 2: Pause for manual intervention
read -p "Pause for manual fixes on high-impact files. Press Enter when ready to continue..."

check_errors "high-impact-files"

log ""
log "🎯 PHASE 3: Accessibility Improvements"
log "======================================"

# Phase 3: Accessibility
log "♿ Applying accessibility fixes..."
if [ -f "scripts/fix-accessibility.sh" ]; then
    bash scripts/fix-accessibility.sh | tee -a "$LOG_FILE"
    check_errors "accessibility"
else
    log "⚠️  Accessibility fix script not found, skipping..."
fi

log ""
log "🎯 FINAL VERIFICATION"
log "===================="

# Final check
log "🔍 Running final TypeScript check..."
check_errors "final"

# Generate summary report
log ""
log "📊 FINAL SUMMARY"
log "================"

# Read progress from CSV
if [ -f "logs/progress-tracker.csv" ]; then
    log "Progress tracking:"
    cat "logs/progress-tracker.csv" | tee -a "$LOG_FILE"
fi

# Calculate improvement
initial_errors=$(head -2 "logs/progress-tracker.csv" | tail -1 | cut -d',' -f2)
final_errors=$(tail -1 "logs/progress-tracker.csv" | cut -d',' -f2)
improvement=$((initial_errors - final_errors))

log ""
log "🎉 RESULTS:"
log "  Initial errors: $initial_errors"
log "  Final errors: $final_errors"
log "  Errors fixed: $improvement"
log "  Improvement: $(echo "scale=1; $improvement * 100 / $initial_errors" | bc -l)%"

# Success criteria check
if [ "$final_errors" -lt 50 ]; then
    log "✅ SUCCESS: Error count below 50 - ready for production!"
elif [ "$final_errors" -lt 100 ]; then
    log "🟡 GOOD PROGRESS: Error count below 100 - continue with manual fixes"
else
    log "🔴 MORE WORK NEEDED: Error count still high - review strategy"
fi

# Generate next steps
log ""
log "📋 NEXT STEPS:"
if [ "$final_errors" -gt 0 ]; then
    log "1. Review remaining errors in: logs/errors-after-final-*.txt"
    log "2. Focus on manual fixes for complex type issues"
    log "3. Consider using TypeScript strict mode gradually"
    log "4. Run individual fix scripts again if needed"
fi

log "5. Test application functionality: pnpm run dev"
log "6. Run tests: pnpm run test (if available)"
log "7. Consider linting: pnpm run lint"

# Archive logs
log ""
log "📁 Process complete! Logs available in:"
log "  - Main log: $LOG_FILE"
log "  - Progress: logs/progress-tracker.csv"
log "  - Error snapshots: logs/errors-after-*.txt"
log "  - Backups: backups/*"

# Final recommendations
log ""
log "💡 RECOMMENDATIONS:"
log "  - Commit working changes frequently during manual fixes"
log "  - Test each major fix before proceeding"
log "  - Consider enabling TypeScript strict mode incrementally"
log "  - Set up pre-commit hooks to prevent future type errors"

echo ""
echo "🎊 TypeScript fix process completed!"
echo "Check the logs for detailed results and next steps."
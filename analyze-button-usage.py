import os
import re
from collections import defaultdict

def analyze_svelte_file(filepath):
    """Analyze a Svelte file for button usage and imports"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for Button component imports
    button_import_patterns = [
        r"import\s+(?:\{[^}]*\bButton\b[^}]*\}|Button)\s+from\s+['\"][\$@]lib/components/ui(?:/button)?(?:\.svelte)?['\"]",
        r"import\s+Button\s+from\s+['\"][\$@]lib/components/ui/button(?:\.svelte)?['\"]",
        r"import\s+(?:\*\s+as\s+)?_Button\s+from",  # Commented out imports
    ]
    
    has_button_import = False
    has_commented_import = False
    
    for pattern in button_import_patterns:
        if re.search(pattern, content):
            if "_Button" in pattern:
                has_commented_import = True
            else:
                has_button_import = True
    
    # Count raw button occurrences
    button_matches = re.findall(r'<button\b[^>]*>', content, re.IGNORECASE)
    button_count = len(button_matches)
    
    # Get first few button samples
    button_samples = button_matches[:3] if button_matches else []
    
    # Check if file is a UI component itself (might legitimately use raw buttons)
    is_ui_component = '/ui/' in filepath or filepath.endswith('button.svelte')
    
    return {
        'path': filepath,
        'has_button_import': has_button_import,
        'has_commented_import': has_commented_import,
        'button_count': button_count,
        'button_samples': button_samples,
        'is_ui_component': is_ui_component
    }

def main():
    # Files to analyze
    files_to_analyze = []
    
    # Add component files
    component_files = """K:\\driplo.bg-main\\src\\lib\\components\\upload\\ImageUpload.svelte
K:\\driplo.bg-main\\src\\lib\\components\\shared\\CategoryDropdown.svelte
K:\\driplo.bg-main\\src\\lib\\components\\checkout\\CheckoutFlow.svelte
K:\\driplo.bg-main\\src\\lib\\components\\shared\\UnifiedFilter.svelte
K:\\driplo.bg-main\\src\\lib\\components\\onboarding\\ProfileSetupWizard.svelte
K:\\driplo.bg-main\\src\\lib\\components\\home\\HeroSearchFixed.svelte
K:\\driplo.bg-main\\src\\lib\\components\\home\\HeroSearch.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\badge.svelte
K:\\driplo.bg-main\\src\\lib\\components\\home\\LandingCategories.svelte
K:\\driplo.bg-main\\src\\lib\\components\\shared\\MobileCategorySheet.svelte
K:\\driplo.bg-main\\src\\lib\\components\\search\\StickySearchBar.svelte
K:\\driplo.bg-main\\src\\lib\\components\\shared\\CategoryDropdownFixed.svelte
K:\\driplo.bg-main\\src\\lib\\components\\shared\\UnifiedSearch.svelte
K:\\driplo.bg-main\\src\\lib\\components\\category\\CategoryLanding.svelte
K:\\driplo.bg-main\\src\\lib\\components\\listings\\CreateListingForm\\steps\\ProductDetailsStep.svelte
K:\\driplo.bg-main\\src\\lib\\components\\listings\\CreateListingForm\\components\\ImageUploader.svelte
K:\\driplo.bg-main\\src\\lib\\components\\messaging\\MessageSearch.svelte
K:\\driplo.bg-main\\src\\lib\\components\\messaging\\ConversationListEnhanced.svelte
K:\\driplo.bg-main\\src\\lib\\components\\messaging\\ConversationList.svelte
K:\\driplo.bg-main\\src\\lib\\components\\listings\\CreateListingForm\\steps\\ShippingStep.svelte
K:\\driplo.bg-main\\src\\lib\\components\\listings\\CreateListingForm\\CreateListingForm.svelte
K:\\driplo.bg-main\\src\\lib\\components\\checkout\\checkout-modal\\PaymentInstructions.svelte
K:\\driplo.bg-main\\src\\lib\\components\\checkout\\CheckoutModal.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\switch.svelte
K:\\driplo.bg-main\\src\\lib\\components\\cookie-consent\\CookieConsent.svelte
K:\\driplo.bg-main\\src\\lib\\components\\home\\TopSellers.svelte
K:\\driplo.bg-main\\src\\lib\\components\\checkout\\LazyCheckoutFlow.svelte
K:\\driplo.bg-main\\src\\lib\\components\\NotificationPopup.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\alert-dialog\\AlertDialogTrigger.svelte
K:\\driplo.bg-main\\src\\lib\\components\\checkout\\checkout-modal\\PaymentProcessor.svelte
K:\\driplo.bg-main\\src\\lib\\components\\onboarding\\BrandInfoForm.svelte
K:\\driplo.bg-main\\src\\lib\\components\\shared\\ErrorBoundary.svelte
K:\\driplo.bg-main\\src\\lib\\components\\debug\\DebugOverlay.svelte
K:\\driplo.bg-main\\src\\lib\\components\\shared\\category-dropdown\\CategorySection.svelte
K:\\driplo.bg-main\\src\\lib\\components\\onboarding\\ProgressIndicator.svelte
K:\\driplo.bg-main\\src\\lib\\components\\layout\\PromotionalBanner.svelte
K:\\driplo.bg-main\\src\\lib\\components\\layout\\MobileNav.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\ColorPicker.svelte
K:\\driplo.bg-main\\src\\lib\\components\\orders\\OrderDetails.svelte
K:\\driplo.bg-main\\src\\lib\\components\\home\\SellerQuickView.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\dialog\\dialog.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\alert-dialog\\AlertDialogContent.svelte
K:\\driplo.bg-main\\src\\lib\\components\\listings\\CreateListingForm\\steps\\PricingStep.svelte
K:\\driplo.bg-main\\src\\lib\\components\\brands\\brand-onboarding-wizard\\steps\\BrandLogoStep.svelte
K:\\driplo.bg-main\\src\\lib\\components\\messaging\\MessageThread.svelte
K:\\driplo.bg-main\\src\\lib\\components\\profile\\ProfileHeader.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\InfiniteScroll.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\dialog\\DialogContent.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\chip.svelte
K:\\driplo.bg-main\\src\\lib\\components\\payment\\PaymentAccountSetup.svelte
K:\\driplo.bg-main\\src\\lib\\components\\orders\\ShippingForm.svelte
K:\\driplo.bg-main\\src\\lib\\components\\orders\\OrderList.svelte
K:\\driplo.bg-main\\src\\lib\\components\\onboarding\\AvatarPicker.svelte
K:\\driplo.bg-main\\src\\lib\\components\\auth\\TwoFactorVerification.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\tooltip\\TooltipTrigger.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\tabs\\TabsTrigger.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\RatingStars.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\popover\\PopoverTrigger.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\pagination\\PaginationLink.svelte
K:\\driplo.bg-main\\src\\lib\\components\\ui\\LazyModal.svelte
K:\\driplo.bg-main\\src\\lib\\components\\search\\TrendingSearches.svelte
K:\\driplo.bg-main\\src\\lib\\components\\onboarding\\PersonalInfoForm.svelte
K:\\driplo.bg-main\\src\\lib\\components\\onboarding\\AccountTypeSelector.svelte
K:\\driplo.bg-main\\src\\lib\\components\\listings\\ProductGallery.svelte
K:\\driplo.bg-main\\src\\lib\\components\\listings\\listing-card\\ListingCardImage.svelte
K:\\driplo.bg-main\\src\\lib\\components\\listings\\listing-card\\ListingCardActions.svelte
K:\\driplo.bg-main\\src\\lib\\components\\brands\\brand-onboarding-wizard\\WizardNavigation.svelte"""
    
    route_files = """K:\\driplo.bg-main\\src\\routes\\(app)\\+error.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\brands\\[slug]\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\wishlist\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\messages\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\brands\\analytics\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\listings\\[id]\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(auth)\\register\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\browse\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\orders\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\admin\\verify-emails\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\brands\\settings\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(auth)\\login\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\admin\\users\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\dashboard\\+layout.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\admin\\brands\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\dashboard\\brands\\[id]\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\profile\\settings\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\profile\\[username]\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\leaderboard\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(auth)\\reset-password\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(auth)\\forgot-password\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\brands\\welcome\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\brands\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\(auth)\\+error.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\messages\\+error.svelte
K:\\driplo.bg-main\\src\\routes\\deployment-check\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\dashboard\\brands\\+page.svelte
K:\\driplo.bg-main\\src\\routes\\+error.svelte
K:\\driplo.bg-main\\src\\routes\\(app)\\sellers\\+page.svelte"""
    
    files_to_analyze.extend(component_files.strip().split('\n'))
    files_to_analyze.extend(route_files.strip().split('\n'))
    
    # Categorize results
    no_import_raw_buttons = []
    has_import_but_raw = []
    commented_import = []
    ui_components = []
    
    for filepath in files_to_analyze:
        if os.path.exists(filepath):
            result = analyze_svelte_file(filepath)
            
            if result['button_count'] > 0:
                if result['is_ui_component']:
                    ui_components.append(result)
                elif result['has_commented_import']:
                    commented_import.append(result)
                elif result['has_button_import']:
                    has_import_but_raw.append(result)
                else:
                    no_import_raw_buttons.append(result)
    
    # Print report
    print("# Button Component Usage Analysis Report\n")
    print(f"Total files analyzed: {len(files_to_analyze)}")
    print(f"Files with raw button usage: {len(no_import_raw_buttons + has_import_but_raw + commented_import + ui_components)}\n")
    
    print("## 1. Files using raw <button> WITHOUT Button component import")
    print(f"Found {len(no_import_raw_buttons)} files:\n")
    for file in sorted(no_import_raw_buttons, key=lambda x: x['button_count'], reverse=True):
        print(f"- **{file['path'].replace('K:\\\\driplo.bg-main\\\\', '')}**")
        print(f"  - Raw buttons: {file['button_count']}")
        if file['button_samples']:
            print(f"  - Samples: {file['button_samples'][:2]}")
        print()
    
    print("\n## 2. Files WITH Button import but still using raw buttons")
    print(f"Found {len(has_import_but_raw)} files:\n")
    for file in sorted(has_import_but_raw, key=lambda x: x['button_count'], reverse=True):
        print(f"- **{file['path'].replace('K:\\\\driplo.bg-main\\\\', '')}**")
        print(f"  - Raw buttons: {file['button_count']}")
        if file['button_samples']:
            print(f"  - Samples: {file['button_samples'][:2]}")
        print()
    
    print("\n## 3. Files with COMMENTED OUT Button imports (_Button)")
    print(f"Found {len(commented_import)} files:\n")
    for file in sorted(commented_import, key=lambda x: x['button_count'], reverse=True):
        print(f"- **{file['path'].replace('K:\\\\driplo.bg-main\\\\', '')}**")
        print(f"  - Raw buttons: {file['button_count']}")
        if file['button_samples']:
            print(f"  - Samples: {file['button_samples'][:2]}")
        print()
    
    print("\n## 4. UI Components (legitimate raw button usage)")
    print(f"Found {len(ui_components)} files:\n")
    for file in sorted(ui_components, key=lambda x: x['button_count'], reverse=True):
        print(f"- **{file['path'].replace('K:\\\\driplo.bg-main\\\\', '')}**")
        print(f"  - Raw buttons: {file['button_count']}")
        print()
    
    # Summary
    print("\n## Summary")
    print(f"- Files needing Button import: {len(no_import_raw_buttons)}")
    print(f"- Files potentially misusing both patterns: {len(has_import_but_raw)}")
    print(f"- Files with commented imports to fix: {len(commented_import)}")
    print(f"- Total files to review: {len(no_import_raw_buttons + has_import_but_raw + commented_import)}")

if __name__ == "__main__":
    main()
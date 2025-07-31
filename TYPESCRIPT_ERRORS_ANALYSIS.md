# TypeScript Errors and Warnings - Complete Analysis

## Summary

- **Total unique error types:** 255
- **Total unique warning types:** 43
- **Total error occurrences:** 493
- **Total warning occurrences:** 104

## TypeScript Errors

### 1. Object is possibly 'undefined'.
**Count:** 19 occurrences

**Affected files:**
- `src/lib/components/category/CategoryLanding.svelte`: lines 197
- `src/lib/components/category/TopThreeSellers.svelte`: lines 40
- `src/lib/components/common/LazyAvatar.svelte`: lines 46
- `src/lib/components/messaging/ConversationList.svelte`: lines 151
- `src/lib/components/messaging/ConversationListEnhanced.svelte`: lines 145
- `src/lib/components/messaging/MessageSearch.svelte`: lines 198
- `src/lib/components/onboarding/WelcomeModal.svelte`: lines 76, 77, 78
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 483, 899, 915, 1064, 1068, 1086, 1105, 1109
- `src/lib/components/upload/ImageUpload.svelte`: lines 231
- `src/routes/(auth)/register/+page.svelte`: lines 104

### 2. Unexpected token
**Count:** 17 occurrences

**Affected files:**
- `src/lib/components/auth/TurnstileWrapper.svelte`: lines 69
- `src/lib/components/profile/ProfileStats.svelte`: lines 208
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 7
- `src/routes/(app)/admin/users/+page.svelte`: lines 14
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 26
- `src/routes/(app)/brands/analytics/+page.svelte`: lines 196
- `src/routes/(app)/leaderboard/+page.svelte`: lines 47, 295
- `src/routes/(app)/profile/[username]/+page.svelte`: lines 336
- `src/routes/(app)/wishlist/+page.svelte`: lines 59
- `src/routes/(auth)/forgot-password/+page.svelte`: lines 36, 155
- `src/routes/(auth)/reset-password/+page.svelte`: lines 56, 229

### 3. Object literal may only specify known properties, but 'p_user_id' does not exist in type '{ event_type: string; user_id?: string | undefined; email?: string | undefined; ip_address?: string | undefined; user_agent?: string | undefined; metadata?: Record<string, unknown> | undefined; }'. Did you mean to write 'user_id'?
**Count:** 10 occurrences

**Affected files:**
- `src/routes/(app)/onboarding/+page.server.ts`: lines 45, 60
- `src/routes/(auth)/callback/+page.server.ts`: lines 37
- `src/routes/(auth)/login/+page.server.ts`: lines 93, 127
- `src/routes/(auth)/register/+page.server.ts`: lines 162, 190
- `src/routes/api/onboarding/complete/+server.ts`: lines 30, 44
- `src/routes/logout/+page.server.ts`: lines 31

### 4. Object is possibly 'undefined'.
**Count:** 9 occurrences

**Affected files:**
- `src/lib/utils/focus-trap.ts`: lines 218
- `src/lib/utils/format.ts`: lines 31, 34
- `src/lib/utils/image-compression.ts`: lines 202
- `src/routes/(auth)/register/+page.server.ts`: lines 138

### 5. Module '"$lib/types"' has no exported member 'Category'.
**Count:** 9 occurrences

**Affected files:**
- `src/lib/components/category/CategoryLanding.svelte`: lines 2
- `src/lib/components/category/TopThreeSellers.svelte`: lines 4
- `src/lib/components/home/HeroSearch.svelte`: lines 10
- `src/lib/components/home/HeroSearchFixed.svelte`: lines 10
- `src/lib/components/search/StickySearchBar.svelte`: lines 6
- `src/lib/components/seo/CategorySEO.svelte`: lines 3
- `src/lib/components/shared/CategoryDropdownFixed.svelte`: lines 5
- `src/lib/components/shared/UnifiedSearch.svelte`: lines 9
- `src/lib/components/subcategory/SubcategoryBrowse.svelte`: lines 2

### 6. Cannot find name 'auth'.
**Count:** 9 occurrences

**Affected files:**
- `src/routes/(app)/onboarding/+page.svelte`: lines 37, 43, 46, 49, 51, 54, 83, 86, 87

### 7. Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
**Count:** 8 occurrences

**Affected files:**
- `src/lib/components/listings/CreateListingForm/components/ImageUploader.svelte`: lines 212
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 278
- `src/lib/utils/performance.ts`: lines 304
- `src/routes/(app)/listings/[id]/+page.server.ts`: lines 43, 89, 107, 126
- `src/routes/api/stripe/webhooks/+server.ts`: lines 102

### 8. No overload matches this call.
**Count:** 8 occurrences

**Affected files:**
- `src/lib/components/messaging/MessageSearch.svelte`: lines 206
- `src/lib/utils/image-compression.ts`: lines 203
- `src/routes/(app)/admin/brands/+page.server.ts`: lines 52, 82
- `src/routes/(app)/leaderboard/+page.server.ts`: lines 33
- `src/routes/api/orders/+server.ts`: lines 186
- `src/routes/api/orders/[id]/complete/+server.ts`: lines 107, 108

### 9. Property 'id' does not exist on type 'Category'.
**Count:** 8 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 637, 640, 652, 668, 671, 678, 1039, 1042

### 10. Operator '>' cannot be applied to types '() => number' and 'number'.
**Count:** 7 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 214, 463, 554, 604, 611, 772, 1130

### 11. Object literal may only specify known properties, and 'categories' does not exist in type 'Props'.
**Count:** 7 occurrences

**Affected files:**
- `src/lib/components/home/HeroSearch.svelte`: lines 320, 383
- `src/lib/components/home/HeroSearchFixed.svelte`: lines 315, 375
- `src/lib/components/shared/UnifiedSearch.svelte`: lines 347, 397, 475

### 12. Expected a valid element or component name. Components must have a valid variable name or dot notation expression
**Count:** 6 occurrences

**Affected files:**
- `src/lib/components/shared/MobileCategorySheet.svelte`: lines 68
- `src/lib/components/ui/radio-group/RadioGroupItem.svelte`: lines 23
- `src/routes/(app)/brands/welcome/+page.svelte`: lines 162

### 13. Object literal may only specify known properties, but 'p_order_id' does not exist in type '{ order_id: string; new_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "disputed"; tracking_number?: string | undefined; carrier?: string | undefined; notes?: string | undefined; }'. Did you mean to write 'order_id'?
**Count:** 6 occurrences

**Affected files:**
- `src/routes/api/orders/[id]/+server.ts`: lines 103
- `src/routes/api/orders/[id]/cancel/+server.ts`: lines 65
- `src/routes/api/orders/[id]/complete/+server.ts`: lines 67
- `src/routes/api/orders/[id]/ship/+server.ts`: lines 54
- `src/routes/api/orders/bulk/+server.ts`: lines 60, 88

### 14. Type '{ icon: string; name: string; action: string; ariaLabel: string; variant: string; }[]' is not assignable to type 'FilterGroup[]'.
**Count:** 6 occurrences

**Affected files:**
- `src/lib/components/home/HeroSearch.svelte`: lines 281, 291, 400
- `src/lib/components/home/HeroSearchFixed.svelte`: lines 276, 286, 392

### 15. 'm' is declared but its value is never read.
**Count:** 6 occurrences

**Affected files:**
- `src/routes/(app)/+error.svelte`: lines 5
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 6
- `src/routes/(app)/sell/success/+page.svelte`: lines 7
- `src/routes/(auth)/+error.svelte`: lines 4
- `src/routes/(auth)/register/+page.svelte`: lines 8
- `src/routes/+error.svelte`: lines 4

### 16. Property 'brand_name' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 6 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 46, 47, 56, 74, 85, 245

### 17. Property 'reviewer' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 6 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 314, 315, 321

### 18. Not all code paths return a value.
**Count:** 5 occurrences

**Affected files:**
- `src/lib/hooks/useImagePreload.ts`: lines 185
- `src/lib/utils/performance.ts`: lines 177, 602
- `src/lib/utils/web-vitals.ts`: lines 196
- `src/routes/api/admin/payouts/+server.ts`: lines 99

### 19. This kind of expression is always truthy.
**Count:** 5 occurrences

**Affected files:**
- `src/lib/server/api-utils.ts`: lines 249, 250
- `src/routes/api/admin/payouts/stats/+server.ts`: lines 13
- `src/routes/api/messages/conversations/[id]/+server.ts`: lines 13
- `src/routes/api/sellers/top/+server.ts`: lines 18

### 20. Property 'user' does not exist on type 'Locals'.
**Count:** 5 occurrences

**Affected files:**
- `src/routes/(app)/admin/verify-emails/+page.server.ts`: lines 5, 40
- `src/routes/dashboard/brands/[id]/+page.server.ts`: lines 64, 125, 167

### 21. '"$app/stores"' has no exported member named '_page'. Did you mean 'page'?
**Count:** 5 occurrences

**Affected files:**
- `src/lib/components/seo/CategorySEO.svelte`: lines 2
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 2
- `src/routes/(app)/messages/+page.svelte`: lines 2
- `src/routes/(app)/orders/[id]/+page.svelte`: lines 2
- `src/routes/(app)/sell/+page.svelte`: lines 7

### 22. Property 'brand_description' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 5 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 47, 94, 95, 247, 250

### 23. Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses
**Count:** 5 occurrences

**Affected files:**
- `src/routes/(app)/browse/+page.svelte`: lines 250, 303
- `src/routes/(app)/listings/[id]/+page.svelte`: lines 51, 467
- `src/routes/(app)/wishlist/+page.svelte`: lines 290

### 24. Optional chaining cannot appear in the callee of new expressions
**Count:** 4 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 32
- `src/lib/components/home/SellerQuickView.svelte`: lines 46
- `src/lib/components/orders/OrderDetails.svelte`: lines 100
- `src/routes/(app)/orders/+page.svelte`: lines 73

### 25. Property 'sizeRanges' does not exist on type 'CategoryData'.
**Count:** 4 occurrences

**Affected files:**
- `src/lib/components/shared/CategoryDropdown.svelte`: lines 237, 241
- `src/lib/components/shared/CategoryDropdownFixed.svelte`: lines 216, 220

### 26. '||' and '??' operations cannot be mixed without parentheses.
**Count:** 4 occurrences

**Affected files:**
- `src/routes/api/auth/2fa/verify/+server.ts`: lines 50
- `src/routes/api/messages/search/+server.ts`: lines 16
- `src/routes/api/orders/bulk/+server.ts`: lines 13
- `src/routes/api/search/suggestions/+server.ts`: lines 7

### 27. Optional chaining cannot appear in left-hand side
**Count:** 4 occurrences

**Affected files:**
- `src/lib/components/profile/ProfileHeader.svelte`: lines 130
- `src/routes/(app)/orders/+page.svelte`: lines 126
- `src/routes/(app)/profile/[username]/+page.svelte`: lines 97

### 28. Not all code paths return a value.
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/listings/CreateListingForm/steps/MediaUploadStep.svelte`: lines 30
- `src/lib/components/listings/CreateListingForm/steps/ProductDetailsStep.svelte`: lines 95
- `src/lib/components/ui/alert-dialog/AlertDialogContent.svelte`: lines 43

### 29. ')' expected.
**Count:** 3 occurrences

**Affected files:**
- `.svelte-kit/types/src/routes/(app)/browse/proxy+page.server.ts`: lines 87
- `src/routes/(app)/browse/+page.server.ts`: lines 86
- `src/routes/api/browse/load-more/+server.ts`: lines 83

### 30. at-rule or selector expected (css)
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/auth/TurnstileWrapper.svelte`: lines 88
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 311
- `src/lib/components/checkout/checkout-modal/ShippingForm.svelte`: lines 172

### 31. ) expected (css)
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/auth/TurnstileWrapper.svelte`: lines 85
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 310
- `src/lib/components/checkout/checkout-modal/ShippingForm.svelte`: lines 171

### 32. Invalid optional chain from new expression. Did you mean to call 'Intl()'?
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 32
- `src/lib/components/home/SellerQuickView.svelte`: lines 46
- `src/lib/components/orders/OrderDetails.svelte`: lines 100

### 33. This expression is not constructable.
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 32
- `src/lib/components/home/SellerQuickView.svelte`: lines 46
- `src/lib/components/orders/OrderDetails.svelte`: lines 100

### 34. 'onMount' is declared but its value is never read.
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/checkout/LazyCheckoutFlow.svelte`: lines 2
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 2
- `src/lib/components/ui/popover/PopoverContent.svelte`: lines 2

### 35. Cannot find module 'vitest' or its corresponding type declarations.
**Count:** 3 occurrences

**Affected files:**
- `src/lib/server/api-utils.test.ts`: lines 1
- `src/lib/utils/format.test.ts`: lines 1
- `src/lib/utils/validation.test.ts`: lines 1

### 36. Property 'data' does not exist on type 'Response'.
**Count:** 3 occurrences

**Affected files:**
- `src/lib/server/api-utils.test.ts`: lines 34, 35, 56

### 37. Type '"2024-06-20"' is not assignable to type '"2025-06-30.basil"'.
**Count:** 3 occurrences

**Affected files:**
- `src/routes/api/health/stripe/+server.ts`: lines 7
- `src/routes/api/payment/create-intent/+server.ts`: lines 20
- `src/routes/api/stripe/webhooks/+server.ts`: lines 9

### 38. Property 'INTERNAL_ERROR' does not exist on type 'typeof ApiErrorType'.
**Count:** 3 occurrences

**Affected files:**
- `src/routes/api/orders/+server.ts`: lines 261
- `src/routes/api/wishlist/+server.ts`: lines 121, 168

### 39. Cannot find name 'key'. Did you mean '_key'?
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 332

### 40. Property 'icon' does not exist on type 'Category'.
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 645, 676, 1047

### 41. Property 'name' does not exist on type 'Category'.
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 647, 677, 1047

### 42. Property 'id' comes from an index signature, so it must be accessed with ['id'].
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/messaging/ConversationList.svelte`: lines 135
- `src/lib/components/messaging/ConversationListEnhanced.svelte`: lines 128
- `src/routes/(app)/messages/[id]/+page.svelte`: lines 26

### 43. ')' expected.
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 7
- `src/routes/(app)/admin/users/+page.svelte`: lines 20
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 26

### 44. Property 'username' does not exist on type '{ id: string; email: string; created_at: string; raw_user_meta_data: Record<string, unknown>; }'.
**Count:** 3 occurrences

**Affected files:**
- `src/routes/(app)/admin/verify-emails/+page.svelte`: lines 53, 55, 56

### 45. Property 'website_url' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 3 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 21, 291, 294

### 46. Property 'brand_cover_url' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 3 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 52, 55, 64

### 47. Property 'created_at' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 3 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 107, 287, 331

### 48. Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ default: string; secondary: string; success: string; destructive: string; outline: string; 'condition-new-with-tags': string; 'condition-new-without-tags': string; 'condition-very-good': string; ... 7 more ...; interactive: string; }'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/ui/badge.svelte`: lines 181, 231

### 49. 'error' is of type 'unknown'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/onboarding/ProfileSetupWizard.svelte`: lines 215, 235

### 50. Object literal may only specify known properties, and 'p_category_id' does not exist in type '{ category_slug: string; limit_count?: number | undefined; offset_count?: number | undefined; sort_by?: string | undefined; filters?: Record<string, unknown> | undefined; }'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/server/category.ts`: lines 31, 114

### 51. Argument of type 'string | undefined' is not assignable to parameter of type 'string | AnyComponent'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/brands/brand-onboarding-wizard/hooks/useImageUpload.svelte.ts`: lines 228, 238

### 52. Type 'UserProfile | null' is not assignable to type 'User | null'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/layout/header/Header.svelte`: lines 171, 186

### 53. `</script>` attempted to close an element that was not open
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/layout/header/CategoryMenu.svelte`: lines 62

### 54. Object literal may only specify known properties, and '"aria-label"' does not exist in type 'Props'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/ui/pagination/PaginationNext.svelte`: lines 23
- `src/lib/components/ui/pagination/PaginationPrevious.svelte`: lines 23

### 55. Property 'session' does not exist on type 'Locals'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/server/database-rate-limit.ts`: lines 25
- `src/lib/server/rate-limit.ts`: lines 33

### 56. Object literal may only specify known properties, but 'p_listing_id' does not exist in type '{ listing_id: string; viewer_id?: string | undefined; ip_address?: string | undefined; }'. Did you mean to write 'listing_id'?
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(app)/listings/[id]/+page.server.ts`: lines 140
- `src/routes/api/views/+server.ts`: lines 21

### 57. Object literal may only specify known properties, and 'p_identifier' does not exist in type '{ email: string; ip_address?: string | undefined; }'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(auth)/login/+page.server.ts`: lines 61
- `src/routes/(auth)/register/+page.server.ts`: lines 119

### 58. Argument of type 'string' is not assignable to parameter of type 'NonNullable<"pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "disputed">'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/api/orders/+server.ts`: lines 77
- `src/routes/api/orders/export/+server.ts`: lines 52

### 59. Element implicitly has an 'any' type because index expression is not of type 'number'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/api/upload/image/+server.ts`: lines 82, 83

### 60. Type 'FormDataEntryValue | null' is not assignable to type 'string | null | undefined'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/brands/settings/+page.server.ts`: lines 71, 72

### 61. This comparison appears to be unintentional because the types '"error" | "success" | "warning" | "info"' and '"default"' have no overlap.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/NotificationPopup.svelte`: lines 33, 40

### 62. Property 'count' does not exist on type 'Category'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 648, 649

### 63. Object literal may only specify known properties, and 'supabase' does not exist in type 'Props'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/category/CategoryLanding.svelte`: lines 385
- `src/lib/components/subcategory/SubcategoryBrowse.svelte`: lines 79

### 64. 'goto' is declared but its value is never read.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/layout/MobileNav.svelte`: lines 3
- `src/lib/components/search/StickySearchBar.svelte`: lines 8

### 65. Object literal may only specify known properties, and '"onclick|stopPropagation"' does not exist in type 'HTMLProps<"button", HTMLAttributes<any>>'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/listings/ProductGallery.svelte`: lines 164, 171

### 66. Can only bind to an Identifier or MemberExpression or a `{get, set}` pair
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/onboarding/WelcomeModal.svelte`: lines 60
- `src/routes/(app)/profile/settings/+page.svelte`: lines 481

### 67. '"lucide-svelte"' has no exported member named '_ShoppingBag'. Did you mean 'ShoppingBag'?
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/orders/OrderList.svelte`: lines 5
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 3

### 68. Unexpected keyword or identifier.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 7

### 69. Attributes need to be unique
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/shared/PriceRangeSlider.svelte`: lines 76

### 70. Type 'QuickFilter[]' is not assignable to type 'FilterGroup[]'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedSearch.svelte`: lines 335, 411

### 71. Object literal may only specify known properties, and '"category"' does not exist in type 'Props'.
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/subcategory/SubcategoryBrowse.svelte`: lines 67, 107

### 72. Property 'brand_logo_url' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 71, 73

### 73. Property 'brand_story' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 254, 257

### 74. Property 'brand_values' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 266, 269

### 75. Property 'brand_mission' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 273, 276

### 76. Property 'supabase' comes from an index signature, so it must be accessed with ['supabase'].
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(app)/profile/+page.svelte`: lines 10
- `src/routes/(app)/sell/success/+page.svelte`: lines 16

### 77. '"svelte"' has no exported member named '_onMount'. Did you mean 'onMount'?
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(app)/sellers/+page.svelte`: lines 2
- `src/routes/(auth)/register/+page.svelte`: lines 11

### 78. Object literal may only specify known properties, and '"href"' does not exist in type 'ButtonProps'. (js)
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(auth)/auth-code-error/+page.svelte`: lines 32, 35

### 79. Property 'includes' does not exist on type '{}'.
**Count:** 2 occurrences

**Affected files:**
- `src/routes/(auth)/login/+page.svelte`: lines 74, 219

### 80. Object literal may only specify known properties, and 'closeOnEscape' does not exist in type '{ open?: boolean | undefined; onOpenChange?: OnChangeFn<boolean> | undefined; onOpenChangeComplete?: OnChangeFn<boolean> | undefined; } & { children?: Snippet<...> | undefined; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/sheet/sheet.svelte`: lines 39

### 81. An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/CreateListingForm/steps/ProductDetailsStep.svelte`: lines 2

### 82. Argument of type '() => ({ formData, action, cancel }: any) => Promise<(({ result, update }: any) => Promise<void>) | undefined>' is not assignable to parameter of type 'SubmitFunction<Record<string, unknown> | undefined, Record<string, unknown> | undefined>'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/CheckoutFlow.svelte`: lines 282

### 83. Object literal may only specify known properties, but 'p_user_id' does not exist in type '{ user_id?: string | undefined; limit_count?: number | undefined; offset_count?: number | undefined; }'. Did you mean to write 'user_id'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/browse.ts`: lines 94

### 84. Object literal may only specify known properties, and 'p_status' does not exist in type '{ filters?: Record<string, unknown> | undefined; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/browse.ts`: lines 111

### 85. Object literal may only specify known properties, and 'category_uuid' does not exist in type '{ category_slug: string; limit_count?: number | undefined; time_period?: string | undefined; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/category.ts`: lines 38

### 86. All declarations of 'Sentry' must have identical modifiers.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/config/sentry.ts`: lines 220

### 87. Object literal may only specify known properties, and 'enableNavigationSpans' does not exist in type 'Partial<BrowserTracingOptions>'.
**Count:** 1 occurrences

**Affected files:**
- `src/hooks.client.ts`: lines 37

### 88. Object literal may only specify known properties, and 'maxRetries' does not exist in type 'Partial<BaseTransportOptions> | Partial<NodeTransportOptions> | Partial<BrowserTransportOptions>'.
**Count:** 1 occurrences

**Affected files:**
- `src/hooks.client.ts`: lines 63

### 89. Type '{ brandName: string; brandCategory: string; brandDescription: string; onUpdate: (updates: any) => void; disabled: boolean; logoFile?: undefined; logoPreview?: undefined; logoUrl?: undefined; supabase?: undefined; onUploadStateChange?: undefined; } | { ...; } | { ...; }' is not assignable to type '(Props & Props) | undefined'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/brands/BrandOnboardingWizard.svelte`: lines 138

### 90. Element implicitly has an 'any' type because expression of type '"state_province"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/ShippingForm.svelte`: lines 109

### 91. Element implicitly has an 'any' type because expression of type '"card_payment"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte`: lines 58

### 92. Element implicitly has an 'any' type because expression of type '"stripe_card_description"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte`: lines 59

### 93. Element implicitly has an 'any' type because expression of type '"revolut_payment"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte`: lines 119

### 94. Element implicitly has an 'any' type because expression of type '"revolut_manual_description"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte`: lines 120

### 95. Element implicitly has an 'any' type because expression of type '"stripe_security_description"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte`: lines 146

### 96. Element implicitly has an 'any' type because expression of type '"manual_verification"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte`: lines 155

### 97. Element implicitly has an 'any' type because expression of type '"revolut_manual_process_description"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte`: lines 156

### 98. Element implicitly has an 'any' type because expression of type '"payment_security_notice"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte`: lines 167

### 99. Property 'manual_payment_instructions' does not exist on type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'. Did you mean 'payment_instructions'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 59

### 100. Element implicitly has an 'any' type because expression of type '"complete_payment_via_revolut"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 60

### 101. Element implicitly has an 'any' type because expression of type '"payment_details"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 65

### 102. Element implicitly has an 'any' type because expression of type '"payment_reference"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 74

### 103. Element implicitly has an 'any' type because expression of type '"order_id"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 79

### 104. Element implicitly has an 'any' type because expression of type '"expires_at"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 85

### 105. Element implicitly has an 'any' type because expression of type '"payment_expired"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 100

### 106. Element implicitly has an 'any' type because expression of type '"payment_expired_message"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 101

### 107. Element implicitly has an 'any' type because expression of type '"pay_with_revolut"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 124

### 108. Element implicitly has an 'any' type because expression of type '"confirming_payment"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 136

### 109. Element implicitly has an 'any' type because expression of type '"i_have_completed_payment"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 139

### 110. Element implicitly has an 'any' type because expression of type '"important_notice"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 149

### 111. Element implicitly has an 'any' type because expression of type '"manual_payment_security_notice"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 151

### 112. Element implicitly has an 'any' type because expression of type '"include_payment_reference_notice"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte`: lines 160

### 113. 'toast' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 4

### 114. Element implicitly has an 'any' type because expression of type '"creating_payment"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 202

### 115. Element implicitly has an 'any' type because expression of type '"create_payment_request"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 207

### 116. Element implicitly has an 'any' type because expression of type '"loading_payment_form"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 225

### 117. Element implicitly has an 'any' type because expression of type '"loading_card_form"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 237

### 118. Element implicitly has an 'any' type because expression of type '"payment_form_load_error"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 243

### 119. Element implicitly has an 'any' type because expression of type '"stripe_security_notice"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 284

### 120. Element implicitly has an 'any' type because expression of type '"revolut_security_notice"' can't be used to index type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte`: lines 286

### 121. Property 'cannot_close_during_payment' does not exist on type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/CheckoutModal.svelte`: lines 73

### 122. Property 'processing_please_wait' does not exist on type 'typeof import("k:/driplo.bg-main/src/lib/paraglide/messages")'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/CheckoutModal.svelte`: lines 172

### 123. 'Button' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/layout/ProfileDropdownContent.svelte`: lines 8

### 124. Object literal may only specify known properties, and 'session' does not exist in type 'Props'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/layout/header/UserMenu.svelte`: lines 90

### 125. Argument of type '() => Promise<void>' is not assignable to parameter of type '() => void | (() => void)'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/layout/header/Header.svelte`: lines 53

### 126. Module '"k:/driplo.bg-main/src/lib/components/layout/header/CategoryMenu.svelte"' has no default export.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/layout/header/index.ts`: lines 8

### 127. Object literal may only specify known properties, and '"colspan"' does not exist in type 'Props'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/data-table/DataTable.svelte`: lines 59

### 128. Object literal may only specify known properties, and '"onclick"' does not exist in type 'Props'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/data-table/DataTable.svelte`: lines 71

### 129. Cannot use `$$restProps` in runes mode
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/dialog/Dialog.svelte`: lines 301

### 130. Object literal may only specify known properties, but 'ariaLabel' does not exist in type 'HTMLProps<"div", HTMLAttributes<any>>'. Did you mean to write 'aria-label'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/dialog/Dialog.svelte`: lines 253

### 131. Already included file name 'k:/driplo.bg-main/src/lib/components/ui/dialog/Dialog.svelte' differs from file name 'k:/driplo.bg-main/src/lib/components/ui/dialog/dialog.svelte' only in casing.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/dialog/index.ts`: lines 1

### 132. Module '"./RadioGroupItem.svelte"' has no exported member 'default'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/radio-group/index.ts`: lines 2

### 133. Type 'unknown' is not assignable to type 'T[keyof T] | undefined'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/api-utils.ts`: lines 408

### 134. Type 'T | undefined' is not assignable to type 'T'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/api-utils.ts`: lines 524

### 135. Argument of type 'T | undefined' is not assignable to parameter of type 'T'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/api-utils.ts`: lines 525

### 136. Property 'init' does not exist on type 'Response'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/api-utils.test.ts`: lines 57

### 137. Object literal may only specify known properties, and 'p_action' does not exist in type '{ action_type: string; resource_type: string; resource_id: string; details?: Record<string, unknown> | undefined; ip_address?: string | undefined; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/audit.ts`: lines 17

### 138. Object literal may only specify known properties, but 'p_identifier' does not exist in type '{ identifier: string; action: string; limit?: number | undefined; }'. Did you mean to write 'identifier'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/database-rate-limit.ts`: lines 32

### 139. Conversion of type '{ allowed: boolean; current_count: number; retry_after?: number | undefined; }' to type 'RateLimitResult' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/database-rate-limit.ts`: lines 44

### 140. Type 'string | null' is not assignable to type 'string'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/email.ts`: lines 468

### 141. Type '{ url: string; path: string; width: number; height: number; }' is not assignable to type 'never'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/server/image-optimizer.ts`: lines 122

### 142. Object literal may only specify known properties, and 'handleHEIC' does not exist in type 'CompressionOptions'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/utils/storage-client.ts`: lines 72

### 143. Property 'optimizeImage' does not exist on type 'ImageOptimizer'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/utils/storage.ts`: lines 93

### 144. Property 'uploadOptimizedImages' does not exist on type 'ImageOptimizer'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/utils/storage.ts`: lines 103

### 145. Property 'generateSrcSet' does not exist on type 'ImageOptimizer'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/utils/storage.ts`: lines 113

### 146. An object literal cannot have multiple properties with the same name.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/+layout.ts`: lines 33

### 147. Object literal may only specify known properties, and 'target_user_id' does not exist in type '{ user_id: string; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/admin/verify-emails/+page.server.ts`: lines 57

### 148. Element implicitly has an 'any' type because expression of type '0' can't be used to index type '{ total_sales: number; total_purchases: number; average_rating: number | null; review_count: number; listing_count: number; follower_count: number; following_count: number; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.server.ts`: lines 84

### 149. Object literal may only specify known properties, and 'user_id_param' does not exist in type '{ brand_id_param: string; start_date?: string | undefined; end_date?: string | undefined; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/analytics/+page.server.ts`: lines 62

### 150. Element implicitly has an 'any' type because expression of type '0' can't be used to index type '{ total_sales: number; total_revenue: number; average_order_value: number; top_categories: { category_name: string; sales_count: number; }[]; sales_by_month: { month: string; sales_count: number; revenue: number; }[]; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/analytics/+page.server.ts`: lines 95

### 151. Argument of type 'string | null' is not assignable to parameter of type 'string'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/listings/[id]/+page.server.ts`: lines 105

### 152. Property 'catch' does not exist on type 'PromiseLike<void>'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/listings/[id]/+page.server.ts`: lines 144

### 153. Object literal may only specify known properties, and 'p_seller_id' does not exist in type '{ profile_username: string; viewer_id?: string | undefined; limit_count?: number | undefined; offset_count?: number | undefined; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/profile/[username]/+page.server.ts`: lines 34

### 154. Element implicitly has an 'any' type because expression of type '0' can't be used to index type '{ listings: Record<string, unknown>[]; stats: { total_listings: number; total_sales: number; average_rating: number; }; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/profile/[username]/+page.server.ts`: lines 44

### 155. 'error' is of type 'unknown'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/sell/+page.server.ts`: lines 46

### 156. Object literal may only specify known properties, but 'p_user_id' does not exist in type '{ user_id: string; limit_count?: number | undefined; offset_count?: number | undefined; }'. Did you mean to write 'user_id'?
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/wishlist/+page.server.ts`: lines 14

### 157. Argument of type '({ request, locals, url, cookies }: RequestEvent<Partial<Record<string, string>>, string | null>) => Promise<ActionFailure<{ error: string | undefined; email: string; }>>' is not assignable to parameter of type '(event: RequestEvent<Partial<Record<string, string>>, string | null>) => Promise<Record<string, unknown>>'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/login/+page.server.ts`: lines 33

### 158. Type '({ request, locals }: RequestEvent<RouteParams, "/api/admin/payouts">) => Promise<Response | undefined>' is not assignable to type 'RequestHandler'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/admin/payouts/+server.ts`: lines 99

### 159. Argument of type '{ type: "signup"; email: string; options: { redirectTo: string; }; }' is not assignable to parameter of type 'GenerateLinkParams'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/auth/resend-verification/+server.ts`: lines 49

### 160. Argument of type '{ type: "signup"; email: any; options: { redirectTo: string; }; }' is not assignable to parameter of type 'GenerateLinkParams'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/auth/send-confirmation/+server.ts`: lines 18

### 161. Property 'updated_at' does not exist on type 'never'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/drafts/listing/+server.ts`: lines 35

### 162. '&&' and '??' operations cannot be mixed without parentheses.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/messages/conversations/[id]/+server.ts`: lines 55

### 163. Object literal may only specify known properties, but 'p_conversation_id' does not exist in type '{ conversation_id: string; user_id: string; }'. Did you mean to write 'conversation_id'?
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/messages/conversations/[id]/+server.ts`: lines 57

### 164. Argument of type '{ id: string; username: string; email: string | null; }' is not assignable to parameter of type '{ avatar_url: string | null; bio: string | null; buyer_rating: number | null; buyer_rating_count: number | null; completion_percentage: number | null; cover_url: string | null; ... 53 more ...; brand_mission?: string | ... 1 more ... | undefined; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/messages/send/+server.ts`: lines 130

### 165. Object literal may only specify known properties, and 'quantity_increment' does not exist in type '{ listing_id: string; increment_by: number; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/orders/[id]/cancel/+server.ts`: lines 106

### 166. Type '"completed"' is not assignable to type '"pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "disputed" | undefined'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/orders/[id]/refund/+server.ts`: lines 289

### 167. 'apiError' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/payment/create-intent/+server.ts`: lines 6

### 168. 'apiSuccess' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/payment/create-intent/+server.ts`: lines 7

### 169. Object literal may only specify known properties, and 'result_limit' does not exist in type '{ time_period?: "all" | "day" | "week" | "month" | "year" | undefined; limit_count?: number | undefined; category_id?: string | undefined; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/sellers/top/+server.ts`: lines 37

### 170. 'text' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/stripe/webhooks/+server.ts`: lines 1

### 171. Type '"transfer.paid"' is not comparable to type '"account.application.authorized" | "account.application.deauthorized" | "account.external_account.created" | "account.external_account.deleted" | "account.external_account.updated" | ... 243 more ... | "treasury.received_debit.created"'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/stripe/webhooks/+server.ts`: lines 332

### 172. Property 'data' does not exist on type 'never'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/stripe/webhooks/+server.ts`: lines 333

### 173. Property 'message' does not exist on type '{}'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/api/upload/simple/+server.ts`: lines 105

### 174. Spread types may only be created from object types.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/dashboard/brands/+page.server.ts`: lines 47

### 175. 'fade' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/NotificationPopup.svelte`: lines 3

### 176. Property 'PUBLIC_RECAPTCHA_SITE_KEY' comes from an index signature, so it must be accessed with ['PUBLIC_RECAPTCHA_SITE_KEY'].
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/auth/CaptchaWrapper.svelte`: lines 16

### 177. { expected (css)
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/auth/TurnstileWrapper.svelte`: lines 86

### 178. Object literal may only specify known properties, and '"className"' does not exist in type '$$ComponentProps'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/listing-card/ListingCardImage.svelte`: lines 120

### 179. 'Filter' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 2

### 180. 'ChevronRight' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 2

### 181. 'ChevronDown' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 2

### 182. 'Listing' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/LazyCheckoutFlow.svelte`: lines 3

### 183. 'Category' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/CategoryDropdownFixed.svelte`: lines 5

### 184. 'onCategorySelect' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/search/StickySearchBar.svelte`: lines 25

### 185. '"lucide-svelte"' has no exported member named '_ChevronRight'. Did you mean 'ChevronRight'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/home/LandingCategories.svelte`: lines 4

### 186. Module '"$lib/types"' has no exported member '_Category'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/home/LandingCategories.svelte`: lines 5

### 187. Module '"$lib/utils"' has no exported member '_cn'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/home/SellerQuickView.svelte`: lines 3

### 188. Type 'Json | undefined' is not assignable to type 'string | null | undefined'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/home/SellerQuickView.svelte`: lines 199

### 189. 'isLoadingListings' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/home/TopSellersWithModal.svelte`: lines 19

### 190. Modifiers cannot appear here.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/layout/PromotionalBanner.svelte`: lines 66

### 191. Expected 1 arguments, but got 2.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/LazyCreateListingForm.svelte`: lines 11

### 192. 'onclick|stopPropagation' is not a valid attribute name
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/ProductGallery.svelte`: lines 140

### 193. Object literal may only specify known properties, and '"onclick|stopPropagation"' does not exist in type 'Omit<HTMLAttributes<HTMLDivElement>, never> & HTMLAttributes<any>'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/ProductGallery.svelte`: lines 140

### 194. Type 'Promise<typeof import("k:/driplo.bg-main/src/lib/components/messaging/MessageThread.svelte")>' is not assignable to type 'Promise<{ default: ComponentType<SvelteComponent<Record<string, any>, any, any>>; }>'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/messaging/LazyMessageThread.svelte`: lines 24

### 195. '_highlightText' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/messaging/MessageSearch.svelte`: lines 77

### 196. Type 'Promise<typeof import("k:/driplo.bg-main/src/lib/components/onboarding/ProfileSetupWizard.svelte")>' is not assignable to type 'Promise<{ default: ComponentType<SvelteComponent<Record<string, any>, any, any>>; }>'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/onboarding/LazyProfileSetupWizard.svelte`: lines 9

### 197. 'updateOrderStatus' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/orders/OrderDetails.svelte`: lines 78

### 198. '"$lib/types"' has no exported member named '_Database'. Did you mean 'Database'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/orders/OrderList.svelte`: lines 4

### 199. Type 'string' is not assignable to type 'boolean'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/payment/PaymentAccountSetup.svelte`: lines 43

### 200. Declaration or statement expected.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 7

### 201. Cannot find name 'as'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 7

### 202. 'any' only refers to a type, but is being used as a value here.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 7

### 203. Element implicitly has an 'any' type because index expression is not of type 'number'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 7

### 204. Property 'platform' does not exist on type '{ categories: { Row: { created_at: string | null; description: string | null; display_order: number | null; icon: string | null; icon_url: string | null; id: string; is_active: boolean | null; ... 6 more ...; updated_at: string | null; }; Insert: { ...; }; Update: { ...; }; Relationships: [...]; }; ... 19 more ...; ...'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 92

### 205. Property 'username' does not exist on type '{ categories: { Row: { created_at: string | null; description: string | null; display_order: number | null; icon: string | null; icon_url: string | null; id: string; is_active: boolean | null; ... 6 more ...; updated_at: string | null; }; Insert: { ...; }; Update: { ...; }; Relationships: [...]; }; ... 19 more ...; ...'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 93

### 206. Property 'url' does not exist on type '{ categories: { Row: { created_at: string | null; description: string | null; display_order: number | null; icon: string | null; icon_url: string | null; id: string; is_active: boolean | null; ... 6 more ...; updated_at: string | null; }; Insert: { ...; }; Update: { ...; }; Relationships: [...]; }; ... 19 more ...; ...'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 94

### 207. Property 'is_verified' does not exist on type '{ categories: { Row: { created_at: string | null; description: string | null; display_order: number | null; icon: string | null; icon_url: string | null; id: string; is_active: boolean | null; ... 6 more ...; updated_at: string | null; }; Insert: { ...; }; Update: { ...; }; Relationships: [...]; }; ... 19 more ...; ...'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 95

### 208. Property 'isVerified' does not exist on type '{ platform: string; username: string; url: string; } | { platform: any; username: any; url: any; isVerified: any; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 127

### 209. 'activeCategory' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedSearch.svelte`: lines 73

### 210. 'mobileLayout' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedSearch.svelte`: lines 88

### 211. '_isSticky' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedSearch.svelte`: lines 94

### 212. 'handleCategorySelect' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedSearch.svelte`: lines 219

### 213. Module '"$lib/types"' has no exported member 'Product'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/subcategory/SubcategoryBrowse.svelte`: lines 2

### 214. Object literal may only specify known properties, and '"href"' does not exist in type 'ButtonProps'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/subcategory/SubcategoryBrowse.svelte`: lines 86

### 215. 'size' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/ColorPicker.svelte`: lines 9

### 216. 'allowCustom' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/ColorPicker.svelte`: lines 10

### 217. 'showValue' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/ColorPicker.svelte`: lines 11

### 218. '"svelte"' has no exported member named '_ComponentProps'. Did you mean 'ComponentProps'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/icon.svelte`: lines 3

### 219. '"lucide-svelte"' has no exported member named '_AlertCircle'. Did you mean 'AlertCircle'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/upload/ImageUpload.svelte`: lines 2

### 220. '"$lib/components/ui"' has no exported member named '_Button'. Did you mean 'Button'?
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/upload/ImageUpload.svelte`: lines 3

### 221. Cannot find name 'handleDisabled'.
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/upload/ImageUpload.svelte`: lines 169

### 222. '_session' is declared but its value is never read. (js)
**Count:** 1 occurrences

**Affected files:**
- `src/routes/+layout.svelte`: lines 33

### 223. '_errorString' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/+error.svelte`: lines 16

### 224. This comparison appears to be unintentional because the types '"pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "disputed"' and '"completed"' have no overlap.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/admin/+page.svelte`: lines 95

### 225. Expression expected.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/admin/users/+page.svelte`: lines 14

### 226. Parameter 'user' implicitly has an 'any' type.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/admin/users/+page.svelte`: lines 14

### 227. Property 'full_name' does not exist on type '{ id: string; email: string; created_at: string; raw_user_meta_data: Record<string, unknown>; }'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/admin/verify-emails/+page.svelte`: lines 53

### 228. Property 'topBrands' does not exist on type '{ csrfToken: string; categories: { id: string; name: string; slug: string; icon: string | null; }[]; user: User | null; supabase: SupabaseClient<Database, "public", { Tables: { categories: { ...; }; ... 19 more ...; payments?: { ...; } | undefined; }; Views: {}; Functions: { ...; }; Enums: { ...; }; CompositeTypes: ...'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/+page.svelte`: lines 157

### 229. '"lucide-svelte"' has no exported member named '_Users'. Did you mean 'Users'?
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 3

### 230. '"lucide-svelte"' has no exported member named '_TrendingUp'. Did you mean 'TrendingUp'?
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 3

### 231. Property 'user' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 15

### 232. Property 'instagram_url' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 22

### 233. Property 'facebook_url' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 23

### 234. Property 'twitter_url' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 24

### 235. Property 'tiktok_url' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 25

### 236. Property 'verification_status' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 86

### 237. Property 'rating' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 326

### 238. Property 'comment' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/brands/[slug]/+page.svelte`: lines 335

### 239. Type '{ unread_count: number; id: string; listing_id: string; buyer_id: string; seller_id: string; last_message_at: string | null; archived_by_buyer: boolean | null; archived_by_seller: boolean | null; ... 5 more ...; last_message: { ...; }[]; }[]' is not assignable to type 'Conversation[]'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/messages/+page.svelte`: lines 63

### 240. Object literal may only specify known properties, and '"userId"' does not exist in type '$$ComponentProps'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/messages/+page.svelte`: lines 86

### 241. Cannot use 'bind:' with this property. It is declared as non-bindable inside the component.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/messages/+page.svelte`: lines 85

### 242. 'data' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/onboarding/+page.svelte`: lines 9

### 243. '_isNewSignup' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/onboarding/+page.svelte`: lines 28

### 244. Type '{ id: string; order_number: string; buyer_id: string; seller_id: string; transaction_id: string | null; status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "disputed"; ... 24 more ...; disputes: { ...; }[]; }' is not assignable to type 'Order'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(app)/orders/[id]/+page.svelte`: lines 22

### 245. Type 'Timeout' is not assignable to type 'number'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/+error.svelte`: lines 81

### 246. Argument of type '{}' is not assignable to parameter of type 'string | AnyComponent'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/login/+page.svelte`: lines 73

### 247. Type 'typeof Github' is not assignable to type 'Component<{}, {}, string>'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/login/+page.svelte`: lines 179

### 248. Type '{}' is not assignable to type 'string | number | undefined'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/login/+page.svelte`: lines 213

### 249. Type 'typeof EyeOff' is not assignable to type 'Component<{}, {}, string>'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/login/+page.svelte`: lines 248

### 250. Type 'typeof Eye' is not assignable to type 'Component<{}, {}, string>'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/login/+page.svelte`: lines 250

### 251. Module '"k:/driplo.bg-main/src/lib/components/auth/TurnstileWrapper.svelte"' has no default export.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/register/+page.svelte`: lines 14

### 252. '_validatedData' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/register/+page.svelte`: lines 90

### 253. Property '_data' does not exist on type 'AuthResponse'.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/register/+page.svelte`: lines 105

### 254. '_data' is declared but its value is never read.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/register/+page.svelte`: lines 105

### 255. Parameter 'token' implicitly has an 'any' type.
**Count:** 1 occurrences

**Affected files:**
- `src/routes/(auth)/register/+page.svelte`: lines 487


## Warnings (Accessibility & Code Quality)

### 1. Visible, non-interactive elements with a click event must be accompanied by a keyboard event handler. Consider whether an interactive element such as `<button type="button">` or `<a>` might be more appropriate
**Count:** 19 occurrences

**Affected files:**
- `src/lib/components/checkout/CheckoutModal.svelte`: lines 95, 108
- `src/lib/components/cookie-consent/CookieConsent.svelte`: lines 118
- `src/lib/components/listings/CreateListingForm/steps/ProductDetailsStep.svelte`: lines 161
- `src/lib/components/messaging/MessageSearch.svelte`: lines 161
- `src/lib/components/messaging/MessageThread.svelte`: lines 326
- `src/lib/components/orders/OrderList.svelte`: lines 191
- `src/lib/components/shared/CategoryDropdown.svelte`: lines 71, 77
- `src/lib/components/shared/CategoryDropdownFixed.svelte`: lines 64, 70
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 587
- `src/lib/components/subcategory/SubcategoryBrowse.svelte`: lines 97, 98
- `src/lib/components/ui/Image.svelte`: lines 274, 298
- `src/lib/components/ui/alert-dialog/AlertDialogTrigger.svelte`: lines 25
- `src/lib/components/ui/popover/PopoverTrigger.svelte`: lines 27
- `src/lib/components/upload/ImageUpload.svelte`: lines 160

### 2. A form label must be associated with a control
**Count:** 17 occurrences

**Affected files:**
- `src/lib/components/checkout/CheckoutFlow.svelte`: lines 463
- `src/lib/components/messaging/ConversationList.svelte`: lines 189
- `src/lib/components/orders/OrderList.svelte`: lines 191
- `src/lib/components/orders/ShippingForm.svelte`: lines 117
- `src/lib/components/payment/PaymentAccountSetup.svelte`: lines 127
- `src/lib/components/ui/ColorPicker.svelte`: lines 57
- `src/routes/(auth)/register/+page.svelte`: lines 233
- `src/routes/brands/settings/+page.svelte`: lines 518, 529, 540, 553, 575, 587, 659, 671, 683, 774

### 3. `<div>` with a click handler must have an ARIA role
**Count:** 12 occurrences

**Affected files:**
- `src/lib/components/checkout/CheckoutModal.svelte`: lines 108
- `src/lib/components/cookie-consent/CookieConsent.svelte`: lines 118
- `src/lib/components/messaging/MessageSearch.svelte`: lines 161
- `src/lib/components/shared/CategoryDropdown.svelte`: lines 71, 77
- `src/lib/components/shared/CategoryDropdownFixed.svelte`: lines 64, 70
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 587
- `src/lib/components/subcategory/SubcategoryBrowse.svelte`: lines 97, 98
- `src/lib/components/ui/alert-dialog/AlertDialogTrigger.svelte`: lines 25
- `src/lib/components/ui/popover/PopoverTrigger.svelte`: lines 27

### 4. noninteractive element cannot have nonnegative tabIndex value
**Count:** 5 occurrences

**Affected files:**
- `src/lib/components/messaging/ConversationList.svelte`: lines 189, 194
- `src/lib/components/messaging/ConversationListEnhanced.svelte`: lines 183, 192
- `src/lib/components/ui/list/ListCard.svelte`: lines 20

### 5. Buttons and links should either contain text or have an `aria-label` or `aria-labelledby` attribute
**Count:** 4 occurrences

**Affected files:**
- `src/lib/components/messaging/MessageSearch.svelte`: lines 106
- `src/lib/components/messaging/MessageThread.svelte`: lines 437
- `src/routes/(app)/messages/+page.svelte`: lines 31
- `src/routes/(app)/sellers/+page.svelte`: lines 96

### 6. `<svelte:component>` is deprecated in runes mode — components are dynamic by default
**Count:** 4 occurrences

**Affected files:**
- `src/lib/components/ui/badge.svelte`: lines 208, 258
- `src/routes/(app)/admin/+page.svelte`: lines 46
- `src/routes/dashboard/+layout.svelte`: lines 101

### 7. Non-interactive element `<img>` should not be assigned mouse or keyboard event listeners
**Count:** 3 occurrences

**Affected files:**
- `src/lib/components/messaging/MessageThread.svelte`: lines 326
- `src/lib/components/ui/Image.svelte`: lines 274, 298

### 8. `<button>` cannot be a child of `<button>`. When rendering this component on the server, the resulting HTML will be modified by the browser (by moving, removing, or inserting elements), likely resulting in a `hydration_mismatch` warning
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/ui/badge.svelte`: lines 216
- `src/lib/components/ui/chip.svelte`: lines 55

### 9. Self-closing HTML tags for non-void elements are ambiguous — use `<button ...></button>` rather than `<button ... />`
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/listings/CreateListingForm/CreateListingForm.svelte`: lines 459
- `src/lib/components/listings/listing-card/ListingCardImage.svelte`: lines 167

### 10. Redundant role 'navigation'
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/layout/MobileNav.svelte`: lines 101
- `src/lib/components/ui/pagination/Pagination.svelte`: lines 14

### 11. Also define the standard property 'line-clamp' for compatibility (css)
**Count:** 2 occurrences

**Affected files:**
- `src/lib/components/brands/TopBrands.svelte`: lines 174
- `src/lib/components/home/SellerQuickView.svelte`: lines 239

### 12. `imgElement` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/Image.svelte`: lines 84

### 13. `Component` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/LazyModal.svelte`: lines 20

### 14. Elements with the ARIA role "combobox" must have the following attributes defined: "aria-controls" and "aria-expanded"
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/CreateListingForm/steps/ProductDetailsStep.svelte`: lines 171

### 15. Elements with the 'combobox' interactive role must have a tabindex value
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/CreateListingForm/steps/ProductDetailsStep.svelte`: lines 161

### 16. `<div>` with a dragenter, dragleave, dragover or drop handler must have an ARIA role
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/CreateListingForm/components/ImageUploader.svelte`: lines 254

### 17. `<div>` with a dragstart, dragover or drop handler must have an ARIA role
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/listings/CreateListingForm/components/ImageUploader.svelte`: lines 327

### 18. Unused CSS selector ".text-warning"
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/brands/brand-onboarding-wizard/steps/BrandBasicsStep.svelte`: lines 177

### 19. Unused CSS selector ".text-danger"
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/brands/brand-onboarding-wizard/steps/BrandBasicsStep.svelte`: lines 181

### 20. Elements with the 'dialog' interactive role must have a tabindex value
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/CheckoutModal.svelte`: lines 95

### 21. Unused CSS selector ".modal-backdrop"
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/CheckoutModal.svelte`: lines 191

### 22. Redundant role 'banner'
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/layout/header/Header.svelte`: lines 156

### 23. Unused CSS selector "header button:active"
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/layout/header/Header.svelte`: lines 235

### 24. Unused CSS selector "header button:not(:active)"
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/layout/header/Header.svelte`: lines 242

### 25. `dialogEl` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/alert-dialog/AlertDialogContent.svelte`: lines 23

### 26. The value of 'aria-hidden' must be either 'true' or 'false'. It cannot be empty
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/pagination/PaginationEllipsis.svelte`: lines 13

### 27. `contentEl` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/popover/PopoverContent.svelte`: lines 30

### 28. `<div>` with a mouseenter or mouseleave handler must have an ARIA role
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/ui/tooltip/TooltipTrigger.svelte`: lines 22

### 29. `containerRef` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedFilter.svelte`: lines 123

### 30. `CheckoutFlow` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/checkout/LazyCheckoutFlow.svelte`: lines 21

### 31. `conversations` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/messaging/ConversationList.svelte`: lines 37

### 32. `loading` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/messaging/ConversationList.svelte`: lines 38

### 33. `hasMore` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/messaging/ConversationList.svelte`: lines 39

### 34. Avoid using autofocus
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/messaging/MessageSearch.svelte`: lines 123

### 35. `shipping_carrier` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/orders/ShippingForm.svelte`: lines 12

### 36. `tracking_number` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/orders/ShippingForm.svelte`: lines 13

### 37. `shipping_label_url` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/orders/ShippingForm.svelte`: lines 14

### 38. `submitting` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/orders/ShippingForm.svelte`: lines 15

### 39. `error` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/orders/ShippingForm.svelte`: lines 16

### 40. Non-interactive element `<label>` should not be assigned mouse or keyboard event listeners
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/orders/OrderList.svelte`: lines 191

### 41. Unknown at rule @apply (css)
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/profile/SocialMediaLinks.svelte`: lines 161

### 42. `searchRef` is updated, but is not declared with `$state(...)`. Changing its value will not correctly trigger updates
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/shared/UnifiedSearch.svelte`: lines 95

### 43. `<div>` with a click, dragover, dragleave or drop handler must have an ARIA role
**Count:** 1 occurrences

**Affected files:**
- `src/lib/components/upload/ImageUpload.svelte`: lines 160


## Files with Most Issues

| File | Errors | Warnings | Total |
|------|--------|----------|-------|
| `src/routes/(app)/brands/[slug]/+page.svelte` | 49 | 0 | 49 |
| `src/lib/components/shared/UnifiedFilter.svelte` | 38 | 3 | 41 |
| `src/lib/components/checkout/checkout-modal/PaymentInstructions.svelte` | 17 | 0 | 17 |
| `src/lib/components/profile/SocialMediaLinks.svelte` | 13 | 1 | 14 |
| `src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte` | 11 | 0 | 11 |
| `src/lib/components/shared/UnifiedSearch.svelte` | 10 | 1 | 11 |
| `src/routes/(app)/onboarding/+page.svelte` | 11 | 0 | 11 |
| `src/lib/components/subcategory/SubcategoryBrowse.svelte` | 6 | 4 | 10 |
| `src/routes/brands/settings/+page.svelte` | 0 | 10 | 10 |
| `src/routes/(auth)/register/+page.svelte` | 8 | 1 | 9 |
| `src/lib/components/checkout/checkout-modal/PaymentSelector.svelte` | 8 | 0 | 8 |
| `src/lib/components/shared/CategoryDropdownFixed.svelte` | 4 | 4 | 8 |
| `src/lib/components/messaging/ConversationList.svelte` | 2 | 6 | 8 |
| `src/routes/(app)/listings/[id]/+page.server.ts` | 7 | 0 | 7 |
| `src/lib/components/checkout/CheckoutModal.svelte` | 2 | 5 | 7 |
| `src/lib/components/messaging/MessageSearch.svelte` | 3 | 4 | 7 |
| `src/routes/(auth)/login/+page.svelte` | 7 | 0 | 7 |
| `src/lib/utils/format.ts` | 6 | 0 | 6 |
| `src/lib/components/home/SellerQuickView.svelte` | 5 | 1 | 6 |
| `src/lib/components/layout/header/Header.svelte` | 3 | 3 | 6 |
| `src/lib/components/shared/CategoryDropdown.svelte` | 2 | 4 | 6 |
| `src/lib/components/upload/ImageUpload.svelte` | 4 | 2 | 6 |
| `src/lib/components/home/HeroSearch.svelte` | 6 | 0 | 6 |
| `src/lib/components/home/HeroSearchFixed.svelte` | 6 | 0 | 6 |
| `src/lib/components/orders/ShippingForm.svelte` | 0 | 6 | 6 |
| `src/lib/components/ui/badge.svelte` | 2 | 3 | 5 |
| `src/lib/components/listings/CreateListingForm/steps/ProductDetailsStep.svelte` | 2 | 3 | 5 |
| `src/routes/api/stripe/webhooks/+server.ts` | 5 | 0 | 5 |
| `src/lib/components/auth/TurnstileWrapper.svelte` | 5 | 0 | 5 |
| `src/lib/server/api-utils.ts` | 5 | 0 | 5 |

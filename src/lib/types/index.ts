// Core database types - explicit exports to avoid conflicts
export type {
  Json,
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  CompositeTypes,
  ExtendedProfile,
  Profile,
  ExtendedSubcategory,
  BrandVerificationRequest,
  AdminApproval
} from './db';

// Enhanced component and API types - explicit exports to avoid conflicts
export type {
  ListingCardProps,
  ComponentSize,
  ModalProps,
  CardProps,
  LoadingState,
  ErrorState,
  FormState,
  ValidatedInput,
  ComponentProps,
  InteractiveState,
  NavigationItem
} from './components';

export type {
  LoginFormData,
  RegisterFormData,
  ListingFormData,
  ProfileFormData,
  FormFieldError,
  ValidationResult,
  FormSubmitState
} from './forms';

// UI types with explicit exports to avoid ComponentSize conflict
export type {
  ColorVariant,
  VisualVariant,
  BorderRadius,
  ShadowVariant,
  ButtonVariant,
  ButtonSize,
  ButtonState,
  InputVariant,
  InputSize,
  InputState,
  BadgeVariant,
  BadgeSize,
  AlertVariant,
  AlertSize,
  SpinnerVariant,
  SpinnerSize,
  SkeletonVariant,
  ModalSize,
  ModalVariant,
  BackdropVariant,
  NavigationVariant,
  NavigationItemState,
  TableVariant,
  TableSize,
  CardVariant,
  CardSize,
  ListingCardVariant,
  ConditionVariant,
  BrandBadgeVariant,
  AnimationTiming,
  AnimationEasing,
  TransitionType,
  Breakpoint,
  ResponsiveProperty,
  ThemeMode,
  ColorScheme,
  ScreenReaderText,
  FocusVisible,
  ReducedMotion,
  FlexDirection,
  FlexAlign,
  FlexJustify,
  GridTemplate,
  ComponentPropsBase,
  InteractiveComponentProps,
  StyleProps,
  ComponentSize as UiComponentSize
} from './ui';

// API types with explicit naming to avoid conflicts
export type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
  BrowseListingsParams,
  BrowseListingsResponse,
  CreateListingRequest,
  CreateListingResponse,
  UpdateListingRequest,
  OrderData,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderListResponse,
  MessageData,
  MessageAttachment,
  ConversationData,
  SendMessageRequest,
  SendMessageResponse,
  ConversationListResponse,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  PaymentMethodData,
  SearchSuggestionsParams,
  SearchSuggestionsResponse,
  UserAnalyticsData,
  SellerAnalyticsResponse,
  FileUploadRequest,
  FileUploadResponse,
  HealthCheckResponse,
  RequestId,
  ApiMethod,
  SortOrder,
  CurrencyCode,
  PaginationInfo,
  BrowseLoadMoreResponse,
  TopSellersResponse,
  MessageSendResponse,
  UnreadCountResponse,
  OrderResponse,
  OrderCreateRequest,
  WishlistToggleResponse
} from './api';

// Legacy types - explicit exports to avoid conflicts
export type {
  Listing,
  Category as LegacyCategory,
  Condition,
  Price,
  ListingImage,
  Measurements,
  ListingStatus,
  ListingAnalytics,
  ShippingOptions,
  ShippingMethod
} from './listing';

// Transaction types - explicit exports to avoid ShippingAddress conflict
export type {
  Transaction,
  Money,
  TransactionStatus as LegacyTransactionStatus,
  TransactionShipping,
  ShippingAddress as TransactionShippingAddress,
  EscrowDetails,
  TransactionEvent
} from './transaction';

// Filter types - explicit exports
export type {
  FilterParams,
  SortParams,
  CategoryFilter,
  PriceFilter,
  LocationFilter,
  ConditionFilter,
  BrandFilter,
  FilterOption,
  ActiveFilters,
  FilterCounts
} from './filter';

// Unified types - explicit to avoid Profile conflicts
export type {
  Profile as UnifiedProfile,
  Listing as UnifiedListing,
  Category as UnifiedCategory,
  Transaction as UnifiedTransaction,
  UserRating,
  Message,
  Favorite,
  UserFollow,
  ProfileInsert,
  ListingInsert,
  TransactionInsert,
  ProfileUpdate,
  ListingUpdate,
  TransactionUpdate,
  ListingStatus as UnifiedListingStatus,
  ListingCondition,
  TransactionStatus,
  RatingType,
  PaginationParams,
  SortParams,
  FilterParams,
  ApiResponse as UnifiedApiResponse,
  PaginatedResponse as UnifiedPaginatedResponse,
  ProfileWithStats,
  ListingWithDetails,
  TransactionWithDetails,
  MessageThread,
  ProfileFormData,
  ListingFormData,
  AchievementLevel,
  AchievementDefinition,
  Database
} from './unified';

// RPC types (if still needed) - explicit exports
export type {
  GetTopCategorySellersArgs,
  GetTopCategorySellersResponse,
  DatabaseFunction,
  RPCParams,
  RPCResponse
} from './rpc.types';
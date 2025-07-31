// RPC Function Types for Supabase Functions
// This file defines TypeScript types for all RPC functions used in the application

export interface RPCFunctions {
  // Session Management
  create_auth_session: {
    Args: {
      user_id: string;
      session_token: string;
      expires_at: string;
    };
    Returns: {
      session_id: string;
      created_at: string;
    };
  };

  validate_auth_session: {
    Args: {
      session_token: string;
    };
    Returns: {
      is_valid: boolean;
      user_id?: string;
      expires_at?: string;
    };
  };

  manage_user_session: {
    Args: {
      action: 'create' | 'validate' | 'refresh' | 'delete';
      user_id?: string;
      session_token?: string;
    };
    Returns: {
      success: boolean;
      session?: {
        id: string;
        user_id: string;
        expires_at: string;
      };
    };
  };

  validate_user_session: {
    Args: {
      user_id: string;
      session_token: string;
    };
    Returns: {
      is_valid: boolean;
      session_data?: Record<string, unknown>;
    };
  };

  // Login Tracking
  track_login_attempt: {
    Args: {
      email: string;
      success: boolean;
      ip_address?: string;
      user_agent?: string;
    };
    Returns: void;
  };

  get_active_sessions: {
    Args: Record<string, never>;
    Returns: Array<{
      user_id: string;
      session_count: number;
      last_active: string;
    }>;
  };

  // Seller & Brand Analytics
  get_top_sellers: {
    Args: {
      time_period?: 'day' | 'week' | 'month' | 'year' | 'all';
      limit_count?: number;
      category_id?: string;
    };
    Returns: Array<{
      id: string;
      user_id: string;
      username: string;
      display_name: string;
      avatar_url: string | null;
      total_sales: number;
      revenue: number;
      average_rating: number | null;
      review_count: number;
      rank?: number;
    }>;
  };

  get_top_brands: {
    Args: {
      limit_count?: number;
      time_period?: 'day' | 'week' | 'month' | 'year' | 'all';
    };
    Returns: Array<{
      id: string;
      name: string;
      slug: string;
      logo_url: string | null;
      total_sales: number;
      revenue: number;
      listing_count: number;
      average_rating: number | null;
      follower_count: number;
    }>;
  };

  get_category_top_sellers: {
    Args: {
      category_slug: string;
      time_period?: 'day' | 'week' | 'month' | 'year' | 'all';
      result_limit?: number;
    };
    Returns: Array<{
      id: string;
      username: string;
      full_name: string;
      avatar_url: string | null;
      account_type: string;
      is_verified: boolean;
      category_sales: number;
      category_revenue: number;
      category_rating: number;
      category_rating_count: number;
    }>;
  };

  // User Statistics
  get_user_stats: {
    Args: {
      user_id_param: string;
    };
    Returns: {
      total_sales: number;
      total_purchases: number;
      average_rating: number | null;
      review_count: number;
      listing_count: number;
      follower_count: number;
      following_count: number;
    };
  };

  get_user_statistics: {
    Args: {
      p_user_id: string;
    };
    Returns: {
      sales_count: number;
      purchase_count: number;
      listing_count: number;
      average_rating: number;
    };
  };

  // Reviews
  get_recent_reviews: {
    Args: {
      time_period?: 'day' | 'week' | 'month' | 'year';
      limit_count?: number;
    };
    Returns: Array<{
      id: string;
      rating: number;
      comment: string;
      created_at: string;
      reviewer_name: string;
      reviewer_avatar: string | null;
      listing_title: string;
      listing_image: string | null;
    }>;
  };

  // Search
  search_listings: {
    Args: {
      search_query?: string;
      category_id?: string;
      min_price?: number;
      max_price?: number;
      conditions?: string[];
      sizes?: string[];
      sort_by?: 'price_asc' | 'price_desc' | 'created_at' | 'popularity';
      limit_count?: number;
      offset_count?: number;
    };
    Returns: Array<{
      id: string;
      title: string;
      price: number;
      image_url: string;
      seller_username: string;
      condition: string;
      size: string | null;
      created_at: string;
    }>;
  };

  // Brand Sales Statistics
  get_brand_sales_stats: {
    Args: {
      brand_id_param: string;
      start_date?: string;
      end_date?: string;
    };
    Returns: {
      total_sales: number;
      total_revenue: number;
      average_order_value: number;
      top_categories: Array<{
        category_name: string;
        sales_count: number;
      }>;
      sales_by_month: Array<{
        month: string;
        sales_count: number;
        revenue: number;
      }>;
    };
  };

  // Payout Statistics
  get_payout_statistics: {
    Args: {
      start_date?: string;
      end_date?: string;
    };
    Returns: {
      total_payouts: number;
      pending_amount: number;
      processed_amount: number;
      failed_count: number;
      average_payout: number;
    };
  };

  // Admin Audit Logging
  log_admin_action: {
    Args: {
      action_type: string;
      resource_type: string;
      resource_id: string;
      details?: Record<string, unknown>;
      ip_address?: string;
    };
    Returns: void;
  };

  // Order Management
  generate_order_number: {
    Args: Record<string, never>;
    Returns: string;
  };

  update_order_status: {
    Args: {
      order_id: string;
      new_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'disputed';
      tracking_number?: string;
      carrier?: string;
      notes?: string;
    };
    Returns: {
      success: boolean;
      message?: string;
    };
  };

  // Message Management
  mark_messages_as_read: {
    Args: {
      conversation_id: string;
      user_id: string;
    };
    Returns: {
      updated_count: number;
    };
  };

  // Category Management
  get_categories_with_counts: {
    Args: Record<string, never>;
    Returns: Array<{
      category_data: Record<string, unknown>;
      product_count: number;
    }>;
  };

  // Admin Functions
  get_unverified_users_for_admin: {
    Args: Record<string, never>;
    Returns: Array<{
      id: string;
      email: string;
      created_at: string;
      raw_user_meta_data: Record<string, unknown>;
    }>;
  };

  admin_verify_user_email: {
    Args: {
      user_id: string;
    };
    Returns: {
      success: boolean;
      message?: string;
    };
  };

  // Rate Limiting
  cleanup_expired_rate_limits: {
    Args: Record<string, never>;
    Returns: number;
  };

  // Homepage Functions
  get_homepage_listings: {
    Args: {
      p_type: string;
      p_limit: number;
    };
    Returns: Array<Record<string, unknown>>;
  };

  // Auth Rate Limiting
  check_auth_rate_limit: {
    Args: {
      email: string;
      ip_address?: string;
    };
    Returns: {
      allowed: boolean;
      retry_after?: number;
    };
  };

  check_rate_limit: {
    Args: {
      identifier: string;
      action: string;
      limit?: number;
    };
    Returns: {
      allowed: boolean;
      current_count: number;
      retry_after?: number;
    };
  };

  // Listing Functions
  get_category_listings: {
    Args: {
      category_slug: string;
      limit_count?: number;
      offset_count?: number;
      sort_by?: string;
      filters?: Record<string, unknown>;
    };
    Returns: Array<{
      id: string;
      title: string;
      price: number;
      images: string[];
      condition: string;
      size: string | null;
      seller_id: string;
      seller_username: string;
      created_at: string;
    }>;
  };

  get_listings_count: {
    Args: {
      filters?: Record<string, unknown>;
    };
    Returns: number;
  };

  get_listings_with_favorites: {
    Args: {
      user_id?: string;
      limit_count?: number;
      offset_count?: number;
    };
    Returns: Array<{
      id: string;
      title: string;
      price: number;
      images: string[];
      is_favorited: boolean;
      seller_username: string;
      created_at: string;
    }>;
  };

  get_profile_listings_with_stats: {
    Args: {
      profile_username: string;
      viewer_id?: string;
      limit_count?: number;
      offset_count?: number;
    };
    Returns: {
      listings: Array<Record<string, unknown>>;
      stats: {
        total_listings: number;
        total_sales: number;
        average_rating: number;
      };
    };
  };

  get_user_favorites_with_listings: {
    Args: {
      user_id: string;
      limit_count?: number;
      offset_count?: number;
    };
    Returns: Array<{
      listing_id: string;
      listing: Record<string, unknown>;
      favorited_at: string;
    }>;
  };

  increment_listing_quantity: {
    Args: {
      listing_id: string;
      increment_by: number;
    };
    Returns: {
      new_quantity: number;
      success: boolean;
    };
  };

  // Auth Event Logging
  log_auth_event: {
    Args: {
      event_type: string;
      user_id?: string;
      email?: string;
      ip_address?: string;
      user_agent?: string;
      metadata?: Record<string, unknown>;
    };
    Returns: void;
  };

  // Listing Analytics
  track_listing_view: {
    Args: {
      listing_id: string;
      viewer_id?: string;
      ip_address?: string;
    };
    Returns: void;
  };

  // Top Category Sellers (referenced as type constraint)
  get_top_category_sellers: {
    Args: {
      category_slug: string;
      limit_count?: number;
      time_period?: string;
    };
    Returns: Array<{
      seller_id: string;
      username: string;
      avatar_url: string | null;
      total_sales: number;
      rating: number;
    }>;
  };

}

// Helper type to extract RPC function names
export type RPCFunctionName = keyof RPCFunctions;

// Helper type to get args for a specific RPC function
export type RPCArgs<T extends RPCFunctionName> = RPCFunctions[T]['Args'];

// Helper type to get return type for a specific RPC function
export type RPCReturns<T extends RPCFunctionName> = RPCFunctions[T]['Returns'];

// Type-safe RPC call helper type
export type TypedRPC = <T extends RPCFunctionName>(
  functionName: T,
  args: RPCArgs<T>
) => Promise<{
  data: RPCReturns<T> | null;
  error: Error | null;
}>;
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// For startup phase, we show ALL sellers, brands, etc.
	// Later we can add filters for top performers only
	
	// Fetch all sellers (personal accounts)
	const sellersResult = await locals?.supabase
		.from('profiles')
		.select(`
			id,
			user_id: id,
			username,
			full_name,
			avatar_url,
			badges,
			total_sales,
			seller_rating,
			average_rating: seller_rating,
			rating_count: seller_rating_count,
			total_revenue: total_earned,
			listings_count,
			created_at,
			account_type,
			is_verified,
			followers_count
		`)
		.eq('account_type', 'personal')
		.order('total_sales', { ascending: false });
		
	// Fetch brand profiles with profile data in a single JOIN query
	const brandsResult = await locals?.supabase
		.from('brand_profiles')
		.select(`
			id,
			brand_name,
			brand_slug,
			brand_logo_url,
			verification_status,
			created_at,
			profiles!brand_profiles_user_id_fkey (
				username,
				avatar_url,
				total_sales,
				seller_rating,
				seller_rating_count,
				total_earned,
				followers_count,
				badges
			)
		`);
	
	// Handle any errors
	if (sellersResult?.error) {
		console?.error('Error fetching sellers:', sellersResult?.error);
	}
	if (brandsResult?.error) {
		console?.error('Error fetching brands:', brandsResult?.error);
	}
	
	// Process brand data with joined profile data
	const brands = (brandsResult?.data || [])?.map((brand) => {
		const profile = (brand as any)?.profiles || {};
		return {
			brand_id: (brand as any)?.id,
			brand_name: (brand as any)?.brand_name,
			brand_slug: (brand as any)?.brand_slug,
			brand_logo_url: (brand as any)?.brand_logo_url,
			verification_status: (brand as any)?.verification_status,
			created_at: (brand as any)?.created_at,
			username: profile?.username,
			avatar_url: profile?.avatar_url,
			total_sales: profile?.total_sales || 0,
			average_rating: profile?.seller_rating || 0,
			rating_count: profile?.seller_rating_count || 0,
			total_revenue: profile?.total_earned || 0,
			followers_count: profile?.followers_count || 0,
			badges: profile?.badges || []
		};
	});
	
	console?.log('Processed brands:', brands);
	
	// For now, we'll use the same data structure as before but with all sellers
	return {
		topSellers: sellersResult?.data || [],
		topBrands: brands,
		recentReviews: [], // We can add this later if needed
		initialTimePeriod: 'all'
	};
};
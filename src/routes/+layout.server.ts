import type { LayoutServerLoad } from './$types'
import { generateCSRFToken } from '$lib/server/csrf'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, depends }) => {
	// Declare dependencies for invalidation
	depends('supabase:auth')
	
	// Get authenticated session with JWT validation
	const { session, user } = await safeGetSession()
	
	// Get main categories for navigation (cached for 5 minutes)
	const { data: categories, error: categoriesError } = await supabase
		.from('categories')
		.select('id, name, slug, icon')
		.is('parent_id', null)
		.eq('is_active', true)
		.order('sort_order')
		.order('name')
	
	// Get user profile if authenticated
	let profile = null
	if (user) {
		try {
			const { data: profileData } = await supabase
				.from('profiles')
				.select('id, username, full_name, avatar_url, account_type, email_verified')
				.eq('id', user.id)
				.single()
			
			profile = profileData
		} catch (error) {
			// Profile fetch failed - not critical for layout
			console.warn('Failed to fetch user profile:', error)
		}
	}

	return {
		session,
		user,
		profile,
		categories: categories || [],
		// Include CSRF token for forms
		csrfToken: generateCSRFToken()
	}
}
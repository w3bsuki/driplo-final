import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createBrowserClient, isBrowser } from '@supabase/ssr'
import type { LayoutLoad } from './$types'
import type { Database } from '$lib/types/database'
import { createRoutePreloader } from '$lib/utils/lazy-load'

// Create route preloader for heavy routes
const routePreloader = isBrowser ? createRoutePreloader({
	'/messages': () => import('$lib/components/messaging/MessageThread.svelte'),
	'/sell': () => import('$lib/components/listings/CreateListingForm/CreateListingForm.svelte'),
	'/checkout': () => import('$lib/components/checkout/CheckoutFlow.svelte'),
	'/profile/setup': () => import('$lib/components/onboarding/ProfileSetupWizard.svelte')
}) : null;

export const load: LayoutLoad = async ({ data, depends, fetch, url }) => {
	/**
	 * Declare a dependency so the layout can be invalidated on auth changes
	 */
	depends('supabase:auth')

	// Create browser client with secure configuration
	const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch,
		},
		auth: {
			persistSession: true,
			detectSessionInUrl: true,
			flowType: 'pkce',
			// Security: Automatically refresh tokens
			autoRefreshToken: true,
			// Detect session in URL for OAuth callbacks
			detectSessionInUrl: true
		}
	})

	// Preload routes based on current path (performance optimization)
	if (isBrowser && routePreloader) {
		routePreloader.preloadMatchingRoutes(url.pathname);
		
		// Preload commonly accessed routes after page load
		if (url.pathname === '/') {
			setTimeout(() => {
				routePreloader.preloadRoute('/messages');
				routePreloader.preloadRoute('/sell');
			}, 3000);
		}
	}

	// Return server-validated data to client
	// All authentication decisions are made server-side
	return {
		session: data.session,
		supabase,
		user: data.user,
		profile: data.profile,
		categories: data.categories || [],
		csrfToken: data.csrfToken
	}
}
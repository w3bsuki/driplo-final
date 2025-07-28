import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, cookies }) => {
	// Get current session before signing out
	const { user } = await locals.safeGetSession()
	
	// Sign out from Supabase
	await locals.supabase.auth.signOut()
	
	// Clear all auth-related cookies
	const cookiesToClear = [
		'remember_me',
		'2fa_verified',
		'2fa_redirect'
	]
	
	cookiesToClear.forEach(cookieName => {
		cookies.delete(cookieName, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		})
	})
	
	// Log the sign out event if user was logged in
	if (user) {
		try {
			await locals.supabase.rpc('log_auth_event', {
				p_user_id: user.id,
				p_action: 'logout',
				p_ip_address: 'server',
				p_user_agent: 'server',
				p_success: true,
				p_error_message: null,
				p_metadata: null
			})
		} catch (error) {
			// Ignore logging errors during logout
		}
	}
	
	// Redirect to login with success message
	throw redirect(303, '/login?message=logged_out')
}
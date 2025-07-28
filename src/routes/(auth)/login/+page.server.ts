import type { PageServerLoad, Actions } from './$types'
import { redirect, fail } from '@sveltejs/kit'
import { validateEmail } from '$lib/utils/auth-validation'
import { logError } from '$lib/utils/error-handling'
import { generateCSRFToken, csrfProtectedAction } from '$lib/server/csrf'

export const load: PageServerLoad = async ({ locals, url }) => {
	try {
		// Check if user is already authenticated
		const { session } = await locals.safeGetSession()
		
		// If already logged in, redirect to intended page or home
		if (session) {
			const redirectTo = url.searchParams.get('redirect') || '/'
			throw redirect(303, redirectTo)
		}
	} catch (error) {
		// If it's a redirect from SvelteKit, rethrow it
		if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
			throw error
		}
		// Log other errors but don't break the page
		logError(error, { handler: 'login-load', url: url.pathname })
	}
	
	// Return CSRF token for form security
	return {
		csrfToken: generateCSRFToken()
	}
}

export const actions: Actions = {
	login: csrfProtectedAction(async ({ request, locals, url, cookies }) => {
		try {
			const formData = await request.formData()
			const email = formData.get('email')?.toString().trim()
			const password = formData.get('password')?.toString()
			const rememberMe = formData.get('rememberMe') === 'on'
			// CSRF protection is handled by csrfProtectedAction wrapper
			
			// Input validation
			if (!email || !password) {
				return fail(400, { 
					error: 'Email and password are required',
					email: email || ''
				})
			}
			
			// Validate email format
			const emailValidation = validateEmail(email)
			if (!emailValidation.valid) {
				return fail(400, { 
					error: emailValidation.error,
					email: email
				})
			}
			
			// Check rate limit
			try {
				const { data: rateLimitCheck } = await locals.supabase.rpc('check_auth_rate_limit', {
					p_identifier: email,
					p_action: 'login',
					p_max_attempts: 5,
					p_window_minutes: 15,
					p_block_minutes: 30
				})
				
				if (rateLimitCheck && !rateLimitCheck.allowed) {
					const errorMessage = rateLimitCheck.reason === 'blocked' 
						? `Too many login attempts. Please try again in ${Math.ceil(rateLimitCheck.retry_after / 60)} minutes.`
						: 'Too many login attempts. Please try again later.'
						
					return fail(429, { 
						error: errorMessage,
						email: email
					})
				}
			} catch (rateLimitError) {
				// Continue if rate limit check fails
				logError(rateLimitError, { handler: 'login-rate-limit', email })
			}
			
			// Attempt login
			const { data, error } = await locals.supabase.auth.signInWithPassword({
				email,
				password
			})
			
			if (error) {
				// Log failed login attempt
				try {
					await locals.supabase.rpc('log_auth_event', {
						p_user_id: null,
						p_action: 'login_failed',
						p_ip_address: request.headers.get('x-forwarded-for') || 
									  request.headers.get('x-real-ip') || 
									  'unknown',
						p_user_agent: request.headers.get('user-agent'),
						p_success: false,
						p_error_message: error.message,
						p_metadata: { email }
					})
				} catch (logError) {
					// Ignore logging errors
				}
				
				// Handle specific error types
				let errorMessage = 'Login failed. Please try again.'
				if (error.message.includes('Email not confirmed')) {
					errorMessage = 'Please verify your email before logging in. Check your inbox for the confirmation link.'
				} else if (error.message.includes('Invalid login credentials')) {
					errorMessage = 'Invalid email or password. Please try again.'
				} else if (error.message.toLowerCase().includes('rate limit')) {
					errorMessage = 'Too many login attempts. Please try again later.'
				}
				
				return fail(400, { 
					error: errorMessage,
					email: email
				})
			}
			
			if (data.user && data.session) {
				// Log successful login
				try {
					await locals.supabase.rpc('log_auth_event', {
						p_user_id: data.user.id,
						p_action: 'login',
						p_ip_address: request.headers.get('x-forwarded-for') || 
									  request.headers.get('x-real-ip') || 
									  'unknown',
						p_user_agent: request.headers.get('user-agent'),
						p_success: true,
						p_error_message: null,
						p_metadata: null
					})
				} catch (logError) {
					// Ignore logging errors
				}
				
				// Set remember me cookie if requested
				if (rememberMe) {
					cookies.set('remember_me', 'true', {
						path: '/',
						httpOnly: true,
						secure: true,
						sameSite: 'lax',
						maxAge: 60 * 60 * 24 * 30 // 30 days
					})
				}
				
				// Redirect to intended page or home
				const redirectTo = url.searchParams.get('redirect') || '/'
				throw redirect(303, redirectTo)
			}
			
			return fail(500, { 
				error: 'Login failed. Please try again.',
				email: email
			})
			
		} catch (error) {
			// Handle redirect
			if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
				throw error
			}
			
			// Log unexpected errors
			logError(error, { 
				handler: 'login-action', 
				url: url.pathname,
				userAgent: request.headers.get('user-agent')
			})
			
			return fail(500, { 
				error: 'An unexpected error occurred. Please try again.',
				email: ''
			})
		}
	})
}
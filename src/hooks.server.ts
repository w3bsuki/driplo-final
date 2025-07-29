import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import type { Database } from '$lib/types/db'
import { sequence } from '@sveltejs/kit/hooks'
import { setLocale, isLocale } from '$lib/paraglide/runtime.js'
import { dev } from '$app/environment'
import { check2FAMiddleware } from '$lib/server/auth-middleware'
import { logError } from '$lib/utils/error-handling'
import * as Sentry from '@sentry/sveltekit'
import { SENTRY_CONFIG } from '$lib/config/sentry'
import { redirect } from '@sveltejs/kit'

// Try to get Sentry DSN from environment
const PUBLIC_SENTRY_DSN = import.meta.env.PUBLIC_SENTRY_DSN || '';

// Initialize Sentry on the server
if (PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: PUBLIC_SENTRY_DSN,
    environment: SENTRY_CONFIG.environment,
    release: SENTRY_CONFIG.release,
    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
    profilesSampleRate: SENTRY_CONFIG.profilesSampleRate,
    sendDefaultPii: SENTRY_CONFIG.sendDefaultPii,
    ignoreErrors: SENTRY_CONFIG.ignoreErrors,
    ignoreTransactions: SENTRY_CONFIG.ignoreTransactions,
    beforeSend: SENTRY_CONFIG.beforeSend,
    beforeSendTransaction: SENTRY_CONFIG.beforeSendTransaction,
    debug: dev,
  });
}

const handleI18n: Handle = async ({ event, resolve }) => {
	try {
		// Get language from cookie or Accept-Language header
		// Paraglide uses PARAGLIDE_LOCALE as the cookie name
		const cookieLocale = event.cookies.get('PARAGLIDE_LOCALE') || event.cookies.get('locale')
		const acceptLanguage = event.request.headers.get('accept-language')?.split(',')[0]?.split('-')[0]
		
		// Determine which language to use
		let locale = 'en' // default
		
		if (cookieLocale && isLocale(cookieLocale)) {
			locale = cookieLocale
		} else if (acceptLanguage && isLocale(acceptLanguage)) {
			locale = acceptLanguage
		}
		
		// Set the language for this request
		setLocale(locale as 'en' | 'bg', { reload: false })
		
		// Store locale for use in components
		event.locals.locale = locale
		
		// Resolve the request
		const response = await resolve(event, {
			transformPageChunk: ({ html }) => {
				// Replace html lang attribute
				return html.replace('<html lang="en">', `<html lang="${locale}">`)
			}
		})
		
		// Set cookie if it's not already set or if locale changed
		if (!cookieLocale || cookieLocale !== locale) {
			// Set PARAGLIDE_LOCALE cookie for Paraglide runtime
			response.headers.append('set-cookie', event.cookies.serialize('PARAGLIDE_LOCALE', locale, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 365, // 1 year
				secure: !dev
			}))
		}
		
		return response
	} catch (error) {
		logError(error, {
			handler: 'handleI18n',
			url: event.url.pathname,
			method: event.request.method
		});
		
		// Fall back to basic response without i18n
		return await resolve(event);
	}
}

const handleSupabase: Handle = async ({ event, resolve }) => {
	try {
		/**
		 * Creates a Supabase client specific to this server request.
		 * The Supabase client gets the Auth token from the request cookies.
		 * Using secure cookie configuration for production.
		 */
		event.locals.supabase = createServerClient<Database>(
			PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_ANON_KEY,
			{
				cookies: {
					get: (key) => event.cookies.get(key),
					set: (key, value, options) => {
						// Secure cookie configuration
						event.cookies.set(key, value, {
							...options,
							path: '/',
							httpOnly: true,
							secure: !dev, // Only secure in production
							sameSite: 'lax',
							maxAge: options?.maxAge ?? 60 * 60 * 24 * 7, // 7 days default
							// Additional security for auth cookies
							...(key.includes('auth') && { 
								sameSite: 'strict',
								maxAge: 60 * 60 * 24 * 1 // 1 day for auth cookies
							})
						})
					},
					remove: (key, options) => {
						// Ensure complete cookie removal
						event.cookies.delete(key, {
							...options,
							path: '/',
							httpOnly: true,
							secure: !dev,
							sameSite: 'lax'
						})
					}
				}
			}
		)

	/**
	 * Secure session validation using safeGetSession.
	 * This function validates the JWT and ensures the session is legitimate.
	 * It also handles token refresh automatically.
	 */
	event.locals.safeGetSession = async () => {
		try {
			const {
				data: { session },
				error: sessionError
			} = await event.locals.supabase.auth.getSession()
			
			if (sessionError || !session) {
				return { session: null, user: null }
			}

			// Validate the session by fetching the user
			const {
				data: { user },
				error: userError
			} = await event.locals.supabase.auth.getUser()
			
			if (userError || !user) {
				// JWT validation failed - clear invalid session
				await event.locals.supabase.auth.signOut()
				return { session: null, user: null }
			}

			// Additional security: verify session hasn't expired
			if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
				await event.locals.supabase.auth.signOut()
				return { session: null, user: null }
			}

			return { session, user }
		} catch (error) {
			// Log error but don't break the request
			logError(error, { handler: 'safeGetSession', url: event.url.pathname })
			return { session: null, user: null }
		}
	}

		// Handle authentication redirects and profile setup
		const { user } = await event.locals.safeGetSession()
		
		// Handle authentication requirements for protected routes
		const isProtectedRoute = ![
			'/login', '/register', '/forgot-password', '/reset-password',
			'/auth/callback', '/auth/confirm', '/', '/browse'
		].some(route => event.url.pathname === route || event.url.pathname.startsWith(route))
		
		const isPublicAsset = event.url.pathname.startsWith('/_app') || 
							  event.url.pathname.startsWith('/images') ||
							  event.url.pathname.includes('.')
		
		// Redirect unauthenticated users from protected routes
		if (isProtectedRoute && !isPublicAsset && !user) {
			const redirectTo = event.url.pathname + event.url.search
			throw redirect(303, `/login?redirect=${encodeURIComponent(redirectTo)}`)
		}
		
		// Handle onboarding for authenticated users
		if (user && !event.url.pathname.startsWith('/onboarding') && !event.url.pathname.startsWith('/api') && !isPublicAsset) {
			try {
				const { data: profile } = await event.locals.supabase
					.from('profiles')
					.select('username, setup_completed, account_type, created_at')
					.eq('id', user.id)
					.single()
				
				if (profile) {
					const needsOnboarding = (
						!profile.setup_completed ||
						(!profile.setup_completed && 
						 new Date(profile.created_at || Date.now()).getTime() > Date.now() - 60 * 60 * 1000)
					)
					
					if (needsOnboarding && !event.url.pathname.startsWith('/login') && 
						!event.url.pathname.startsWith('/register') &&
						!event.url.pathname.startsWith('/callback') &&
						!(profile.account_type === 'brand' && event.url.pathname.startsWith('/brands/'))) {
						throw redirect(303, '/onboarding')
					}
				}
			} catch (profileError) {
				// Don't break on profile fetch errors
				logError(profileError, { handler: 'profile-check', userId: user.id })
			}
		}

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version'
		}
	})

		// Add comprehensive security headers
		response.headers.set('X-Content-Type-Options', 'nosniff')
		response.headers.set('X-Frame-Options', 'DENY')
		response.headers.set('X-XSS-Protection', '1; mode=block')
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
		response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')
		
		// Content Security Policy - Re-enabled for production security
		if (!dev) {
			const cspDirectives = [
				"default-src 'self'",
				"script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://js.stripe.com https://checkout.stripe.com",
				"frame-src 'self' https://www.google.com https://checkout.stripe.com https://js.stripe.com https://hcaptcha.com https://*.hcaptcha.com",
				"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
				"font-src 'self' https://fonts.gstatic.com data:",
				"img-src 'self' data: https: blob:",
				"connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google.com https://api.stripe.com https://*.sentry.io https://*.ingest.sentry.io https://hcaptcha.com https://*.hcaptcha.com",
				"object-src 'none'",
				"base-uri 'self'",
				"form-action 'self'",
				"frame-ancestors 'none'",
				"upgrade-insecure-requests"
			]
			response.headers.set('Content-Security-Policy', cspDirectives.join('; '))
		}
	
	// Only set HSTS in production
	if (event.url.protocol === 'https:') {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
	}

	return response
	} catch (error) {
		logError(error, {
			handler: 'handleSupabase',
			url: event.url.pathname,
			method: event.request.method,
			userAgent: event.request.headers.get('user-agent')
		});
		
		// For auth errors, don't break the entire request
		// Just create a minimal client for fallback
		try {
			event.locals.supabase = createServerClient<Database>(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_ANON_KEY,
				{
					cookies: {
						get: () => null,
						set: () => {},
						remove: () => {}
					}
				}
			);
			
			event.locals.safeGetSession = async () => ({ session: null, user: null });
		} catch (fallbackError) {
			logError(fallbackError, { handler: 'handleSupabase-fallback' });
		}
		
		return await resolve(event);
	}
}

const handleCaching: Handle = async ({ event, resolve }) => {
	try {
		const response = await resolve(event)
	
	// Skip caching for non-GET requests
	if (event.request.method !== 'GET') {
		return response
	}
	
	// Skip if cache headers already set by route
	if (response.headers.has('cache-control')) {
		return response
	}
	
	const path = event.url.pathname
	
	// Apply caching based on route patterns
	if (path.startsWith('/_app/') || path.startsWith('/images/') || path.endsWith('.js') || path.endsWith('.css')) {
		// Static assets - long cache
		response.headers.set('cache-control', 'public, max-age=31536000, immutable')
	} else if (path.startsWith('/api/')) {
		// API routes - short cache
		response.headers.set('cache-control', 'public, max-age=0, s-maxage=60, must-revalidate')
	} else if (path.startsWith('/auth/') || path.startsWith('/account/') || path.startsWith('/dashboard/')) {
		// Private routes - no cache
		response.headers.set('cache-control', 'no-store')
	} else if (path === '/' || path.startsWith('/browse')) {
		// Browse pages - moderate cache
		response.headers.set('cache-control', 'public, max-age=300, s-maxage=3600')
	} else if (path.startsWith('/listings/')) {
		// Product pages - longer cache
		response.headers.set('cache-control', 'public, max-age=600, s-maxage=86400')
	} else if (path.startsWith('/sellers/') || path.startsWith('/brands/')) {
		// Profile pages - short cache
		response.headers.set('cache-control', 'public, max-age=60, s-maxage=300')
	} else {
		// Default - short cache
		response.headers.set('cache-control', 'public, max-age=60, s-maxage=300')
	}
	
	// Add Vary header for proper caching with different representations
	const vary = response.headers.get('vary')
	const varyHeaders = ['Accept-Encoding', 'Accept-Language']
	if (vary) {
		varyHeaders.unshift(vary)
	}
	response.headers.set('vary', varyHeaders.join(', '))
	
	return response
	} catch (error) {
		logError(error, {
			handler: 'handleCaching',
			url: event.url.pathname,
			method: event.request.method
		});
		
		// Return response without caching headers on error
		return await resolve(event);
	}
}

// Global error handler for unhandled server errors
export const handleError: HandleServerError = Sentry.handleErrorWithSentry(({ error, event, status, message }) => {
	const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	
	// Log the error with context
	logError(error, {
		handler: 'handleError',
		url: event.url.pathname,
		method: event.request.method,
		status,
		message,
		userAgent: event.request.headers.get('user-agent'),
		errorId,
		stack: error instanceof Error ? error.stack : undefined
	});
	
	// Add context to Sentry
	if (PUBLIC_SENTRY_DSN) {
		Sentry.setContext('server_error', {
			errorId,
			url: event.url.pathname,
			method: event.request.method,
			status,
			userAgent: event.request.headers.get('user-agent'),
			timestamp: new Date().toISOString(),
		});
	}

	// Return sanitized error for client
	if (dev) {
		// In development, return full error details
		return {
			message: message || 'Internal server error',
			errorId,
			stack: error instanceof Error ? error.stack : undefined
		};
	} else {
		// In production, return minimal error info
		return {
			message: 'Something went wrong. Please try again.',
			errorId
		};
	}
});

// Add Sentry handle if enabled
const sentryHandle = PUBLIC_SENTRY_DSN ? Sentry.sentryHandle() : null;
const handles = [handleI18n, handleSupabase, check2FAMiddleware, handleCaching];
if (sentryHandle) {
  handles.unshift(sentryHandle);
}

export const handle = sequence(...handles)
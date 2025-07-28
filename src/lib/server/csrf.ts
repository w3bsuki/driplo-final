// CSRF Protection utilities for SvelteKit
import { dev } from '$app/environment'
import { fail, type RequestEvent } from '@sveltejs/kit'

// Generate a secure CSRF token
export function generateCSRFToken(): string {
	return crypto.randomUUID()
}

// Validate CSRF token from form submission
export function validateCSRFToken(
	_event: RequestEvent,
	submittedToken: string | null | undefined,
	_sessionToken?: string
): boolean {
	// In development, be more lenient
	if (dev && !submittedToken) {
		console.warn('CSRF: Missing token in development mode')
		return true
	}
	
	// In production, always require token
	if (!submittedToken) {
		return false
	}
	
	// For now, we'll use UUID validation
	// In a more advanced setup, you'd store tokens in session/database
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
	return uuidRegex.test(submittedToken)
}

// Middleware function to check CSRF for form submissions
export function withCSRFProtection<T extends Record<string, unknown>>(
	handler: (event: RequestEvent) => Promise<T>
) {
	return async (event: RequestEvent): Promise<T> => {
		// Only check CSRF for POST requests
		if (event.request.method !== 'POST') {
			return handler(event)
		}
		
		// Get CSRF token from form data
		const formData = await event.request.formData()
		const csrfToken = formData.get('csrfToken')?.toString()
		
		// Validate CSRF token
		if (!validateCSRFToken(event, csrfToken)) {
			throw fail(403, {
				error: 'Invalid request. Please refresh the page and try again.',
				code: 'CSRF_INVALID'
			})
		}
		
		return handler(event)
	}
}

// Extract CSRF token from request headers (for API calls)
export function getCSRFTokenFromHeaders(request: Request): string | null {
	return request.headers.get('x-csrf-token')
}

// Set CSRF token in response headers
export function setCSRFTokenHeader(response: Response, token: string): void {
	response.headers.set('x-csrf-token', token)
}

// Create a CSRF-protected form action wrapper
export function csrfProtectedAction<T extends Record<string, unknown>>(
	action: (event: RequestEvent) => Promise<T>
) {
	return withCSRFProtection(action)
}
import type { SupabaseClient, Session, User } from '@supabase/supabase-js'
import type { Database } from '$lib/types/db'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>
			locale: string
		}
		interface PageData {
			session: Session | null
			user: User | null
			profile?: Database['public']['Tables']['profiles']['Row'] | null
			categories?: Array<{
				id: string
				name: string
				slug: string
				icon: string | null
			}>
			csrfToken?: string
			locale?: string
		}
		// interface PageState {}
		// interface Platform {}
	}
	
	// reCAPTCHA types
	interface Window {
		grecaptcha?: {
			render: (container: HTMLElement, options: {
				sitekey: string
				callback?: (token: string) => void
				'expired-callback'?: () => void
				'error-callback'?: () => void
				theme?: 'light' | 'dark'
				size?: 'normal' | 'compact'
			}) => number
			reset: (widgetId?: number) => void
			getResponse: (widgetId?: number) => string
			execute: (widgetId?: number) => void
		}
		onRecaptchaLoad?: () => void
		hcaptcha?: any // In case we switch to hCaptcha later
		// Sentry error tracking
		Sentry?: any
		sentryOnLoad?: () => void
	}
}

export {}

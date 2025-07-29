// Lightweight auth stores for backward compatibility
// These now rely on server-side authentication as the source of truth
import { writable, type Readable } from 'svelte/store'
import { page } from '$app/stores'
import { derived } from 'svelte/store'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '$lib/types/db'

type Profile = Database['public']['Tables']['profiles']['Row']

// Create derived stores from page data
export const user: Readable<User | null> = derived(
	page,
	($page) => $page.data?.user || null
)

export const session: Readable<Session | null> = derived(
	page,
	($page) => $page.data?.session || null
)

export const profile: Readable<Profile | null> = derived(
	page,
	($page) => $page.data?.profile || null
)

// Loading state for compatibility
export const loading = writable(false)

// Deprecated: Initialize auth state
// This is now handled server-side - kept for backward compatibility
export function initializeAuth(_initialUser: User | null, _initialSession: Session | null) {
	// No-op: Server-side authentication is the source of truth
	console.warn('initializeAuth is deprecated. Authentication is now handled server-side.')
}

// Simple auth object for legacy compatibility
export const auth = {
	user,
	session,
	profile,
	loading,
	// These methods should not be used - redirect to proper form-based auth
	signUp() {
		throw new Error('Use server-side form actions for authentication')
	},
	signIn() {
		throw new Error('Use server-side form actions for authentication')
	},
	signOut() {
		throw new Error('Use server-side form actions for authentication')
	},
	signInWithProvider() {
		throw new Error('Use server-side OAuth handlers for authentication')
	},
	resetPassword() {
		throw new Error('Use server-side form actions for password reset')
	},
	updatePassword() {
		throw new Error('Use server-side form actions for password updates')
	},
	updateProfile() {
		throw new Error('Use server-side form actions for profile updates')
	}
}
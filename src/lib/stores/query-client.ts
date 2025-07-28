import { QueryClient } from '@tanstack/svelte-query'
import { browser } from '$app/environment'

// Create a singleton query client
let queryClient: QueryClient | null = null

export function createQueryClient() {
	// Always create a client, but with different settings for SSR
	if (!queryClient || (browser && !queryClient)) {
		const isSSR = !browser;
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					// Cache for 5 minutes by default
					staleTime: isSSR ? 0 : 5 * 60 * 1000,
					// Keep in cache for 10 minutes
					gcTime: isSSR ? 0 : 10 * 60 * 1000,
					// Retry failed queries
					retry: isSSR ? 0 : 2,
					// Only refetch on window focus in production
					refetchOnWindowFocus: !isSSR,
					// Don't refetch on reconnect by default
					refetchOnReconnect: !isSSR,
					// Enable network mode for better offline handling
					networkMode: isSSR ? 'always' : 'online',
					// Enable queries in both SSR and browser
					enabled: true
				},
				mutations: {
					// Retry failed mutations once
					retry: isSSR ? 0 : 1,
					// Network mode for mutations
					networkMode: isSSR ? 'always' : 'online'
				}
			}
		})
	}
	return queryClient!
}

// Get the existing query client
export function getQueryClient() {
	if (!queryClient) {
		queryClient = createQueryClient()
	}
	return queryClient
}

// Specific cache configurations for different data types
export const cacheConfigs = {
	// Homepage data - cache for 15 minutes
	homepage: {
		staleTime: 15 * 60 * 1000,
		gcTime: 30 * 60 * 1000
	},
	// Category navigation - cache for 1 hour
	categories: {
		staleTime: 60 * 60 * 1000,
		gcTime: 2 * 60 * 60 * 1000
	},
	// Browse results - cache for 5 minutes
	browse: {
		staleTime: 5 * 60 * 1000,
		gcTime: 15 * 60 * 1000
	},
	// User-specific data - cache for 2 minutes
	user: {
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000
	},
	// Real-time data - cache for 30 seconds
	realtime: {
		staleTime: 30 * 1000,
		gcTime: 60 * 1000
	}
}

// Cache keys for consistent invalidation
export const cacheKeys = {
	homepage: ['homepage'],
	categories: ['categories'],
	browse: (filters: any) => ['browse', filters],
	category: (slug: string) => ['category', slug],
	listing: (id: string) => ['listing', id],
	user: (id: string) => ['user', id],
	messages: (conversationId?: string) => conversationId ? ['messages', conversationId] : ['messages'],
	orders: (userId: string) => ['orders', userId]
}
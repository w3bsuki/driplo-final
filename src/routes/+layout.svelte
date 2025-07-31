<script>
	import '../app.css';
	import Header from '$lib/components/layout/header/Header.svelte';
	import MobileNav from '$lib/components/layout/MobileNav.svelte';
	import PromotionalBanner from '$lib/components/layout/PromotionalBanner.svelte';
	import CookieConsent from '$lib/components/cookie-consent/CookieConsent.svelte';
	import ErrorBoundary from '$lib/components/shared/ErrorBoundary.svelte';
	import { Toaster } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { navigating } from '$app/stores';
	import { QueryClientProvider } from '@tanstack/svelte-query'
	import { createQueryClient } from '$lib/stores/query-client';
	import NotificationPopup from '$lib/components/NotificationPopup.svelte';
	import { browser, dev } from '$app/environment';
	import { initWebVitals } from '$lib/utils/web-vitals';
	import { setSentryUser } from '$lib/config/sentry';
	import * as m from '$lib/paraglide/messages.js';

	let { data, children } = $props();
	
	// Initialize query client
	const queryClient = createQueryClient();
	
	// Set initial Sentry user context
	if (browser && data.user) {
		setSentryUser(data.user);
	}
	
	// Reactive state based on server data
	let user = $derived(data.user);
	let _session = $derived(data.session);
	let profile = $derived(data.profile);
	
	// Define pages where bottom nav should be hidden
	const hiddenPaths = [
		'/orders',
		'/wishlist',
		'/checkout',
		'/messages',
		'/settings',
		'/profile/edit'
	];
	
	// Hide mobile nav on specific pages
	let shouldHideMobileNav = $derived(
		hiddenPaths.some(path => $page.url.pathname.startsWith(path)) || // Hidden paths
		$page.url.pathname.includes('/listings/') || // Product detail pages
		$page.url.pathname.includes('/sell') || // Sell product form
		$page.url.pathname.includes('/payment') || // Payment forms
		$page.url.pathname.includes('/login') || // Login page
		$page.url.pathname.includes('/register') || // Register page
		$page.url.pathname.includes('/onboarding') // Onboarding pages
	);
		
	// Check if we're on an auth page
	let isAuthPage = $derived($page.url.pathname.includes('/login') || $page.url.pathname.includes('/register'));

	onMount(() => {
		// Initialize Web Vitals monitoring
		if (browser) {
			initWebVitals({
				sendToAnalytics: (_metric) => {
					// In production, send to your analytics service
					if (!dev) {
						// Example: Google Analytics
						// gtag('event', metric.name, {
						//   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
						//   metric_rating: metric.rating,
						//   non_interaction: true
						// });
					}
				},
				sampleRate: dev ? 1 : 0.1, // 100% in dev, 10% in production
				metadata: {
					version: '1.0.0',
					environment: dev ? 'development' : 'production'
				}
			});
		}
		
		// Listen for auth changes and sync with server
		const { data: authListener } = data.supabase.auth.onAuthStateChange(async (event, session) => {
			// Update Sentry user context on auth changes
			if (event === 'SIGNED_IN' && session?.user) {
				setSentryUser(session.user);
			} else if (event === 'SIGNED_OUT') {
				setSentryUser(null);
			}
			
			// Always invalidate to sync with server state
			// Server-side auth is the source of truth
			await invalidate('supabase:auth');
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	});
</script>

<QueryClientProvider client={queryClient}>
	<ErrorBoundary 
		level="detailed"
		onError={(error, context) => {
			// Custom error handling for layout errors
			console.error('Layout error:', error, context);
			
			// In production, send to error tracking service
			if (!dev && browser) {
				// Example: Send to analytics or error tracking service
			}
		}}
		resetKeys={[data.user?.id, $page.url.pathname]}
	>
		<!-- Skip link for keyboard navigation -->
		<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:font-medium">
			Skip to main content
		</a>
		
		<div class="min-h-screen bg-background">
			{#if !isAuthPage}
				{#if !user}
					<PromotionalBanner 
						message={m.banner_launch_message()} 
						secondaryMessage={m.banner_launch_secondary()}
						ctaText={m.banner_launch_cta()} 
						ctaHref="/register"
						variant="launch"
						countdown={true}
					/>
				{:else}
					<PromotionalBanner 
						message={m.banner_welcome_message()} 
						ctaText={m.banner_welcome_cta()} 
						ctaHref="/sell"
						variant="gradient"
					/>
				{/if}
				<ErrorBoundary level="minimal" isolate={true}>
					<Header categories={data.categories} supabase={data.supabase} user={user} profile={profile} />
				</ErrorBoundary>
			{/if}
			<main id="main-content" class={shouldHideMobileNav ? "pb-0 md:pb-0" : "pb-20 md:pb-0"}>
				<ErrorBoundary level="detailed" isolate={true} resetKeys={[$page.url.pathname, user?.id]}>
					{@render children()}
				</ErrorBoundary>
			</main>
			{#if !shouldHideMobileNav}
				<ErrorBoundary level="minimal" isolate={true}>
					<MobileNav />
				</ErrorBoundary>
			{/if}
		</div>

		<CookieConsent />
		<Toaster richColors position="top-center" />
		<NotificationPopup position="top-right" />
		
		
		<!-- Page transition loading indicator -->
		{#if $navigating}
			<div class="fixed top-0 left-0 right-0 z-[100]">
				<div class="h-1 bg-blue-200">
					<div class="h-full bg-blue-400 animate-[loading-bar_1s_ease-in-out_infinite]"></div>
				</div>
			</div>
		{/if}
	</ErrorBoundary>
</QueryClientProvider>

<style>
	@keyframes loading-bar {
		0% {
			width: 0%;
			margin-left: 0%;
		}
		50% {
			width: 70%;
			margin-left: 15%;
		}
		100% {
			width: 0%;
			margin-left: 100%;
		}
	}
</style>


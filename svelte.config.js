import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// Use Node.js 22.x runtime (Vercel default)
			runtime: 'nodejs22.x',
			// Force dynamic rendering
			isr: false,
			// Ensure proper function generation
			split: false
		}),
		
		// Prerender static pages for better performance
		prerender: {
			entries: [
				// Category pages (with ISR potential)
				'/browse',
				'/bags',
				'/designer', 
				'/kids',
				'/men',
				'/shoes',
				'/women',
				
				// Static pages
				'/privacy',
				
				// Auth pages (no server data)
				'/login',
				'/register',
				'/auth-code-error'
			],
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			crawl: true
		},
		
		// Disable CSP here since we're using vercel.json
		csp: {
			mode: 'auto'
		}
	}
};

export default config;

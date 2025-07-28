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
			// Force dynamic rendering for all routes
			isr: false,
			// Ensure proper function generation
			split: false,
			// Disable static exports
			precompress: false
		}),
		
		// Disable prerendering to ensure server-side rendering works
		prerender: {
			entries: [],
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			crawl: false
		},
		
		// Remove CSP configuration - handled by vercel.json
	}
};

export default config;

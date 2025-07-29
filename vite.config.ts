import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide",
		}),
		// Tailwind v4 direct integration - no PostCSS
		tailwindcss(),
	],
	server: {
		port: 5190,
		strictPort: true,
		hmr: {
			overlay: false
		}
	},
	build: {
		sourcemap: true,
		minify: 'esbuild',
		cssMinify: 'esbuild',
		target: ['es2022', 'chrome89', 'firefox89', 'safari15']
	},
	optimizeDeps: {
		include: [
			'svelte',
			'@supabase/supabase-js',
			'@stripe/stripe-js',
			'bits-ui',
			'lucide-svelte',
			'@tanstack/svelte-query',
			'date-fns',
			'zod',
			'clsx',
			'tailwind-merge',
			'class-variance-authority'
		],
		exclude: ['@sveltejs/kit']
	}
});

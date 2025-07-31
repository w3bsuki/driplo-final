import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Deployment: b357f69 - adapter-auto completely removed
/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Preprocessing support for TypeScript, PostCSS, etc.
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter(),
    
    // Alias configuration
    alias: {
      $components: 'src/lib/components',
      $stores: 'src/lib/stores',
      $utils: 'src/lib/utils',
      $types: 'src/lib/types',
      $server: 'src/lib/server',
      $styles: 'src/lib/styles'
    }
  },
};

export default config;
import adapter from '@sveltejs/adapter-vercel';

// Deployment: b357f69 - adapter-auto completely removed
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
};

export default config;
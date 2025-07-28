import adapter from '@sveltejs/adapter-vercel';

// Force deployment trigger
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
};

export default config;
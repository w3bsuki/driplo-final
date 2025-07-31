// tailwind.config.js - Tailwind v4 CSS-First Configuration  
// CSS tokens are defined in src/lib/styles/tokens.css
export default {
  // Let CSS-first handle everything via @import in Vite plugin
  content: [
    './src/**/*.{html,js,svelte,ts,md,mdx}',
    './src/**/*.stories.{js,ts}',
    './.svelte-kit/generated/**/*.{js,ts}'
  ],
  
  // CSS-first config only needs to specify non-standard plugin requirements
  plugins: [],
};
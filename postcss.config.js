export default {
  plugins: {
    // Tailwind v4 CSS processing
    tailwindcss: {},
    // Enhanced autoprefixer for Vercel compatibility
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace',
    },
    // CSS optimization for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          // Preserve color functions for brand colors
          colormin: {
            // Don't minify hex colors to preserve brand colors
            legacy: false,
          },
          // Preserve CSS custom properties
          calc: false,
          // Don't remove unused rules in case of dynamic classes
          discardUnused: false,
        }]
      }
    })
  },
}
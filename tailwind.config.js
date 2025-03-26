/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}",
    "./docusaurus.config.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Important: This ensures Tailwind doesn't conflict with Docusaurus styles
  important: true,
  // This ensures Tailwind classes don't conflict with Docusaurus classes
  corePlugins: {
    preflight: false,
  },
} 
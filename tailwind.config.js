const tokens = require('./src/design/tokens')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docusaurus.config.js',
  ],
  theme: {
    extend: {
      // Colors, radii, widths, and fonts come from src/design/tokens.js.
      // Color utilities read the CSS variables that the design tokens plugin
      // generates, so they switch with the color mode and support opacity
      // modifiers such as bg-primary/10.
      colors: Object.fromEntries(
        [
          'border', 'input', 'ring', 'background', 'foreground', 'surface',
          'primary', 'primary-foreground', 'primary-soft',
          'secondary', 'secondary-foreground',
          'destructive', 'destructive-foreground',
          'muted', 'muted-foreground',
          'accent', 'accent-foreground',
          'popover', 'popover-foreground',
          'card', 'card-foreground',
        ].map((name) => [name, `hsl(var(--${name}) / <alpha-value>)`])
      ),
      borderRadius: {
        sm: `${tokens.radius.sm}px`,
        DEFAULT: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        xl: `${tokens.radius.xl}px`,
      },
      fontFamily: {
        sans: tokens.font.sans.split(/,\s*/),
        mono: tokens.font.mono.split(/,\s*/),
      },
      maxWidth: {
        content: `${tokens.layout.content}px`,
        wide: `${tokens.layout.wide}px`,
      },
      boxShadow: {
        hover: 'var(--sp-shadow-hover)',
        popover: 'var(--sp-shadow-popover)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.15s ease-in-out",
        "accordion-up": "accordion-up 0.15s ease-in-out",
        "fade-out-80": "fade-out 0.15s ease-in-out",
        "fade-in": "fade-in 0.15s ease-in-out",
        "slide-in-from-top-full": "slide-in-from-top 0.15s ease-out",
        "slide-in-from-bottom-full": "slide-in-from-bottom 0.15s ease-out",
        "slide-out-to-right-full": "slide-out-to-right 0.15s ease-in",
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
  // No `important`: Infima and the Docusaurus theme CSS sit in cascade layers,
  // so unlayered utilities already win over them.
  // Preflight is off so Tailwind does not reset the Docusaurus base styles
  corePlugins: {
    preflight: false,
  },
} 
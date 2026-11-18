/**
 * Design tokens for the docs site. This file is the single source of truth.
 *
 * It feeds:
 * - the generated CSS custom properties (plugins/docusaurus-plugin-design-tokens
 *   writes them to tokens.css at build start)
 * - the Tailwind theme (tailwind.config.js)
 * - the Prism light and dark code themes (src/theme/PrismThemes)
 * - the MUI theme (src/components/MuiTheme)
 *
 * Change a value here, not in CSS. Every text color pair is at least 4.5:1
 * against the surfaces it sits on (WCAG AA).
 *
 * CommonJS on purpose: Node (Tailwind, the plugin) and the browser bundle both
 * load it.
 */

/** Primary purple. Defined once; everything else references it. */
const accent = { light: '#6638b8', dark: '#a98bf0' }

const color = {
  light: {
    bg: '#ffffff', // page
    surface: '#fafafa', // code blocks, table heads, footer
    'surface-raised': '#f4f4f5', // hover fills, inline code, secondary buttons
    'surface-overlay': '#ffffff', // popovers, dropdowns, modals
    border: '#e4e4e7',
    'border-strong': '#d4d4d8',
    fg: '#18181b', // body and heading text
    'fg-muted': '#52525b', // secondary text
    accent: accent.light,
    'accent-hover': '#552d9c',
    'accent-fg': '#ffffff', // text on an accent fill
    'accent-soft': '#f5f1fc', // active sidebar item, selected states
    'accent-border': '#d9cbf2', // borders on accent-soft fills
    'code-highlight': 'rgb(102 56 184 / 0.08)',
    'link-underline': 'rgb(102 56 184 / 0.4)',
    focus: accent.light,
  },
  dark: {
    // Surfaces step lighter as they rise, so elevation reads without shadows
    bg: '#0f0f11',
    surface: '#141417',
    'surface-raised': '#1c1c20',
    'surface-overlay': '#1f1f23',
    border: '#27272a',
    'border-strong': '#3f3f46',
    fg: '#f4f4f5', // body text at full strength, not a dimmed grey
    'fg-muted': '#a1a1aa',
    accent: accent.dark, // same hue as light, lifted for contrast
    'accent-hover': '#bba3f4',
    'accent-fg': '#0f0f11',
    'accent-soft': '#1d1830',
    'accent-border': '#3b2d63',
    'code-highlight': 'rgb(169 139 240 / 0.12)',
    'link-underline': 'rgb(169 139 240 / 0.45)',
    focus: accent.dark,
  },
}

/**
 * Semantic colors for callouts. Each has a border, a tinted background, and a
 * foreground for the icon and title. Callout body text uses the normal fg.
 */
const callout = {
  light: {
    note: { border: '#e4e4e7', bg: '#fafafa', fg: '#3f3f46' },
    info: { border: '#bfdbfe', bg: '#eff6ff', fg: '#1d4ed8' },
    tip: { border: '#bbf7d0', bg: '#f0fdf4', fg: '#15803d' },
    warning: { border: '#fde68a', bg: '#fffbeb', fg: '#a16207' },
    danger: { border: '#fecaca', bg: '#fef2f2', fg: '#b91c1c' },
  },
  dark: {
    note: { border: '#3f3f46', bg: '#18181b', fg: '#d4d4d8' },
    info: { border: '#1e3a8a', bg: '#0f172a', fg: '#93c5fd' },
    tip: { border: '#14532d', bg: '#0b1d12', fg: '#86efac' },
    warning: { border: '#713f12', bg: '#1c1407', fg: '#fcd34d' },
    danger: { border: '#7f1d1d', bg: '#210d0d', fg: '#fca5a5' },
  },
}

/** Syntax colors for the matched Prism pair, checked against `surface`. */
const syntax = {
  light: {
    plain: color.light.fg,
    comment: '#6b6b74',
    punctuation: '#52525b',
    keyword: accent.light,
    string: '#047857',
    number: '#b45309',
    function: '#1d4ed8',
    tag: '#be123c',
    attr: '#9a3412',
    variable: color.light.fg,
  },
  dark: {
    plain: color.dark.fg,
    comment: '#8b8b94',
    punctuation: '#a1a1aa',
    keyword: accent.dark,
    string: '#6ee7b7',
    number: '#fcd34d',
    function: '#93c5fd',
    tag: '#fda4af',
    attr: '#fdba74',
    variable: color.dark.fg,
  },
}

const font = {
  sans: "'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
}

/** [font-size, line-height] in px, plus weight and tracking where they differ. */
const text = {
  xs: { size: 12, line: 16 },
  sm: { size: 14, line: 20 },
  body: { size: 16, line: 28 },
  h4: { size: 16, line: 24, weight: 600 },
  h3: { size: 18, line: 28, weight: 600, tracking: '-0.01em' },
  h2: { size: 24, line: 32, weight: 600, tracking: '-0.015em' },
  h1: { size: 36, line: 44, weight: 600, tracking: '-0.02em' },
}

const weight = { regular: 400, medium: 500, semibold: 600 }

/** 4px spacing scale, in px. */
const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 }

const radius = { sm: 4, md: 6, lg: 8, xl: 12 }

/** Layout widths, in px. */
const layout = {
  sidebar: 272,
  content: 672, // reading column
  wide: 896, // code, tables, and diagrams can widen to this
  toc: 224,
  navbar: 60,
  target: 24, // minimum pointer target (WCAG 2.2, 2.5.8)
}

/** No shadows by default: one for hover, one for popovers. */
const shadow = {
  light: {
    hover: '0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.06)',
    popover: '0 4px 8px -2px rgb(0 0 0 / 0.08), 0 16px 32px -8px rgb(0 0 0 / 0.16)',
  },
  dark: {
    hover: '0 1px 2px rgb(0 0 0 / 0.4), 0 4px 12px rgb(0 0 0 / 0.4)',
    popover: '0 4px 8px -2px rgb(0 0 0 / 0.5), 0 16px 32px -8px rgb(0 0 0 / 0.6)',
  },
}

module.exports = {
  accent,
  color,
  callout,
  syntax,
  font,
  text,
  weight,
  space,
  radius,
  layout,
  shadow,
}

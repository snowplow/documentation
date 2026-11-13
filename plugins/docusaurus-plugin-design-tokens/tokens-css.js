/**
 * Turn src/design/tokens.js into CSS custom properties.
 *
 *   --sp-*   the design tokens, used by every stylesheet in src/css
 *   --background, --primary, ...   HSL triplets for the Tailwind theme
 *                                  (`hsl(var(--primary) / <alpha-value>)`)
 *
 * Light values go on :root, dark values on [data-theme='dark'], which
 * Docusaurus sets on <html> for the dark and system-dark modes.
 */

function hexToHslTriplet(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) throw new Error(`Tailwind colors must be 6-digit hex, got ${hex}`)
  const n = parseInt(m[1], 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  const round = (x) => Math.round(x * 10) / 10
  return `${round(h)} ${round(s * 100)}% ${round(l * 100)}%`
}

/**
 * Tailwind color names (kept from the earlier shadcn setup so existing class
 * names such as `bg-card` and `text-muted-foreground` keep working), mapped to
 * token names.
 */
const TAILWIND_COLORS = {
  background: 'bg',
  foreground: 'fg',
  card: { light: 'bg', dark: 'surface' },
  'card-foreground': 'fg',
  popover: 'surface-overlay',
  'popover-foreground': 'fg',
  muted: 'surface-raised',
  'muted-foreground': 'fg-muted',
  accent: 'surface-raised',
  'accent-foreground': 'fg',
  secondary: 'surface-raised',
  'secondary-foreground': 'fg',
  primary: 'accent',
  'primary-foreground': 'accent-fg',
  'primary-soft': 'accent-soft',
  border: 'border',
  input: 'border',
  ring: 'focus',
  surface: 'surface',
}

function tailwindVars(tokens, mode) {
  const lines = []
  for (const [name, ref] of Object.entries(TAILWIND_COLORS)) {
    const key = typeof ref === 'string' ? ref : ref[mode]
    lines.push(`--${name}: ${hexToHslTriplet(tokens.color[mode][key])};`)
  }
  lines.push(
    `--destructive: ${hexToHslTriplet(tokens.callout[mode].danger.fg)};`,
    `--destructive-foreground: ${hexToHslTriplet(tokens.color[mode].bg)};`
  )
  return lines
}

function modeVars(tokens, mode) {
  const lines = []
  for (const [name, value] of Object.entries(tokens.color[mode])) {
    lines.push(`--sp-color-${name}: ${value};`)
  }
  for (const [type, c] of Object.entries(tokens.callout[mode])) {
    for (const [part, value] of Object.entries(c)) {
      lines.push(`--sp-callout-${type}-${part}: ${value};`)
    }
  }
  for (const [name, value] of Object.entries(tokens.shadow[mode])) {
    lines.push(`--sp-shadow-${name}: ${value};`)
  }
  return lines.concat(tailwindVars(tokens, mode))
}

function staticVars(tokens) {
  const px = (n) => (n === 0 ? '0' : `${n}px`)
  const lines = [
    `--sp-font-sans: ${tokens.font.sans};`,
    `--sp-font-mono: ${tokens.font.mono};`,
  ]
  for (const [name, t] of Object.entries(tokens.text)) {
    lines.push(`--sp-text-${name}: ${px(t.size)};`)
    lines.push(`--sp-leading-${name}: ${px(t.line)};`)
    if (t.weight) lines.push(`--sp-weight-${name}: ${t.weight};`)
    if (t.tracking) lines.push(`--sp-tracking-${name}: ${t.tracking};`)
  }
  for (const [name, value] of Object.entries(tokens.weight)) {
    lines.push(`--sp-weight-${name}: ${value};`)
  }
  for (const [name, value] of Object.entries(tokens.space)) {
    lines.push(`--sp-space-${name}: ${px(value)};`)
  }
  for (const [name, value] of Object.entries(tokens.radius)) {
    lines.push(`--sp-radius-${name}: ${px(value)};`)
  }
  for (const [name, value] of Object.entries(tokens.layout)) {
    lines.push(`--sp-layout-${name}: ${px(value)};`)
  }
  return lines
}

function tokensToCss(tokens) {
  const block = (selector, lines) =>
    `${selector} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}\n`
  return [
    '/* Generated from src/design/tokens.js by plugins/docusaurus-plugin-design-tokens. Do not edit. */\n',
    block(':root', [...staticVars(tokens), ...modeVars(tokens, 'light'), 'color-scheme: light;']),
    block("[data-theme='dark']", [...modeVars(tokens, 'dark'), 'color-scheme: dark;']),
  ].join('\n')
}

module.exports = { tokensToCss, hexToHslTriplet }

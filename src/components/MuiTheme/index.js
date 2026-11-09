import { createTheme } from '@mui/material/styles'
import tokens from '@site/src/design/tokens'

function palette(mode) {
  const c = tokens.color[mode]
  return {
    mode,
    primary: { main: c.accent, contrastText: c['accent-fg'] },
    background: { default: c.bg, paper: mode === 'dark' ? c.surface : c.bg },
    text: { primary: c.fg, secondary: c['fg-muted'] },
    divider: c.border,
    error: { main: tokens.callout[mode].danger.fg },
    warning: { main: tokens.callout[mode].warning.fg },
    info: { main: tokens.callout[mode].info.fg },
    success: { main: tokens.callout[mode].tip.fg },
  }
}

const shared = {
  typography: { fontFamily: tokens.font.sans },
  shape: { borderRadius: tokens.radius.md },
}

/** Fixed-mode themes for widgets that pick a ThemeProvider from useColorMode. */
export const lightTheme = createTheme({ ...shared, palette: palette('light') })
export const darkTheme = createTheme({ ...shared, palette: palette('dark') })

export default lightTheme

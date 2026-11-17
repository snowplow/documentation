import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { useColorMode } from '@docusaurus/theme-common'
import { darkTheme, lightTheme } from '@site/src/components/MuiTheme'

/**
 * The MUI theme, scoped to one widget. MUI is not provided site-wide: each
 * widget that still needs it (JsonSchemaValidator, DbtSchemaSelector,
 * FirstSteps, data grids) wraps itself in this, so MUI's code is only in the
 * bundles of the pages that use those widgets. Both themes come from the
 * design tokens and follow the Docusaurus color mode.
 */
export default function MuiScope({ children }: { children: React.ReactNode }): JSX.Element {
  const { colorMode } = useColorMode()
  return <ThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>{children}</ThemeProvider>
}

/** Wrap a component in <MuiScope> */
export function withMuiScope<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  const Wrapped: React.FC<P> = (props) => (
    <MuiScope>
      <Component {...props} />
    </MuiScope>
  )
  Wrapped.displayName = `withMuiScope(${Component.displayName ?? Component.name ?? 'Component'})`
  return Wrapped
}

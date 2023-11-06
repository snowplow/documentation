import React from 'react'
import { getInitColorSchemeScript } from '@mui/material/styles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '@site/src/components/MuiTheme'
import { LicenseInfo } from '@mui/x-license-pro';

export default function Root({ children }) {
  LicenseInfo.setLicenseKey("a3d6a1e3cdca760ace01b65d01608642Tz03MTE1NixFPTE3MjE1NDQ2NzEwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y");
  return (
    <>
      {getInitColorSchemeScript()}
      <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
    </>
  )
}

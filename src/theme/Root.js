import React from 'react'
import { getInitColorSchemeScript } from '@mui/material/styles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '@site/src/components/MuiTheme'
import { ProductFruits } from 'react-product-fruits'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export default function Root({ children }) {
  const { siteConfig } = useDocusaurusContext()

  const userInfo = {
    username: 'test_user',
  }
  return (
    <>
      <ProductFruits
        workspaceCode={siteConfig.customFields.productFruitsNext}
        language="en"
        user={userInfo}
      />

      {getInitColorSchemeScript()}
      <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
    </>
  )
}

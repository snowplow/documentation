import React, { useState, useEffect } from 'react'
import { getInitColorSchemeScript } from '@mui/material/styles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '@site/src/components/MuiTheme'
import { ProductFruits } from 'react-product-fruits'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

const useCookie = () => {
  const [userId, setUserId] = useState('unknown_user')
  const [sessionId, setSessionId] = useState('unknown_session')

  useEffect(() => {
    const cookieValue = decodeURIComponent(document.cookie)
      .split('; ')
      .find((row) => row.startsWith('_sp_biz1_id'))
      ?.split('=')[1]

    if (cookieValue) {
      const parts = cookieValue.split('.')
      setUserId(parts[0] ?? 'unknown_user')
      setSessionId(parts[5] ?? 'unknown_session')
    }
  }, [])

  return [userId, sessionId]
}

export default function Root({ children }) {
  const { siteConfig } = useDocusaurusContext()
  const [userId, sessionId] = useCookie()
  const userInfo = {
    username: userId,
    props: { sessionId: sessionId },
  }

  return (
    <>
      <ProductFruits
        workspaceCode={siteConfig.customFields.productFruits}
        language="en"
        user={userInfo}
        lifeCycle="unmount"
      />

      {getInitColorSchemeScript()}
      <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
    </>
  )
}

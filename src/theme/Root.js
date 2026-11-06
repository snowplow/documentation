import React, { useState, useEffect } from 'react'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '@site/src/components/MuiTheme'
import { ProductFruits } from 'react-product-fruits'
import { PRODUCT_FRUITS_WORKSPACE_CODE } from '@site/src/constants/config'

const useCookie = () => {
  const [userId, setUserId] = useState('unknown_user')
  const [sessionId, setSessionId] = useState('unknown_session')

  useEffect(() => {
    // Ensure we're in the browser before accessing document
    if (typeof window === 'undefined' || !document.cookie) {
      return
    }

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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [userId, sessionId] = useCookie()
  const userInfo = {
    username: userId,
    props: { sessionId: sessionId },
  }

  return (
    <>
      {isClient && (
        <ProductFruits
          workspaceCode={PRODUCT_FRUITS_WORKSPACE_CODE}
          language="en"
          user={userInfo}
          lifeCycle="unmount"
        />
      )}

      {/*
        MUI's palette CSS variables are keyed on the data-theme attribute that
        Docusaurus already sets on <html>, so MUI components follow the
        Docusaurus color mode with no JavaScript sync. colorSchemeNode={null}
        stops MUI writing that attribute itself.
      */}
      <CssVarsProvider
        theme={theme}
        attribute="data-theme"
        colorSchemeNode={null}
      >
        {children}
      </CssVarsProvider>
    </>
  )
}

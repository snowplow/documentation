import React, { useState, useEffect } from 'react'
import { getInitColorSchemeScript } from '@mui/material/styles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '@site/src/components/MuiTheme'
import { ProductFruits } from 'react-product-fruits'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

const useCookie = () => {
  const [userIdValue, setUserIdValue] = useState('')
  const [sessionIdValue, setSessionIdValue] = useState('')

  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('_sp_biz1_id'))

    const cookieExists = cookie !== undefined && cookie !== null

    setUserIdValue(cookieExists ? cookie.split('=')[1].split('.')[0] : '')
    setSessionIdValue(cookieExists ? cookie.split('=')[1].split('.')[5] : '')
  })

  return [
    userIdValue ? userIdValue : 'unknown_user',
    sessionIdValue ? sessionIdValue : 'unknown_session',
  ]
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
        workspaceCode={siteConfig.customFields.productFruitsNext}
        language="en"
        user={userInfo}
        lifeCycle="unmount"
      />

      {getInitColorSchemeScript()}
      <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
    </>
  )
}

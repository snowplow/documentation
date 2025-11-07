import React, { useState, useEffect } from 'react'
import { getInitColorSchemeScript } from '@mui/material/styles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '@site/src/components/MuiTheme'
import { ProductFruits } from 'react-product-fruits'
import { Toaster } from '@site/src/components/ui/toaster'

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

async function fetchApiKey() {
  try {
    const response = await fetch('/.netlify/functions/product_fruits_key', {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(
        `Netlify Function responded with status ${response.status}`
      )
    }

    const apiKey = await response.text()

    // The Product Fruits API key is 16 characters
    if (typeof apiKey !== 'string' || apiKey.length !== 16) {
      throw new Error(
        `Invalid API key format: expected 16 character string, got ${typeof apiKey} with length ${
          apiKey.length
        }`
      )
    }

    return apiKey
  } catch (error) {
    console.error('Error fetching API key:', error)
    return null
  }
}

export default function Root({ children }) {
  const [apiKey, setApiKey] = useState()

  useEffect(() => {
    fetchApiKey().then((key) => {
      if (key) {
        setApiKey(key)
      }
    })
  })

  const [userId, sessionId] = useCookie()
  const userInfo = {
    username: userId,
    props: { sessionId: sessionId },
  }

  return (
    <>
      {apiKey && (
        <ProductFruits
          workspaceCode={apiKey}
          language="en"
          user={userInfo}
          lifeCycle="unmount"
        />
      )}

      {getInitColorSchemeScript()}
      <CssVarsProvider theme={theme}>
        {children}
        <Toaster />
      </CssVarsProvider>
    </>
  )
}

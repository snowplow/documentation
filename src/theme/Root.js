import React, { useState, useEffect } from 'react'
import { ProductFruits } from 'react-product-fruits'
import { useLocation } from '@docusaurus/router'
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

/**
 * Doc pages have their own "Was this page helpful?" block
 * (src/components/Feedback), so Product Fruits, which adds a feedback side
 * tab, only loads outside /docs/.
 */
function useProductFruitsEnabled() {
  const { pathname } = useLocation()
  return !pathname.startsWith('/docs/')
}

/**
 * MUI is no longer provided here. The widgets that still use it
 * (JsonSchemaValidator, DbtSchemaSelector, FirstSteps) wrap themselves in
 * <MuiScope>, so MUI only loads with the pages that use them.
 */
export default function Root({ children }) {
  const [isClient, setIsClient] = useState(false)
  const productFruits = useProductFruitsEnabled()

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
      {isClient && productFruits && (
        <ProductFruits
          workspaceCode={PRODUCT_FRUITS_WORKSPACE_CODE}
          language="en"
          user={userInfo}
          lifeCycle="unmount"
        />
      )}
      {children}
    </>
  )
}

import React, { useState, useEffect, useMemo } from 'react'
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
      // `||`, not `??`: the tracker can write empty fields, and Product
      // Fruits throws if it's initialized with an empty username
      setUserId(parts[0] || 'unknown_user')
      setSessionId(parts[5] || 'unknown_session')
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
 * Product Fruits is a third-party widget: if it throws, render nothing
 * instead of letting the error crash the page.
 */
class ProductFruitsBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('Product Fruits failed to load:', error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
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
  // Stable between renders, so Product Fruits only gets an update when the
  // user ID or session ID changes
  const userInfo = useMemo(
    () => ({ username: userId, props: { sessionId } }),
    [userId, sessionId]
  )

  return (
    <>
      {isClient && productFruits && (
        <ProductFruitsBoundary>
          <ProductFruits
            workspaceCode={PRODUCT_FRUITS_WORKSPACE_CODE}
            language="en"
            user={userInfo}
            lifeCycle="unmount"
          />
        </ProductFruitsBoundary>
      )}
      {children}
    </>
  )
}

import { useLocation } from '@docusaurus/router'
import { useMemo } from 'react'
import { BIZ1_COOKIE_NAME } from '@site/src/constants/config'

export type PageContext = {
  url: string
  pageTitle: string
  snowplowDomainUserId?: string
  snowplowDomainSessionId?: string
}

const readSnowplowIds = (): {
  snowplowDomainUserId?: string
  snowplowDomainSessionId?: string
} => {
  if (typeof document === 'undefined' || !document.cookie) return {}
  const value = decodeURIComponent(document.cookie)
    .split('; ')
    .find((row) => row.startsWith(`${BIZ1_COOKIE_NAME}id`))
    ?.split('=')[1]
  if (!value) return {}
  const parts = value.split('.')
  return {
    ...(parts[0] ? { snowplowDomainUserId: parts[0] } : {}),
    ...(parts[5] ? { snowplowDomainSessionId: parts[5] } : {}),
  }
}

export const usePageContext = (): PageContext => {
  const { pathname, search } = useLocation()
  return useMemo(() => {
    const isBrowser = typeof window !== 'undefined'
    const url = isBrowser
      ? `${window.location.origin}${pathname}${search}`
      : `${pathname}${search}`
    return {
      url,
      pageTitle: isBrowser ? document.title : '',
      ...readSnowplowIds(),
    }
  }, [pathname, search])
}

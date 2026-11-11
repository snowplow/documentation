import React, { useEffect } from 'react'
import Content from '@theme-original/NotFound/Content'
import type ContentType from '@theme/NotFound/Content'
import type { WrapperProps } from '@docusaurus/types'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { trackStructEvent } from '@snowplow/browser-tracker'

type Props = WrapperProps<typeof ContentType>

/**
 * Track every 404 so the docs-usage baseline can count broken inbound links
 * and missing redirects. The page view alone doesn't say the page was a 404,
 * because the URL is whatever the reader requested.
 *
 * A structured event avoids publishing a new schema for one counter.
 */
export default function ContentWrapper(props: Props): JSX.Element {
  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return
    try {
      trackStructEvent({
        category: 'docs',
        action: 'page_not_found',
        label: window.location.pathname + window.location.search,
        property: document.referrer || undefined,
      })
    } catch (err) {
      console.warn('Failed to track 404:', err)
    }
  }, [])

  return <Content {...props} />
}

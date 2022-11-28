import React, { useEffect, useRef } from 'react'
import Sidebar from '@theme-original/DocPage/Layout/Sidebar'
import { refreshLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking'

export default function SidebarWrapper(props) {
  const sidebarRef = useRef()
  useEffect(() => {
    const listener = (event) => {
      const { classList } = event?.target
      if (
        classList?.contains('clean-btn') &&
        classList?.contains('menu__caret')
      ) {
        // we need to call it whenever a new link appears on the page
        // see https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/#refreshlinkclicktracking
        setTimeout(() => refreshLinkClickTracking(), 100)
      }
    }

    if (sidebarRef.current) {
      sidebarRef.current.addEventListener('click', listener, { passive: true })
    }

    return () => {
      sidebarRef.current.removeEventListener('click', listener)
    }
  }, [sidebarRef.current])
  return (
    <div ref={sidebarRef}>
      <Sidebar {...props} />
    </div>
  )
}

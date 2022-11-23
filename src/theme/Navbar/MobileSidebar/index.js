import React, { useEffect, useRef } from 'react'
import MobileSidebar from '@theme-original/Navbar/MobileSidebar'
import { refreshLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking'

export default function MobileSidebarWrapper(props) {
  const mobileSidebarRef = useRef()
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

    if (mobileSidebarRef.current) {
      mobileSidebarRef.current.addEventListener('click', listener, {
        passive: true,
      })
    }

    return () => {
      mobileSidebarRef.current.removeEventListener('click', listener)
    }
  }, [mobileSidebarRef.current])
  return (
    <div ref={mobileSidebarRef}>
      <MobileSidebar {...props} />
    </div>
  )
}

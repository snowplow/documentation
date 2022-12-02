import { useEffect } from 'react'
import { refreshLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking'

export function useRefreshTrackingOnMenuToggle() {
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
    // we need to disable adding it multiple times so we flag that the handler is already
    // attached using this custom attribute
    if (document.body && !document.body.getAttribute('listenForMenuToggle')) {
      document.body.setAttribute('listenForMenuToggle', 'true')
      document.body.addEventListener('click', listener, {
        passive: true,
      })
    }

    return () => {
      document.body.removeAttribute('listenForMenuToggle')
      document.body.removeEventListener('click', listener)
    }
  }, [])
}

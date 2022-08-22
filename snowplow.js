import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { newTracker, trackPageView } from '@snowplow/browser-tracker'
import { LinkClickTrackingPlugin, enableLinkClickTracking, refreshLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking'

const docsUrls = ['docs.snowplowanalytics.com', 'docs.snowplow.io', 'snowplow.github.io']

const setupBrowserTracker = () => {
  if (ExecutionEnvironment.canUseDOM) {
    const appId = docsUrls.includes(window.location.hostname) ? 'docs2' : 'test'

    const snowplowTracker = newTracker('snplow5', 'https://collector-g.snowplowanalytics.com', { 
      appId,
      plugins: [ LinkClickTrackingPlugin() ], 
      cookieDomain: ".snowplowanalytics.com",
      cookieName: "_sp5_",
      contexts: {
        webPage: true,
        performanceTiming: true,
        gaCookies: true,
      }
    })

    enableLinkClickTracking()
    refreshLinkClickTracking()
    snowplowTracker.enableActivityTracking({heartbeatDelay: 10, minimumVisitLength: 10})  // precise tracking for the unified log
  }
}

setupBrowserTracker()

const module = {
  onRouteDidUpdate({location, previousLocation}) {
    if (location.pathname !== previousLocation?.pathname) {
      // see https://github.com/facebook/docusaurus/pull/7424 regarding setTimeout
      setTimeout(() => trackPageView())
    }
  }
}

export default module
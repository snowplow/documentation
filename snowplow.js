import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { newTracker, trackPageView } from '@snowplow/browser-tracker'
import { LinkClickTrackingPlugin, enableLinkClickTracking, refreshLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking'
import { onPreferencesChanged } from 'cookie-though'
import Cookies from 'js-cookie'
import { DOCS_SITE_URLS } from './src/constants/config'

const setupBrowserTracker = () => {
  const appId = DOCS_SITE_URLS.includes(window.location.hostname) ? 'docs2' : 'test'

  const trackerConfig = { 
    appId,
    plugins: [ LinkClickTrackingPlugin() ], 
    cookieDomain: ".snowplowanalytics.com",
    cookieName: "_sp5_",
    contexts: {
      webPage: true,
      performanceTiming: true,
      gaCookies: true,
    }
  }

  const cookiePreferences = Cookies.get('cookie-preferences')

  if (!cookiePreferences || cookiePreferences.includes('analytics:0')) {
    trackerConfig.anonymousTracking = { 
      withServerAnonymisation: true
    }
  }

  const snowplowTracker = newTracker('snplow5', 'https://collector-g.snowplowanalytics.com', trackerConfig)

  enableLinkClickTracking()
  refreshLinkClickTracking()
  snowplowTracker.enableActivityTracking({heartbeatDelay: 10, minimumVisitLength: 10})  // precise tracking for the unified log

  return snowplowTracker
}

if (ExecutionEnvironment.canUseDOM) {
  const tracker = setupBrowserTracker()

  onPreferencesChanged((preferences)=> {
    preferences.cookieOptions.forEach(({id, isEnabled}) => {
      if (id === 'analytics') {
        if (isEnabled) {
          tracker.disableAnonymousTracking({ stateStorageStrategy: 'cookieAndLocalStorage' })
        } else {
          tracker.enableAnonymousTracking({
            withServerAnonymisation: true
          })
        }
      }
    })
  })
}

const module = {
  onRouteDidUpdate({location, previousLocation}) {
    if (location.pathname !== previousLocation?.pathname) {
      // see https://github.com/facebook/docusaurus/pull/7424 regarding setTimeout
      setTimeout(() => trackPageView())
    }
  }
}

export default module
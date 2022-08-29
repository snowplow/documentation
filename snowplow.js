import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { newTracker, trackPageView } from '@snowplow/browser-tracker'
import { LinkClickTrackingPlugin, enableLinkClickTracking, refreshLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking'
import { onPreferencesChanged } from 'cookie-though'
import Cookies from 'js-cookie'
import { COOKIE_PREF_KEY, DOCS_SITE_URLS } from './src/constants/config'
import { reloadOnce } from './src/helpers/reloadOnce'

const setupBrowserTracker = () => {
  const appId = DOCS_SITE_URLS.includes(window.location.hostname) ? 'docs2' : 'test'
  const domain = location.host.split('.').reverse()

  const trackerConfig = { 
    appId,
    plugins: [ LinkClickTrackingPlugin() ], 
    cookieDomain: `.${domain[1]}.${domain[0]}`,
    cookieName: "_sp5_",
    contexts: {
      webPage: true,
      performanceTiming: true,
      gaCookies: true,
    }
  }

  const cookiePreferences = Cookies.get(COOKIE_PREF_KEY)

  if (!cookiePreferences || cookiePreferences.includes('analytics:0')) {
    trackerConfig.anonymousTracking = { 
      withServerAnonymisation: true
    }
  }

  const snowplowTracker = newTracker('snplow5', 'https://collector.snowplow.io', trackerConfig)

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
           // to now track it with all the extra data
          trackPageView()
        } else {
          Cookies.remove('_sp5_')
          reloadOnce()
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
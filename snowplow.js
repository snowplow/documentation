import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import {
  newTracker,
  trackPageView,
  addGlobalContexts,
  enableActivityTracking,
  disableAnonymousTracking,
  trackSelfDescribingEvent,
  enableActivityTrackingCallback,
} from '@snowplow/browser-tracker'
import {
  LinkClickTrackingPlugin,
  enableLinkClickTracking,
} from '@snowplow/browser-plugin-link-click-tracking'
import {
  ButtonClickTrackingPlugin,
  enableButtonClickTracking,
} from '@snowplow/browser-plugin-button-click-tracking'
import {
  FormTrackingPlugin,
  enableFormTracking,
} from '@snowplow/browser-plugin-form-tracking'
import { onPreferencesChanged } from 'cookie-though'
import Cookies from 'js-cookie'
import { COOKIE_PREF_KEY, DOCS_SITE_URLS } from './src/constants/config'
import { reloadOnce } from './src/helpers/reloadOnce'
import { isEmpty, pickBy } from 'lodash'
import { SnowplowMediaPlugin } from '@snowplow/browser-plugin-media'

let aggregatedEvent = {
  minXOffset: 0,
  maxXOffset: 0,
  minYOffset: 0,
  maxYOffset: 0,
  numEvents: 0,
}

const sendAggregatedEvent = () => {
  if (aggregatedEvent.numEvents > 0) {
    trackSelfDescribingEvent({
      event: {
        schema: 'iglu:com.snowplowanalytics/page_view_aggregated/jsonschema/1-0-0',
        data: {
          minXOffset: Math.max(0, Math.round(aggregatedEvent.minXOffset)),
          maxXOffset: Math.max(0, Math.round(aggregatedEvent.maxXOffset)),
          minYOffset: Math.max(0, Math.round(aggregatedEvent.minYOffset)),
          maxYOffset: Math.max(0, Math.round(aggregatedEvent.maxYOffset)),
          activeSeconds: aggregatedEvent.numEvents,
        },
      },
    })
  }
  // Reset
  aggregatedEvent = {
    minXOffset: 0,
    maxXOffset: 0,
    minYOffset: 0,
    maxYOffset: 0,
    numEvents: 0,
  }
}

const createTrackerConfig = (cookieName) => {
  const appId = DOCS_SITE_URLS.includes(window.location.hostname)
    ? 'docs2'
    : 'test'
  const domain = location.host.split('.').reverse()

  const trackerConfig = {
    appId,
    eventMethod: 'post',
    plugins: [
      LinkClickTrackingPlugin(),
      SnowplowMediaPlugin(),
      ButtonClickTrackingPlugin(),
      FormTrackingPlugin(),
    ],
    cookieDomain: `.${domain[1]}.${domain[0]}`,
    cookieName,
    cookieSameSite: 'Lax',
    keepalive: true,
    contexts: {
      webPage: true,
      performanceTiming: true,
      gaCookies: true,
    },
  }

  const cookiePreferences = Cookies.get(COOKIE_PREF_KEY)

  if (!cookiePreferences || cookiePreferences.includes('analytics:0')) {
    trackerConfig.anonymousTracking = {
      withServerAnonymisation: true,
    }
  }

  return trackerConfig
}

const setupBrowserTracker = () => {
  newTracker(
    'snplow5',
    // 'https://collector.snowplow.io',
    'com-snplow-sales-aws-prod1.collector.snplow.net',
    createTrackerConfig('_sp5_')
  )
  // newTracker('biz1', 'https://c.snowplow.io', createTrackerConfig('_sp_biz1_'))

  const selectedTabContext = () => {
    const data = pickBy({
      cloud: localStorage.getItem('docusaurus.tab.cloud'),
      data_warehouse: localStorage.getItem('docusaurus.tab.warehouse'),
    })
    // @ts-ignore
    if (!_.isEmpty(data))
      return {
        schema:
          'iglu:com.snowplowanalytics.docs/selected_tabs/jsonschema/1-0-0',
        data,
      }
  }
  addGlobalContexts([selectedTabContext])

  enableLinkClickTracking()

  enableActivityTracking({
    heartbeatDelay: 10,
    minimumVisitLength: 10,
  }) // precise tracking for the unified log

  enableActivityTrackingCallback({
    minimumVisitLength: 1,
    heartbeatDelay: 1,
    callback: function (event) {
      const newMinX =
        aggregatedEvent.numEvents === 0
          ? event.minXOffset
          : Math.min(aggregatedEvent.minXOffset, event.minXOffset)

      const newMinY =
        aggregatedEvent.numEvents === 0
          ? event.minYOffset
          : Math.min(aggregatedEvent.minYOffset, event.minYOffset)

      aggregatedEvent = {
        minXOffset: newMinX,
        maxXOffset: Math.max(aggregatedEvent.maxXOffset, event.maxXOffset),
        minYOffset: newMinY,
        maxYOffset: Math.max(aggregatedEvent.maxYOffset, event.maxYOffset),
        numEvents: aggregatedEvent.numEvents + 1,
      }
    },
  })

  enableButtonClickTracking()
  enableFormTracking()
}

if (ExecutionEnvironment.canUseDOM) {
  setupBrowserTracker()

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendAggregatedEvent()
    }
  })

  onPreferencesChanged((preferences) => {
    preferences.cookieOptions.forEach(({ id, isEnabled }) => {
      if (id === 'analytics') {
        if (isEnabled) {
          disableAnonymousTracking({
            stateStorageStrategy: 'cookieAndLocalStorage',
          })
          // to now track it with all the extra data
          trackPageView()
        } else {
          const cookieKeys = document.cookie
            .split(';')
            .map((str) => str.split('=')[0].trim())
          const snowplowCookies = cookieKeys.filter((cookieKey) =>
            cookieKey.startsWith('_sp5_')
          )
          snowplowCookies.forEach((snowplowCookie) =>
            Cookies.remove(snowplowCookie)
          )
          Cookies.remove('sp')
          reloadOnce()
        }
      }
    })
  })
}

const module = {
  onRouteDidUpdate({ location, previousLocation }) {
    if (location.pathname !== previousLocation?.pathname) {
      sendAggregatedEvent()
      // see https://github.com/facebook/docusaurus/pull/7424 regarding setTimeout
      setTimeout(() => {
        trackPageView()
      })
    }
  },
}

export default module

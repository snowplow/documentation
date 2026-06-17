import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import {
  newTracker,
  trackPageView,
  addGlobalContexts,
  enableActivityTracking,
  disableAnonymousTracking,
  trackSelfDescribingEvent,
  enableActivityTrackingCallback,
  crossDomainLinker,
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
import Cookies from 'js-cookie'
import { DOCS_SITE_URLS, SP5_COOKIE_NAME, BIZ1_COOKIE_NAME } from './src/constants/config'
import { reloadOnce } from './src/helpers/reloadOnce'
import { isEmpty, pickBy } from 'lodash'
import { SnowplowMediaPlugin } from '@snowplow/browser-plugin-media'
import { BotDetectionPlugin } from '@snowplow/browser-plugin-bot-detection'

const CROSS_DOMAIN_TARGETS = ['snowplowanalytics.com']

const crossDomainLinkerFn = (linkElement) => {
  return CROSS_DOMAIN_TARGETS.some((domain) =>
    linkElement.hostname.endsWith(domain)
  )
}

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
      BotDetectionPlugin(),
    ],
    cookieDomain: `.${domain[1]}.${domain[0]}`,
    cookieName,
    cookieSameSite: 'Lax',
    keepalive: true,
    crossDomainLinker: crossDomainLinkerFn,
    useExtendedCrossDomainLinker: true,
    contexts: {
      webPage: true,
      performanceTiming: true,
      gaCookies: true,
    },
  }

  try {
    const raw = Cookies.get('_ketch_consent_v1_')
    const ketchConsent = raw && JSON.parse(atob(decodeURIComponent(raw)))
    if (!ketchConsent || ketchConsent.analytics?.status !== 'granted') {
      trackerConfig.anonymousTracking = { withServerAnonymisation: true }
    }
  } catch {
    trackerConfig.anonymousTracking = { withServerAnonymisation: true }
  }

  return trackerConfig
}

const setupBrowserTracker = () => {
  newTracker(
    'snplow5',
    'https://collector.snowplow.io',
    createTrackerConfig(SP5_COOKIE_NAME)
  )
  newTracker('biz1', 'https://c.snowplow.io', createTrackerConfig(BIZ1_COOKIE_NAME))

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

  let consentInitialized = false

  window.ketch('on', 'consent', (consent) => {
    const analyticsEnabled = consent.purposes?.analytics === true

    if (!consentInitialized) {
      consentInitialized = true
      if (analyticsEnabled) {
        disableAnonymousTracking({
          stateStorageStrategy: 'cookieAndLocalStorage',
        })
        trackPageView()
      }
      return
    }

    if (analyticsEnabled) {
      disableAnonymousTracking({
        stateStorageStrategy: 'cookieAndLocalStorage',
      })
      trackPageView()
    } else {
      const cookieKeys = Object.keys(Cookies.get())
      const snowplowCookies = cookieKeys.filter((cookieKey) =>
        cookieKey.startsWith(SP5_COOKIE_NAME)
      )
      snowplowCookies.forEach((snowplowCookie) =>
        Cookies.remove(snowplowCookie)
      )
      Cookies.remove('sp')
      reloadOnce()
    }
  })
}

const module = {
  onRouteDidUpdate({ location, previousLocation }) {
    if (location.pathname !== previousLocation?.pathname) {
      sendAggregatedEvent()
      // see https://github.com/facebook/docusaurus/pull/7424 regarding setTimeout
      setTimeout(() => {
        trackPageView()
        crossDomainLinker(crossDomainLinkerFn)
      })
    }
  },
}

export default module

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
import {
  DOCS_SITE_URLS,
  SP5_COOKIE_NAME,
  BIZ1_COOKIE_NAME,
  SALES_COOKIE_NAME,
} from './src/constants/config'
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

// Trackers that receive standard tracking (page views, page pings, etc.).
const PRODUCTION_TRACKERS = ['snplow5', 'biz1']
// Dedicated tracker for the aggregated engagement experiment. Scoping the
// callback and the self-describing event to this tracker keeps the experiment
// isolated to the sales pipeline, where the page_view_aggregated schema lives.
const SALES_TRACKER = 'sales'

// The activity-tracking callback fires once per heartbeat. activeSeconds is
// derived from the heartbeat count, so it only equals elapsed seconds while
// AGGREGATION_HEARTBEAT_SECONDS stays at 1 — keep them in sync if you retune it.
const AGGREGATION_HEARTBEAT_SECONDS = 1

const emptyAggregate = () => ({
  minXOffset: 0,
  maxXOffset: 0,
  minYOffset: 0,
  maxYOffset: 0,
  numEvents: 0,
})

let aggregatedEvent = emptyAggregate()

const sendAggregatedEvent = () => {
  if (aggregatedEvent.numEvents > 0) {
    trackSelfDescribingEvent(
      {
        event: {
          schema:
            'iglu:com.snowplowanalytics/page_view_aggregated/jsonschema/1-0-0',
          data: {
            minXOffset: Math.max(0, Math.round(aggregatedEvent.minXOffset)),
            maxXOffset: Math.max(0, Math.round(aggregatedEvent.maxXOffset)),
            minYOffset: Math.max(0, Math.round(aggregatedEvent.minYOffset)),
            maxYOffset: Math.max(0, Math.round(aggregatedEvent.maxYOffset)),
            activeSeconds:
              aggregatedEvent.numEvents * AGGREGATION_HEARTBEAT_SECONDS,
          },
        },
      },
      [SALES_TRACKER]
    )
  }
  // Reset
  aggregatedEvent = emptyAggregate()
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
  // Aggregated engagement experiment: tracks to the sales pipeline only.
  newTracker(
    SALES_TRACKER,
    'https://com-snplow-sales-aws-prod1.collector.snplow.net',
    createTrackerConfig(SALES_COOKIE_NAME)
  )

  const selectedTabContext = () => {
    const data = pickBy({
      cloud: localStorage.getItem('docusaurus.tab.cloud'),
      data_warehouse: localStorage.getItem('docusaurus.tab.warehouse'),
    })
    if (!isEmpty(data))
      return {
        schema:
          'iglu:com.snowplowanalytics.docs/selected_tabs/jsonschema/1-0-0',
        data,
      }
  }
  // selected_tabs is a docs-analytics context; keep it (and its schema
  // dependency) on the production pipelines only.
  addGlobalContexts([selectedTabContext], PRODUCTION_TRACKERS)

  enableLinkClickTracking({}, PRODUCTION_TRACKERS)

  enableActivityTracking(
    {
      heartbeatDelay: 10,
      minimumVisitLength: 10,
    },
    PRODUCTION_TRACKERS
  ) // precise tracking for the unified log

  enableActivityTrackingCallback(
    {
      minimumVisitLength: 1,
      heartbeatDelay: AGGREGATION_HEARTBEAT_SECONDS,
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
    },
    [SALES_TRACKER]
  )

  enableButtonClickTracking({}, PRODUCTION_TRACKERS)
  enableFormTracking({}, PRODUCTION_TRACKERS)
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
      // Flush the aggregate BEFORE the new page view. The page view id is only
      // advanced by trackPageView (deferred below via setTimeout), so flushing
      // here attaches the aggregate to the web_page context of the page being
      // left. Do not reorder: sending after trackPageView would misattribute
      // the engagement to the new page.
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

---
title: "Initialize and configure the web trackers"
sidebar_label: "Initialization and configuration"
description: "Configure tracker behavior with options for cookies, events, anonymous tracking, and collector endpoints."
keywords: ["tracker configuration", "initialization options", "configuration object", "tracker settings"]
date: "2021-03-31"
sidebar_position: 2000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

Initialize the tracker by calling the `newTracker` function. It takes three arguments:

1. The tracker namespace
2. The Collector endpoint
3. An optional configuration object containing other settings

Here is a simple example of how to initialise a tracker, setting a few configuration options:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// The tracker namespace is 'sp' in this example
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax', // Recommended
  contexts: {
    session: true
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
// The tracker namespace is 'sp' in this example
newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  cookieSameSite: 'Lax', // Recommended
  contexts: {
    session: true
  }
});
```

  </TabItem>
</Tabs>

The tracker will send events to the Collector URL you specify by replacing `{{collector_url_here}}`. The final argument is the configuration object. Here it's used to set the app ID and enable the [session](/docs/sources/web-trackers/tracking-events/session/index.md) entity for each event. Each event the tracker sends will have an `app_id` field set to `my-app-id`.

If your code calls `newTracker` multiple times with the same namespace, only the first call is taken into account.

:::tip For Single Page Apps
Initialize one tracker per initial page load.
:::

The following table shows all the configuration parameters. These are all optional: you aren't required to provide any configuration object at all.


| Property                                                                                                                                    | Description                                                                                          | Default (if applicable)               | Type                       |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------- | -------------------------- |
| [`appId`](/docs/sources/web-trackers/tracking-events/index.md#application-id)                                                       | Set the application ID.                                                                              |                                       | `string`                   |
| [`appVersion`](/docs/sources/web-trackers/tracking-events/index.md#application-version)                                             | Set the application version.                                                                         |                                       | `string`                   |
| [`platform`](/docs/sources/web-trackers/tracking-events/index.md#application-platform)                                              | Set the application platform.                                                                        | `web`                                 | `string` enum              |
| [`cookieDomain`](/docs/sources/web-trackers/cookies-and-local-storage/configuring-cookies/index.md#cookie-domain)                           | Set the cookie domain.                                                                               | Current domain                        | `string`                   |
| [`discoverRootDomain`](/docs/sources/web-trackers/cookies-and-local-storage/configuring-cookies/index.md#cookie-domain)                     | Automatic discovery and setting of the root domain, to facilitate tracking over multiple subdomains. | `true`                                | `boolean`                  |
| [`cookieName`](/docs/sources/web-trackers/cookies-and-local-storage/configuring-cookies/index.md#cookie-name)                               | Set the cookie name prefix.                                                                          | `_sp_`                                | `string`                   |
| [`cookieSameSite`](/docs/sources/web-trackers/cookies-and-local-storage/configuring-cookies/index.md#cookie-samesite-and-secure-attributes) | Set the cookie SameSite attribute.                                                                   | `Lax`                                 | `string` enum              |
| [`cookieSecure`](/docs/sources/web-trackers/cookies-and-local-storage/configuring-cookies/index.md#cookie-samesite-and-secure-attributes)   | Set the cookie Secure attribute.                                                                     | `true`                                | `boolean`                  |
| [`encodeBase64`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#base64-encoding)                                           | Enable Base64 encoding for self-describing event and entity data.                                    | `true` for GET, `false` for POST      | `boolean`                  |
| [`respectDoNotTrack`](/docs/sources/web-trackers/anonymous-tracking/index.md#respecting-do-not-track)                                       | Respect the browser Do Not Track setting.                                                            | `false`                               | `boolean`                  |
| [`eventMethod`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#network-protocol-and-method)                                | Send events by GET or POST.                                                                          | `post`                                | `string` enum              |
| [`bufferSize`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#number-of-events-per-request)                                | Number of events to buffer before sending.                                                           | 1                                     | `int`                      |
| [`maxPostBytes`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#maximum-payload-size)                                      | Maximum size in bytes for POST requests.                                                             | 40000                                 | `int`                      |
| [`maxGetBytes`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#maximum-payload-size)                                       | Maximum size for GET request URLs.                                                                   |                                       | `int`                      |
| [`postPath`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#custom-post-path)                                              | Custom collector POST path.                                                                          | `/com.snowplowanalytics.snowplow/tp2` | `string`                   |
| [`crossDomainLinker`](/docs/sources/web-trackers/cross-domain-tracking/index.md)                                                            | Function to determine which links to decorate for cross-domain tracking.                             |                                       | `function`                 |
| [`useExtendedCrossDomainLinker`](/docs/sources/web-trackers/cross-domain-tracking/index.md)                                                 | Use extended format for cross-domain linker with additional user/session data.                       | `false`                               | `boolean` or `object`      |
| [`cookieLifetime`](/docs/sources/web-trackers/cookies-and-local-storage/configuring-cookies/index.md#cookie-lifetime-and-duration)          | Set the cookie lifetime in seconds.                                                                  | 63072000 (2 years)                    | `int`                      |
| [`sessionCookieTimeout`](/docs/sources/web-trackers/tracking-events/session/index.md)                                                       | Set the session timeout in seconds.                                                                  | 1800 (30 minutes)                     | `int`                      |
| [`stateStorageStrategy`](/docs/sources/web-trackers/cookies-and-local-storage/configuring-cookies/index.md#storage-strategy)                | How to store tracker state.                                                                          | `cookieAndLocalStorage`               | `string` enum              |
| [`maxLocalStorageQueueSize`](/docs/sources/web-trackers/cookies-and-local-storage/configuring-cookies/index.md#local-storage-queue-size)    | Maximum events to queue in local storage when they are failing to send.                              | 1000                                  | `int`                      |
| [`resetActivityTrackingOnPageView`](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md#reset-page-ping-on-page-view)   | Reset page ping timers when a page view is tracked.                                                  | `true`                                | `boolean`                  |
| [`connectionTimeout`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#connection-timeout)                                   | Request timeout in milliseconds.                                                                     | 5000                                  | `int`                      |
| [`anonymousTracking`](/docs/sources/web-trackers/anonymous-tracking/index.md)                                                               | Enable anonymous tracking (do not track user identifiers).                                           | `false`                               | `boolean` or `object`      |
| [`customHeaders`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#custom-request-headers)                                   | Custom headers to add to POST requests.                                                              |                                       | `object`                   |
| [`credentials`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#disabling-sending-credentials-with-requests)                | Whether to send credentials (cookies) with requests.                                                 | `include`                             | `string` enum              |
| [`contexts`](/docs/sources/web-trackers/tracking-events/index.md#add-contextual-data-with-entities)                                                     | Configure context entities to add to all events.                                                     | `{ webPage: true }`                   | `object`                   |
| [`plugins`](/docs/sources/web-trackers/plugins/index.md)                                                                                    | Plugins to extend tracker functionality.                                                             | `[]`                                  | `BrowserPlugin[]`          |
| [`retryStatusCodes`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#custom-retry-http-codes)                               | HTTP status codes to retry requests on.                                                              |                                       | `int[]`                    |
| [`dontRetryStatusCodes`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#custom-retry-http-codes)                           | HTTP status codes to never retry.                                                                    | `[400, 401, 403, 410, 422]`           | `int[]`                    |
| [`retryFailedRequests`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#retries)                                            | Retry failed requests (timeouts, network errors).                                                    | `true`                                | `boolean`                  |
| [`onSessionUpdateCallback`](/docs/sources/web-trackers/tracking-events/session/index.md#on-session-update-callback)                         | Callback executed when the session identifier updates.                                               |                                       | `function`                 |
| [`onRequestSuccess`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#onrequestsuccess-callback)                             | Callback executed when a request succeeds (2xx status).                                              |                                       | `function`                 |
| [`onRequestFailure`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#onrequestfailure-callback)                             | Callback executed when a request fails (non-2xx status).                                             |                                       | `function`                 |
| [`preservePageViewIdForUrl`](/docs/sources/web-trackers/tracking-events/page-views/index.md#when-is-the-page-view-id-generated)             | Control when a new page view ID is generated based on URL changes.                                   | `false`                               | `boolean` or `string` enum |
| [`customFetch`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#custom-event-store)                                         | Override the default fetch function with a custom implementation.                                    |                                       | `function`                 |
| [`eventStore`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#custom-event-store)                                          | Custom EventStore implementation for storing events before sending.                                  |                                       | `object`                   |
| [`keepalive`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#keepalive-option-for-collector-requests)                      | Allow requests to outlive the webpage. Enables requests to complete even if the page is closed.      | `false`                               | `boolean`                  |
| [`synchronousCookieWrite`](/docs/sources/web-trackers/configuring-how-events-sent/index.md#synchronous-cookie-writes)                       | Write cookies synchronously (blocks main thread).                                                    | `false`                               | `boolean`                  |

Here is a longer code example in which every tracker configuration parameter is set:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

If you're using the minimal `sp.lite.js` distribution, setting the `performanceNavigationTiming`, `gaCookies`, or `webVitals` `context` options won't do anything as those plugins aren't available.

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  platform: 'web',
  cookieDomain: null,
  discoverRootDomain: true,
  cookieName: '_sp_',
  cookieSameSite: 'Lax', // Recommended
  cookieSecure: true,
  encodeBase64: true,
  respectDoNotTrack: false,
  eventMethod: 'post',
  bufferSize: 1,
  maxPostBytes: 40000,
  maxGetBytes: 1000, // available in v3.4+
  postPath: '/custom/path', // Collector must be configured
  crossDomainLinker: function (linkElement) {
    return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
  },
  useExtendedCrossDomainLinker: {
    userId: true,
  },
  cookieLifetime: 63072000,
  sessionCookieTimeout: 1800,
  stateStorageStrategy: 'cookieAndLocalStorage',
  maxLocalStorageQueueSize: 1000,
  resetActivityTrackingOnPageView: true,
  connectionTimeout: 5000,
  anonymousTracking: false,
  // anonymousTracking: { withSessionTracking: true },
  // anonymousTracking: { withSessionTracking: true, withServerAnonymisation: true },
  customHeaders: {}, // Use with caution. Available from v3.2.0+
  credentials: 'include', // Available from v4+
  contexts: {
    webPage: true, // Default
    session: false, // Adds client session entity to events, off by default. Available in v3.5+.
    browser: false, // Adds browser entity to events, off by default. Available in v3.9+.
    performanceNavigationTiming: false, // Adds performance navigation timing entity. Available in v4.0.2+
    gaCookies: false, // Adds Google Analytics cookies entity. Available in v3.0+
    webVitals: false // Adds web vitals entity. Available in v4.0+
  },
  retryStatusCodes: [],
  dontRetryStatusCodes: [],
  retryFailedRequests: true,
  onSessionUpdateCallback: function(clientSession) { }, // Allows the addition of a callback, whenever a new session is generated. Available in v3.11+.
  onRequestSuccess: function(data) => { }, // Available in v3.18.1+
  onRequestFailure: function(data) => { }, // Available in v3.18.1+
  preservePageViewIdForUrl: false,
  keepalive: false, // Introduced in v4
  customFetch: undefined, // Introduced in v4
  eventStore: undefined, // Introduced in v4
  synchronousCookieWrite: false,
});
```

The `contexts` block also accepts `clientHints` and `geolocation` keys. The [client hints](/docs/sources/web-trackers/tracking-events/client-hints/index.md) and [geolocation](/docs/sources/web-trackers/tracking-events/timezone-geolocation/index.md) plugins used to be included in `sp.js`, but were removed in version 4. Setting these configuration options won't do anything in version 4+ unless you've also installed the plugins separately.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  appVersion: '0.1.0',
  platform: 'web',
  cookieDomain: null,
  discoverRootDomain: true,
  cookieName: '_sp_',
  cookieSameSite: 'Lax', // Recommended
  cookieSecure: true,
  encodeBase64: true,
  respectDoNotTrack: false,
  eventMethod: 'post',
  bufferSize: 1,
  maxPostBytes: 40000,
  maxGetBytes: 1000, // available in v3.4+
  postPath: '/custom/path', // Collector must be configured
  crossDomainLinker: function (linkElement) {
    return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
  },
  useExtendedCrossDomainLinker: {
    userId: true,
  },
  cookieLifetime: 63072000,
  sessionCookieTimeout: 1800,
  stateStorageStrategy: 'cookieAndLocalStorage',
  maxLocalStorageQueueSize: 1000,
  resetActivityTrackingOnPageView: true,
  connectionTimeout: 5000,
  anonymousTracking: false,
  // anonymousTracking: { withSessionTracking: true },
  // anonymousTracking: { withSessionTracking: true, withServerAnonymisation: true },
  customHeaders: {}, // Use with caution. Available from v3.2.0+
  credentials: 'include', // Available from v4+
  contexts: {
    webPage: true, // Default
    session: false, // Adds client session context entity to events, off by default. Available in v3.5+.
    browser: false // Adds browser context entity to events, off by default. Available in v3.9+.
  },
  plugins: [],
  retryStatusCodes: [],
  dontRetryStatusCodes: [],
  retryFailedRequests: true,
  onSessionUpdateCallback: function(clientSession) { }, // Allows the addition of a callback, whenever a new session is generated. Available in v3.11+.
  onRequestSuccess: function(data) => { }, // Available in v3.18.1+
  onRequestFailure: function(data) => { }, // Available in v3.18.1+
  preservePageViewIdForUrl: false,
  keepalive: false, // Introduced in v4
  customFetch: undefined, // Introduced in v4
  eventStore: undefined, // Introduced in v4
  synchronousCookieWrite: false,
});
```

  </TabItem>
</Tabs>

You can further extend the tracker functionality by installing plugins. Read more about them [here](/docs/sources/web-trackers/plugins/index.md).

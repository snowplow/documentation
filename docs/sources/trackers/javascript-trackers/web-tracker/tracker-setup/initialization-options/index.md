---
title: "Initialization and configuration"
date: "2021-03-31"
sidebar_position: 2000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

Initialize the tracker by calling the `"newTracker"` function. It takes three arguments:

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
  discoverRootDomain: true, // default, can be omitted
  cookieSameSite: 'Lax', // Recommended
  contexts: {
    webPage: true // default, can be omitted
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
  discoverRootDomain: true, // default, can be omitted
  cookieSameSite: 'Lax', // Recommended
  contexts: {
    webPage: true // default, can be omitted
  }
});
```

  </TabItem>
</Tabs>

The tracker will send events to the Collector URL you specify by replacing `{{collector_url_here}}`. The final argument is the configuration object. Here it's used to set the app ID and the webPage entity for each event. Each event the tracker sends will have an `app_id` field set to `my-app-id`.

If your code calls `newTracker` multiple times with the same namespace, only the first call is taken into account.

:::tip For Single Page Apps
Initialize one tracker per initial page load.
:::

The following table shows all the configuration parameters. These are all optional. In fact, you aren't required to provide any configuration object at all.

| Property                                                                                                                                                                | Description                                                                                                                                                                                                                         | Default (if applicable)               | Type                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------- |
| [`appId`](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/index.md#setting-application-id)                                                       | Set the application ID.                                                                                                                                                                                                             |                                       | `string`                                                 |
| [`appVersion`](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/index.md#setting-application-version)                                             | Set the application version.                                                                                                                                                                                                        |                                       | `string`                                                 |
| [`platform`](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/index.md#setting-application-platform)                                              | Set the application platform.                                                                                                                                                                                                       | "web"                                 | `string` enum                                            |
| [`cookieDomain`](/docs/sources/trackers/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/index.md#cookie-domain)                           | Set the cookie domain.                                                                                                                                                                                                              |                                       |                                                          |
| [`discoverRootDomain`](/docs/sources/trackers/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/index.md#cookie-domain)                     | Automatic discovery and setting of the root domain, to facilitate tracking over multiple subdomains.                                                                                                                                | true                                  | `boolean`                                                |
| [`cookieName`](/docs/sources/trackers/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/index.md#cookie-name)                               | Set the cookie name.                                                                                                                                                                                                                |                                       | `string`                                                 |
| [`cookieSameSite`](/docs/sources/trackers/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/index.md#cookie-samesite-and-secure-attributes) | Set the cookie same-site attribute.                                                                                                                                                                                                 | null                                  | `string` enum                                            |
| [`cookieSecure`](/docs/sources/trackers/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/index.md#cookie-samesite-and-secure-attributes)   | Set the cookie secure attribute.                                                                                                                                                                                                    | true                                  | `boolean`                                                |
| [`encodeBase64`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#base64-encoding)                                           | Enable Base64 encoding for entities and custom self-describing events (JSON objects).                                                                                                                                               | true for GET, false for POST requests | `boolean`                                                |
| [`respectDoNotTrack`](/docs/sources/trackers/javascript-trackers/web-tracker/anonymous-tracking/index.md#respecting-do-not-track)                                       | Choose to respect browser `Do Not` Track option.                                                                                                                                                                                    | false                                 | `boolean`                                                |
| [`eventMethod`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#network-protocol-and-method)                                | Choose to send events by GET or POST.                                                                                                                                                                                               | `post`                                | `string` enum                                            |
| [`bufferSize`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#number-of-events-per-request)                                | How many events to send in one request.                                                                                                                                                                                             | 1                                     | `int`                                                    |
| [`maxPostBytes`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#maximum-payload-size)                                      | Set a limit for the size of one request.                                                                                                                                                                                            | 40000                                 | `int`                                                    |
| [`maxGetBytes`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#maximum-payload-size)                                       | Set a limit for the size of one request.                                                                                                                                                                                            |                                       | `int`                                                    |
| [`postPath`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#custom-post-path)                                              | Change the collector POST path.                                                                                                                                                                                                     |                                       | `string`                                                 |
| [`useExtendedCrossDomainLinker`](/docs/sources/trackers/javascript-trackers/web-tracker/cross-domain-tracking/index.md)                                                 | Decorate links for cross-domain tracking using the extended format.                                                                                                                                                                 |                                       | `object`                                                 |
| [`crossDomainLinker`](/docs/sources/trackers/javascript-trackers/web-tracker/cross-domain-tracking/index.md)                                                            | Decorate links for cross-domain tracking using the original, short format.                                                                                                                                                          |                                       | `function`                                               |
| [`cookieLifetime`](/docs/sources/trackers/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/index.md#cookie-lifetime-and-duration)          | Set the cookie lifetime.                                                                                                                                                                                                            | 63072000 s (2 years)                  | `int`                                                    |
| [`stateStorageStrategy`](/docs/sources/trackers/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/index.md#storage-strategy)                | How to store tracker state.                                                                                                                                                                                                         | `cookieAndLocalStorage`               | `string` enum                                            |
| [`maxLocalStorageQueueSize`](/docs/sources/trackers/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/index.md#local-storage-queue-size)    | How many events to queue in local storage when they're failing to send.                                                                                                                                                             | 1000                                  | `int`                                                    |
| [`resetActivityTrackingOnPageView`](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/activity-page-pings/index.md#reset-page-ping-on-page-view)   | Choose to reset page ping timers when a page view is tracked.                                                                                                                                                                       | true                                  | `boolean`                                                |
| [`connectionTimeout`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#connection-timeout)                                   | Set request connection timeout.                                                                                                                                                                                                     | 5000 ms                               | `int`                                                    |
| [`anonymousTracking`](/docs/sources/trackers/javascript-trackers/web-tracker/anonymous-tracking/index.md)                                                               | Don't track user identifiers.                                                                                                                                                                                                       | false                                 | `boolean`                                                |
| [`customHeaders`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#custom-request-headers)                                   | Add custom headers to requests.                                                                                                                                                                                                     |                                       | `object`                                                 |
| [`credentials`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#disabling-sending-credentials-with-requests)                | Choose whether to include cookies in certain collector requests.                                                                                                                                                                    | `include`                             | `string` enum                                            |
| [`contexts`](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/index.md#auto-tracked-entities)                                                     | Configure context entities to add to all events.                                                                                                                                                                                    | various                               | `object`                                                 |
| [`retryStatusCodes`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#custom-retry-http-codes)                               | Set HTTP response codes to retry requests on.                                                                                                                                                                                       |                                       | `[int]`                                                  |
| [`dontRetryStatusCodes`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#custom-retry-http-codes)                           | Set HTTP response codes not to retry requests on.                                                                                                                                                                                   |                                       | `[int]`                                                  |
| [`retryFailedRequests`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#retries)                                            | Choose to retry failed requests or not.                                                                                                                                                                                             | true                                  | `boolean`                                                |
| [`onSessionUpdateCallback`](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/session/index.md#on-session-update-callback)                         | A callback to run every time the session updates.                                                                                                                                                                                   |                                       | `function`                                               |
| [`onRequestSuccess`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#onrequestsuccess-callback)                             | A callback to run every time a request is successfully sent to the collector.                                                                                                                                                       |                                       | `function`                                               |
| [`onRequestFailure`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#onrequestfailure-callback)                             | A callback to run every time a request fails to send.                                                                                                                                                                               |                                       | `function`                                               |
| [`preservePageViewIdForUrl`](/docs/sources/trackers/javascript-trackers/web-tracker/tracking-events/page-views/index.md#when-is-the-page-view-id-generated)             | Option to change when a new page view ID is generated. Makes it possible to generate a new page view on URL change instead of when tracking a page view, which enables tracking events before the page view event with the same ID. | `false`                               | `false`, `true`, `full`, `pathname`, `pathnameAndSearch` |
| [`customFetch`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#custom-event-store)                                         | Enables overriding the default fetch function with a custom implementation.                                                                                                                                                         | function                              |                                                          |
| [`eventStore`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#custom-event-store)                                          | Enables providing a custom EventStore implementation to store events before sending them to the collector.                                                                                                                          | object                                |                                                          |
| [`keepalive`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#keepalive-option-for-collector-requests)                      | Indicates that the request should be allowed to outlive the webpage that initiated it. Enables collector requests to complete even if the page is closed or navigated away from.                                                    | boolean                               | false                                                    |
| [`synchronousCookieWrite`](/docs/sources/trackers/javascript-trackers/web-tracker/configuring-how-events-sent/index.md#synchronous-cookie-writes)                       | Whether to write the cookies synchronously.                                                                                                                                                                                         | boolean                               | false                                                    |

Here is a longer code example in which every tracker configuration parameter is set:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

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
  useExtendedCrossDomainLinker: {
    userId: true,
  },
  crossDomainLinker: function (linkElement) {
    return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
  },
  cookieLifetime: 63072000,
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
    browser: false, // Adds browser context entity to events, off by default. Available in v3.9+.
    performanceNavigationTiming: true, // Adds performance navigation timing entity. Available in v4.0.2+
    performanceTiming: true,
    gaCookies: true,
    // gaCookies: { ga4: true, ua: false, ga4MeasurementId: "", cookiePrefix: "_ga_" }, // Optional
    geolocation: false,
    clientHints: true,
    // clientHints: { includeHighEntropy: true }, // Optional
  },
  retryStatusCodes: [],
  dontRetryStatusCodes: [],
  retryFailedRequests: true,
  onSessionUpdateCallback: function(clientSession) { }, // Allows the addition of a callback, whenever a new session is generated. Available in v3.11+.
  onRequestSuccess: function(data) => { }, // Available in v3.18.1+
  onRequestFailure: function(data) => { }, // Available in v3.18.1+
  keepalive: false, // Introduced in v4
  customFetch: undefined, // Introduced in v4
  eventStore: undefined, // Introduced in v4
});
```

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
  useExtendedCrossDomainLinker: {
    userId: true,
  },
  crossDomainLinker: function (linkElement) {
    return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
  },
  cookieLifetime: 63072000,
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
  retryStatusCodes: [],
  dontRetryStatusCodes: [],
  retryFailedRequests: true,
  onSessionUpdateCallback: function(clientSession) { }, // Allows the addition of a callback, whenever a new session is generated. Available in v3.11+.
  onRequestSuccess: function(data) => { }, // Available in v3.18.1+
  onRequestFailure: function(data) => { }, // Available in v3.18.1+
  keepalive: false, // Introduced in v4
  customFetch: undefined, // Introduced in v4
  eventStore: undefined, // Introduced in v4
});
```

  </TabItem>
</Tabs>

You can further extend the tracker functionality by installing plugins. Read more about them [here](/docs/sources/trackers/javascript-trackers/web-tracker/plugins/index.md).

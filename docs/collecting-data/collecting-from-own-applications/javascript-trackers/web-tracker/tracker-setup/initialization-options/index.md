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

Tracker initialization is started by calling the `"newTracker"` function and takes three arguments:

1. The tracker namespace (`sp` in the below example)
2. The collector endpoint
3. An optional configuration object containing other settings

Here is a simple example of how to initialise a tracker, setting a few configuration options:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
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
newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  discoverRootDomain: true, // default, can be omitted
  cookieSameSite: 'Lax', // Recommended
  contexts: {
    webPage: true // default, can be omitted
  }
});
```

  </TabItem>
</Tabs>

The tracker will be named `sp` (tracker namespace) and will send events to the a collector url you specify by replacing `{{collector_url_here}}`. The final argument is the configuration object. Here it is just used to set the app ID and the common webPage context for each event. Each event the tracker sends will have an app ID field set to “my-app-id”.

If `newTracker` is called multiple times with the same namespace, only the first call is taken into account. 

:::tip For Single Page Apps
Initialize one tracker per initial page load.
:::

The following table shows all the various configuration parameters. Note that these are all optional. In fact, you aren’t required to provide any configuration object at all.

| Property                                                                                                                                                                                      | Description                                                                                          | Default (if applicable) | Type          |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|-------------------------|---------------|
| [`appId`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#setting-application-id)                                                     | Set the application ID.                                                                              |                         | `string`      |
| [`platform`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#setting-application-platform)                                            | Set the application platform.                                                                        | "web"                   | `string` enum |
| [`cookieDomain`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/#cookie-domain)                                                                                                                                                                                | Set the cookie domain.                                                                               |                         |               |
| [`discoverRootDomain`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/#cookie-domain)                                                                                                                                                                          | Automatic discovery and setting of the root domain, to facilitate tracking over multiple subdomains. | true                    | `boolean`     |
| [`cookieName`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/#cookie-name)                                                                                                                                                                                  | Set the cookie name.                                                                                 |                         | `string`      |
| [`cookieSameSite`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/#cookie-samesite-and-secure-attributes)                                                                                                                                                                              | Set the cookie samesite attribute.                                                                   | null                    | `string` enum |
| [`cookieSecure`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/#cookie-samesite-and-secure-attributes)                                                                                                                                                                                | Set the cookie secure attribute.                                                                     | true                    | `boolean`     |
| [`encodeBase64`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent#base64-encoding)                                          | Enable Base64 encoding for JSONs (context entities and custom self-describing events).               | true                    | `boolean`     |
| [`respectDoNotTrack`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/anonymous-tracking/#respecting-do-not-track)                                     | Choose to respect browser Do Not Track option.                                                       | false                   | `boolean`     |
| [`eventMethod`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#network-protocol-and-method)                              | Choose to send events by GET, POST, or Beacon API.                                                       | `post`                   | `string` enum |
| [`bufferSize`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#number-of-events-per-request)                              | How many events to send in one request.                                                              | 1                       | `int`         |
| [`maxPostBytes`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#maximum-payload-size)                                    | Set a limit for the size of one request.                                                             | 40000                   | `int`         |
| [`maxGetBytes`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#maximum-payload-size)                                     | Set a limit for the size of one request.                                                             |                         | `int`         |
| [`postPath`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#custom-post-path)                                            | Change the collector POST path.                                                                      |                       | `string`      |
| [`crossDomainLinker`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cross-domain-tracking/index.md)                                                  | Decorate links for cross-domain tracking.                                                            |                         | `function`    |
| [`cookieLifetime`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/#cookie-lifetime-and-duration)                                                                                                                                                                              | Set the cookie lifetime.                                                                             | 63072000 s (2 years)    | `int`         |
| [`stateStorageStrategy`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/#storage-strategy)                                                                                                                                                                        | How to store tracker state.                                                                          | `cookieAndLocalStorage`                       | `string` enum |
| [`maxLocalStorageQueueSize`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/configuring-cookies/#local-storage-queue-size)                                                                                                                                                                    | How many events to queue in local storage when they are failing to send.                             | 1000                    | `int`         |
| [`resetActivityTrackingOnPageView`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/activity-page-pings/#reset-page-ping-on-page-view) | Choose to reset page ping timers when a page view is tracked.                                        | true                    | `boolean`     |
| [`connectionTimeout`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#connection-timeout)                                 | Set request connection timeout.                                                                      | 5000 ms                 | `int`         |
| [`anonymousTracking`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/anonymous-tracking/index.md)                                                     | Do not track user identifiers.                                                                       | false                   | `boolean`     |
| [`customHeaders`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#custom-request-headers)                                 | Add custom headers to requests.                                                                      |                         | `object`      |
| [`withCredentials`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#disabling-withcredentials-flag)                       | Choose whether to use the `withCredentials` flag in collector requests.                              | true                    | `boolean`     |
| [`contexts`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#auto-tracked-entities)                                                   | Configure context entities to add to all events.                                                     | various                 | `object`      |
| [`retryStatusCodes`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#custom-retry-http-codes)                             | Set HTTP response codes to retry requests on.                                                        |                         | `[int]`       |
| [`dontRetryStatusCodes`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#custom-retry-http-codes)                         | Set HTTP response codes not to retry requests on.                                                    |                         | `[int]`       |
| [`retryFailedRequests`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#retries)                                          | Choose to retry failed requests or not.                                                              | true                    | `boolean`     |
| [`onSessionUpdateCallback`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/session/#on-session-update-callback)                       | A callback to run every time the session updates.                                                    |                         | `function`    |
| [`onRequestSuccess`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#onrequestsuccess-callback)                           | A callback to run every time a request is successfully sent to the collector.                        |                         | `function`    |
| [`onRequestFailure`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/configuring-how-events-sent/#onrequestfailure-callback)                           | A callback to run every time a request fails to send.                                                |                         | `function`    |
| [`preservePageViewIdForUrl`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/page-views/index.md#when-is-the-page-view-id-generated) | Option to change when a new page view ID is generated. Makes it possible to generate a new page view on URL change instead of when tracking a page view, which enables tracking events before the page view event with the same ID. | `false` | `false`, `true`, `full`, `pathname`, `pathnameAndSearch` |

Here is a longer code example in which every tracker configuration parameter is set:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
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
  cookieLifetime: 63072000,
  stateStorageStrategy: 'cookieAndLocalStorage',
  maxLocalStorageQueueSize: 1000,
  resetActivityTrackingOnPageView: true,
  connectionTimeout: 5000,
  anonymousTracking: false,
  // anonymousTracking: { withSessionTracking: true },
  // anonymousTracking: { withSessionTracking: true, withServerAnonymisation: true },
  customHeaders: {}, // Use with caution. Available from v3.2.0+
  withCredentials: true, // Available from v3.2.0+
  contexts: {
    webPage: true, // Default
    session: false, // Adds client session context entity to events, off by default. Available in v3.5+.
    browser: false, // Adds browser context entity to events, off by default. Available in v3.9+.
    performanceTiming: true,
    gaCookies: true,
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
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
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
  cookieLifetime: 63072000,
  stateStorageStrategy: 'cookieAndLocalStorage',
  maxLocalStorageQueueSize: 1000,
  resetActivityTrackingOnPageView: true,
  connectionTimeout: 5000,
  anonymousTracking: false,
  // anonymousTracking: { withSessionTracking: true },
  // anonymousTracking: { withSessionTracking: true, withServerAnonymisation: true },
  customHeaders: {}, // Use with caution. Available from v3.2.0+
  withCredentials: true, // Available from v3.2.0+
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
});
```

  </TabItem>
</Tabs>

You can further extend the tracker functionality by installing plugins. Read more about them [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/index.md).

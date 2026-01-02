---
title: "Initialization and configuration"
date: "2021-03-31"
sidebar_position: 2000
description: "Setup and initialization instructions for Initialization and configuration."
keywords: ["setup", "installation"]
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
  discoverRootDomain: true,
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
  discoverRootDomain: true,
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
| [`appId`](../../tracking-events/index.md#setting-application-id)                                                     | Set the application ID.                                                                              |                         | `string`      |
| [`platform`](../../tracking-events/index.md#setting-application-platform)                                            | Set the application platform.                                                                        | "web"                   | `string` enum |
| [`cookieDomain`](../../cookies-and-local-storage/configuring-cookies/index.md#cookie-domain)                                                                                                                                                                                | Set the cookie domain.                                                                               |                         |               |
| [`discoverRootDomain`](../../cookies-and-local-storage/configuring-cookies/index.md#cookie-domain)                                                                                                                                                                          | Automatic discovery and setting of the root domain, to facilitate tracking over multiple subdomains. | true                    | `boolean`     |
| [`cookieName`](../../cookies-and-local-storage/configuring-cookies/index.md#cookie-name)                                                                                                                                                                                  | Set the cookie name.                                                                                 |                         | `string`      |
| [`cookieSameSite`](../../cookies-and-local-storage/configuring-cookies/index.md#cookie-samesite-and-secure-attributes)                                                                                                                                                                              | Set the cookie samesite attribute.                                                                   | null                    | `string` enum |
| [`cookieSecure`](../../cookies-and-local-storage/configuring-cookies/index.md#cookie-samesite-and-secure-attributes)                                                                                                                                                                                | Set the cookie secure attribute.                                                                     | true                    | `boolean`     |
| [`encodeBase64`](../../configuring-how-events-sent/index.md#base64-encoding)                                          | Enable Base64 encoding for JSONs (context entities and custom self-describing events).               | true                    | `boolean`     |
| [`respectDoNotTrack`](../../anonymous-tracking/index.md#respecting-do-not-track)                                     | Choose to respect browser Do Not Track option.                                                       | false                   | `boolean`     |
| [`eventMethod`](../../configuring-how-events-sent/index.md#network-protocol-and-method)                              | Choose to send events by GET, POST, or Beacon API.                                                       | `post`                   | `string` enum |
| [`bufferSize`](../../configuring-how-events-sent/index.md#number-of-events-per-request)                              | How many events to send in one request.                                                              | 1                       | `int`         |
| [`maxPostBytes`](../../configuring-how-events-sent/index.md#maximum-payload-size)                                    | Set a limit for the size of one request.                                                             | 40000                   | `int`         |
| [`maxGetBytes`](../../configuring-how-events-sent/index.md#maximum-payload-size)                                     | Set a limit for the size of one request.                                                             |                         | `int`         |
| [`postPath`](../../configuring-how-events-sent/index.md#custom-post-path)                                            | Change the collector POST path.                                                                      |                       | `string`      |
| [`crossDomainLinker`](../../cross-domain-tracking/index.md)                                                  | Decorate links for cross-domain tracking.                                                            |                         | `function`    |
| [`cookieLifetime`](../../cookies-and-local-storage/configuring-cookies/index.md#cookie-lifetime-and-duration)                                                                                                                                                                              | Set the cookie lifetime.                                                                             | 63072000 s (2 years)    | `int`         |
| [`stateStorageStrategy`](../../cookies-and-local-storage/configuring-cookies/index.md#storage-strategy)                                                                                                                                                                        | How to store tracker state.                                                                          | `cookieAndLocalStorage`                       | `string` enum |
| [`maxLocalStorageQueueSize`](../../cookies-and-local-storage/configuring-cookies/index.md#local-storage-queue-size)                                                                                                                                                                    | How many events to queue in local storage when they are failing to send.                             | 1000                    | `int`         |
| [`resetActivityTrackingOnPageView`](../../tracking-events/activity-page-pings/index.md#reset-page-ping-on-page-view) | Choose to reset page ping timers when a page view is tracked.                                        | true                    | `boolean`     |
| [`connectionTimeout`](../../configuring-how-events-sent/index.md#connection-timeout)                                 | Set request connection timeout.                                                                      | 5000 ms                 | `int`         |
| [`anonymousTracking`](../../anonymous-tracking/index.md)                                                     | Do not track user identifiers.                                                                       | false                   | `boolean`     |
| [`customHeaders`](../../configuring-how-events-sent/index.md#custom-request-headers)                                 | Add custom headers to requests.                                                                      |                         | `object`      |
| [`withCredentials`](../../configuring-how-events-sent/index.md#disabling-withcredentials-flag)                       | Choose whether to use the `withCredentials` flag in collector requests.                              | true                    | `boolean`     |
| [`contexts`](../../tracking-events/index.md#auto-tracked-entities)                                                   | Configure context entities to add to all events.                                                     | various                 | `object`      |
| [`retryStatusCodes`](../../configuring-how-events-sent/index.md#custom-retry-http-codes)                             | Set HTTP response codes to retry requests on.                                                        |                         | `[int]`       |
| [`dontRetryStatusCodes`](../../configuring-how-events-sent/index.md#custom-retry-http-codes)                         | Set HTTP response codes not to retry requests on.                                                    |                         | `[int]`       |
| [`retryFailedRequests`](../../configuring-how-events-sent/index.md#retries)                                          | Choose to retry failed requests or not.                                                              | true                    | `boolean`     |
| [`onSessionUpdateCallback`](../../tracking-events/session/index.md#on-session-update-callback)                       | A callback to run every time the session updates.                                                    |                         | `function`    |
| [`onRequestSuccess`](../../configuring-how-events-sent/index.md#onrequestsuccess-callback)                           | A callback to run every time a request is successfully sent to the collector.                        |                         | `function`    |
| [`onRequestFailure`](../../configuring-how-events-sent/index.md#onrequestfailure-callback)                           | A callback to run every time a request fails to send.                                                |                         | `function`    |
| [`preservePageViewIdForUrl`](../../tracking-events/page-views/index.md#when-is-the-page-view-id-generated) | Option to change when a new page view ID is generated. Makes it possible to generate a new page view on URL change instead of when tracking a page view, which enables tracking events before the page view event with the same ID. | `false` | `false`, `true`, `full`, `pathname`, `pathnameAndSearch` |

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

You can further extend the tracker functionality by installing plugins. Read more about them [here](../../plugins/index.md).

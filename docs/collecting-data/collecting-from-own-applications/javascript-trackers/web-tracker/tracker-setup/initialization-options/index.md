---
title: "Initialization options"
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

Here is a simple example of how to initialise a tracker:

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

Here is a longer example in which every tracker configuration parameter is set:

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

## All configuration options

The following table shows all the various configuration parameters. Note that these are all optional. In fact, you aren’t required to provide any configuration object at all.

| Property                          | Description                                                                                          | Default (if applicable) | Type          |
|-----------------------------------|------------------------------------------------------------------------------------------------------|-------------------------|---------------|
| `appId`                           | Set the application ID.                                                                              |                         | `string`      |
| `platform`                        | Set the application platform.                                                                        | "web"                   | `string` enum |
| `cookieDomain`                    | Set the cookie domain.                                                                               |                         |               |
| `discoverRootDomain`              | Automatic discovery and setting of the root domain, to facilitate tracking over multiple subdomains. | true                    | `boolean`     |
| `cookieName`                      | Set the cookie name.                                                                                 |                         | `string`      |
| `cookieSameSite`                  | Set the cookie samesite attribute.                                                                   | null                    | `string` enum |
| `cookieSecure`                    | Set the cookie secure attribute.                                                                     | true                    | `boolean`     |
| `encodeBase64`                    | Enable Base64 encoding for JSONs (context entities and custom self-describing events).               | true                    | `boolean`     |
| `respectDoNotTrack`               | Choose to respect browser Do Not Track option.                                                       | false        | `boolean`     |
| `eventMethod`                     | Choose to send events by GET, POST, or Beacon.                                                       | `post`                  | `string` enum |
| `bufferSize`                      | How many events to send in one request.                                                              | 1                       | `int`         |
| `maxPostBytes`                    | Set a limit for the size of one request.                                                             | 40000                   | `int`         |
| `maxGetBytes`                     | Set a limit for the size of one request.                                                             |                         | `int`         |
| `postPath`                        | Change the collector POST path.                                                                      | 1                       | `string`      |
| `crossDomainLinker`               | Decorate links for cross-domain tracking.                                                            |                         | `function`    |
| `cookieLifetime`                  | Set the cookie lifetime.                                                                             | 63072000 s (2 years)    | `int`         |
| `stateStorageStrategy`            | How to store tracker state.                                                                          | 1                       | `string` enum |
| `maxLocalStorageQueueSize`        | How many events to queue in Local Storage when they are failing to send.                             | 1000                    | `int`         |
| `resetActivityTrackingOnPageView` | Choose to reset page ping timers when a page view is tracked.                                        | true                    | `boolean`     |
| `connectionTimeout`               | Set request connection timeout.                                                                      | 5000 ms                 | `int`         |
| `anonymousTracking`               | Do not track user identifiers.                                                                       | false                   | `boolean`     |
| `customHeaders`                   | Add custom headers to requests.                                                                      |                         | `object`      |
| `withCredentials`                 | Choose whether to use the `withCredentials` flag.                                                    | true                    | `boolean`     |
| `contexts`                        | Configure context entities to add to all events.                                                     | various                 | `object`      |
| `retryStatusCodes`                | Set HTTP response codes to retry requests on.                                                        |                         | `[int]`       |
| `dontRetryStatusCodes`            | Set HTTP response codes not to retry requests on.                                                    |                         | `[int]`       |
| `retryFailedRequests`             | Choose to retry failed requests or not.                                                              | true                    | `boolean`     |
| `onSessionUpdateCallback`         | A callback to run every time the session updates.                                                    |                         | `function`    |
| `onRequestSuccess`                | A callback to run every time a request is successfully sent to the collector.                        |                         | `function`    |
| `onRequestFailure`                | A callback to run every time a request fails to send.                                                |                         | `function`    |



## Application ID

Set the application ID using the `appId` field of the configuration object. This will be attached to every event the tracker fires. You can set different application IDs on different parts of your site. You can then distinguish events that occur on different applications by grouping results based on `application_id`.

## Platform

Set the application platform using the `platform` field of the configuration object. This will be attached to every event the tracker fires. Its default value is “web”. For a list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md#application-parameters).




## `onRequestSuccess` callback

:::note
Available from v3.18.1
:::

The `onRequestSuccess` option allows you to supply a callback function to be executed whenever a request is successfully sent to the collector. In practice this means any request which returns a `2xx` status code will trigger this callback.

The callback's signature is:
`(data: EventBatch) => void`
where `EventBatch` can be either:

- `Record<string, unknown>[]` for POST requests
- `string[]` for GET requests

## `onRequestFailure` callback

:::note
Available from v3.18.1
:::

The `onRequestFailure` option allows you to supply a callback function to be executed whenever a request fails to be sent to the collector. This is the inverse of the `onRequestSuccess` callback, so any non `2xx` status code will trigger this callback.

The callback's signature is:
`(data: RequestFailure) => void`
where `RequestFailure` is:

```ts
export type RequestFailure = {
  /** The batch of events that failed to send */
  events: EventBatch;
  /** The status code of the failed request */
  status?: number;
  /** The error message of the failed request */
  message?: string;
  /** Whether the tracker will retry the request */
  willRetry: boolean;
};
```

The format of `EventBatch` is the same as the `onRequestSuccess` callback.

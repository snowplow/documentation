---
title: "Configure how events are sent by the web trackers"
sidebar_label: "Configuring how events are sent"
description: "Configure request methods, payload sizes, retries, and custom headers for event transmission to the collector."
keywords: ["event transmission", "post requests", "get requests", "batch sending", "retry configuration"]
date: "2021-04-07"
sidebar_position: 2750
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

It's possible to add a fine-grained configuration for exactly how the web tracker should track and send events.

## Configuring the request

### Base64 encoding

Context entities and custom self-describing events can be encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the `encodeBase64` field of the [tracker configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

This setting is enabled by default for GET requests. For POST requests, it is disabled by default as it doesn't provide the same benefits and can result in larger payload size and is more difficult to debug.

### Number of events per request

The default `bufferSize` is 1, i.e. an event will be processed into a single request and sent as soon as it is tracked. This can be increased to send events in batches, using the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

The `bufferSize` property is only relevant when making POST requests, [see below](#post-support).

### Maximum payload size

**POST requests**

Because the Snowplow Stream Collector can have a maximum request size, the Tracker limits POST requests to 40000 bytes. If the combined size of the events in `localStorage` is greater than this limit, they will be split into multiple POST requests. You can override this default using a `maxPostBytes` in the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

**GET requests**

By default, there is no limit on the maximum size of GET requests – the tracker will add to queue and try to emit all GET requests irrespective of their size. However (since version 3.4), there is an optional `maxGetBytes` parameter which serves two purposes:

1. It prevents requests over the threshold in bytes to be added to event queue and retried in case sending them is not successful.
2. It sends events over the threshold as individual POST requests (same as for `maxPostBytes`).

The size of GET requests is calculated for their full GET request URL.

**Collector limit**

The Snowplow Stream Collector cannot process requests bigger than 1MB because that is the maximum size of a Kinesis record.

### Custom request headers

From v3.2.0, you are able to set custom headers with an `eventMethod: "post"` and `eventMethod: "get"` (Except for IE9). This functionality should only be used in the case where a Proxy or other Collector type is being used which allows for custom headers to be set on the request.

:::warning
Adding additional headers without returning the appropriate CORS Headers on the OPTIONS request will cause events to fail to send.
:::

```javascript
customHeaders: {
  'Content-Language': 'de-DE, en-CA',
}
```

Set this in the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

### Disabling sending credentials with requests

The `credentials` option in the tracker configuration controls whether cookies are sent with requests to a Snowplow Collector running on a different domain.
The default setting is `include` to always include the cookies.
The setting translates to the `credentials` option in the fetch API, see [the documentation here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials).

```json
credentials: 'omit'
```

Before v4, this configuration was provided using the `withCredentials` flag.

### Sent timestamp for GET events

By default, the tracker sends POST requests. If you update the `eventMethod` to `get`, the tracker will send events using GET requests. These events will contain a `stm` [timestamp parameter](/docs/events/timestamps/index.md) recording when the event was sent.

If you need to make requests as small as possible, you can omit the `stm` parameter by setting the `useStm` [configuration option](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md) to `false`. This option was introduced in version 2.10.1. It's a niche parameter that you should only use if you have a specific reason to do so.

POST requests always include the sent timestamp.

## Network protocol and method

### Setting the request protocol

Normally the protocol (http or https) used by the Tracker to send events to a collector is the same as the protocol of the current page. You can force the tracker to use https by prefixing the collector endpoint with the protocol. For example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
newTracker('sp', 'https://{{collector_url_here}}', {
  appId: 'my-app-id'
}
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
newTracker('sp', 'https://{{collector_url_here}}', {
  appId: 'my-app-id'
}
```

  </TabItem>
</Tabs>


### GET support

By default, events are sent by GET. This can be changed using the `eventMethod` field of the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

### POST support

If you set the `eventMethod` field of the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md) to `post`, the tracker will send events using POST requests rather than GET requests. In browsers which do not support cross-origin XMLHttpRequests (e.g. IE9), the tracker will fall back to using GET.

`eventMethod` defaults to `post`. `get` can be used for GET requests.

The main advantage of POST requests is that they circumvent Internet Explorer’s maximum URL length of 2083 characters by storing the event data in the body of the request rather than the querystring.

You can also batch events sent by POST by setting a numeric `bufferSize` field in the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md). This is the number of events to buffer before sending them all in a single POST. If the user navigates away from the page while the buffer is only partially full, the tracker will attempt to send all stored events immediately, but this often doesn’t happen before the page unloads. Normally the tracker will store unsent events in `localStorage`, meaning that unsent events will be resent when the user next visits a page on the same domain. The `bufferSize` defaults to 1, meaning events are sent as soon as they are created.

We recommend leaving the `bufferSize` as the default value of 1. This ensure that events are sent as they are created, and reduces the chance of events being unsent and left in local storage, if a user closes their browser before a flush can occur (which happens on page visibility changing).

If you have set `bufferSize` to greater than 1, you can flush the buffer using the `flushBuffer` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('flushBuffer');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
flushBuffer();
```

  </TabItem>
</Tabs>

For instance, if you wish to send several events at once, you might make the API calls to create the events and store them and then and call `flushBuffer` afterwards to ensure they are all sent before the user leaves the page.

Note that if `localStorage` is inaccessible or you are not using it to store data, the buffer size will always be 1 to prevent losing events when the user leaves the page.

### `keepalive` option for Collector requests

The keepalive feature in the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) indicates that the request should be allowed to outlive the webpage that initiated it.
It enables requests to the Snowplow Collector to complete even if the page is closed or navigated away from.

This option is disabled by default.

:::note
Browsers put a limit on keepalive requests of 64KB.
You may control the size of the individual POST requests using the `maxPostBytes` option.
But in case of multiple keepalive requests in parallel (may happen in case of multiple trackers), the limit is shared between them and may cause the requests to fail.
:::

```ts
let tracker = newTracker("...", "...", {
    // ...
    keepalive: true
});
```

### Custom POST path

The POST path that is used to send POST requests to a collector can be changed with the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md) value `postPath`.

`postPath` defaults to the standard path: `/com.snowplowanalytics.snowplow/tp2`

```mdx-code-block
import PostPath from "@site/docs/reusable/trackers-post-path-note/_index.md"

<PostPath/>
```

## Retries

Unsuccessful requests are retried by default: the tracker retries on all 3xx, 4xx, and 5xx status codes except for 400, 401, 403, 410, and 422. Events in failed requests that are not retried are lost.

Starting with version 3.17 of the tracker, it is also possible to completely disable retry functionality, using the `retryFailedRequests` boolean option in the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md). This option takes precedence over `retryStatusCodes` and `dontRetryStatusCodes` (see below).

### Connection timeout

When events are sent using POST or GET, they are given 5 seconds to complete by default. GET requests having a timeout is only available in 2.15.0.

`_connectionTimeout_: 5000`

This value is configurable when initialising the tracker ([configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md)) and is specified in milliseconds. The value specified here will effect both POST and GET requests.

**Warning:** Setting this value too low may prevent events from successfully sending to your collector or the tracker may retry to send events that have already arrived at the collector, as the tracker will assume the request failed on timeout, leading to duplicate events in the warehouse. **We recommend 5000 milliseconds as the minimum value and 10000 as the maximum value.**

### Custom retry HTTP codes

The tracker provides a retry functionality that sends the same events repeatedly in case GET or POST requests to the Collector fail. This may happen due to connection issues or a non-successful HTTP status code in Collector response.

Prior to version 3.5 of the tracker, requests receiving all 4xx and 5xx HTTP status codes in Collector response were retried. Since version 3.5, the behavior changed and became customizable:

By default, the tracker retries on all 3xx, 4xx, and 5xx status codes except for 400, 401, 403, 410, and 422. The set of status codes for which events should be retried or not is customizable. You can make use of the `retryStatusCodes` and `dontRetryStatusCodes` lists to specify them ([configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md)). Retry behavior can only be configured for non-successful status codes (i.e., >= 300).

```json
retryStatusCodes: [403], // override default behavior and retry on 403
dontRetryStatusCodes: [418] // force retry on 418
```

Please note that not retrying sending events to the Collector means that the events will be dropped when they fail to be sent. Take caution when choosing the `dontRetryStatusCodes`.

### Event queue behavior

The `useLocalStorage` [configuration option](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md) refers to event queue behavior. It was introduced in version 4.0.0. If you set it to `false`, events will be stored in memory only. If the page closes before events are sent, they'll be lost.

This is a **risky** setting that you should only use if you have a specific reason, such as compliance or privacy.

Previous versions of the tracker had a `useLocalStorage` option that referred to state storage. In version 3 [we deprecated this option](/docs/sources/web-trackers/migration-guides/v2-to-v3-migration-guide/index.md) in favor of `stateStorageStrategy`. If you're upgrading from version 2 and were using `useLocalStorage`, switch to `stateStorageStrategy: 'localStorage'` if don't want to store state in cookies, or use the default `cookieAndLocalStorage` behavior.

## Callbacks

Provide callbacks within the [configuration object](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md).

### `onRequestSuccess` callback

:::note
Available from v3.18.1
:::

The `onRequestSuccess` option allows you to supply a callback function to be executed whenever a request is successfully sent to the collector. In practice this means any request which returns a `2xx` status code will trigger this callback.

The callback's signature is:
`(data: EventBatch) => void`
where `EventBatch` can be either:

- `Record<string, unknown>[]` for POST requests
- `string[]` for GET requests

### `onRequestFailure` callback

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

## Custom tracker components and configuration

### Custom event store

Before events are sent to the Snowplow Collector, they are queued in an event store.
This ensures that events can be batched together and retried in case of network failures.

By default, the tracker uses the browser local storage for the event store implementation.
It is possible to use an in memory event store or provide a custom event store implementation by setting the `eventStore` configuration option.

```ts
import { newInMemoryEventStore } from '@snowplow/tracker-core';

let tracker = newTracker("...", "...", {
    // ...
    eventStore: newInMemoryEventStore({
        maxSize: 1000
    })
});
```

### Custom fetch function

The tracker provides an option to override the [fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) used to make requests to the Snowplow Collector.
It may be useful in unit tests to test that requests are made without actually making them.
You may also want to wrap the fetch function to modify or monitor the requests.

```ts
let tracker = newTracker("...", "...", {
    // ...
    customFetch: (input: RequestInfo, init?: RequestInit) => fetch(input, init)
});
```

### Synchronous cookie writes

Since v4 of the tracker, the tracker updates the user and session information in cookies asynchronously from the track calls (e.g., `trackPageView`).
The cookies are updated within 10ms of the track call and the read cookie values are cached for 50ms.
This strategy makes the track function take less time and avoid blocking the main thread of the app.

It might be desirable to update cookies synchronously.
This can be useful for testing purposes to ensure that the cookies are written before the test continues.
It also has the benefit of making sure that the cookie is correctly set before session information is used in events.
The downside is that it is slower and blocks the main thread.

To configure synchronous cookie updates, use the `synchronousCookieWrite` configuration option:

```ts
let tracker = newTracker("...", "...", {
    // ...
    synchronousCookieWrite: true
});
```

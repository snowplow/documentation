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

We will now go through the various configuration parameters. Note that these are all optional. In fact, you aren’t required to provide any configuration object at all.

## Application ID

Set the application ID using the `appId` field of the configuration object. This will be attached to every event the tracker fires. You can set different application IDs on different parts of your site. You can then distinguish events that occur on different applications by grouping results based on `application_id`.

## Platform

Set the application platform using the `platform` field of the configuration object. This will be attached to every event the tracker fires. Its default value is “web”. For a list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md#application-parameters).

## Cookie domain

If your website spans multiple subdomains e.g.

- www.mysite.com
- blog.mysite.com
- application.mysite.com

You will want to track user behavior across all those subdomains, rather than within each individually. As a result, it is important that the domain for your first party cookies is set to ‘.mysite.com’ rather than ‘www.mysite.com’. By doing so, any values that are stored on the cookie on one of subdomain will be accessible on all the others.

It is recommended that you [enable automatic discovery and setting of the root domain](#automatically-discover-and-set-the-root-domain).

Otherwise, set the cookie domain for the tracker instance using the `cookieDomain` field of the configuration object. If this field is not set, the cookies will not be given a domain.

**WARNING**: _Changing the cookie domain will reset all existing cookies. As a result, it might be a major one-time disruption to data analytics because all visitors to the website will receive a new `domain_userid`._

## Cookie name

Set the cookie name for the tracker instance using the `cookieName` field of the configuration object. The default is “_sp_“. Snowplow uses two cookies, a domain cookie and a session cookie. In the default case, their names are “_sp_id” and “_sp_ses” respectively. If you are upgrading from an earlier version of Snowplow, you should use the default cookie name so that the cookies set by the earlier version are still remembered. Otherwise you should provide a new name to prevent clashes with other Snowplow users on the same page.

Once set, you can retrieve a cookie name thanks to the `getCookieName(basename)` method where basename is id or ses for the domain and session cookie respectively. As an example, you can retrieve the complete name of the domain cookie with `getCookieName('id')`.

## Cookie samesite attribute

Set the cookie samesite attribute for the tracker instance using the `cookieSameSite` field of the configuration object. The default is “None” for backward compatibility reasons, however ‘Lax’ is likely a better option for most use cases given the reasons below. Valid values are "Strict", "Lax", "None" or `null`. `null` will not set the SameSite attribute.

It is recommended to set either "None" or "Lax". You must use "None" if using the tracker in a third party iframe. "Lax" is good in all other cases and must be used if not setting Secure to true.

Safari 12 Issue with SameSite cookies

It's been noted that Safari 12 doesn't persist cookies with `SameSite: None` as expected which can lead to rotation of the `domain_userid` from users using this browser. You should switch to `cookieSameSite: 'Lax'` in your tracker configuration to solve this, unless you are tracking inside a third party iframe.

## Cookie secure attribute

Set the cookie secure attribute for the tracker instance using the `cookieSecure` field of the configuration object. The default is "true". Valid values are "true" or "false".

It is recommended to set this to "true". This must be set to "false" if using the tracker on non-secure HTTP.

## Base 64 encoding

By default, self-describing events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the `encodeBase64` field of the configuration object.

## Respecting Do Not Track

Most browsers have a Do Not Track option which allows users to express a preference not to be tracked. You can respect that preference by setting the `respectDoNotTrack` field of the configuration object to `true`. This prevents cookies from being sent and events from being fired.

## Opt-out cookie

It is possible to set an opt-out cookie in order not to track anything similarly to Do Not Track through `setOptOutCookie('opt-out');` where ‘opt-out’ is the name of your opt-out cookie. If this cookie is set, cookies won’t be stored and events won’t be fired.


## Setting the event request protocol

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

## Session cookie duration

Whenever an event fires, the Tracker creates a session cookie. If the cookie didn’t previously exist, the Tracker interprets this as the start of a new session.

By default the session cookie expires after 30 minutes. This means that a user leaving the site and returning in under 30 minutes does not change the session. You can override this default by setting `sessionCookieTimeout` to a duration (in seconds) in the configuration object. For example,

```json
{
  ...
  sessionCookieTimeout: 3600
  ...
}
```

would set the session cookie lifespan to an hour.

## Storage strategy

Three strategies are made available to store the Tracker’s state: cookies, local storage or no storage at all. You can set the strategy with the help of the `stateStorageStrategy` parameter in the configuration object to “cookieAndLocalStorage” (the default), “cookie”, “localStorage” or “none” respectively.

When choosing local storage, the Tracker will additionally store events in local storage before sending them so that they can be recovered if the user leaves the page before they are sent.

See also [How the Tracker uses `localStorage`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/index.md) for an explanation of how the tracker can later recover and send unsent events.


## POST support

If you set the `eventMethod` field of the configuration object to `post`, the tracker will send events using POST requests rather than GET requests. In browsers which do not support cross-origin XMLHttpRequests (e.g. IE9), the tracker will fall back to using GET.

`eventMethod` defaults to `post`, other options available are `get` for GET requests and `beacon` for using the Beacon API (**Note**: Beacon support is not available and/or unreliable in some browsers, in these cases the tracker will fallback to POST).

The main advantage of POST requests is that they circumvent Internet Explorer’s maximum URL length of 2083 characters by storing the event data in the body of the request rather than the querystring.

You can also batch events sent by POST by setting a numeric `bufferSize` field in the configuration object. This is the number of events to buffer before sending them all in a single POST. If the user navigates away from the page while the buffer is only partially full, the tracker will attempt to send all stored events immediately, but this often doesn’t happen before the page unloads. Normally the tracker will store unsent events in `localStorage`, meaning that unsent events will be resent when the user next visits a page on the same domain. The `bufferSize` defaults to 1, meaning events are sent as soon as they are created.

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

## Beacon API support

The Beacon interface is used to schedule asynchronous and non-blocking requests to a web server. This will allow events to be sent even after a webpage is closed. This browser interface can be used to send events by setting the `eventMethod` field in the configuration object to `beacon`.

Using Beacon will store a Session Cookie in the users browser for reliability reasons, and will always send the first request as a standard POST. This prevents data loss in a number of older browsers with broken Beacon implementations.

Note: the Beacon API makes POST requests.

More information and documentation about the Beacon API can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API).

## POST path

The POST path that is used to send POST requests to a collector can be change with the configuration object value `postPath`.

`postPath` defaults to the standard path: `/com.snowplowanalytics.snowplow/tp2`

```mdx-code-block
import PostPath from "@site/docs/reusable/trackers-post-path-note/_index.md"

<PostPath/>
```

## Cross-domain tracking
```mdx-code-block
import CrossDomain from "@site/docs/reusable/javascript-tracker-cross-domain/_index.md"
```

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

<CrossDomain lang="javascript" />

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

<CrossDomain lang="browser" />

  </TabItem>
</Tabs>

## Maximum payload size in bytes

**POST requests**

Because the Snowplow Stream Collector can have a maximum request size, the Tracker limits POST requests to 40000 bytes. If the combined size of the events in `localStorage` is greater than this limit, they will be split into multiple POST requests. You can override this default using a `maxPostBytes` in the configuration object.

**GET requests**

By default, there is no limit on the maximum size of GET requests – the tracker will add to queue and try to emit all GET requests irrespective of their size. However (since version 3.4), there is an optional `maxGetBytes` parameter which serves two purposes:

1. It prevents requests over the threshold in bytes to be added to event queue and retried in case sending them is not successful.
2. It sends events over the threshold as individual POST requests (same as for `maxPostBytes`).

The size of GET requests is calculated for their full GET request URL.

**Collector limit**

The Snowplow Stream Collector cannot process requests bigger than 1MB because that is the maximum size of a Kinesis record.

## Automatically discover and set the root domain

If the optional `discoverRootDomain` field of the configuration object is set to `true`, the Tracker automatically discovers and sets the `configCookieDomain` value to the root domain.

**NOTE**: If you have been setting this manually please note that the automatic detection does not prepend a ‘.’ to the domain. For example a root domain of “.mydomain.com” would become “mydomain.com”. This is because the library we use for setting cookies doesn’t care about the difference.

**This will then result in a different domain hash, so we recommend that if you have been setting this manually with a leading ‘.’ to continue to do so manually.**

## Cookies lifetime

Whenever tracker initialized on your domain – it will set domain-specific visitor’s cookies. By default, these cookies will be active for 2 years. You can change this duration using `cookieLifetime` configuration object parameter or `setVisitorCookieTimeout` method.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newTracker', 'cf', '{{COLLECTOR_URL}}', {
  cookieLifetime: 86400 * 31,
});
```

or

```javascript
snowplow('setVisitorCookieTimeout', 86400 * 30);  // 30 days
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
newTracker('cf', '{{COLLECTOR_URL}}', {
  cookieLifetime: 86400 * 31,
});
```

or

```javascript
setVisitorCookieTimeout(86400 * 30);  // 30 days
```

  </TabItem>
</Tabs>

If `cookieLifetime` is set to `0`, the cookie will expire at the end of the session (when the browser closes). If set to `-1`, the first-party cookies will be disabled.

## Limiting Local Storage queue size

Because most browsers limit Local Storage to around 5mb per site, you may want to limit the number of events the tracker will queue in local storage if they fail to send. The default is a max queue size of 1000, but you may wish to reduce this if your web application also makes use local storage. To do so, you should set the optional `maxLocalStorageQueueSize` field of the configuration object is set to your desired value (e.g. 500).

## Reset Page Ping on Page View

By default the tracker will reset the Page Ping timers, which were configured when `enableActivityTracking` is called, as well as reset the attached Page View contexts on all future Page Pings when a new `trackPageView` event occurs. This is enabled by default as of 2.13.0 and is particularly useful for Single Page Applications (SPA), if you previously relied on this behavior, you can disable this functionality by specifying `resetActivityTrackingOnPageView: false` in the configuration object on tracker initialisation.

## Connection timeout

When events are sent using POST or GET, they are given 5 seconds to complete by default. GET requests having a timeout is only available in 2.15.0.

`_connectionTimeout_: 5000`

This value is configurable when initialising the tracker and is specified in milliseconds. The value specified here will effect both POST and GET requests.

**Warning:** Setting this value too low may prevent events from successfully sending to your collector or the tracker may retry to send events that have already arrived at the collector, as the tracker will assume the request failed on timeout, leading to duplicate events in the warehouse. **We recommend 5000 milliseconds as the minimum value and 10000 as the maximum value.**

## Custom header values

From v3.2.0, you are able to set custom headers with an `eventMethod: "post"` and `eventMethod: "get"` (Except for IE9). This functionality should only be used in the case where a Proxy or other Collector type is being used which allows for custom headers to be set on the request.

:::caution
Adding additional headers without returning the appropriate CORS Headers on the OPTIONS request will cause events to fail to send.
:::

```javascript
customHeaders: {
  'Content-Language': 'de-DE, en-CA',
}
```

## Disabling withCredentials flag

From v3.2.0, it's now possible to turn off the `withCredentials` flag on all requests to the collector. The default value is `true` which sets `withCredentials` to `true` on requests. Disabling this flag will have impact when using `eventMethod: "post"` and `eventMethod: "get"`. This flag has no effect on same site requests, but disabling it will prevent cookies being sent with requests to a Snowplow Collector running on a different domain. You can read more about this flag at [MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials).

```json
withCredentials: false
```

## Custom retry HTTP status codes

The tracker provides a retry functionality that sends the same events repeatedly in case GET or POST requests to the Collector fail. This may happen due to connection issues or a non-successful HTTP status code in Collector response.

Prior to version 3.5 of the tracker, requests receiving all 4xx and 5xx HTTP status codes in Collector response were retried. Since version 3.5, the behavior changed and became customizable:

By default, the tracker retries on all 3xx, 4xx, and 5xx status codes except for 400, 401, 403, 410, and 422. The set of status codes for which events should be retried or not is customizable. You can make use of the `retryStatusCodes` and `dontRetryStatusCodes` lists to specify them. Retry behavior can only be configured for non-successful status codes (i.e., >= 300).

```json
retryStatusCodes: [403], // override default behavior and retry on 403
dontRetryStatusCodes: [418] // force retry on 418
```

Please note that not retrying sending events to the Collector means that the events will be dropped when they fail to be sent. Take caution when choosing the `dontRetryStatusCodes`.

Starting with version 3.17 of the tracker, it is also possible to completely disable retry functionality, using the `retryFailedRequests` boolean option. This option takes precedence over `retryStatusCodes` and `dontRetryStatusCodes`.


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

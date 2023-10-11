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
  onSessionUpdateCallback: function(clientSession) { }, // Allows the addition of a callback, whenever a new session is generated. Available in v3.11+.
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
  onSessionUpdateCallback: function(clientSession) { }, // Allows the addition of a callback, whenever a new session is generated. Available in v3.11+.
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

## Anonymous tracking

The Snowplow JavaScript tracker offers two techniques where tracking can be done anonymously. This means that no user identifiers are sent to the Snowplow Collector. By default `anonymousTracking: false`.

Recommended configurations when using `anonymousTracking`:

```javascript
anonymousTracking: true, 
stateStorageStrategy: 'cookieAndLocalStorage'
```

or

```javascript
anonymousTracking: { withSessionTracking: true },
stateStorageStrategy: 'cookieAndLocalStorage'
```

or for a completely cookieless experience (from JavaScript Tracker 2.17.0+)

```javascript
anonymousTracking: { withServerAnonymisation: true },
stateStorageStrategy: 'none',
eventMethod: 'post'
```

### Client anonymous tracking

`anonymousTracking: true`

This mode will no longer track any user identifiers or session information. Similar in behavior to setting `stateStorageStrategy: 'none'`, as it will store no values in cookies or localStorage, however by using `anonymousTracking` you can toggle this behavior on and off (useful for allowing events to be sent without user identifiers until cookie banners have been accepted).

Setting `stateStorageStrategy` to `cookieAndLocalStorage` or `localStorage` also allows for event buffering to continue working whilst not sending user information when `anonymousTracking` is enabled.

Anonymous tracking can be toggled on and off. The methods to control this behavior are described [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/additional-options/index.md).

### Full anonymous/cookieless tracking

`anonymousTracking: { withServerAnonymisation: true }`

Server Anonymisation requires the Snowplow Stream Collector v2.1.0+. Using a lower version will cause events to fail to send until Server Anonymisation is disabled.

Server Anonymisation will not work when the tracker is initialized with `eventMethod: 'beacon'` as it requires additional custom headers which beacon does not support.

This mode will no longer track any user identifiers or session information, and will additionally prevent the Snowplow Collector from generating a `network_userid` cookie and capturing the users IP address. The same behavior described for above for Client side Anonymous tracking also applies.

Setting `stateStorageStrategy` to `cookieAndLocalStorage` or `localStorage` also allows for event buffering to continue working whilst not sending user information when `anonymousTracking` is enabled. However for an experience that doesn't use any browser storage (cookieless), set `stateStorageStrategy` to `none`. This can be later toggled on, once a user accepts a cookie policy.

Anonymous tracking can be toggled on and off. The methods to control this behavior are described [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/additional-options/index.md).

### Anonymous session tracking

`anonymousTracking: { withSessionTracking: true }`

This mode will continue to track session information in the client side but will track no user identifiers. To achieve this, the tracker will use Cookies or Local Storage. For session tracking, `stateStorageStrategy` must be either `cookieAndLocalStorage` (default), `localStorage` or `cookie`. If this feature is enabled and the storage strategy is not appropriate, then full anonymous tracking will occur.

The Snowplow JavaScript Tracker performs sessionization client side. This allows anonymous session tracking to be done using client side storage without sending any user identifier fields to the collector.

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

## Adding predefined contexts

The JavaScript Tracker comes with many predefined context entities which you can automatically add to every event you send. To enable them, simply add them to the `contexts` field of the configuration object as above.

### webPage context

When the JavaScript Tracker loads on a page, it generates a new page view UUID. If the webPage context is enabled (default), then a context containing this UUID is attached to every page view.

Enabled by default

From v3 of the JavaScript Tracker, the webPage context is enabled by default. You can disable it if you don't require it but we advise you leave this enabled so you can use the [Snowplow Web Data Model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md).

### session context

If this context is enabled, the JavaScript tracker will add a context entity to events with information about the current session. The context entity repeats some of the session information stored in canonical event properties (e.g., `domain_userid`, `domain_sessionid`), but also adds new information. It adds a reference to the previous session (`previousSessionId`) and first event in the current session (`firstEventId`, `firstEventTimestamp`). It also adds an index of the event in the session useful for ordering events as they were tracked (`eventIndex`).

Anonymous tracking has to be disabled for the session context entities to be added to events.

The [`client_session`](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) context entity consists of the following properties:

| Attribute             | Description                                                                                                   | Required? |
|-----------------------|---------------------------------------------------------------------------------------------------------------|-----------|
| `userId`              | An identifier for the user of the session (same as `domain_userid`).                                          | Yes       |
| `sessionId`           | An identifier (UUID) for the session (same as `domain_sessionid`).                                            | Yes       |
| `sessionIndex`        | The index of the current session for this user (same as `domain_sessionidx`).                                 | Yes       |
| `eventIndex`          | Optional index of the current event in the session. Signifies the order of events in which they were tracked. | No        |
| `previousSessionId`   | The previous session identifier (UUID) for this user.                                                         | No        |
| `storageMechanism`    | The mechanism that the session information has been stored on the device.                                     | Yes       |
| `firstEventId`        | The optional identifier (UUID) of the first event id for this session.                                        | No        |
| `firstEventTimestamp` | Optional date-time timestamp of when the first event in the session was tracked.                              | No        |

:::note
Please note that the session context entity is only available since version 3.5 of the tracker.
:::

### browser context

The [browser](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema) context entity consists of the following properties:

| Attribute | Description | Required? |
| : ------: | :--------: | :-----: |
| `viewport` | Viewport dimensions of the browser. Arrives in the form of WidthxHeight e.g. 1200x900. | Yes  |
| `documentSize` | Document dimensions. Arrives in the form of WidthxHeight e.g. 1200x900. | Yes  |
| `resolution` | Device native resolution. Arrives in the form of WidthxHeight e.g. 1200x900. | Yes |
| `colorDepth` | The number of bits allocated to colors for a pixel in the output device, excluding the alpha channel. | Yes |
| `devicePixelRatio` | Ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device. | No  |
| `cookiesEnabled` | Indicates whether cookies are enabled or not. More info and caveats at the official [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled). | Yes |
| `online` | Returns the online status of the browser. Important caveats are described in [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine). | Yes |
| `browserLanguage` | The preferred language of the user, usually the language of the browser UI. Defined in [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646). | No  |
| `documentLanguage` | The language of the HTML document. Defined in [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646). | No  |
| `webdriver` | Indicates whether the user agent is controlled by automation. | No  |
| `deviceMemory` | Approximate amount of device memory in gigabytes. | No  |
| `hardwareConcurrency` | Number of logical processors available to run threads on the user's computer. | No  |
| `tabId` | A UUID identifier for the client browser tab the event is sent from. | No  |

:::note
Please note that the browser context entity is only available since version 3.9 of the tracker.
:::

### optimizelyXSummary context

Support for OptimizelyX has been introduced in the tracker, you can have a look at the JsonSchema in [com.optimizely.optimizelyx/summary/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.optimizely.optimizelyx/summary/jsonschema/1-0-0) to see what is being captured.

If you’re planning on leveraging the context’s variation names, you’ll have to untick ‘Mask descriptive names in project code and third-party integrations’ in the OptimizelyX menu -> Settings -> Privacy. Otherwise, all variation names will be `null`.

### Other contexts

There are many other context entities which can be added to your tracking, which are available as [plugins](https://github.com/snowplow/snowplow-javascript-tracker/tree/release/3.0.0/plugins).

## JavaScript tracker-specific contexts

The following context entities are only available as configuration options for the JavaScript tracker, not the Browser tracker.
### performanceTiming context

If this context is enabled, the JavaScript Tracker will use the create a context JSON from the `window.performance.timing` object, along with the Chrome `firstPaintTime` field (renamed to `chromeFirstPaint`) if it exists. This data can be used to calculate page performance metrics.

Note that if you fire a page view event as soon as the page loads, the `domComplete`, `loadEventStart`, `loadEventEnd`, and `chromeFirstPaint` metrics in the Navigation Timing API may be set to zero. This is because those properties are only known once all scripts on the page have finished executing. 

<details>
  <summary>Advanced PerformanceTiming usage</summary>
  The `domComplete`, `loadEventStart`, and `loadEventEnd` metrics in the NavigationTiming API are set to 0 until after every script on the page has finished executing, including sp.js. This means that the corresponding fields in the PerformanceTiming reported by the tracker will be 0.

  To get around this limitation, you can wrap all Snowplow code in a `setTimeout` call:

  ```javascript
  setTimeout(function () {

  // Load Snowplow and call tracking methods here

  }, 0);
  ```

  This delays its execution until after those NavigationTiming fields are set.

</details>

Additionally the `redirectStart`, `redirectEnd`, and `secureConnectionStart` are set to 0 if there is no redirect or a secure connection is not requested.

For more information on the Navigation Timing API, see [the specification](http://www.w3.org/TR/2012/REC-navigation-timing-20121217/#sec-window.performance-attribute).

### gaCookies context

If this context is enabled, the JavaScript Tracker will look for Google Analytics cookies (specifically the `__utma`, `__utmb`, `__utmc`, `__utmv`, `__utmz`, and `_ga` cookies) and combine their values into a JSON which gets sent with every event.

### clientHints context

If this context is enabled, the JavaScript Tracker will capture the Client Hints data made available in the browser. See [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH#Browser_compatibility) for browser support.

This is useful data to capture as browsers are moving away from high entropy User Agent strings. Client Hints offer useful information to understand browser usage without the potential to infringe on a users privacy as is often the case with the User Agent string.

This context be enabled in two ways:

1. `clientHints: true`
    - This will capture the "basic" client hints
2. `clientHints: { includeHighEntropy: true }`
    - This will capture the "basic" client hints as well as hints that are deemed "High Entropy" and could be used to fingerprint users. Browsers may choose to prompt the user before making this data available.

To see what will be captured please see the JsonSchema file [org.ietf/http_client_hints/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/org.ietf/http_client_hints/jsonschema/1-0-0).

### geolocation context

If this context is enabled, the JavaScript Tracker will attempt to create a context from the visitor’s geolocation information. If the visitor has not already given or denied the website permission to use their geolocation information, a prompt will appear. If they give permission, then all events from that moment on will include their geolocation information.

##### `enableGeolocationContext`

If the geolocation context isn't enabled at tracker initialization, then it can be enabled at a later time by calling `enableGeolocationContext`. This is useful if you have other areas of your site where you require requesting geolocation access, as you can defer enabling this on your Snowplow events until you have permission to read the users geolocation for your other use case.

For more information on the geolocation API, see [the specification](http://dev.w3.org/geo/api/spec-source.html).

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

## On session update callback

The `onSessionUpdateCallback` option, allows you to supply a callback function to be executed whenever a new session is generated on the tracker.

The callback's signature is:
`(clientSession: ClientSession) => void`
where clientSession includes the same values as you would expect on the [`client_session`](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) context.

_Note:_ The callback is **not** called whenever a session is expired, but only when a new one is generated.

:::note
Please note that the session context entity is only available since version 3.11 of the tracker.
:::

---
title: "Initialization options"
sidebar_position: 10
---

_This page refers to version 2.14.0+ of the Snowplow JavaScript Tracker._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v1) for the corresponding documentation for version 1._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.0) for the corresponding documentation for version 2.0 and 2.1.1._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.2) for the corresponding documentation for version 2.2.2._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.3) for the corresponding documentation for version 2.3.0._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.4) for the corresponding documentation for version 2.4.3._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.5) for the corresponding documentation for version 2.5.3._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.6) for the corresponding documentation for version 2.6.2._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.7) for the corresponding documentation for version 2.7.2._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.8) for the corresponding documentation for version 2.8.2._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.9) for the corresponding documentation for version 2.9.0._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.10.0) for the corresponding documentation for version 2.10.0._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.11) for the corresponding documentation for version 2.11.0._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.12) for the corresponding documentation for version 2.12.0._

_Click [here](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker-v2.13) for the corresponding documentation for version 2.13.0._

```mdx-code-block
import DeprecatedV2 from "@site/docs/reusable/javascript-tracker-v2-deprecation/_index.md"
```

[![](https://img.shields.io/github/v/release/snowplow/sp-js-assets?sort=semver&style=flat)](https://github.com/snowplow/snowplow-javascript-tracker/releases)


<DeprecatedV2/>

Tracker initialization is started by calling the `"newTracker"` function and takes three arguments:

1. The tracker namespace
2. The collector endpoint
3. An optional configuration object containing other settings

Here is a simple example of how to initialise a tracker:

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  discoverRootDomain: true,
  cookieSameSite: 'Lax', // Recommended
  contexts: {
    webPage: true
  }
});
```

The tracker will be named “sp” and will send events to the a collector url you specify by replacing `{{collector_url_here}}`. The final argument is the configuration object. Here it is just used to set the app ID and the common webPage context for each event. Each event the tracker sends will have an app ID field set to “my-app-id”.

Here is a longer example in which every tracker configuration parameter is set:

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
  pageUnloadTimer: 500,
  forceSecureTracker: false,
  eventMethod: 'post',
  bufferSize: 1,
  maxPostBytes: 40000,
  postPath: '/custom/path',
  crossDomainLinker: function (linkElement) {
    return (linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink');
  },
  cookieLifetime: 63072000,
  stateStorageStrategy: 'cookieAndLocalStorage',
  maxLocalStorageQueueSize: 1000,
  resetActivityTrackingOnPageView: true,
  connectionTimeout: 5000, // Available from 2.15.0
  skippedBrowserFeatures: [], // Available from 2.15.0
  anonymousTracking: false, // Available from 2.15.0
  // anonymousTracking: { withSessionTracking: true } // Available from 2.15.0
  // anonymousTracking: { withSessionTracking: true, withServerAnonymisation: true } // Available from 2.17.0
  contexts: {
    webPage: true,
    performanceTiming: true,
    gaCookies: true,
    geolocation: false,
    clientHints: true, // Available from 2.15.0
    // clientHints: { includeHighEntropy: true } // Optional
  }
});
```

We will now go through the various configuration parameters. Note that these are all optional. In fact, you aren’t required to provide any configuration object at all.

#### Setting the application ID

Set the application ID using the `appId` field of the configuration object. This will be attached to every event the tracker fires. You can set different application IDs on different parts of your site. You can then distinguish events that occur on different applications by grouping results based on `application_id`.

#### Setting the platform

Set the application platform using the `platform` field of the configuration object. This will be attached to every event the tracker fires. Its default value is “web”. For a list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md#application-parameters).

#### Configuring the cookie domain

If your website spans multiple subdomains e.g.

- www.mysite.com
- blog.mysite.com
- application.mysite.com

You will want to track user behavior across all those subdomains, rather than within each individually. As a result, it is important that the domain for your first party cookies is set to ‘.mysite.com’ rather than ‘www.mysite.com’. By doing so, any values that are stored on the cookie on one of subdomain will be accessible on all the others.

It is recommended that you [enable automatic discovery and setting of the root domain](#automatically-discover-and-set-the-root-domain).

Otherwise, set the cookie domain for the tracker instance using the `cookieDomain` field of the configuration object. If this field is not set, the cookies will not be given a domain.

**WARNING**: _Changing the cookie domain will reset all existing cookies. As a result, it might be a major one-time disruption to data analytics because all visitors to the website will receive a new `domain_userid`._

#### Configuring the cookie name

Set the cookie name for the tracker instance using the `cookieName` field of the configuration object. The default is “_sp_“. Snowplow uses two cookies, a domain cookie and a session cookie. In the default case, their names are “_sp_id” and “_sp_ses” respectively. If you are upgrading from an earlier version of Snowplow, you should use the default cookie name so that the cookies set by the earlier version are still remembered. Otherwise you should provide a new name to prevent clashes with other Snowplow users on the same page.

Once set, you can retrieve a cookie name thanks to the `getCookieName(basename)` method where basename is id or ses for the domain and session cookie respectively. As an example, you can retrieve the complete name of the domain cookie with `getCookieName('id')`.

#### Configuring the cookie samesite attribute

Set the cookie samesite attribute for the tracker instance using the `cookieSameSite` field of the configuration object. The default is “None” for backward compatibility reasons, however ‘Lax’ is likely a better option for most use cases given the reasons below. Valid values are "Strict", "Lax", "None" or `null`. `null` will not set the SameSite attribute.

It is recommended to set either "None" or "Lax". You must use "None" if using the tracker in a third party iframe. "Lax" is good in all other cases and must be used if not setting Secure to true.

Safari 12 Issue with SameSite cookies

It's been noted that Safari 12 doesn't persist cookies with `SameSite: None` as expected which can lead to rotation of the `domain_userid` from users using this browser. You should switch to `cookieSameSite: 'Lax'` in your tracker configuration to solve this, unless you are tracking inside a third party iframe.

#### Configuring the cookie secure attribute

Set the cookie secure attribute for the tracker instance using the `cookieSecure` field of the configuration object. The default is "true". Valid values are "true" or "false".

It is recommended to set this to "true". This must be set to "false" if using the tracker on non-secure HTTP.

#### Configuring base 64 encoding

By default, self-describing events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the `encodeBase64` field of the configuration object.

#### Respecting Do Not Track

Most browsers have a Do Not Track option which allows users to express a preference not to be tracked. You can respect that preference by setting the `respectDoNotTrack` field of the configuration object to `true`. This prevents cookies from being sent and events from being fired.

#### Opt-out cookie

It is possible to set an opt-out cookie in order not to track anything similarly to Do Not Track through `window.snowplow('setOptOutCookie', 'opt-out');` where ‘opt-out’ is the name of your opt-out cookie. If this cookie is set, cookies won’t be stored and events won’t be fired.

#### Anonymous Tracking (2.15.0+)

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

##### Client Anonymous Tracking

`anonymousTracking: true`

This mode will no longer track any user identifiers or session information. Similar in behavior to setting `stateStorageStrategy: 'none'`, as it will store no values in cookies or localStorage, however by using `anonymousTracking` you can toggle this behavior on and off (useful for allowing events to be sent without user identifiers until cookie banners have been accepted).

Setting `stateStorageStrategy` to `cookieAndLocalStorage` or `localStorage` also allows for event buffering to continue working whilst not sending user information when `anonymousTracking` is enabled.

Anonymous tracking can be toggled on and off. The methods to control this behavior are described [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v2/tracker-setup/other-parameters-2/index.md).

##### Full Anonymous/Cookieless Tracking (2.17.0+)

`anonymousTracking: { withServerAnonymisation: true }`

Server Anonymisation requires the Snowplow Stream Collector v2.1.0+. Using a lower version will cause events to fail to send until Server Anonymisatoin is disabled.

Server Anonymisation will not work when the tracker is initialized with `eventMethod: 'beacon'` as it requires additional custom headers which beacon does not support.

This mode will no longer track any user identifiers or session information, and will additionally prevent the Snowplow Collector from generating a `network_userid` cookie and capturing the users IP address. The same behavior described for above for Client side Anonymous tracking also applies.

Setting `stateStorageStrategy` to `cookieAndLocalStorage` or `localStorage` also allows for event buffering to continue working whilst not sending user information when `anonymousTracking` is enabled. However for an experience that doesn't use any browser storage (cookieless), set `stateStorageStrategy` to `none`. This can be later toggled on, once a user accepts a cookie policy.

Anonymous tracking can be toggled on and off. The methods to control this behavior are described [here](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v2/tracker-setup/other-parameters-2/index.md).

##### Anonymous Session Tracking

`anonymousTracking: { withSessionTracking: true }`

This mode will continue to track session information in the client side but will track no user identifiers. To achieve this, the tracker will use Cookies or Local Storage. For session tracking, `stateStorageStrategy` must be either `cookieAndLocalStorage` (default), `localStorage` or `cookie`. If this feature is enabled and the storage strategy is not appropriate, then full anonymous tracking will occur.

The Snowplow JavaScript Tracker performs sessionization client side. This allows anonymous session tracking to be done using client side storage without sending any user identifier fields to the collector.

#### Setting the page unload pause

Whenever the Snowplow Javascript Tracker fires an event, it automatically starts a 500 millisecond timer running. If the user clicks on a link or refreshes the page during this period (or, more likely, if the event was triggered by the user clicking a link), the page will wait until either the event is sent or the timer is finished before unloading. 500 milliseconds is usually enough to ensure the event has time to be sent.

You can change the pause length (in milliseconds) using the `pageUnloadTimer` of the configuration object. The above example completely eliminates the pause. This does make it unlikely that events triggered by link clicks will be sent.

See also [How the Tracker uses `localStorage`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/index.md#local-storage) for an explanation of how the tracker can later recover and send unsent events.

#### Setting the event request protocol

Normally the protocol (http or https) used by the Tracker to send events to a collector is the same as the protocol of the current page. You can force it to use https by setting the `forceSecureTracker` field of the configuration object to `true`.

#### Setting an unsecure event request protocol

Normally the protocol (http or https) used by the Tracker to send events to a collector is the same as the protocol of the current page. You can force it to use http by setting the `forceUnsecureTracker` field of the configuration object to `true`. If `forceSecureTracker` is activated this argument is ignored.

**NOTE**: This argument should only be used for testing purposes as it creates security vulnerabilities.

#### Configuring the session cookie duration

Whenever an event fires, the Tracker creates a session cookie. If the cookie didn’t previously exist, the Tracker interprets this as the start of a new session.

By default the session cookie expires after 30 minutes. This means that a user leaving the site and returning in under 30 minutes does not change the session. You can override this default by setting `sessionCookieTimeout` to a duration (in seconds) in the configuration object. For example,

```javascript
{
  ...
  sessionCookieTimeout: 3600
  ...
}
```

would set the session cookie lifespan to an hour.

#### Configuring the storage strategy

Three strategies are made available to store the Tracker’s state: cookies, local storage or no storage at all. You can set the strategy with the help of the `stateStorageStrategy` parameter in the configuration object to “cookieAndLocalStorage” (the default), “cookie”, “localStorage” or “none” respectively.

When choosing local storage, the Tracker will additionally store events in local storage before sending them so that they can be recovered if the user leaves the page before they are sent.

#### Adding predefined contexts

The JavaScript Tracker comes with many predefined contexts which you can automatically add to every event you send. To enable them, simply add them to the `contexts` field of the configuration object as above.

##### webPage context

When the JavaScript Tracker loads on a page, it generates a new page view UUID. If the webPage context is enabled, then a context containing this UUID is attached to every page view.

##### performanceTiming context

If this context is enabled, the JavaScript Tracker will use the create a context JSON from the `window.performance.timing` object, along with the Chrome `firstPaintTime` field (renamed to `"chromeFirstPaint"`) if it exists. This data can be used to calculate page performance metrics.

Note that if you fire a page view event as soon as the page loads, the `domComplete`, `loadEventStart`, `loadEventEnd`, and `chromeFirstPaint` metrics in the Navigation Timing API may be set to zero. This is because those properties are only known once all scripts on the page have finished executing. See the [Advanced Usage](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v2/advanced-usage/getting-the-most-out-of-performance-timing/index.md) page for more information on circumventing this limitation. Additionally the `redirectStart`, `redirectEnd`, and `secureConnectionStart` are set to 0 if there is no redirect or a secure connection is not requested.

For more information on the Navigation Timing API, see [the specification](http://www.w3.org/TR/2012/REC-navigation-timing-20121217/#sec-window.performance-attribute).

##### gaCookies context

If this context is enabled, the JavaScript Tracker will look for Google Analytics cookies (specifically the “__utma”, “__utmb”, “__utmc”, “__utmv”, “__utmz”, and “_ga” cookies) and combine their values into a JSON which gets sent with every event.

##### clientHints context (2.15.0+)

If this context is enabled, the JavaScript Tracker will capture the Client Hints data made available in the browser. See [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH#Browser_compatibility) for browser support.

This is useful data to capture as browsers are moving away from high entropy User Agent strings. Client Hints offer useful information to understand browser usage without the potential to infringe on a users privacy as is often the case with the User Agent string.

This context be enabled in two ways:

1. `clientHints: true`
    - This will capture the "basic" client hints
2. `clientHints: { includeHighEntropy: true }`
    - This will capture the "basic" client hints as well as hints that are deemed "High Entropy" and could be used to fingerprint users. Browsers may choose to prompt the user before making this data available.

To see what will be captured please see the JsonSchema file [org.ietf/http_client_hints/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/org.ietf/http_client_hints/jsonschema/1-0-0).

##### geolocation context

If this context is enabled, the JavaScript Tracker will attempt to create a context from the visitor’s geolocation information. If the visitor has not already given or denied the website permission to use their geolocation information, a prompt will appear. If they give permission, then all events from that moment on will include their geolocation information.

For more information on the geolocation API, see [the specification](http://dev.w3.org/geo/api/spec-source.html).

##### optimizelyExperiments context

If this context is enabled the JavaScript Tracker will use the `window['optimizely'].data.experiments` object to create an array of context JSONs; one for each sub-object.

To see what will be captured please see the JsonSchema file [com.optimizely/experiment/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.optimizely/experiment/jsonschema/1-0-0).

##### optimizelyStates context

If this context is enabled the JavaScript Tracker will use the `window['optimizely'].data.state` object to create an array of context JSONs; one for each sub-object.

To see what will be captured please see the JsonSchema file [com.optimizely/state/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.optimizely/state/jsonschema/1-0-0).

##### optimizelyVariations context

If this context is enabled the JavaScript Tracker will use the `window['optimizely'].data.variations` object to create an array of context JSONs; one for each sub-object.

To see what will be captured please see the JsonSchema file [com.optimizely/variation/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.optimizely/variation/jsonschema/1-0-0).

##### optimizelyVisitor context

If this context is enabled the JavaScript Tracker will use the `window['optimizely'].data.visitor` object to create a context JSON.

To see what will be captured please see the JsonSchema file [com.optimizely/visitor/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.optimizely/visitor/jsonschema/1-0-0).

##### optimizelyAudiences context

If this context is enabled the JavaScript Tracker will use the `window['optimizely'].data.visitor.audiences` object to create an array of context JSONs; one for each sub-object.

To see what will be captured please see the JsonSchema file [com.optimizely/visitor_audience/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.optimizely/visitor_audience/jsonschema/1-0-0).

##### optimizelyDimensions context

If this context is enabled the JavaScript Tracker will use the `window['optimizely'].data.visitor.dimensions` object to create an array of context JSONs; one for each sub-object.

To see what will be captured please see the JsonSchema file [com.optimizely/visitor_dimension/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.optimizely/visitor_dimension/jsonschema/1-0-0).

##### optimizelySummary context

Unlike previously mentioned Optimizely contexts this context doesn’t attach existing in browser object, but constructs its own using only data necessary to join with [exported Optimizely](https://developers.optimizely.com/classic/events/export/index.html) data.

To see what will be captured please see the JsonSchema file [com.optimizely.snowplow/optimizely_summary/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.optimizely.snowplow/optimizely_summary/jsonschema/1-0-0).

We highly recommend to use this context instead of previous ones because it is has much smaller footprint and contains all necessary data.

##### optimizelyXSummary context

Support for OptimizelyX has been introduced in the tracker, you can have a look at the JsonSchema in [com.optimizely.optimizelyx/summary/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.optimizely.optimizelyx/summary/jsonschema/1-0-0) to see what is being captured.

If you’re planning on leveraging the context’s variation names, you’ll have to untick ‘Mask descriptive names in project code and third-party integrations’ in the OptimizelyX menu -> Settings -> Privacy. Otherwise, all variation names will be `null`.

##### parrable context

If this context is enabled, the JavaScript Tracker will use the `window['_hawk']` object to create a [Parrable](https://www.parrable.com/) context JSON.

To see what will captured, please see the JsonSchema file [com.parrable/encrypted_payload/jsonschema/1-0-0](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.parrable/encrypted_payload/jsonschema/1-0-0).

#### POST support

If you set the `eventMethod` field of the configuration object to `post`, the tracker will send events using POST requests rather than GET requests. In browsers such as Internet Explorer 9 which do not support cross-origin XMLHttpRequests, the tracker will fall back to using GET.

`eventMethod` defaults to `post`, other options available are `get` for GET requests and `beacon` for using the Beacon API (note: Using Beacon will store a Session Cookie in the users browser for reliability reasons described below).

The main advantage of POST requests is that they circumvent Internet Explorer’s maximum URL length of 2083 characters by storing the event data in the body of the request rather than the querystring.

You can also batch events sent by POST by setting a numeric `bufferSize` field in the configuration object. This is the number of events to buffer before sending them all in a single POST. If the user navigates away from the page while the buffer is only partially full, the tracker will attempt to send all stored events immediately, but this often doesn’t happen before the page unloads. Normally the tracker will store unsent events in `localStorage`, meaning that unsent events will be resent when the user next visits a page on the same domain. The `bufferSize` defaults to 1, meaning events are sent as soon as they are created.

If you have set `bufferSize` to greater than 1, you can flush the buffer using the `flushBuffer` method:

```javascript
snowplow('flushBuffer');
```

For instance, if you wish to send several events at once, you might make the API calls to create the events and store them and then and call `flushBuffer` afterwards to ensure they are all sent before the user leaves the page.

Note that if `localStorage` is inaccessible or you are not using it to store data, the buffer size will always be 1 to prevent losing events when the user leaves the page.

##### Beacon API support

The Beacon interface is used to schedule asynchronous and non-blocking requests to a web server. This will allow events to be sent even after a webpage is closed. This browser interface can be used to send events by setting the `eventMethod` field in the configuration object to `beacon`.

Using Beacon will store a Session Cookie in the users browser for reliability reasons, and will always send the first request as a standard POST. This prevents data loss in a number of older browsers with broken Beacon implementations.

Note: the Beacon API makes POST requests.

More information and documentation about the Beacon API can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API).

##### POST path

The POST path that is used to send POST requests to a collector can be change with the configuration object value `postPath`.

`postPath` defaults to the standard path: `/com.snowplowanalytics.snowplow/tp2`

```mdx-code-block
import PostPath from "@site/docs/reusable/trackers-post-path-note/_index.md"
```

<PostPath/>

#### Configuring cross-domain tracking

```mdx-code-block
import CrossDomain from "@site/docs/reusable/javascript-tracker-cross-domain/_index.md"
```

<CrossDomain lang="javascript" />

#### Configuring the maximum payload size in bytes

Because the Clojure Collector and the Scala Stream Collector both have a maximum request size, the Tracker limits POST requests to 40000 bytes. If the combined size of the events in `localStorage` is greater than this limit, they will be split into multiple POST requests. You can override this default using a `maxPostBytes` in the configuration object.

The Clojure Collector can’t handle requests bigger than 64kB. The Scala Stream Collector cannot process requests bigger than 1MB because that is the maximum size of a Kinesis record.

#### Automatically discover and set the root domain

If the optional `discoverRootDomain` field of the configuration object is set to `true`, the Tracker automatically discovers and sets the `configCookieDomain` value to the root domain.

**NOTE**: If you have been setting this manually please note that the automatic detection does not prepend a ‘.’ to the domain. For example a root domain of “.mydomain.com” would become “mydomain.com”. This is because the library we use for setting cookies doesn’t care about the difference.

**This will then result in a different domain hash, so we recommend that if you have been setting this manually with a leading ‘.’ to continue to do so manually.**

#### Configuring the cookies lifetime

Whenever tracker initialized on your domain – it will set domain-specific visitor’s cookies. By default, these cookies will be active for 2 years. You can change this duration using `cookieLifetime` configuration object parameter or `setVisitorCookieTimeout` method.

```javascript
snowplow('newTracker', 'cf', '{{COLLECTOR_URL}}', {
  cookieLifetime: 86400 * 31,
});
```

or

```javascript
snowplow('setVisitorCookieTimeout', 86400 * 30);  // 30 days
```

If `cookieLifetime` is set to `0`, the cookie will expire at the end of the session (when the browser closes). If set to `-1`, the first-party cookies will be disabled.

#### Tracking prerendered pages

Some browsers can “preload” pages while user typing URL in. These users not always end up in that page, however due page preloading tracker is initialized and loaded.

JS Tracker by default doesn’t fire events when page is preloaded, but sets callback on [visibilitychange](https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange) event, which fires actual event only when page starts to render.

To explicitly enable tracking for prerendered pages you can use `setCountPreRendered` function:

```javascript
snowplow('setCountPreRendered', true);
```

#### Limiting Local Storage queue size

Because most browsers limit Local Storage to around 5mb per site, you may want to limit the number of events the tracker will queue in local storage if they fail to send. The default is a max queue size of 1000, but you may wish to reduce this if your web application also makes use local storage. To do so, you should set the optional `maxLocalStorageQueueSize` field of the configuration object is set to your desired value (e.g. 500).

#### Reset Page Ping on Page View

By default the tracker will reset the Page Ping timers, which were configured when `enableActivityTracking` is called, as well as reset the attached Page View contexts on all future Page Pings when a new `trackPageView` event occurs. This is enabled by default as of 2.13.0 and is particularly useful for Single Page Applications (SPA), if you previously relied on this behavior, you can disable this functionality by specifying `resetActivityTrackingOnPageView: false` in the configuration object on tracker initialisation.

#### Skip tracking browser features (2.15.0+)

By default the tracker will capture a number of browser features that are available. If you don't require these to be captured and would like to reduce the size of the event payload, you can choose to skip them.

When initialising the tracker, you can specify an array of features to skip.

`skippedBrowserFeatures: ['realp', 'java', 'gears', 'ag']`

Full list of features:

- `res` - Screen Resolution
- `cd` - Screen Colour Depth
- `cookie` - Cookie support (if cookies enabled in tracker initialization)
- `pdf` - PDF MimeType Support (application/pdf)
- `qt` - Quicktime Video MimeType Support (video/quicktime)
- `realp` - RealAudio MimeType Support (audio/x-pn-realaudio-plugin)
- `wma` - WMA MimeType Support (application/x-mplayer2)
- `dir` - Director MimeType Support (application/x-director)
- `fla` - Flash MimeType Support (application/x-shockwave-flash)
- `java` - Java MimeType Support (application/x-java-vm)
- `gears` - Google Gears MimeType Support (application/x-googlegears)
- `ag` - Silverlight MimeType Support (application/x-silverlight)

#### Set connection timeout (2.15.0+)

When events are sent using POST or GET, they are given 5 seconds to complete by default. GET requests having a timeout is only available in 2.15.0.

`_connectionTimeout_: 5000`

This value is configurable when initialising the tracker and is specified in milliseconds. The value specified here will effect both POST and GET requests.

**Warning:** Setting this value too low may prevent events from successfully sending to your collector or the tracker may retry to send events that have already arrived at the collector, as the tracker will assume the request failed on timeout, leading to duplicate events in the warehouse. **We recommend 5000 milliseconds as the minimum value and 10000 as the maximum value.**

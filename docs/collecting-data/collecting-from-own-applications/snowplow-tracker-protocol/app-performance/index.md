---
title: "App performance"
---

We provide two groups out-of-the-box solutions for tracking app performance metrics:

1. Plugins for our Web trackers with automatic performance tracking.
2. Timing events available on most of our trackers for manual tracking.

## Automatic performance tracking on Web

### Web vitals events

 | 
---|---
Type | Event
Schema | `iglu://com.snowplowanalytics.snowplow/web_vitals/jsonschema/1-0-0` 
Web | ✅
Mobile | ❌
Atomic table field name | `unstruct_event_com_snowplowanalytics_snowplow_web_vitals_1`
Tracked automatically | ✅

#### Example payload

| schema_name | cls  | fcp | fid     | inp     | lcp   | navigation_type | ttfb  |
|-------------|------|-----|---------|---------|-------|-----------------|-------|
| web_vitals  | 0.05 | 0   | 36:00.0 | 36:00.0 | 1,908 | navigate        | 228.9 |

<details>
  <summary>Web vitals event schema properties</summary>
  <div>

The schema is [available here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/web_vitals/jsonschema).

Property | Title | Type | Description
---|---|---|---
`cls` | Cumulative Layout Shift | number | A unitless metric for measuring visual stability because it helps quantify how often users experience unexpected layout shifts. For more information https://web.dev/cls/.
`fid` | First Input Delay | number | A metric for measuring load responsiveness because it quantifies the experience users feel when trying to interact with unresponsive pages. Measured in milliseconds. For more information https://web.dev/fid/.
`lcp` | Largest Contentful Paint | number | A metric for measuring perceived load speed because it marks the point in the page load timeline when the page's main content has likely loaded. Measured in milliseconds. For more information https://web.dev/lcp/.
`fcp` | First Contentful Paint | number | A metric for measuring perceived load speed because it marks the first point in the page load timeline where the user can see anything on the screen. Measured in milliseconds. For more information https://web.dev/fcp/.
`inp` | Interaction to Next Pai |  number | A metric that assesses responsiveness. INP observes the latency of all interactions a user has made with the page, and reports a single value which all (or nearly all) interactions were below that value. For more information https://web.dev/inp/.
`ttfb` | Time To First By |  number | A DOMHighResTimeStamp referring to the time in milliseconds between the browser requesting a page and when it receives the first byte of information from the server. For more information https://web.dev/ttfb/.
`navigationType` | | string | The navigation type recognised from the Navigation Timing API https://www.w3.org/TR/navigation-timing-2/. E.g. 'navigate', 'reload', 'back-forward', 'back-forward-cache', 'prerender', 'restore'

  </div>
</details>

#### How to track?

Use the [Web vitals plugin for the JavaScript tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/web-vitals/).

### Performance navigation timing context entity

This plugin will add Performance Navigation Timing contexts to tracked events.

 | 
---|---
Type | Context entity
Schema | `iglu:org.w3/PerformanceNavigationTiming/jsonschema/1-0-0` 
Web | ✅
Mobile | ❌
Atomic table field name | `context_org_w3_performancenavigationtiming_1`
Tracked automatically | ✅


<details>
  <summary>Performance navigation context schema properties</summary>
  <div>

The schema is available here: [iglu:org.w3/PerformanceNavigationTiming/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/org.w3/PerformanceNavigationTiming/jsonschema/1-0-0).

Property | Type | Description
---|---|---
`decodedBodySize` | integer | A number that is the size (in octets) received from the fetch (HTTP or cache) of the message body, after removing any applied content encoding.
`encodedBodySize` | integer | A number representing the size (in octets) received from the fetch (HTTP or cache), of the payload body, before removing any applied content encodings.
`redirectStart` | number | A DOMHighResTimeStamp that represents the start time of the fetch which initiates the redirect in milliseconds.
`redirectEnd` | number | A DOMHighResTimeStamp immediately after receiving the last byte of the response of the last redirect in milliseconds.
`fetchStart` | number | A DOMHighResTimeStamp immediately before the browser starts to fetch the resource in milliseconds.
`domainLookupStart` | number | A DOMHighResTimeStamp immediately before the browser starts the domain name lookup for the resource in milliseconds.
`domainLookupEnd` | number | A DOMHighResTimeStamp representing the time immediately after the browser finishes the domain name lookup for the resource in milliseconds.
`connectStart` | number | A DOMHighResTimeStamp immediately before the browser starts to establish the connection to the server to retrieve the resource in milliseconds.
`secureConnectionStart` | number | A DOMHighResTimeStamp immediately before the browser starts the handshake process to secure the current connection in milliseconds.
`connectEnd` | number | A DOMHighResTimeStamp immediately after the browser finishes establishing the connection to the server to retrieve the resource in milliseconds.
`requestStart` | number | A DOMHighResTimeStamp immediately before the browser starts requesting the resource from the server in milliseconds.
`responseStart` | number | A DOMHighResTimeStamp immediately after the browser receives the first byte of the response from the server in milliseconds.
`responseEnd` | number | A DOMHighResTimeStamp immediately after the browser receives the last byte of the resource or immediately before the transport connection is closed in milliseconds, whichever comes first.
`unloadEventStart` | number | A DOMHighResTimeStamp representing the time immediately after the current document's unload event handler starts in milliseconds.
`unloadEventEnd` | number | A DOMHighResTimeStamp representing the time immediately after the current document's unload event handler completes in milliseconds.
`domInteractive` | number | A DOMHighResTimeStamp representing the time immediately before the user agent sets the document's readyState to 'interactive' in milliseconds.
`domContentLoadedEventStart` | number | A DOMHighResTimeStamp representing the time immediately before the current document's DOMContentLoaded event handler starts in milliseconds.
`domContentLoadedEventEnd` | number | A DOMHighResTimeStamp representing the time immediately after the current document's DOMContentLoaded event handler completes in milliseconds.
`domComplete` | number | A DOMHighResTimeStamp representing the time immediately before the user agent sets the document's readyState to 'complete' in milliseconds.
`loadEventStart` | number | A DOMHighResTimeStamp representing the time immediately after the current document's load event handler starts in milliseconds.
`loadEventEnd` | number | A DOMHighResTimeStamp representing the time immediately after the current document's load event handler completes in milliseconds.
`entryType` | string | The string 'navigation'.
`redirectCount` | integer | A number representing the number of redirects since the last non-redirect navigation in the current browsing context.
`type` | string | A string representing the navigation type. Either 'navigate', 'reload', 'back_forward' or 'prerender'.
`workerStart` | number | Returns a DOMHighResTimeStamp immediately before dispatching the FetchEvent if a Service Worker thread is already running, or immediately before starting the Service Worker thread if it is not already running. If the resource is not intercepted by a Service Worker the property will always return 0.
`nextHopProtocol` | string | A string representing the network protocol used to fetch the resource, as identified by the ALPN Protocol ID (RFC7301)
`transferSize` | nteger | A number representing the size (in octets) of the fetched resource. The size includes the response header fields plus the response payload body.
`duration` | number | Returns a timestamp that is the difference between the loadEventEnd and startTime properties.
`activationStart` | number | If the document is prerendered, activationStart represents the time between when the prerender was started and the document was actually activated.
`deliveryType` | string | Expose information about how a resource was delivered e.g. resources which were delivered from the cache.
`serverTiming` | array | Array of PerformanceServerTiming entries.

  </div>
</details>

### How to track?

1. Using the [Performance Navigation Timing plugin for the JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/performance-navigation-timing/index.md).

## Manually tracked timing events

Timing events are self-describing events available across most of our trackers.
They enable you to manually track timing information measured within your app.

 | 
---|---
Type | Event
Schema | `iglu:com.snowplowanalytics.snowplow/timing/jsonschema/1-0-0` 
Web | ✅
Mobile | ✅
Atomic table field name | `context_com_snowplowanalytics_snowplow_timing_1`
Tracked automatically | ❌

<details>
  <summary>Timing event schema</summary>
  <div>

The schema for the event is [available here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/timing/jsonschema/1-0-0). It contains the following properties:

Property | Type | Description | Required
---|---|---|---
`category` | string | The timing category | Yes
`variable` | string | The timing variable | Yes
`timing` | number | The measured time | Yes
`label` | string | The timing label | Yes

  </div>
</details>

### How to track?

1. Using the [JavaScript tracker on Web](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v2/tracking-specific-events/index.md#tracktiming).
2. [iOS and Android trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/index.md#creating-a-timing-event).

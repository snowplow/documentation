---
title: "App performance"
sidebar_label: "App performance"
sidebar_position: 20
description: "Track web vitals, navigation timing, and custom performance metrics using automatic plugins or manual timing events."
keywords: ["web vitals", "performance tracking", "navigation timing", "timing events"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

We provide two out-of-the-box solutions for tracking app performance metrics:
* Plugins for automatic performance tracking on web
* Timing events, available in most Snowplow trackers, for manual tracking

## Automatic tracking on web

The [JavaScript tracker](/docs/sources/web-trackers/index.md) provides two configurable plugins that track performance automatically.

Use the web vitals plugin to track key user-centric performance metrics, and the performance navigation timing plugin to capture detailed navigation timing data.

### Web vitals

This [plugin](/docs/sources/web-trackers/tracking-events/web-vitals/index.md) tracks web performance metrics categorized as [Web Vitals](https://web.dev/vitals/).

<SchemaProperties
  overview={{event: true, web: true, mobile: false, automatic: true}}
  example={{
    schema_name: "web_vitals",
    cls: 0.05,
    fcp: 0,
    fid: "36:00.0",
    inp: "36:00.0",
    lcp: 1908,
    navigationType: "navigate",
    ttfb: 228.9
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a web vitals tracking event. For more information on web vitals you can visit https://web.dev/vitals/.", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "web_vitals", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "cls": { "title": "Cumulative Layout Shift", "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A unitless metric for measuring visual stability because it helps quantify how often users experience unexpected layout shifts. For more information https://web.dev/cls/." }, "fid": { "title": "First Input Delay", "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A metric for measuring load responsiveness because it quantifies the experience users feel when trying to interact with unresponsive pages. Measured in milliseconds. For more information https://web.dev/fid/." }, "lcp": { "title": "Largest Contentful Paint", "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A metric for measuring perceived load speed because it marks the point in the page load timeline when the page's main content has likely loaded. Measured in milliseconds. For more information https://web.dev/lcp/." }, "fcp": { "title": "First Contentful Paint", "type": ["number", "null"], "maximum": 2147483647, "minimum": 0, "description": "A metric for measuring perceived load speed because it marks the first point in the page load timeline where the user can see anything on the screen. Measured in milliseconds. For more information https://web.dev/fcp/." }, "inp": { "title": "Interaction to Next Paint", "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A metric that assesses responsiveness. INP observes the latency of all interactions a user has made with the page, and reports a single value which all (or nearly all) interactions were below that value. For more information https://web.dev/inp/." }, "ttfb": { "title": "Time To First Byte", "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp referring to the time in milliseconds between the browser requesting a page and when it receives the first byte of information from the server. For more information https://web.dev/ttfb/." }, "navigationType": { "type": [ "string", "null" ], "maxLength": 128, "description": "The navigation type recognised from the Navigation Timing API https://www.w3.org/TR/navigation-timing-2/. E.g. 'navigate', 'reload', 'back-forward', 'back-forward-cache', 'prerender', 'restore'." } }, "additionalProperties": false }} />

To process raw web vitals event data, use the core web vitals module in the [Snowplow Unified Digital dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/core-web-vitals-module/index.md).

### Performance navigation timing

This [plugin](/docs/sources/web-trackers/tracking-events/timings/index.md) will add Performance Navigation Timing entities to all tracked events.

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for page navigation performance entity, based on the PerformanceNavigationTiming interface (see https://w3c.github.io/navigation-timing/)", "self": { "vendor": "org.w3", "name": "PerformanceNavigationTiming", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "decodedBodySize": { "type": [ "integer", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A number that is the size (in octets) received from the fetch (HTTP or cache) of the message body, after removing any applied content encoding." }, "encodedBodySize": { "type": [ "integer", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A number representing the size (in octets) received from the fetch (HTTP or cache), of the payload body, before removing any applied content encodings." }, "redirectStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp that represents the start time of the fetch which initiates the redirect in milliseconds." }, "redirectEnd": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately after receiving the last byte of the response of the last redirect in milliseconds." }, "fetchStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately before the browser starts to fetch the resource in milliseconds." }, "domainLookupStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately before the browser starts the domain name lookup for the resource in milliseconds." }, "domainLookupEnd": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp representing the time immediately after the browser finishes the domain name lookup for the resource in milliseconds." }, "connectStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately before the browser starts to establish the connection to the server to retrieve the resource in milliseconds." }, "secureConnectionStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately before the browser starts the handshake process to secure the current connection in milliseconds." }, "connectEnd": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately after the browser finishes establishing the connection to the server to retrieve the resource in milliseconds." }, "requestStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately before the browser starts requesting the resource from the server in milliseconds." }, "responseStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately after the browser receives the first byte of the response from the server in milliseconds." }, "responseEnd": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "A DOMHighResTimeStamp immediately after the browser receives the last byte of the resource or immediately before the transport connection is closed in milliseconds, whichever comes first." }, "unloadEventStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp representing the time immediately after the current document's unload event handler starts in milliseconds." }, "unloadEventEnd": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp representing the time immediately after the current document's unload event handler completes in milliseconds." }, "domInteractive": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp representing the time immediately before the user agent sets the document's readyState to 'interactive' in milliseconds." }, "domContentLoadedEventStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp representing the time immediately before the current document's DOMContentLoaded event handler starts in milliseconds." }, "domContentLoadedEventEnd": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp representing the time immediately after the current document's DOMContentLoaded event handler completes in milliseconds." }, "domComplete": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp representing the time immediately before the user agent sets the document's readyState to 'complete' in milliseconds." }, "loadEventStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp representing the time immediately after the current document's load event handler starts in milliseconds." }, "loadEventEnd": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "A DOMHighResTimeStamp representing the time immediately after the current document's load event handler completes in milliseconds." }, "entryType": { "type": [ "string", "null" ], "maxLength": 128, "description": "The string 'navigation'." }, "redirectCount": { "type": [ "integer", "null" ], "minimum": 0, "maximum": 64, "description": "A number representing the number of redirects since the last non-redirect navigation in the current browsing context." }, "type": { "type": [ "string", "null" ], "maxLength": 32, "description": "A string representing the navigation type. Either 'navigate', 'reload', 'back_forward' or 'prerender'." }, "workerStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": -2147483647, "description": "Returns a DOMHighResTimeStamp immediately before dispatching the FetchEvent if a Service Worker thread is already running, or immediately before starting the Service Worker thread if it is not already running. If the resource is not intercepted by a Service Worker the property will always return 0." }, "nextHopProtocol": { "type": [ "string", "null" ], "maxLength": 16, "description": "A string representing the network protocol used to fetch the resource, as identified by the ALPN Protocol ID (RFC7301)" }, "transferSize": { "type": ["integer", "null"], "maximum": 2147483647, "minimum": 0, "description": "A number representing the size (in octets) of the fetched resource. The size includes the response header fields plus the response payload body." }, "duration": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "Returns a timestamp that is the difference between the loadEventEnd and startTime properties." }, "activationStart": { "type": [ "number", "null" ], "maximum": 2147483647, "minimum": 0, "description": "If the document is prerendered, activationStart represents the time between when the prerender was started and the document was actually activated." }, "deliveryType": { "type": [ "string", "null" ], "maxLength": 128, "description": "Expose information about how a resource was delivered e.g. resources which were delivered from the cache." }, "serverTiming": { "type": [ "array", "null"], "items": { "$ref": "#/definitions/serverTiming", "description": "PerformanceServerTiming entry" }, "description": "Array of PerformanceServerTiming entries." } }, "definitions": { "serverTiming": { "type": "object", "properties": { "duration": { "description": "Duration of the measurement.", "type": [ "number" , "null" ], "maximum": 2147483647, "minimum": 0 }, "name": { "description": "The name of the measurement.", "type": "string", "maxLength": 4096 }, "description": { "description": "A short description of the measurement.", "type": [ "string" , "null" ], "maxLength": 4096 } }, "required": [ "name" ], "additionalProperties": false } }, "additionalProperties": false }} />

### Tracker support

This table shows which versions of the JavaScript tracker SDK introduced the performance plugins:

| Tracker      | Plugin                                                                                           | Supported | Since version | Auto-tracking |
| ------------ | ------------------------------------------------------------------------------------------------ | --------- | ------------- | ------------- |
| Web          | [WebVitalsPlugin](/docs/sources/web-trackers/tracking-events/web-vitals/index.md)                | ✅         | 3.13.0        | ✅             |
| Web          | [PerformanceNavigationTimingPlugin](/docs/sources/web-trackers/tracking-events/timings/index.md) | ✅         | 3.10.0        | ✅             |
| React Native |                                                                                                  | ❌         |               |               |

The [React Native tracker](/docs/sources/react-native-tracker/index.md) can't access the required browser APIs to use these plugins.

## Manual timing events

Track things like resource load times or other performance measurements using manual timing events.

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: false}}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a user timing event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "timing", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "category": { "type": "string" }, "variable": { "type": "string" }, "timing": { "type": "number" }, "label": { "type": "string" } }, "required": ["category", "variable", "timing"], "additionalProperties": false }} />

### Tracker support

This table shows the support for timing events across Snowplow [tracker SDKs](/docs/sources/index.md).

| Tracker                                                                                               | Supported | Since version |
| ----------------------------------------------------------------------------------------------------- | --------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/timings/generic/index.md)                            | ✅         | 3.0.0         |
| [iOS](/docs/sources/mobile-trackers/tracking-events/index.md#creating-a-timing-event)                 | ✅         | 2.0.0         |
| [Android](/docs/sources/mobile-trackers/tracking-events/index.md#creating-a-timing-event)             | ✅         | 2.0.0         |
| [React Native](/docs/sources/react-native-tracker/tracking-events/index.md#tracking-timing-events)    | ✅         | 0.1.0         |
| [Flutter](/docs/sources/flutter-tracker/tracking-events/index.md#track-timing-events-with-timing)     | ✅         | 0.1.0         |
| Roku                                                                                                  | ❌         |               |
| [Java](/docs/sources/java-tracker/tracking-events/index.md#creating-a-timing-event)                   | ✅         | 0.8.0         |
| [Golang](/docs/sources/golang-tracker/tracking-specific-events/index.md#timing-event)                 | ✅         | 0.1.0         |
| Python                                                                                                | ❌         |               |
| Ruby                                                                                                  | ❌         |               |
| PHP                                                                                                   | ❌         |               |
| [.NET](/docs/sources/net-tracker/event-tracking/index.md#track-timing-events-with-tracktiming)        | ✅         | 1.0.0         |
| [C++](/docs/sources/c-tracker/tracking-specific-events/index.md#track-timing-events-with-timingevent) | ✅         | 0.3.0         |
| [Rust](/docs/sources/rust-tracker/tracking-events/index.md#track-timing-events-with-timingevent)      | ✅         | 0.1.0         |
| [Unity](/docs/sources/unity-tracker/event-tracking/index.md#track-timing-events-with-tracktiming)     | ✅         | 0.1.0         |
| Scala                                                                                                 | ❌         |               |
| Lua                                                                                                   | ❌         |               |
| Node.js                                                                                               | ❌         |               |

You can still track timing data using trackers without built-in timing event support. Use custom events with the `timing` schema.

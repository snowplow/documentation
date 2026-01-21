---
title: "Third-party sources"
sidebar_label: "Third-party sources"
sidebar_position: 170
description: "Capture data from third-party tools including Optimizely experiments, Google Analytics cookies, and Kantar Focal Meter for unified analytics."
keywords: ["optimizely", "google analytics", "focal meter", "a/b testing", "cookies", "integrations"]
date: "2026-01-15"
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Snowplow provides tracking integrations that let you capture data from third-party tools deployed on your web and mobile properties.

## Optimizely X

The Optimizely X web plugin captures experiment and variation data from [Optimizely](https://www.optimizely.com/) A/B tests. The tracker will add it to all tracked events as an entity.

This table shows the support for Optimizely X tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md):

| Tracker                                                               | Supported | Since version | Auto-tracking | Notes                        |
| --------------------------------------------------------------------- | --------- | ------------- | ------------- | ---------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/optimizely/index.md) | ✅         | 3.0.0         | ✅             | Requires Optimizely X plugin |
| iOS                                                                   | ❌         |               |               |                              |
| Android                                                               | ❌         |               |               |                              |
| React Native                                                          | ❌         |               |               |                              |
| Flutter                                                               | ❌         |               |               |                              |
| Roku                                                                  | ❌         |               |               |                              |
| Google Tag Manager                                                    | ❌         |               |               |                              |

<SchemaProperties
  overview={{event: false}}
  example={{
    experimentId: 12345,
    variationName: "Variation A",
    variationId: 67890,
    isActive: true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for Optimizely X experiment context", "self": { "vendor": "com.optimizely.optimizelyx", "name": "summary", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "experimentId": { "type": ["integer", "null"], "description": "The Optimizely experiment ID" }, "variationName": { "type": ["string", "null"], "description": "The variation name (requires privacy setting)" }, "variationId": { "type": ["integer", "null"], "description": "The variation ID" }, "isActive": { "type": ["boolean", "null"], "description": "Whether the experiment is active" } }, "additionalProperties": true }} />

## Google Analytics cookies

The GA cookies web plugin captures Google Analytics cookie values (both GA4 and Universal Analytics) and attaches them to all events.

This table shows the support for GA cookie tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md):

| Tracker                                                               | Supported | Since version | Auto-tracking | Notes                      |
| --------------------------------------------------------------------- | --------- | ------------- | ------------- | -------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/ga-cookies/index.md) | ✅         | 3.0.0         | ✅             | Requires GA cookies plugin |
| iOS                                                                   | ❌         |               |               |                            |
| Android                                                               | ❌         |               |               |                            |
| React Native                                                          | ❌         |               |               |                            |
| Flutter                                                               | ❌         |               |               |                            |
| Roku                                                                  | ❌         |               |               |                            |
| Google Tag Manager                                                    | ❌         |               |               |                            |

The entity schema depends on whether the tracker finds GA4 or Universal Analytics cookies.

GA4 schema:

<SchemaProperties
  overview={{event: false}}
  example={{
    _ga: "G-1234",
    cookie_prefix: "prefix",
    session_cookies: [
      { measurement_id: "G-1234", session_cookie: "567" }
    ]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for GA4 cookies context", "self": { "vendor": "com.google.ga4", "name": "cookies", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "_ga": { "type": "string", "description": "The _ga cookie value" }, "cookie_prefix": { "type": ["string", "null"], "description": "The cookie prefix if configured" }, "session_cookies": { "type": "array", "items": { "type": "object", "properties": { "measurement_id": { "type": "string" }, "session_cookie": { "type": "string" } } }, "description": "Session cookie values by measurement ID" } }, "additionalProperties": false }} />

Universal Analytics schema:

<SchemaProperties
  overview={{event: false}}
  example={{
    _ga: "GA1.2.3.4"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for Universal Analytics cookies context", "self": { "vendor": "com.google.analytics", "name": "cookies", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "_ga": { "type": ["string", "null"], "description": "The _ga cookie value" }, "__utma": { "type": ["string", "null"], "description": "Classic GA cookie" }, "__utmb": { "type": ["string", "null"], "description": "Classic GA cookie" }, "__utmc": { "type": ["string", "null"], "description": "Classic GA cookie" }, "__utmv": { "type": ["string", "null"], "description": "Classic GA cookie" }, "__utmz": { "type": ["string", "null"], "description": "Classic GA cookie" } }, "additionalProperties": false }} />

## Kantar Focal Meter

Some Snowplow trackers integrate with [Kantar Focal Meter](https://www.virtualmeter.co.uk/focalmeter), a router-based audience measurement system. The plugin sends user IDs to Focal Meter endpoints to enable content audience measurement.

This integration sends data to Kantar's endpoint, rather than attaching an entity to events.

This table shows the support for Kantar Focal Meter tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md):

| Tracker                                                               | Supported | Since version | Auto-tracking | Notes                       |
| --------------------------------------------------------------------- | --------- | ------------- | ------------- | --------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/focalmeter/index.md) | ✅         | 3.16.0        | ✅             | Requires Focal Meter plugin |
| [iOS](/docs/sources/mobile-trackers/plugins/focal-meter/index.md)     | ✅         | 5.6.0         | ❌             |                             |
| [Android](/docs/sources/mobile-trackers/plugins/focal-meter/index.md) | ✅         | 5.6.0         | ❌             |                             |
| React Native                                                          | ❌         |               |               |                             |
| Flutter                                                               | ❌         |               |               |                             |
| Roku                                                                  | ❌         |               |               |                             |
| Google Tag Manager                                                    | ❌         |               |               |                             |

## Privacy Sandbox (deprecated)

:::warning
Privacy Sandbox has been deprecated by Google. This plugin remains available but the underlying browser API may no longer be supported.
:::

The Privacy Sandbox plugin captures data from the [Topics API](https://developer.chrome.com/docs/privacy-sandbox/topics/overview/), which was designed to provide privacy-preserving interest-based advertising signals.

This table shows the support for Privacy Sandbox tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md).

| Tracker                                                                    | Supported | Since version | Auto-tracking |
| -------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/privacy-sandbox/index.md) | ✅         | 3.14.0        | ✅             |
| iOS                                                                        | ❌         |               |               |
| Android                                                                    | ❌         |               |               |
| React Native                                                               | ❌         |               |               |
| Flutter                                                                    | ❌         |               |               |
| Roku                                                                       | ❌         |               |               |
| Google Tag Manager                                                         | ❌         |               |               |  |

<SchemaProperties
  overview={{event: false}}
  example={{
    topics: [
      { topic: 123, taxonomyVersion: "1", modelVersion: "2" }
    ]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for Privacy Sandbox Topics context", "self": { "vendor": "com.google.privacysandbox", "name": "topics", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "topics": { "type": "array", "items": { "type": "object", "properties": { "topic": { "type": "integer" }, "taxonomyVersion": { "type": "string" }, "modelVersion": { "type": "string" } } }, "description": "List of topics for the current user" } }, "additionalProperties": false }} />

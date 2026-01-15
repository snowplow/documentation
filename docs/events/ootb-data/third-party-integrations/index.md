---
title: "Third-party integrations"
sidebar_label: "Third-party integrations"
sidebar_position: 170
description: "Capture data from third-party tools including Optimizely experiments, Google Analytics cookies, and Kantar Focal Meter for unified analytics."
keywords: ["optimizely", "google analytics", "focal meter", "a/b testing", "cookies", "integrations"]
date: "2026-01-15"
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Snowplow provides plugins to integrate with third-party tools, capturing their data as entities attached to your events.

## Optimizely X

The Optimizely X plugin captures experiment and variation data from [Optimizely](https://www.optimizely.com/) A/B tests, attaching it to all tracked events.

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    experimentId: 12345,
    variationName: "Variation A",
    variationId: 67890,
    isActive: true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for Optimizely X experiment context", "self": { "vendor": "com.optimizely.optimizelyx", "name": "summary", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "experimentId": { "type": ["integer", "null"], "description": "The Optimizely experiment ID" }, "variationName": { "type": ["string", "null"], "description": "The variation name (requires privacy setting)" }, "variationId": { "type": ["integer", "null"], "description": "The variation ID" }, "isActive": { "type": ["boolean", "null"], "description": "Whether the experiment is active" } }, "additionalProperties": true }} />

:::note
To capture variation names, disable "Mask descriptive names in project code and third-party integrations" in OptimizelyX Settings → Privacy. Otherwise, variation names will be null.
:::

### Tracker support for Optimizely

| Tracker                                                                    | Supported | Since version | Auto-tracking |
| -------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/optimizely/index.md)      | ✅         | 3.0.0         | ✅             |
| iOS                                                                        | ❌         |               |               |
| Android                                                                    | ❌         |               |               |
| React Native                                                               | ❌         |               |               |
| Flutter                                                                    | ❌         |               |               |
| Roku                                                                       | ❌         |               |               |

## Google Analytics cookies

The GA cookies plugin captures Google Analytics cookie values (both GA4 and Universal Analytics) and attaches them to all events.

### GA4 cookies entity

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    _ga: "G-1234",
    cookie_prefix: "prefix",
    session_cookies: [
      { measurement_id: "G-1234", session_cookie: "567" }
    ]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for GA4 cookies context", "self": { "vendor": "com.google.ga4", "name": "cookies", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "_ga": { "type": "string", "description": "The _ga cookie value" }, "cookie_prefix": { "type": ["string", "null"], "description": "The cookie prefix if configured" }, "session_cookies": { "type": "array", "items": { "type": "object", "properties": { "measurement_id": { "type": "string" }, "session_cookie": { "type": "string" } } }, "description": "Session cookie values by measurement ID" } }, "additionalProperties": false }} />

### Universal Analytics cookies entity

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    _ga: "GA1.2.3.4"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for Universal Analytics cookies context", "self": { "vendor": "com.google.analytics", "name": "cookies", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "_ga": { "type": ["string", "null"], "description": "The _ga cookie value" }, "__utma": { "type": ["string", "null"], "description": "Classic GA cookie" }, "__utmb": { "type": ["string", "null"], "description": "Classic GA cookie" }, "__utmc": { "type": ["string", "null"], "description": "Classic GA cookie" }, "__utmv": { "type": ["string", "null"], "description": "Classic GA cookie" }, "__utmz": { "type": ["string", "null"], "description": "Classic GA cookie" } }, "additionalProperties": false }} />

### Tracker support for GA cookies

| Tracker                                                                    | Supported | Since version | Auto-tracking |
| -------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/ga-cookies/index.md)      | ✅         | 3.0.0         | ✅             |
| iOS                                                                        | ❌         |               |               |
| Android                                                                    | ❌         |               |               |
| React Native                                                               | ❌         |               |               |
| Flutter                                                                    | ❌         |               |               |
| Roku                                                                       | ❌         |               |               |

## Kantar Focal Meter

The Focal Meter plugin integrates with [Kantar Focal Meter](https://www.virtualmeter.co.uk/focalmeter), a router-based audience measurement system. The plugin sends domain user IDs to Focal Meter endpoints to enable content audience measurement.

This integration sends data to Kantar's endpoint rather than attaching an entity to events.

### Tracker support for Focal Meter

| Tracker                                                                    | Supported | Since version | Auto-tracking |
| -------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/focalmeter/index.md)      | ✅         | 3.16.0        | ✅             |
| iOS                                                                        | ❌         |               |               |
| Android                                                                    | ❌         |               |               |
| React Native                                                               | ❌         |               |               |
| Flutter                                                                    | ❌         |               |               |
| Roku                                                                       | ❌         |               |               |

## Privacy Sandbox (deprecated)

:::warning
The Privacy Sandbox Topics API has been deprecated by Google. This plugin remains available but the underlying browser API may no longer be supported.
:::

The Privacy Sandbox plugin captures data from the [Topics API](https://developer.chrome.com/docs/privacy-sandbox/topics/overview/), which was designed to provide privacy-preserving interest-based advertising signals.

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    topics: [
      { topic: 123, taxonomyVersion: "1", modelVersion: "2" }
    ]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for Privacy Sandbox Topics context", "self": { "vendor": "com.google.privacysandbox", "name": "topics", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "topics": { "type": "array", "items": { "type": "object", "properties": { "topic": { "type": "integer" }, "taxonomyVersion": { "type": "string" }, "modelVersion": { "type": "string" } } }, "description": "List of topics for the current user" } }, "additionalProperties": false }} />

### Tracker support for Privacy Sandbox

| Tracker                                                                         | Supported | Since version | Auto-tracking |
| ------------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/privacy-sandbox/index.md)      | ✅         | 3.14.0        | ✅             |
| iOS                                                                             | ❌         |               |               |
| Android                                                                         | ❌         |               |               |
| React Native                                                                    | ❌         |               |               |
| Flutter                                                                         | ❌         |               |               |
| Roku                                                                            | ❌         |               |               |

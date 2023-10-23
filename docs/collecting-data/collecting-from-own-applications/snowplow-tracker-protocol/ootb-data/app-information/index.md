---
title: "App & tracker information"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

Information about the app and the tracker instance that the events originate from is tracked using:

1. Atomic event properties
2. Application context entity on mobile apps

## Atomic event properties

These properties can be assigned across all our trackers regardless of the platform.

Tracker payload parameter | Atomic table field | Type | Description | Example values
---|---|---|---|---
`tna` | `name_tracker` | text | The tracker namespace | `tracker_1`
`aid` | `app_id` | text | Unique identifier for website / application | `snow-game-android`
`p` | `platform` | text | The platform the app runs on | `web`, `mob`, `app`
`tv` | `v_tracker` | text | Identifier for Snowplow tracker. The format follows the convention of `TRACKER_NAME-TRACKER_VERSION` | `js-2.16.2`

:::info Tracker namespace
The tracker namespace parameter is used to distinguish between different trackers. The name can be any string that _does not_ contain a colon or semi-colon character. Tracker namespacing allows you to run multiple trackers, pinging to different collectors.
:::

<details>
  <summary>Allowed values for the platform property</summary>
  <div>

Platform | `p` value
---|---
Web (including Mobile Web) | `web`
Mobile/Tablet | `mob`
Desktop/Laptop/Netbook | `pc`
Server-Side App | `srv`
General App | `app`
Connected TV | `tv`
Games Console | `cnsl`
Internet of Things | `iot`
Headset | `headset`

  </div>
</details>

### How to track?

TODO

## Application context entity on mobile apps

This context entity is automatically tracked with events on mobile apps and gives information about the app version and build number.

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: true}}
  example={{
    "version": "1.1.0",
    "build": "s9f2k2d",
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an application context which automatically tracks version number and build name when using our mobile SDK's.", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "application", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "version": { "type": "string", "description": "Version number of the application e.g 1.1.0", "maxLength": 255 }, "build": { "type": "string", "description": "Build name of the application e.g s9f2k2d or 1.1.0 beta", "maxLength": 255 } }, "required": ["version", "build"], "additionalProperties": false }} />

### How to track?

It is tracked on our [iOS and Android trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/platform-and-application-context/index.md#application-context) as well as on the [React Native](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/tracking-events/platform-and-application-context/index.md#application-context) and Flutter tracker (when used in iOS or Android).

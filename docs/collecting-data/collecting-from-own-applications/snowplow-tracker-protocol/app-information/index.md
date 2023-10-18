---
title: "App & tracker information"
---

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
`tv` | `v_tracker` | text | Identifier for Snowplow tracker | `js-2.16.2`

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

 | 
---|---
Type | Context entity
Schema | `iglu://com.snowplowanalytics.mobile/application/jsonschema/1-0-0` 
Web | ❌
Mobile | ✅
Atomic table field name | `context_com_snowplowanalytics_mobile_application_1`
Tracked automatically | ✅

### Example payload

version | build
---|---
1.1.0 | s9f2k2d

<details>
  <summary>Application context entity schema properties</summary>
  <div>

The [application context entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.mobile/application/jsonschema/1-0-0) contains two properties:

| Property | Type | Description | Required in schema |
| --- | --- | --- | --- |
| `version` | String | Version number of the application e.g `1.1.0` | Yes |
| `build` | String | Build name of the application e.g `s9f2k2d` or `1.1.0 beta` | Yes |

  </div>
</details>

### How to track?

It is tracked on our [iOS and Android trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/platform-and-application-context/index.md#application-context) as well as on the [React Native](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/tracking-events/platform-and-application-context/index.md#application-context) and Flutter tracker (when used in iOS or Android).

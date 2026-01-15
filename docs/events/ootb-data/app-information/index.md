---
title: "App and tracker information"
sidebar_label: "App and tracker information"
sidebar_position: 10
description: "Track application and tracker metadata including version, build, platform, and namespace in atomic fields and context entities."
keywords: ["app information", "tracker metadata", "app_id", "tracker version"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Information about the application and the tracker instance that is sending the events to Snowplow can be useful for data analysis and troubleshooting issues.

You can track this in two ways: setting [atomic event properties](/docs/fundamentals/canonical-event/index.md), or configuring the application entity.

## Application atomic event properties

These [properties](/docs/fundamentals/canonical-event/index.md#application-fields) can be assigned across all our trackers, regardless of the platform.

| Atomic table field | Type | Description                                                                                          | Example values      |
| ------------------ | ---- | ---------------------------------------------------------------------------------------------------- | ------------------- |
| `name_tracker`     | text | The tracker namespace                                                                                | `tracker_1`         |
| `app_id`           | text | Unique identifier for website / application                                                          | `snow-game-android` |
| `platform`         | text | The platform the app runs on                                                                         | `web`, `mob`, `app` |
| `v_tracker`        | text | Identifier for Snowplow tracker. The format follows the convention of `TRACKER_NAME-TRACKER_VERSION` | `js-2.16.2`         |

You can specify the tracker namespace and app ID when creating a new tracker instance.

The tracker platform is set automatically but can be overriden in most of our trackers. The tracker version is also set automatically.

## Application entity

You can configure your web or mobile trackers to automatically include an application entity with all tracked events.

The included data is slightly different depending on the platform, as different schemas are used:
* Web: `version` only
* Mobile: `version` and `build`

### Tracker support

This table shows the support for the application entity across the main client-side Snowplow [tracker SDKs](/docs/sources/index.md). The server-side trackers don't include this entity.

| Tracker                                                                                                                | Supported | Since version | Auto-tracking | Notes                                                |
| ---------------------------------------------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ---------------------------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/index.md#setting-application-version)                                 | ✅         | 4.1.0         | ❌             |                                                      |
| [iOS](/docs/sources/mobile-trackers/tracking-events/platform-and-application-context/index.md#application-context)     | ✅         | 1.0.0         | ✅             | Tracked by default                                   |
| [Android](/docs/sources/mobile-trackers/tracking-events/platform-and-application-context/index.md#application-context) | ✅         | 1.0.0         | ✅             | Tracked by default                                   |
| [React Native](/docs/sources/react-native-tracker/tracking-events/platform-and-application-context/index.md)           | ✅         | 4.0.0         | ❌             | Uses web or mobile schema depending on configuration |
| [Flutter](/docs/sources/flutter-tracker/initialization-and-configuration/index.md)                                     | ✅         | 0.3.0         | ✅             | Available for mobile only                            |
| [Roku](/docs/sources/roku-tracker/adding-data/index.md)                                                                | ✅         | 0.1.0         | ❌             |                                                      |

The native mobile trackers are able to extract the application version and build number automatically from the app metadata.

For web, you need to provide the application version manually in the tracker configuration.

### Entity definitions

Web applications:

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: false}}
  example={{
    "version": "1.1.0"
  }}
  schema={{ "description": "Schema for an application context which tracks the app version.", "properties": { "version": { "type": "string", "description": "Version of the application. Can be a semver-like structure (e.g 1.1.0) or a Git commit SHA hash.", "maxLength": 255 } }, "additionalProperties": false, "type": "object", "required": [ "version" ], "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "application", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />


Mobile applications:

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: true}}
  example={{
    "version": "1.1.0",
    "build": "s9f2k2d",
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an application context which automatically tracks version number and build name when using our mobile SDK's.", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "application", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "version": { "type": "string", "description": "Version number of the application e.g 1.1.0", "maxLength": 255 }, "build": { "type": "string", "description": "Build name of the application e.g s9f2k2d or 1.1.0 beta", "maxLength": 255 } }, "required": ["version", "build"], "additionalProperties": false }} />

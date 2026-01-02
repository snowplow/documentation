---
title: "App and tracker information"
sidebar_label: "App and tracker information"
description: "Track application and tracker metadata including version, build, platform, and namespace in atomic fields and context entities."
keywords: ["app information", "tracker metadata", "app_id", "tracker version"]
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

Information about the app and the tracker instance that the events originate from is tracked using:

1. Atomic event properties
2. Application context entity on mobile apps

## Atomic event properties

These properties can be assigned across all our trackers regardless of the platform.

| Atomic table field | Type | Description                                                                                          | Example values      |
| ------------------ | ---- | ---------------------------------------------------------------------------------------------------- | ------------------- |
| `name_tracker`     | text | The tracker namespace                                                                                | `tracker_1`         |
| `app_id`           | text | Unique identifier for website / application                                                          | `snow-game-android` |
| `platform`         | text | The platform the app runs on                                                                         | `web`, `mob`, `app` |
| `v_tracker`        | text | Identifier for Snowplow tracker. The format follows the convention of `TRACKER_NAME-TRACKER_VERSION` | `js-2.16.2`         |

:::info Tracker namespace
The tracker namespace parameter is used to distinguish between different trackers. The name can be any string that _does not_ contain a colon or semi-colon character. Tracker namespacing allows you to run multiple trackers, pinging to different collectors.
:::

### How to track?

You can specify the tracker namespace and app ID when creating a new tracker instance (the `newTracker` call in the JavaScript and `Snowplow.createTracker` in mobile trackers).
The tracker platform is set automatically but can be overriden in most of our trackers.
The tracker version is also set automatically.

## Application context entity on Web apps

This context entity is tracked with events tracked using the JavaScript tracker starting from version 4.1.0.
The application version is provided in the tracker configuration, [see instructions here](/docs/sources/web-trackers/tracking-events/index.md#setting-application-version).

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: false}}
  example={{
    "version": "1.1.0"
  }}
  schema={{ "description": "Schema for an application context which tracks the app version.", "properties": { "version": { "type": "string", "description": "Version of the application. Can be a semver-like structure (e.g 1.1.0) or a Git commit SHA hash.", "maxLength": 255 } }, "additionalProperties": false, "type": "object", "required": [ "version" ], "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "application", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />


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

It is tracked on our [iOS and Android trackers](/docs/sources/mobile-trackers/tracking-events/platform-and-application-context/index.md#application-context) as well as on the [React Native](/docs/sources/react-native-tracker/tracking-events/platform-and-application-context/index.md#application-context) and Flutter tracker (when used in iOS or Android).

---
title: "Mobile app install and lifecycle events"
sidebar_label: "Mobile lifecycle"
sidebar_position: 110
description: "Automatically track mobile app install, foreground, and background events with lifecycle entities for app usage analysis."
keywords: ["app install", "app lifecycle", "foreground events", "background events", "mobile tracking"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Mobile lifecycle events track key moments in your app's usage: when a user installs the app, opens it, or switches away. These events help you understand user engagement patterns, measure retention, and analyze session behavior.

We recommend using the [Base mobile data product template](/docs/data-product-studio/data-products/data-product-templates/index.md#base-mobile) for mobile tracking. It includes install and lifecycle events.

## Install events

The mobile trackers can automatically track an install event when the app is first opened after installation.

:::note No uninstall events
It's not possible to track when an app is uninstalled, since the mobile platforms don't provide a callback where such an event could be tracked.
:::

This event has no properties since the relevant data is the timestamp, which is captured in the standard event fields.

<SchemaProperties
  overview={{event: true}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an event where a mobile application is installed.", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "application_install", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { }, "additionalProperties": false }} />

### Tracker support

This table shows the support for mobile application install tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md).

Depending on your tracker and version, install autotracking may be enabled by default.

| Tracker                                                                                           | Supported | Since version | Auto-tracking | Notes                           |
| ------------------------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ------------------------------- |
| Web                                                                                               | ❌         |               |               |                                 |
| [iOS](/docs/sources/mobile-trackers/tracking-events/installation-tracking/index.md)               | ✅         | 1.1.0         | ✅             |                                 |
| [Android](/docs/sources/mobile-trackers/tracking-events/installation-tracking/index.md)           | ✅         | 1.1.0         | ✅             |                                 |
| [React Native](/docs/sources/react-native-tracker/tracking-events/installation-tracking/index.md) | ✅         | 0.1.0         | ✅             | Only relevant for mobile events |
| Flutter                                                                                           | ❌         |               |               |                                 |
| Roku                                                                                              | ❌         |               |               |                                 |

### Android referrer details entity

On Android only, the Android tracker can attach an extra [entity with install referrer information](/docs/sources/mobile-trackers/tracking-events/installation-tracking/index.md#android-only-tracking-referrer-information-from-the-google-play-referrer-library) to the install event. It makes use of the [Google Play Install Referrer library](https://developer.android.com/google/play/installreferrer) to retrieve the referrer information.

This entity is available from Android tracker version 5.2.0 onwards.

<SchemaProperties
  overview={{event: true}}
  example={{
		"installReferrer": "https://play.google.com/store/apps/details?id=com.example.myapp&referrer=someid%3Dsomedata",
		"referrerClickTimestamp": "2023-11-03T09:55:29.920Z",
		"installBeginTimestamp": "2023-11-03T10:55:29.920Z",
		"googlePlayInstantParam": true
   }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Represents an install referrer details for Android apps installed from the Play Store (see https://developer.android.com/reference/com/android/installreferrer/api/ReferrerDetails)", "self": { "vendor": "com.android.installreferrer.api", "name": "referrer_details", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "installReferrer": { "type": ["string", "null"], "maxLength": 4096, "description": "The referrer URL of the installed package" }, "referrerClickTimestamp": { "type": ["string", "null"], "format": "date-time", "description": "The timestamp when referrer click happens" }, "installBeginTimestamp": { "type": ["string", "null"], "format": "date-time", "description": "The timestamp when installation begins" }, "googlePlayInstantParam": { "type": "boolean", "description": "Boolean indicating if the user has interacted with the app's instant experience in the past 7 days" } }, "required": ["googlePlayInstantParam"], "additionalProperties": false }} />

## Foreground and background

Foreground and background events capture when the user switches to or away from your app. A foreground event fires when the app becomes visible on screen, while a background event fires when the user switches to another app or returns to the home screen.

The mobile trackers can track these events automatically. They also attach a lifecycle entity to all events, indicating whether the app was visible when each event occurred.

### Foreground event

The foreground event is tracked each time the app becomes visible on the screen. The `foregroundIndex` property counts how many times the app has been foregrounded since installation.

<SchemaProperties
  overview={{event: true}}
  example={{ foregroundIndex: 1 }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an application foreground event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "application_foreground", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "foregroundIndex": { "type": "integer", "minimum": 0, "maximum": 2147483647 } }, "additionalProperties": false }} />

### Background event

The background event is tracked when the app is no longer visible, such as when the user switches to another app or returns to the home screen. The `backgroundIndex` property counts how many times the app has been backgrounded since installation.

<SchemaProperties
  overview={{event: true}}
  example={{ backgroundIndex: 1 }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an application background event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "application_background", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "backgroundIndex": { "type": "integer", "minimum": 0, "maximum": 2147483647 } }, "additionalProperties": false }} />

### Lifecycle entity

When lifecycle autotracking is enabled, this entity is automatically attached to all events. It indicates whether the app was in the foreground or background when the event occurred.

<SchemaProperties
  overview={{event: false}}
  example={{
    "isVisible": true,
    "index": 2
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Entity that indicates the visibility state of the app (foreground, background)", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "application_lifecycle", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "isVisible": { "description": "Indicates if the app is in foreground state (true) or background state (false)", "type": "boolean" }, "index": { "description": "Represents the foreground index or background index (tracked with com.snowplowanalytics.snowplow application_foreground and application_background events.", "type": "integer", "minimum": 0, "maximum": 2147483647 } }, "required": ["isVisible"], "additionalProperties": false }} />

### Tracker support

This table shows the support for mobile lifecycle event tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md). The server-side trackers don't include lifecycle event tracking.

Depending on your tracker and version, lifecycle autotracking may be enabled by default.

| Tracker                                                                                                        | Supported | Since version | Auto-tracking | Notes                           |
| -------------------------------------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ------------------------------- |
| Web                                                                                                            | ❌         |               |               |                                 |
| [iOS](/docs/sources/mobile-trackers/tracking-events/index.md#tracking-deep-links)                              | ✅         | 3.0.0         | ✅             |                                 |
| [Android](/docs/sources/mobile-trackers/tracking-events/index.md#tracking-deep-links)                          | ✅         | 3.0.0         | ✅             |                                 |
| [React Native](/docs/sources/react-native-tracker/tracking-events/index.md#tracking-deep-link-received-events) | ✅         | 0.1.0         | ✅             | Only relevant for mobile events |
| [Flutter](/docs/sources/flutter-tracker/initialization-and-configuration/index.md)                             | ✅         | 0.5.0         | ✅             | Only relevant for mobile events |
| Roku                                                                                                           | ❌         |               |               |                                 |

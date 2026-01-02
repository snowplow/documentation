---
title: "Mobile app install and lifecycle events"
sidebar_label: "Mobile lifecycle events"
description: "Automatically track mobile app install, foreground, and background events with lifecycle entities for app usage analysis."
keywords: ["app install", "app lifecycle", "foreground events", "background events", "mobile tracking"]
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TOCInline from '@theme/TOCInline';
```

Mobile app usage lifecycle consists of several events that are important to understand how a user uses an app.
These are the app install, foreground, and background events.

The app install event is tracked the first time the app is opened after installation.
The background and foreground events are tracked when the user moves the app to background and foreground (the app becomes visible on the screen again).
These events can be tracked automatically by our mobile trackers if configured to do so.
Additionaly, the tracker attaches a LifecycleEntity to all the events tracked by the tracker reporting if the app was visible (foreground state) when the event was tracked.

:::note
It is not possible to track an event when an app is uninstalled since the mobile platforms do not provide a callback where such an event could be tracked.
:::

<TOCInline toc={toc} maxHeadingLevel={2} />

## Install event

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: true}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an event where a mobile application is installed.", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "application_install", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { }, "additionalProperties": false }} />

### Android referrer details context entity

On Android, an extra context entity with install referrer information can be attached to the install event.
It makes use of the [Google Play Install Referrer library](https://developer.android.com/google/play/installreferrer) to retrieve the referrer information.

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: true}}
  example={{
		"installReferrer": "https://play.google.com/store/apps/details?id=com.example.myapp&referrer=someid%3Dsomedata",
		"referrerClickTimestamp": "2023-11-03T09:55:29.920Z",
		"installBeginTimestamp": "2023-11-03T10:55:29.920Z",
		"googlePlayInstantParam": true
   }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Represents an install referrer details for Android apps installed from the Play Store (see https://developer.android.com/reference/com/android/installreferrer/api/ReferrerDetails)", "self": { "vendor": "com.android.installreferrer.api", "name": "referrer_details", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "installReferrer": { "type": ["string", "null"], "maxLength": 4096, "description": "The referrer URL of the installed package" }, "referrerClickTimestamp": { "type": ["string", "null"], "format": "date-time", "description": "The timestamp when referrer click happens" }, "installBeginTimestamp": { "type": ["string", "null"], "format": "date-time", "description": "The timestamp when installation begins" }, "googlePlayInstantParam": { "type": "boolean", "description": "Boolean indicating if the user has interacted with the app's instant experience in the past 7 days" } }, "required": ["googlePlayInstantParam"], "additionalProperties": false }} />

#### How to track?

See the [documentation for the Android tracker](/docs/sources/mobile-trackers/tracking-events/installation-tracking/index.md#android-only-tracking-referrer-information-from-the-google-play-referrer-library) for more information how to track the entity.

## Foreground event

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: true}}
  example={{ foregroundIndex: 1 }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an application foreground event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "application_foreground", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "foregroundIndex": { "type": "integer", "minimum": 0, "maximum": 2147483647 } }, "additionalProperties": false }} />

## Background event

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: true}}
  example={{ backgroundIndex: 1 }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an application background event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "application_background", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "backgroundIndex": { "type": "integer", "minimum": 0, "maximum": 2147483647 } }, "additionalProperties": false }} />

## Lifecycle context entity

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: true}}
  example={{
    "isVisible": true,
    "index": 2
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Entity that indicates the visibility state of the app (foreground, background)", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "application_lifecycle", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "isVisible": { "description": "Indicates if the app is in foreground state (true) or background state (false)", "type": "boolean" }, "index": { "description": "Represents the foreground index or background index (tracked with com.snowplowanalytics.snowplow application_foreground and application_background events.", "type": "integer", "minimum": 0, "maximum": 2147483647 } }, "required": ["isVisible"], "additionalProperties": false }} />

## How to track?

* [iOS and Android tracker documentation](/docs/sources/mobile-trackers/tracking-events/lifecycle-tracking/index.md).
* [React Native tracker documentation](/docs/sources/react-native-tracker/tracking-events/lifecycle-tracking/index.md).

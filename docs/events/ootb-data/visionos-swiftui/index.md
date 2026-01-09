---
title: "visionOS and SwiftUI"
sidebar_label: "visionOS and SwiftUI"
description: "Track window groups and immersive spaces in visionOS apps on Apple Vision Pro using SwiftUI context entities and events."
keywords: ["visionOS", "SwiftUI", "Apple Vision Pro", "window groups", "immersive spaces"]
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TOCInline from '@theme/TOCInline';
```

Use the window group and immersive space context entities and events to understand user behavior within visionOS apps on Apple's Vision Pro headset.

Track the opening and dismissing of SwiftUI window groups using `OpenWindowEvent` and `DismissWindowEvent`. These events can be used in any SwiftUI app, not just visionOS. The event data is sent as a window group context entity attached to these events; the events themselves have no properties.

Use the `OpenImmersiveSpaceEvent` and `DismissImmersiveSpaceEvent` to automatically add an immersive space context entity to all events occurring within an immersive space. The entity will identify the immersive space in which the events occurred. This feature is enabled by default for the iOS tracker. Again, the events themselves have no properties.

Snowplow currently only supports visionOS apps via SwiftUI, not Unity.

<TOCInline toc={toc} maxHeadingLevel={2} />

## Window group context entity

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: false}}
  example={{ 
    id: "group1",
    window_id: "BC374B59-B8E7-4F09-B100-FD5F9AAC0E27",
    title_key: "window1",
    window_style: "automatic"
  }}
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.apple.swiftui", "name": "window_group", "format": "jsonschema", "version": "1-0-0" }, "description": "Schema for a window group entity, representing the SwiftUI window group that the event occurs in.", "type": "object", "properties": { "window_id": { "type": ["string", "null"], "format": "uuid", "description": "UUID for the current window within the group." }, "id": { "type": "string", "description": "A string that uniquely identifies the window group. Identifiers must be unique among the window groups in your app.", "maxLength": 255 }, "title_key": { "type": [ "string", "null" ], "description": "A localized string key to use for the window's title in system menus and in the window's title bar. Provide a title that describes the purpose of the window.", "maxLength": 4096 }, "window_style": { "type": ["string", "null"], "enum": [ "automatic", "hiddenTitleBar", "plain", "titleBar", "volumetric", null ], "description": "A specification for the appearance and interaction of a window." } }, "required": [ "id" ], "additionalProperties": false }} />

## Immersive space context entity

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: true}}
  example={{ 
    id: "space1",
    view_id: "C0A92B47-9654-4889-BC95-97E1C3721A53",
    immersion_style: "mixed",
    upper_limb_visibility: "visible"
  }}
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.apple.swiftui", "name": "immersive_space", "format": "jsonschema", "version": "1-0-0" }, "description": "Schema for an immersive space entity, representing the VisionOS immersive space that the event occurs in.", "type": "object", "properties": { "view_id": { "type": ["string", "null"], "format": "uuid", "description": "UUID for the view of the immersive space." }, "id": { "type": "string", "description": "The identifier of the immersive space to present.", "maxLength": 255 }, "immersion_style": { "type": ["string", "null"], "enum": [ "automatic", "full", "mixed", "progressive", null ], "description": "The style of an immersive space." }, "upper_limb_visibility": { "type": ["string", "null"], "enum": [ "automatic", "visible", "hidden", null ], "description": "Preferred visibility of the user's upper limbs, while an immersive space scene is presented." } }, "required": [ "id" ], "additionalProperties": false }} />

## Open window event

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: false}}
  example={{ }}
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.apple.swiftui", "name": "open_window", "format": "jsonschema", "version": "1-0-0" }, "description": "Schema for an event for opening a SwiftUI window or window group.", "type": "object", "properties": {}, "additionalProperties": false }} />

## Dismiss window event

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: false}}
  example={{ }}
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.apple.swiftui", "name": "dismiss_window", "format": "jsonschema", "version": "1-0-0" }, "description": "Schema for an event for dismissing a SwiftUI window or window group.", "type": "object", "properties": {}, "additionalProperties": false }} />

## Open immersive space event

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: false}}
  example={{ }}
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.apple.swiftui", "name": "open_immersive_space", "format": "jsonschema", "version": "1-0-0" }, "description": "Schema for an event for opening a visionOS immersive space.", "type": "object", "properties": {}, "additionalProperties": false }} />

## Dismiss immersive space event

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: false}}
  example={{ }}
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.apple.swiftui", "name": "dismiss_immersive_space", "format": "jsonschema", "version": "1-0-0" }, "description": "Schema for an event for dismissing a visionOS immersive space.", "type": "object", "properties": {}, "additionalProperties": false }} />

## How to track?

* [iOS tracker documentation](/docs/sources/mobile-trackers/tracking-events/visionos/index.md).

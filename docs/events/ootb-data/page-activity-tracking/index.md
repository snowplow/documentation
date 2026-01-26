---
title: "Page and screen engagement"
sidebar_label: "Page and screen engagement"
sidebar_position: 120
description: "Measure user engagement time and scrolling depth using page ping events on web and screen summary entities on mobile."
keywords: ["page pings", "activity tracking", "scroll tracking", "engagement tracking", "screen summary"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Activity or engagement tracking enables you to measure the time a user spent engaged on a page or screen, and the extent of the page or screen they viewed.

Snowplow provides implementations for web and mobile platforms:
* Page ping events on web
* Screen summary entity on mobile

Both page and screen activity tracking are included in the [Snowplow Unified Digital package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) to calculate engagement metrics. The legacy [Web package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/index.md) handles page pings as well.

## Page engagement

Page ping events record users engaging with content on a web page after it has initially loaded. This includes scroll position.

Where activity autotracking is available, you can configure your tracker to send page ping events at regular intervals. They're considered a type of "heartbeat" event that indicates the user is still present and engaging with the page.

Page ping events are [baked-in events](/docs/fundamentals/events/index.md) that have no schema. They populate the [page offset atomic event parameters](/docs/fundamentals/canonical-event/index.md#baked-in-event-fields).

This table shows the support for page ping tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md). Python is the only server-side tracker that provides page ping events.

| Tracker                                                                            | Supported | Since version | Auto-tracking | Notes                              |
| ---------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ---------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/activity-page-pings/index.md)     | ✅         | 0.10.0        | ✅             |                                    |
| iOS                                                                                | ❌         |               |               |                                    |
| Android                                                                            | ❌         |               |               |                                    |
| React Native                                                                       | ❌         |               |               |                                    |
| [Flutter](/docs/sources/flutter-tracker/initialization-and-configuration/index.md) | ✅         | 0.1.0         | ✅             | Only on web                        |
| Roku                                                                               | ❌         |               |               |                                    |
| [Python](/docs/sources/python-tracker/tracking-specific-events/index.md)           | ✅         | 0.8.0         | ❌             | Detect activity and track manually |
| [Google Tag Manager](/docs/sources/google-tag-manager/snowplow-template/index.md)  | ✅         | v3            | ✅             |                                    |

We recommend using the [Base web tracking plan template](/docs/data-product-studio/data-products/data-product-templates/index.md#base-web) for web tracking. It includes page pings.

## Screen engagement

Use screen engagement tracking on mobile to track a `screen_end` event when a user navigates away from a screen.

The trackers can also track a `screen_summary` entity that contains screen engagement data. This entity is sent along with [lifecycle](/docs/events/ootb-data/mobile-lifecycle-events/index.md) and `screen_end` events.

This table shows the support for screen engagement tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md). The server-side trackers don't include screen engagement tracking.

| Tracker                                                                                                                | Supported | Since version | Auto-tracking | Notes          |
| ---------------------------------------------------------------------------------------------------------------------- | --------- | ------------- | ------------- | -------------- |
| Web                                                                                                                    | ❌         |               |               |                |
| [iOS](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md#screen-engagement-tracking)               | ✅         | 6.0.0         | ✅             |                |
| [Android](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md#screen-engagement-tracking)           | ✅         | 6.0.0         | ✅             |                |
| [React Native](/docs/sources/react-native-tracker/tracking-events/screen-tracking/index.md#screen-engagement-tracking) | ✅         | 2.1.0         | ✅             | Only on mobile |
| [Flutter](/docs/sources/flutter-tracker/tracking-events/index.md#screen-engagement-tracking)                           | ✅         | 0.1.0         | ✅             | Only on mobile |
| Roku                                                                                                                   | ❌         |               |               |                |
| Google Tag Manager                                                                                                     | ❌         |               |               |                |

We recommend using the [Base mobile tracking plan template](/docs/data-product-studio/data-products/data-product-templates/index.md#base-mobile) for mobile tracking. It includes screen end events.

### Screen end event

This event can be tracked automatically by the mobile trackers just before the transition to the next screen. It has no properties.

<SchemaProperties
  overview={{event: true}}
  schema={{ "description": "Schema for an event tracked before transitioning to a new screen", "properties": {}, "additionalProperties": false, "type": "object", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "screen_end", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />

### Screen summary entity

Entity that contains screen engagement information, including how long a user spends on a screen in the foreground and background, as well as scroll depth.

<SchemaProperties
  overview={{event: false}}
  example={{ foreground_sec: 10.2, background_sec: 3.1, last_item_index: 11, items_count: 50, min_x_offset: 0, max_x_offset: 400, min_y_offset: 0, max_y_offset: 1000, content_width: 400, content_height: 5000 }}
  schema={{ "description": "Schema for an entity tracked with foreground/background/screen_end events with summary statistics about the screen view", "properties": { "foreground_sec": { "type": "number", "description": "Time in seconds spent on the current screen while the app was in foreground", "minimum": 0, "maximum": 2147483647 }, "background_sec": { "type": [ "number", "null" ], "description": "Time in seconds spent on the current screen while the app was in background", "minimum": 0, "maximum": 2147483647 }, "last_item_index": { "type": [ "integer", "null" ], "description": "Index of the last viewed item in the list on the screen", "minimum": 0, "maximum": 65535 }, "items_count": { "type": [ "integer", "null" ], "description": "Total number of items in the list on the screen", "minimum": 0, "maximum": 65535 }, "min_x_offset": { "type": [ "integer", "null" ], "description": "Minimum horizontal scroll offset on the scroll view in pixels", "minimum": -2147483647, "maximum": 2147483647 }, "max_x_offset": { "type": [ "integer", "null" ], "description": "Maximum horizontal scroll offset on the scroll view in pixels", "minimum": -2147483647, "maximum": 2147483647 }, "min_y_offset": { "type": [ "integer", "null" ], "description": "Minimum vertical scroll offset on the scroll view in pixels", "minimum": -2147483647, "maximum": 2147483647 }, "max_y_offset": { "type": [ "integer", "null" ], "description": "Maximum vertical scroll offset on the scroll view in pixels", "minimum": -2147483647, "maximum": 2147483647 }, "content_width": { "type": [ "integer", "null" ], "description": "Width of the scroll view in pixels", "minimum": 0, "maximum": 2147483647 }, "content_height": { "type": [ "integer", "null" ], "description": "Height of the scroll view in pixels", "minimum": 0, "maximum": 2147483647 } }, "additionalProperties": false, "type": "object", "required": [ "foreground_sec" ], "self": { "vendor": "com.snowplowanalytics.mobile", "name": "screen_summary", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />

---
title: "Page and screen engagement"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

Page or screen activity (engagement) tracking enables you to measure the time users spent engaged on a page or screen and the extent of the page/screen they viewed.
There are two mechanisms that the activity tracking is implemented:

1. Using page ping events on Web.
2. Using the screen summary entity on mobile.

## On Web using page ping events

Page pings are used to record users engaging with content on a web page after it has originally loaded. For example, it can be used to track how far down an article a user scrolls.

If enabled, the [activity tracking function](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/activity-page-pings/index.md) checks for engagement with a page after load. (E.g. mousemovement, scrolling etc...).

Page pings are identified by `e=pp`. As well as all the standard web fields, there are four additional fields that `pp` includes, which are used to identify how users are scrolling over web pages:

| **Atomic Table Column** | **Type** | **Description**                                    | **Example values** |
| ----------------------- | -------- | -------------------------------------------------- | ------------------ |
| `pp_xoffset_min`        | integer  | Minimum page x offset seen in the last ping period | `0`                |
| `pp_xoffset_max`        | integer  | Maximum page x offset seen in the last ping period | `100`              |
| `pp_yoffset_min`        | integer  | Minimum page y offset seen in the last ping period | `0`                |
| `pp_yoffset_max`        | integer  | Maximum page y offset seen in the last ping period | `100`              |

## On mobile

:::note
Screen engagement tracking is available for native Android and iOS apps starting with version 6 of the trackers.
:::

Screen engagement information is tracked on our mobile trackers in the `screen_summary` context entity.
The entity is tracked along with these events:

1. `application_foreground` and `application_background` events (see [lifecycle events](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/ootb-data/mobile-lifecycle-events/index.md)).
2. `screen_end` event (see below).

### Screen summary entity

Entity that contains the screen engagement information.

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: true}}
  example={{ foreground_sec: 10.2, background_sec: 3.1, last_item_index: 11, items_count: 50, min_x_offset: 0, max_x_offset: 400, min_y_offset: 0, max_y_offset: 1000, content_width: 400, content_height: 5000 }}
  schema={{ "description": "Schema for an entity tracked with foreground/background/screen_end events with summary statistics about the screen view", "properties": { "foreground_sec": { "type": "number", "description": "Time in seconds spent on the current screen while the app was in foreground", "minimum": 0, "maximum": 2147483647 }, "background_sec": { "type": [ "number", "null" ], "description": "Time in seconds spent on the current screen while the app was in background", "minimum": 0, "maximum": 2147483647 }, "last_item_index": { "type": [ "integer", "null" ], "description": "Index of the last viewed item in the list on the screen", "minimum": 0, "maximum": 65535 }, "items_count": { "type": [ "integer", "null" ], "description": "Total number of items in the list on the screen", "minimum": 0, "maximum": 65535 }, "min_x_offset": { "type": [ "integer", "null" ], "description": "Minimum horizontal scroll offset on the scroll view in pixels", "minimum": -2147483647, "maximum": 2147483647 }, "max_x_offset": { "type": [ "integer", "null" ], "description": "Maximum horizontal scroll offset on the scroll view in pixels", "minimum": -2147483647, "maximum": 2147483647 }, "min_y_offset": { "type": [ "integer", "null" ], "description": "Minimum vertical scroll offset on the scroll view in pixels", "minimum": -2147483647, "maximum": 2147483647 }, "max_y_offset": { "type": [ "integer", "null" ], "description": "Maximum vertical scroll offset on the scroll view in pixels", "minimum": -2147483647, "maximum": 2147483647 }, "content_width": { "type": [ "integer", "null" ], "description": "Width of the scroll view in pixels", "minimum": 0, "maximum": 2147483647 }, "content_height": { "type": [ "integer", "null" ], "description": "Height of the scroll view in pixels", "minimum": 0, "maximum": 2147483647 } }, "additionalProperties": false, "type": "object", "required": [ "foreground_sec" ], "self": { "vendor": "com.snowplowanalytics.mobile", "name": "screen_summary", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />

### Screen end event

This event is tracked automatically by the mobile trackers just before the transition to the next screen.

The event has no properties.

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: true}}
  schema={{ "description": "Schema for an event tracked before transitioning to a new screen", "properties": {}, "additionalProperties": false, "type": "object", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "screen_end", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />

## How to track

To track page activity on Web, see the [activity tracking documentation](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/activity-page-pings/index.md).

To track screen engagement on mobile, see the [screen engagement documentation](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/screen-tracking/index.md#screen-engagemement-tracking).

## Use in modeling

Page and screen activity events are used by our [Snowplow Unified Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) (starting from version 0.2.0) to calculate page engagement metrics.
The [Snowplow Web Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/index.md) can process page ping events.

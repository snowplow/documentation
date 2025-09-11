---
title: "Tracking events"
description: "Track specific behavioral events using Lua tracker in embedded systems and gaming applications."
schema: "TechArticle"
keywords: ["Lua Events", "Event Tracking", "Lua Analytics", "Game Events", "Scripting Events", "Custom Events"]
date: "2020-02-26"
sidebar_position: 40
---

## Creating a Tracker

Creating a tracking instance is as simple as calling `snowplow.new_tracker` and providing a URL for your collector:

```lua
local snowplow = require("snowplow")
local tracker = snowplow.new_tracker("{{ collector_url }}")
```

Tracking methods supported by the Lua Tracker:

| Method | Event type tracked |
| --- | --- |
| track_screen_view | View of screen |
| track_struct_event | Semi-custom structured event |
| track_self_describing_event | Custom event based on “self-describing” JSON schema |

## Track structured events with `track_struct_event`

This method provides a halfway-house between tracking fully user-defined self-describing events and out-of-the box predefined events. This event type can be used to track many types of user activity, as it is somewhat customizable. “Struct” events closely mirror the structure of Google Analytics events, with “category”, “action”, “label”, and “value” properties.

| Parameter | Description | Required in event? |
| --- | --- | --- |
| category | The grouping of structured events which this action belongs to | Yes |
| action | Defines the type of user interaction which this event involves | Yes |
| label | Often used to refer to the ‘object’ the action is performed on | No |
| property | Describing the ‘object’, or the action performed on it | No |
| value | Provides numerical data about the event | No |

```lua
tracker:track_struct_event("shop", "add-to-basket", "book", "pcs", 2)
```

## Track self-describing events with `track_self_describing_event`

Use `track_self_describing_event` to track a custom event. This is the most advanced and powerful tracking method, which requires a certain amount of planning and infrastructure. A guide to understanding Self-Describing events is [available here](/docs/fundamentals/events/index.md#self-describing-events).

| Parameter | Description | Required in event? |
| --- | --- | --- |
| schema | The schema to use | Yes |
| action | The data to send along with the schema | Yes |

```lua
tracker:track_self_describing_event(
  "iglu:com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0",
  { sku = "ASO01043", unitPrice = 49.95, quantity = 1000 }
)
```

## Track screen views with `track_screen_view`

Use track_screen_view to track a user viewing a screen (or similar) within your app. This is the page view equivalent for apps that are not webpages.

This method uses a self-describing event with the [`com.snowplowanalytics.snowplow/screen_view` schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0).

```lua
tracker:track_screen_view("Character Creation - Step 1", "c1")
```

## Configuring the Tracker

The `new_tracker` method has a couple of other parameters that can be used to configure your tracker instance, along with the collector `url`.

| Parameter | Description | Required | Default |
| --- | --- | --- | --- |
| url | The Snowplow Collector URL | Yes | \- |
| request_type | The request type to use ("GET" or "POST") | No | "POST" |
| encode_base64 | If self-describing event payloads are base64 encoded | No | true |

Note: It's generally recommended to use the default values as `encode_base64 = true` can reduce the size of payloads and `POST` will receive more future support (such as batched requests), but you can change these if your use case calls for it.

## Tracker Method Return Values

A call to a `track_*` method will return two values, a boolean if the request was successful, and an optional error message if the request was not successful.

An example of the values returned from a failed request:

```lua
local ok, err = tracker:track_screen_view("Character Configuration - Part 1", "c1")
-- false, Host [https://test.invalid/com.snowplowanalytics.snowplow/tp2] not found (possible connectivity error)
```

An example of the values returned from a successful request:

```lua
local ok, err = tracker:track_screen_view("Character Configuration - Part 1", "c1")
-- true, nil
```

## Adding user and platform data

The tracker can store information about the user associated with the event, such as their `user_id`, what type of device they used, or what size screen that device had. It also stores which platform the event occurred on – e.g. server-side app, mobile, games console, etc. This is done through the provided `set_*` methods available on a tracker instance. The stored information is attached to the tracked events using fields described in the [Tracker Protocol](/docs/events/index.md).

For a full list of setters, check out the [Tracker API Documentation](https://snowplow.github.io/snowplow-lua-tracker/modules/Tracker.html).

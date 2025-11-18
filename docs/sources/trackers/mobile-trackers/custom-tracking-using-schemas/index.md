---
title: "Custom Event Tracking for Mobile Trackers"
date: "2022-08-30"
sidebar_position: 20
---

# Custom event tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Self-describing (self-referential) JSON schemas are at the core of Snowplow tracking. Read more about them [here](/docs/fundamentals/schemas/index.md). They allow you to track completely customised data, and are also used internally throughout Snowplow pipelines.

In all our trackers, self-describing JSON are used in two places. One is in the `SelfDescribing` event type that wraps custom self-describing JSONs for sending. The second use is to attach entities to any tracked event.
The entities can describe the context in which the event happen or provide extra information to better describe the event.

<!-- [Here](TODO) are some more details on what events and entities are. -->

## Tracking a custom event (SelfDescribing)

You may wish to track events in your app which are not directly supported by Snowplow and which structured event tracking does not adequately capture. Your event may have more than the five fields offered by Structured events, or its fields may not fit into the category-action-label-property-value model. The solution is Snowplow’s self-describing events. Self-describing events are a [data structure based on JSON Schemas](/docs/fundamentals/schemas/index.md) and can have arbitrarily many fields.

<!-- [Here](TODO) are some more details on how to create a custom entity. -->

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let data = ["targetUrl": "http://a-target-url.com"];       
let event = SelfDescribing(schema: "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", payload: data)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val data = mapOf(
    "targetUrl" to "http://a-target-url.com"
)
val json = SelfDescribingJson(
    "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1",
    data
)
val event = SelfDescribing(json)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Map<String, String> data = new HashMap<>();
data.put("targetUrl", "http://a-target-url.com");
SelfDescribingJson json = new SelfDescribingJson("iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", data);
SelfDescribing event = new SelfDescribing(json);

tracker.track(event);
```

  </TabItem>
</Tabs>

A Self Describing event is a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/). It has two fields:

- A `data` field, containing the properties of the event
- A `schema` field, containing the location of the JSON schema against which the `data` field should be validated.

See the full configuration and parameter options for all these classes and methods in the API docs - [Android](https://snowplow.github.io/snowplow-android-tracker/index.html) and [iOS](https://snowplow.github.io/snowplow-ios-tracker/documentation/snowplowtracker/).

## Tracking a custom entity

Custom entities can be used to augment any standard Snowplow event type with additional data.
Each custom context is an array of self-describing JSON following the same pattern as a self describing event. As with self describing events, if you want to create your own custom entity, you must create a JSON schema.

<!-- [Here](TODO) some more details on how to create a custom entity. -->

Note: Even if only one custom entity is being attached to an event, it still needs to be wrapped in an array.

Here are two examples of schema for custom entities.
One describes a screen:

```json
{
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    "self": {
        "vendor": "com.example",
        "name": "screen",
        "format": "jsonschema",
        "version": "1-0-1"
    },
    "type": "object",
    "properties": {
        "screenType": {
            "type": "string"
        },
        "lastUpdated": {
            "type": "string"
        }
    }
    "required": ["screenType", "lastUpdated"],
    "additionalProperties": false
}
```

and the other describes a user on that screen:

```json
{
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    "self": {
        "vendor": "com.example",
        "name": "user",
        "format": "jsonschema",
        "version": "2-0-0"
    },
    "type": "object",
    "properties": {
        "user": {
            "type": "string"
        }
    }
    "required": ["user"],
    "additionalProperties": false
}
```

They can be used in the tracker to provide more context to specific events (e.g. ScreenView event).

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = ScreenView(name: "DemoScreenName")
event.entities.add(
    SelfDescribingJson(schema: "iglu:com.example/screen/jsonschema/1-0-1",
        andDictionary: [
             "screenType": "test",
             "lastUpdated": "2021-06-11"
        ])!)     
event.entities.add(
    SelfDescribingJson(schema: "iglu:com.example/user/jsonschema/2-0-0", 
        andDictionary: [
             "userType": "tester"
        ])!)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = ScreenView("screen")
event.entities.add(
    SelfDescribingJson(
        "iglu:com.example/screen/jsonschema/1-2-1",
        mapOf(
            "screenType" to "test",
            "lastUpdated" to "2021-06-11"
        )
    )
)
event.entities.add(
    SelfDescribingJson(
        "iglu:com.example/user/jsonschema/2-0-0",
        mapOf(
            "userType" to "tester"
        )
    )
)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ScreenView event = new ScreenView("screen");
event.getEntities().add(
    new SelfDescribingJson("iglu:com.example/screen/jsonschema/1-2-1",
        new HashMap<String, String>() {{
            put("screenType", "test");
            put("lastUpdated", "2021-06-11");
        }})
);
event.getEntities().add(
    new SelfDescribingJson("iglu:com.example/user/jsonschema/2-0-0",
        new HashMap<String, String>() {{
            put("userType", "tester");
        }})
);

tracker.track(event);
```

  </TabItem>
</Tabs>

---
title: "Custom tracking using schemas"
date: "2022-03-24"
sidebar_position: 30
---

Self-describing (self-referential) JSON schemas are at the core of Snowplow tracking. Read more about them [here](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md). They allow you to track completely customised data, and are also used internally throughout Snowplow pipelines.

In all our trackers, self-describing JSON are used in two places. One is in the `Unstructured`/`SelfDescribing` event type that wraps custom self-describing JSONs for sending. The second use is to attach custom data to any tracked event. It's one of the most powerful Snowplow features.

When tracking user behavior, the event describes the specific activity they performed, e.g. a user added an item to an eCommerce cart. To understand the meaning of the event, and how it relates to your business, it's ideal to also track the persistent environment in which the activity was performed. For example, is the user a repeat customer? Which item did they add, and how many are in stock?

These environmental factors can be tracked as the event "context", using self-describing JSON. When self-describing JSON are tracked as part of an event, they are called "entities". All the entities of an event together form the context. Read more in this [thorough blog post](https://snowplow.io/blog/2020/03/25/what-are-snowplow-events-and-entities-and-what-makes-them-so-powerful/).

### Adding custom entities to any event

Every `Event.Builder` in the Java tracker allows for a list of `SelfDescribingJson` objects to be added to the `Event`. It's fine to add multiple entities of the same type. There's no official limit to how many entities you can add to a single event, but consider if the payload size could become problematic if you are adding a large number.

Context entities can be added to any event using the `customContext()` Builder method:

```java
// This example shows an Unstructured event, but all events can have context
Unstructured unstructured = Unstructured.builder()
            .eventData(dataAsSelfDescribingJson)
            .customContext(listOfEntitiesAsSelfDescribingJson)
            .build();
```

Event context is sent as a JSON inside the event payload. During [enrichment](/docs/enriching-your-data/what-is-enrichment/index.md), it is separated into columns for each different schema used.

A note on nomenclature: entities were originally called "context", with the context called "contexts". The old nomenclature is still used in some parts of Snowplow, meaning that enriched events in the data warehouse refer to "contexts"/"context" rather than "context"/"entity".

### Global context

The Java tracker does not yet provide the ability to automatically assign entities to specific events.

### Self-describing JSON in the Java tracker

The Java tracker provides the `SelfDescribingJson` class for custom events and entities. There is no in-built distinction between schemas used for events and those used for entities: they can be used interchangably.

Your schemas must be accessible to your pipeline, within an [Iglu server](/docs/pipeline-components-and-applications/iglu/index.md). Tracked events containing self-describing JSON are validated against their schemas during the enrichment phase of the pipeline. If the data don't match the schema, the events end up in the Bad Rows storage instead of the data warehouse.

A self-describing JSON needs two keys, `schema` and `data`. The `schema` key is the Iglu URI for the schema. The `data` value must match the properties described by the specified schema. It is usually provided as a map.

A simple initialisation looks like this:

```java
// This map will be used for the "data" key
Map<String, String> eventData = new HashMap<>();
eventData.put("targetUrl", "https://snowplow.io")

// Wrap the map in a SelfDescribingJson
// The specified schema allows for a String property "targetUrl"
SelfDescribingJson sdj = new SelfDescribingJson("iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", eventData);
```

See the API docs for the full [SelfDescribingJson](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/payload/SelfDescribingJson.html) constructor options.

JSON can be sent base-64 encoded or not. By default, they are encoded. This is set as part of the Tracker configuration. See [Setting up](/docs/collecting-data/collecting-from-own-applications/java-tracker/previous-versions/java-tracker-v0-12/installation-and-set-up/index.md#setting-up).

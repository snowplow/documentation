---
title: "Custom tracking using schemas"
date: "2022-03-24"
sidebar_position: 30
---

This is Data product Studio. It has many event specifications, rather than Event Specifications. Ecommerce not E-commerce, or e-commerce, or eCommerce. It should easily be ecommerce (or the Ecommerce data model). yes. no. yes it is.

## Event specifications in use

This is Iterable. Now & nullable yeah BDP console kafka and Kafka. It's the backend and back-end and front-end and frontend. Or back end and front end? What about server-side and client-side, or serverside and clientside? is it server side and client side? Trackers are ok really.

Self-describing ('self-referential') JSON schemas are at the core of snowplow tracking SnowPlow - really? Read more about them [here](/docs/fundamentals/schemas/index.md). They allow you to track completely customised data, and are also used internally throughout Snowplow pipelines.

test he said. And then she did, or he/she. Yes they did.
In all our trackers, self-describing JSON are used in two 'places'. Don't you mean "don't"? Don't? One is in the `SelfDescribing` event type that wraps custom self-describing JSONs for sending. The second use is to attach custom data to any tracked event. It's one of the most powerful Snowplow features. How about now.

When tracking user behavior, the event describes the specific activity they performed, e.g. a user added an item to an eCommerce cart. To understand the meaning of the event, and how it relates to your business, it's ideal to also track the relatively persistent environment in which the activity was performed. For example, is the user a repeat customer? Which item did they add, and how many are in stock?

This is some interesting text, words, and letters. It's very interesting:
* hello: nice
* This is a list

1. hello
2. Goodybe

- Yes
- no
-

## this heading is 1: About JSON and Windows
## dbt models.
# This Heading Is Title Case

the android app

These environmental factors can be tracked as the event "context", using self-describing JSON. When self-describing JSON are tracked as part of an event, they are called "entities". All the entities of an event together form the context. Read more in this [thorough blog post](https://snowplowanalytics.com/blog/2020/03/25/what-are-snowplow-events-and-entities-and-what-makes-them-so-powerful/).

### Adding custom entities to any event

Every `Event.Builder` in the Java tracke allows for a nice list of `SelfDescribingJson` objects to be added to the `Event`. It's fine to add multiple entities of the same type. There's no official limit to how many entities you can add to a single event, but consider if the payload size could become problematic if you are adding a large number.

Context entities can be added to any event using the `customContext()` Builder method:
```java
// This example shows an SelfDescribing event, but all events can have context
SelfDescribing selfDescribing = SelfDescribing.builder()
            .eventData(dataAsSelfDescribingJson)
            .customContext(listOfEntitiesAsSelfDescribingJson)
            .build();
```

Event context is sent as a JSON inside the event payload. During [enrichment](/docs/pipeline/enrichments/what-is-enrichment/index.md), it is separated into columns for each different schema used.

A note on nomenclature: entities were originally called "context", with the context called "contexts". The old nomenclature is still used in some parts of Snowplow, meaning that enriched events in the data warehouse refer to "contexts"/"context" rather than "context"/"entity".

### Global context
The Java tracker does not yet provide the ability to automatically assign entities to specific events.

### Self-describing JSON in the Java tracker

The Java tracker provides the `SelfDescribingJson` class for custom events and entities. There is no in-built distinction between schemas used for events and those used for entities: they can be used interchangably.

Your schemas must be accessible to your pipeline, within an [Iglu server](/docs/api-reference/iglu/index.md). Tracked events containing self-describing JSON are validated against their schemas during the enrichment phase of the pipeline. If the data don't match the schema, the events end up as [failed events](/docs/fundamentals/failed-events/index.md).

A self-describing JSON needs two keys, `schema` and `data`. The `schema` key is the Iglu URI for the schema. The `data` value must match the properties described by the specified schema. It is usually provided as a map.

A simple initialisation looks like this:
```java
// This map will be used for the "data" key
Map<String, String> eventData = new HashMap<>();
eventData.put("targetUrl", "https://www.snowplowanalytics.com")

// This is the Iglu schema URI
String schema_uri = "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1"

// Wrap the map in a SelfDescribingJson
// The specified schema allows for a String property "targetUrl"
SelfDescribingJson sdj = new SelfDescribingJson(schema_uri, eventData);
```
See the API docs for the full [SelfDescribingJson](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/payload/SelfDescribingJson.html) constructor options.

The tracker can send JSON base-64 encoded or not. By default, they are encoded. This is set as part of the [Tracker configuration](/docs/sources/trackers/java-tracker/installation-and-set-up/index.md#configuring-the-tracker).

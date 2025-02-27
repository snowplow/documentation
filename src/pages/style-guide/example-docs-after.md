# Custom tracking using schemas

The Java tracker provides the `SelfDescribingJson` class for custom [events](/docs/fundamentals/events/index.md#self-describing-events) and [entities](/docs/fundamentals/entities/index.md). The same class is used for both.

A `SelfDescribingJson` needs two keys:
* `schema`: the URI for the schema
* `data`: the data to be tracked, usually as a map

The `data` value must match the properties described by the specified schema.

A simple initialization looks like this:

```java
// This map will be used for the "data" key
Map<String, String> data = new HashMap<>();
data.put("targetUrl", "https://www.snowplowanalytics.com")

// This is the Iglu schema URI
String schema_uri = "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1"

// Wrap the map in a SelfDescribingJson
// The specified schema allows for a String property "targetUrl"
SelfDescribingJson sdj = new SelfDescribingJson(schema_uri, data);
```

See the API docs for the full [SelfDescribingJson](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/payload/SelfDescribingJson.html) constructor options.

JSON can be sent base-64 encoded or not. By default, they are encoded. This is set as part of the [Tracker configuration](/docs/sources/trackers/java-tracker/installation-and-set-up/index.md#configuring-the-tracker).

## Custom events

Use the `SelfDescribing` class to track custom events. Provide the event data as a `SelfDescribingJson` object.

```java
SelfDescribing event = SelfDescribing.builder()
    .eventData(sdj) // as created above
    .build();

tracker.track(event);
```

## Custom entities

Every `Event.Builder` in the Java tracker allows for a list of `SelfDescribingJson` objects to be added to the `Event`. It's fine to add multiple entities of the same type. There's no official limit to how many entities you can add to a single event, but consider if the payload size could become problematic if you are adding a large number.

Entities can be added to any event using the `customContext()` Builder method, for example:

```java
List<SelfDescribingJson> entities = new ArrayList<>();
entities.add(sdj); // as created above

PageView event = PageView.builder()
    .pageUrl("https://snowplow.io/")
    .customContext(entities)
    .build();

tracker.track(event);
```

### Global context
The Java tracker does not support global context (the ability to automatically assign entities to specific events).

---
title: "Native mobile tracker plugins"
sidebar_label: "Tracker plugins"
sidebar_position: 45
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::note
Tracker plugins are only available since version 5 of the mobile trackers.
:::

The mobile trackers provide a plugin architecture that allows new functionality to be added to the trackers.
There are several Snowplow maintained plugins, however you are also free to build your own or leverage community plugins too.

Plugins provide the ability to intercept tracked events in order to enrich them with additional entities, filter them or just to inspect them.
To implement this, they contain three extension points:

1. `entities` callback which can return context entities to enrich events before they are tracked. The callback is passed the tracked event object to be enriched.
2. `filter` callback that returns true or false in order to decide whether to track a given event or not. The callback is passed the tracked event object.
3. `afterTrack` callback which can be used to inspect final tracked events. The passed event object contains all its properties as well as context entities.

## Creating a custom plugin

In order to build your own plugin, you can instantiate the `PluginConfiguration` class.
It requires you to pass a unique identifier.
There can only be a single plugin for a given identifier registered with the tracker.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let plugin = PluginConfiguration(identifier: "myPlugin")
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val plugin = PluginConfiguration("myPlugin")
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
PluginConfiguration plugin = new PluginConfiguration("myPlugin");
```

  </TabItem>
</Tabs>

### Adding context entities

To enrich events with additional context entities, you can make use of the `entities` callback.
This function accepts an optional list of schemas of self-describing events to subscribe to.
To filter primitive (not self-describing events) such as structured events, you can pass their event names in the schemas list (`se` for structured events).
When no list of schemas is passed, the callback is called for all tracked events.

The following code will add a specific entity, with URI "iglu:xx" (not a valid URI, for example only), to all Structured and ScreenView events.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
plugin.entities(schemas: [
    // The list of schemas to call the closure for is optional. If not passed, the callback is called for all events.
    "iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0", // screen view events
    "se" // structured events
]) { event in
    return [
        SelfDescribingJson(schema: "iglu:xx", andData: ["yy": true])
    ]
}
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
plugin.entities(
    schemas = listOf(
        // The list of schemas to call the closure for is optional. If not passed, the callback is called for all events.
        "iglu:com.google.analytics.measurement-protocol/screen_view/jsonschema/1-0-0", // screen view events
        "se" // structured events
    )
) {
    listOf(SelfDescribingJson("iglu:xx", hashMapOf("yy" to true)))
}
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
plugin.entities(
        Arrays.asList(
                // The list of schemas to call the closure for is optional. If not passed, the callback is called for all events.
                "iglu:com.google.analytics.measurement-protocol/screen_view/jsonschema/1-0-0", // screen view events
                "se" // structured events
        ),
        event -> Collections.singletonList(new SelfDescribingJson("iglu:xx", Collections.singletonMap("yy", true)))
);
```

  </TabItem>
</Tabs>

### Filtering events

The `filter` callback enables you to add custom logic that decides whether a given event should be tracked or not.
This can for example enable you to intercept events automatically tracked by the tracker and skip some of them.
The callback returns true in case the event should be tracked and false otherwise.
It also accepts the same optional `schemas` array as the `entities` callback to only be applied to events with those schemas.

The following code will apply to all screen view events and only accept ones with the name "Home Screen", other screen view events will be discarded:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
plugin.filter(schemas: [
    "iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0", // screen view events
]) { event in
    return event.payload["name"] as? String == "Home Screen"
}
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
plugin.filter(
    schemas = listOf(
        "iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0", // screen view events
    )
) { event ->
    event.payload["name"] == "Home Screen"
}
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
plugin.filter(
        Collections.singletonList(
                "iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0", // screen view events
        ),
        event -> event.getPayload().get("name") == "Home Screen"
);
```

  </TabItem>
</Tabs>

### Inspecting events after they are tracked

To inspect events after they are tracked, you can make use of the `afterTrack` callback.
It also accepts the same optional `schemas` array as the `entities` and `filter` callbacks to filter events.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
plugin.afterTrack { event in
    print("Tracked event with \(event.entities.count) entities")
}
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
plugin.afterTrack {
    println("Tracked event with ${it.entities.count()} entities")
}
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
plugin.afterTrack(
        null,
        event -> System.out.printf("Tracked event with %d entities%n", event.getEntities().size())
);
```

  </TabItem>
</Tabs>

## Registering a plugin in the tracker

Once you have a plugin configuration, you can register it when creating a new tracker:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
// the plugin is supplied to the tracker as a configuration
let tracker = Snowplow.createTracker(namespace: "namespace",
                                     network: networkConfig,
                                     configurations: [plugin])
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
// the plugin is supplied to the tracker as a configuration
val tracker = Snowplow.createTracker(
    applicationContext,
    "namespace",
    networkConfiguration,
    plugin
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerController tracker = Snowplow.createTracker(
        getApplicationContext(),
        "namespace",
        networkConfiguration,
        plugin
);
```

  </TabItem>
</Tabs>

You will be able to list the registered plugin identifiers:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
// one can inspect the enabled plugins and get the list of their identifiers
let pluginIdentifiers = tracker?.plugins.identifiers
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
// one can inspect the enabled plugins and get the list of their identifiers
val pluginIdentifiers = tracker.plugins.identifiers
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
// one can inspect the enabled plugins and get the list of their identifiers
List<String> identifiers = tracker.getPlugins().getIdentifiers();
```

  </TabItem>
</Tabs>

You can also add new plugins to an already instantiated tracker object:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
tracker?.plugins.add(plugin: otherPlugin)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
tracker.plugins.addPlugin(otherPlugin)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
tracker.getPlugins().addPlugin(otherPlugin);
```

  </TabItem>
</Tabs>

And remove a plugin from a tracker instance:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
tracker?.plugins.remove(identifier: "myPlugin")
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
tracker.plugins.removePlugin("myPlugin")
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
tracker.getPlugins().removePlugin("myPlugin");
```

  </TabItem>
</Tabs>

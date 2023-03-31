---
title: "Tracker plugins"
date: "2023-01-03"
sidebar_position: 45
---

# Tracker plugins

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::note
Tracker plugins are only available since version 5 of the mobile trackers.
:::

The mobile trackers provide a plugin architecture that allows new functionality to be added to the trackers.
There are several Snowplow maintained plugins, however you are also free to build your own or leverage community plugins too.

Plugins provide the ability to intercept tracked events in order to enrich them with additional entities or just to inspect them.
To implement this, they contain two extension points:

1. `entities` callback which can return context entities to enrich events before they are tracked. The callback is passed the tracked event object to be enriched.
2. `afterTrack` callback which can be used to inspect final tracked events. The passed event object contains all its properties as well as context entities.

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

To enrich events with additional context entities, you can make use of the `entities` callback.
This function accepts an optional list of schemas of self-describing events to subscribe to.
To filter primitive (not self-describing events) such as structured or page view events, you can pass their event names in the schemas list (`se` for structured events, `pv` for page view events).
When no list of schemas is passed, the callback is called for all tracked events.

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

To inspect events after they are tracked, you can make use of the `afterTrack` callback.
It also accepts the optional `schemas` array as the `entities` callback to filter events.

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
let tracker = Snowplow.createTracker(namespace: "ns",
                                     network: networkConfig,
                                     configurations: [plugin])
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
// the plugin is supplied to the tracker as a configuration
val tracker = Snowplow.createTracker(
    applicationContext,
    "ns",
    networkConfiguration,
    plugin
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerController tracker = Snowplow.createTracker(
        getApplicationContext(),
        "ns",
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

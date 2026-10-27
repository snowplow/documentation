---
title: "Inspect tracked events with Flutter tracker plugins"
sidebar_label: "Plugins"
sidebar_position: 4500
date: "2026-10-26"
description: "Register Flutter tracker plugins with an afterTrack callback to inspect every tracked event, including events the tracker tracks automatically. Add plugins at initialization or at runtime."
keywords: ["flutter plugins", "aftertrack", "inspectable event", "plugin configuration", "event inspection"]
---

Plugins let your Dart code see every event the tracker tracks. Each plugin has an `afterTrack` callback that the tracker calls after it tracks an event, including the events it tracks automatically, such as screen views from the `SnowplowObserver`, screen end, lifecycle, installation, and media events.

Use a plugin when your app needs to react to tracking activity. For example, you can restart an inactivity timer whenever any event is tracked:

```dart
SnowplowTracker tracker = await Snowplow.createTracker(
  namespace: 'ns1',
  endpoint: 'http://your-collector-endpoint.com',
  plugins: [
    PluginConfiguration(
      identifier: 'inactivity_timer',
      afterTrack: (event) => inactivityTimer.restart(),
    ),
  ],
);
```

The tracker calls `afterTrack` after it adds the event to its event queue, not after it sends the event to the Collector. The callback runs asynchronously, so it can run after the next event is tracked.

:::note[Version support]
Plugins were added in version 0.11.2.
:::

## Register a plugin

To create a plugin, instantiate `PluginConfiguration` with a unique `identifier` and an `afterTrack` callback. A tracker has at most one plugin per identifier. Adding a plugin with an identifier that's already registered replaces the existing plugin.

| Attribute    | Type                                   | Description                                       |
| ------------ | -------------------------------------- | ------------------------------------------------- |
| `identifier` | `String`                               | Unique identifier of the plugin within the tracker. |
| `afterTrack` | `void Function(InspectableEvent)?`     | Callback that the tracker calls after each tracked event. |

There are two ways to register a plugin:

- At initialization: pass the plugin in the `plugins` argument of `Snowplow.createTracker()`, as in the example above. The plugin also sees the events the tracker tracks while it's being created, such as the installation event when `installAutotracking` is enabled.
- At runtime: call `addPlugin()` on the tracker. The plugin only sees events tracked after you add it.

```dart
// Add a plugin using the tracker instance
await tracker.addPlugin(PluginConfiguration(
  identifier: 'logger',
  afterTrack: (event) => print('Tracked ${event.schema ?? event.name}'),
));

// Or using the static method (requires specifying the tracker namespace)
await Snowplow.addPlugin(
  PluginConfiguration(identifier: 'logger', afterTrack: print),
  tracker: 'ns1',
);
```

To stop calling a plugin, remove it by its identifier:

```dart
// Remove using the tracker instance
await tracker.removePlugin('logger');

// Or using the static method
await Snowplow.removePlugin('logger', tracker: 'ns1');
```

On web, the JavaScript tracker doesn't support removing plugins, so `removePlugin()` stops calling the plugin's callback but leaves the plugin registered with the JavaScript tracker.

If the callback throws an exception, the tracker reports it to `FlutterError.onError` and keeps calling the callback for later events.

## Inspect the tracked event

The `afterTrack` callback receives an `InspectableEvent` that describes the tracked event:

| Property   | Type                    | Description                                                                 |
| ---------- | ----------------------- | --------------------------------------------------------------------------- |
| `schema`   | `String?`               | Schema of the event, for [self-describing events](/docs/fundamentals/events/index.md#self-describing-events). |
| `name`     | `String?`               | Name of the event for baked-in events, for example `se` for structured events. |
| `payload`  | `Map<String, Object?>`  | Properties of the event.                                                    |
| `entities` | `List<SelfDescribing>`  | [Entities](/docs/fundamentals/entities/index.md) attached to the event, including the ones the tracker adds, such as the session and platform entities. |

Self-describing events have a `schema` and no `name`. Baked-in events have a `name` and no `schema`.

The `afterTrack` callback has no schema filter like the one in the [native mobile tracker plugins](/docs/sources/mobile-trackers/plugins/index.md). To handle only some events, check the event in the callback:

```dart
PluginConfiguration(
  identifier: 'screen_views',
  afterTrack: (event) {
    if (event.schema ==
        'iglu:com.snowplowanalytics.mobile/screen_view/jsonschema/1-0-0') {
      print('Viewed screen ${event.payload['name']}');
    }
  },
);
```

### Account for platform differences

The event properties come from the native mobile trackers on iOS and Android, and from the JavaScript tracker on web, so some details differ between platforms:

- Payload of baked-in events: on iOS and Android, `payload` contains only the event properties, for example `se_ca` and `se_ac` for structured events. On web, it contains the full tracker payload, including properties such as `eid` and `dtm`, and the entities as a JSON string.
- Entities: each platform attaches its own entities, for example the mobile platform entity on iOS and Android, and the web page entity on web. The order of the entities also differs between platforms, so look up entities by schema rather than by position.
- Unsupported values: on iOS and Android, values that can't be passed from the native tracker to Dart are converted to strings

---
title: "Track application lifecycle changes with the native mobile trackers"
sidebar_label: "Application lifecycle"
sidebar_position: 30
description: "Automatically track application foreground and background transitions to understand app usage patterns."
keywords: ["lifecycle tracking", "foreground background events", "app state changes"]
content_type: how-to
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The tracker can capture application lifecycle state changes. In particular, when the app changes state from foreground to background and vice versa.

The lifecycle tracking is enabled by default (since v6.0.0). It can be configured in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .lifecycleAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    .lifecycleAutotracking(true)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .lifecycleAutotracking(true);
```

  </TabItem>
</Tabs>

Once enabled, the tracker will automatically track a [`Background` event](/docs/events/ootb-data/mobile-lifecycle-events/index.md#background-event) when the app is moved to background and a [`Foreground` event](/docs/events/ootb-data/mobile-lifecycle-events/index.md#foreground-event) when the app moves back to foreground (becomes visible in the screen).

The tracker doesn't track a `Foreground` event when the user launches the app, only when the app returns from the background.

The system can also launch an app in the background, for example for a silent push notification. Events tracked during a background launch report the app as not visible. When the user then opens the app, the trackers behave differently:

- iOS: the tracker doesn't track a `Foreground` event, because it only tracks one after a `Background` event
- Android: the tracker tracks a `Foreground` event

:::note[Version support]
Lifecycle state on background launches was fixed in version 6.2.6 of the iOS tracker and version 6.4.1 of the Android tracker. iOS tracker version 6.2.6 to 6.3.0 also tracked a `Foreground` event on every launch of a scene-based app, which version 6.3.1 fixed.
:::

The tracker attaches a [`LifecycleEntity`](/docs/events/ootb-data/mobile-lifecycle-events/index.md#lifecycle-entity) to all the events tracked by the tracker reporting if the app was visible (foreground state) when the event was tracked.

The `LifecycleEntity` value is conditioned by the internal state of the tracker only. To make an example, if the app is in foreground state but the developer tracks a `Background` event intentionally, it would force the generation of a `LifecycleEntity` that mark the app as non visible, even if it's actually visible in the device.

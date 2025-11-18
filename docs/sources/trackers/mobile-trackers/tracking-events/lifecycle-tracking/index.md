---
title: "App Lifecycle Tracking for Mobile Trackers"
sidebar_position: 30
---

# App lifecycle tracking

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

The tracker attaches a [`LifecycleEntity`](/docs/events/ootb-data/mobile-lifecycle-events/index.md#lifecycle-context-entity) to all the events tracked by the tracker reporting if the app was visible (foreground state) when the event was tracked.

The `LifecycleEntity` value is conditioned by the internal state of the tracker only. To make an example, if the app is in foreground state but the developer tracks a `Background` event intentionally, it would force the generation of a `LifecycleEntity` that mark the app as non visible, even if it's actually visible in the device.

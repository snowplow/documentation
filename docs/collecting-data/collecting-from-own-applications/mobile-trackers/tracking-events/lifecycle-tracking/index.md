---
title: "App Lifecycle Tracking"
date: "2023-01-03"
sidebar_position: 30
---

# App Lifecycle Tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

It captures application lifecycle state changes. In particular, when the app changes the state from foreground to background and viceversa.

The lifecycle tracking is disabled by default. It can be enabled in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .lifecycleAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .lifecycleAutotracking(true);
```

  </TabItem>
</Tabs>

Once enabled, the tracker will automatically track a [`Background` event](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_background.html) when the app is moved to background and a [`Foreground` event](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_foreground.html) when the app moves back to foreground (becomes visible in the screen).

The tracker attaches a [`LifecycleEntity`](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1entity_1_1_lifecycle_entity.html) to all the events tracked by the tracker reporting if the app was visible (foreground state) when the event was tracked.

The `LifecycleEntity` value is conditioned by the internal state of the tracker only. To make an example, if the app is in foreground state but the developer tracks a `Background` event intentionally, it would force the generation of a `LifecycleEntity` that mark the app as non visible, even if it's actually visible in the device.

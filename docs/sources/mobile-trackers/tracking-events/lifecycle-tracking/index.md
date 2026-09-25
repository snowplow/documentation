---
title: "Track application lifecycle changes with the native mobile trackers"
sidebar_label: "Application lifecycle"
sidebar_position: 30
description: "Automatically track application foreground and background transitions to understand app usage patterns."
keywords: ["lifecycle tracking", "foreground background events", "app state changes"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The tracker can capture application lifecycle state changes. In particular, when the app changes state from foreground to background and vice versa.

## Configure lifecycle autotracking

The lifecycle tracking is enabled by default (since version 6.0.0). It can be configured in `TrackerConfiguration` like in the example below:

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

## Understand the lifecycle entity value

The tracker attaches a [`LifecycleEntity`](/docs/events/ootb-data/mobile-lifecycle-events/index.md#lifecycle-entity) to all the events tracked by the tracker reporting if the app was visible (foreground state) when the event was tracked.

The `LifecycleEntity` value is conditioned by the internal state of the tracker only. To make an example, if the app is in foreground state but the developer tracks a `Background` event intentionally, it would force the generation of a `LifecycleEntity` that mark the app as non visible, even if it's actually visible in the device.

### Background-only launches

The operating system can launch an app directly into the background, without it ever becoming visible. Silent push notifications, background app refresh, background `URLSession` uploads, and push-to-start Live Activities all do this. Before iOS tracker version 6.3.0, the tracker treated the app as visible until a lifecycle transition told it otherwise. Neither transition fires in a background-only launch, so every event tracked in that process reported `isVisible: true`.

{/* Confirm the iOS tracker version used in this section before merging: it documents a fix that isn't released yet. */}

From iOS tracker version 6.3.0, the tracker reads the application state when you call `Snowplow.createTracker`, before it builds the tracker. Events tracked in a background-only launch report `isVisible: false`, starting with the first one. The tracker treats the `background` application state as not visible, and both `active` and `inactive` as visible. A normal launch reports `inactive` at the point where you create the tracker in `application(_:didFinishLaunchingWithOptions:)`, so a normal launch is unaffected.

:::note[Effects on session and screen engagement data]
Reading the application state at tracker creation also tells session tracking that the app started in the background. Three things follow for a background-only launch:

- The `Foreground` event is tracked when the user later opens the app: earlier versions tracked no such event, and `foregroundIndex` didn't increment
- The session controller's `isInBackground` property reports `true` for the duration of the background launch
- Session expiry checks use the background timeout rather than the foreground timeout, which changes session boundaries only if you set the two [session timeouts](/docs/sources/mobile-trackers/tracking-events/session-tracking/index.md) to different values

Because the `Foreground` event is tracked, the `screen_summary` entity attributes the time before it to `background_sec` rather than `foreground_sec`. Read more in [Screen time](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md#screen-time).
:::

The background-only launch behavior described above is specific to iOS and tvOS. The other platforms that the native mobile trackers support behave differently.

### Platform coverage

Of the platforms supported by the iOS tracker, only iOS and tvOS observe application lifecycle transitions. On macOS, watchOS, and visionOS, the tracker doesn't track `Foreground` or `Background` events, so the `LifecycleEntity` reports `isVisible: true` unless you track a `Background` event yourself.

The Android tracker reports `isVisible: true` for events tracked in a background-only launch, such as one started by WorkManager or Firebase Cloud Messaging.

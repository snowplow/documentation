---
title: "Use Signals attributes and interventions in your app"
sidebar_label: "Signals"
sidebar_position: 75
description: "Configure the iOS and Android trackers to read public Signals services and receive Signals interventions for the current app user and session."
keywords: ["signals", "mobile signals", "interventions", "service attributes", "personalization", "SignalsConfiguration"]
date: "2026-11-08"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The iOS and Android trackers can connect your app to [Signals](/docs/signals/index.md), so that it can react to the user's behavior in real time. Once configured, the tracker's Signals controller lets you:
* Read the attributes of a [public service](/docs/signals/applications/public-services/index.md) for the current user or session
* [Subscribe to interventions](/docs/signals/applications/subscribe/index.md#subscribe-with-the-mobile-trackers) for the current user and session, and handle them in your app

The tracker identifies the user and session with the `userId` and `sessionId` from the [session entity](/docs/sources/mobile-trackers/tracking-events/session-tracking/index.md). In Signals, these correspond to the built-in `client_session_user_id` and `client_session_session_id` [attribute keys](/docs/signals/attributes/attribute-keys/index.md). Define your attribute groups, services, and interventions with these keys to use them from your app.

:::note[Tracker versions]
Signals support is available from version 6.4.0 of the iOS tracker and version 6.5.0 of the Android tracker.
:::

## Configure the tracker

Pass a `SignalsConfiguration` with your Signals API URL when creating the tracker. You'll find the URL on the **Signals** > **Overview** page in Console. The app doesn't need an API key.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let signalsConfig = SignalsConfiguration(endpoint: "https://000000000000.signals.snowplowanalytics.com")
    .timeout(5) // seconds, for attribute reads

let tracker = Snowplow.createTracker(
    namespace: "appTracker",
    network: NetworkConfiguration(endpoint: "https://collector.example.com"),
    configurations: [signalsConfig]
)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val signalsConfig = SignalsConfiguration("https://000000000000.signals.snowplowanalytics.com")
    .timeout(TimeMeasure(5, TimeUnit.SECONDS))

val tracker = Snowplow.createTracker(
    applicationContext,
    "appTracker",
    NetworkConfiguration("https://collector.example.com"),
    signalsConfig
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
SignalsConfiguration signalsConfig = new SignalsConfiguration("https://000000000000.signals.snowplowanalytics.com")
    .timeout(new TimeMeasure(5, TimeUnit.SECONDS));

TrackerController tracker = Snowplow.createTracker(
    applicationContext,
    "appTracker",
    new NetworkConfiguration("https://collector.example.com"),
    signalsConfig
);
```

  </TabItem>
</Tabs>

The `timeout` is optional and defaults to five seconds. If you omit the URL scheme, the tracker uses `https://`.

Access the Signals controller with `tracker.signals`, or `tracker.getSignals()` in Java. Without a `SignalsConfiguration`, its methods log a message and don't send any requests.

## Requirements for Signals requests

The tracker only sends Signals requests when it has a real identifier for the user. It doesn't send any requests when:
* Session tracking is disabled
* [User anonymization](/docs/sources/mobile-trackers/anonymous-tracking/index.md) is enabled, because the session entity then contains a placeholder user ID
* The request is keyed by session, and the tracker hasn't tracked an event in the current session yet

Requests go straight from the app to Signals, without cookies or caching. A failed attribute read reports status `0` in these cases.

## Use Signals in your app

To read attributes, see [Read attributes from websites and apps](/docs/signals/applications/public-services/index.md). The service must have the `public` access mode.

To receive interventions, see [Subscribe with the mobile trackers](/docs/signals/applications/subscribe/index.md#subscribe-with-the-mobile-trackers).

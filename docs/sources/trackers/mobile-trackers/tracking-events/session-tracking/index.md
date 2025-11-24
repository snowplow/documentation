---
title: "Tracking sessions with the native mobile trackers"
sidebar_label: "Sessions"
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Session tracking captures the session which helps to keep track of the user activity in the app.

Client session tracking is enabled by default. It can be set through the `TrackerConfiguration` as explained below.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .sessionContext(true)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    .sessionContext(true)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .sessionContext(true);
```

  </TabItem>
</Tabs>

When enabled, the tracker appends a [`client_session` entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) to each event it sends and it maintains this session information as long as the application is installed on the device.

Sessions correspond to tracked user activity. User information is set via the [Client session context entity](/docs/events/ootb-data/user-and-session-identification/index.md#client-session-context-entity).

A session expires when no tracking events have occurred for the amount of time defined in a timeout (by default 30 minutes). The session timeout check is executed for each event tracked. If the gap between two consecutive events is longer than the timeout the session is renewed. There are two timeouts since a session can timeout in the foreground (while the app is visible) or in the background (when the app has been suspended, but not closed).

The timeouts for the session can be configured in the `SessionConfiguration` like in the example below:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let sessionConfig = SessionConfiguration(
    foregroundTimeout: Measurement(value: 360, unit: .seconds),
    backgroundTimeout: Measurement(value: 360, unit: .seconds)
)
Snowplow.createTracker(
    namespace: "appTracker",
    network: networkConfig,
    configurations: [trackerConfig, sessionConfig]
)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val sessionConfig = SessionConfiguration(
    TimeMeasure(6, TimeUnit.SECONDS),
    TimeMeasure(30, TimeUnit.SECONDS)
)
Snowplow.createTracker(applicationContext, namespace, networkConfig, sessionConfig)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
SessionConfiguration sessionConfig = new SessionConfiguration(
    new TimeMeasure(6, TimeUnit.SECONDS),
    new TimeMeasure(30, TimeUnit.SECONDS)
);
Snowplow.createTracker(getApplicationContext(), namespace, networkConfig, sessionConfig);
```

  </TabItem>
</Tabs>

The lifecycle events (`Foreground` and `Background` events) have a role in the session expiration. The lifecycle events can be enabled as explained in [App Lifecycle Tracking](#lifecycle-tracking). Once enabled they will be fired automatically when the app moves from foreground state to background state and vice versa.

When the app moves from foreground to background, the `Background` event is fired. If session tracking is enabled, the session entity will be attached to the event checking the session expiration using the foreground timeout.
When the app moves from background to foreground, the `Foreground` event is fired. If session tracking is enabled, the session entity will be attached to the event checking the session expiration using the background timeout.

For instance, with this configuration:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
SessionConfiguration(
    foregroundTimeout: Measurement(value: 360, unit: .seconds),
    backgroundTimeout: Measurement(value: 15, unit: .seconds)
)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val sessionConfig = SessionConfiguration(
    TimeMeasure(360, TimeUnit.SECONDS),
    TimeMeasure(15, TimeUnit.SECONDS)
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
SessionConfiguration sessionConfig = new SessionConfiguration(
    new TimeMeasure(360, TimeUnit.SECONDS),
    new TimeMeasure(15, TimeUnit.SECONDS)
);
```

  </TabItem>
</Tabs>

the session would expire if the app is in background for more than 15 seconds, like in this example:

```text
time: 0s - ScreenView event - foreground timeout session check - session 1
time: 3s - Background event - foreground timeout session check (3 < 360) - session 1
time: 30s - Foreground event - background timeout session check (30 > 15) - session 2
```

In the above example, the `Foreground` event triggers a new session because the time spent in background (without tracked events) is bigger than the background timeout for the session.

## Session callback

:::info

This feature is available since v3.1.

:::

The tracker allows the configuration of a callback to inform the app every time a new session is created (in correspondence of a session timeout check).
This can be configured in the `SessionConfiguration` and it provides the `SessionState` where all the info already tracked in the session can be accessed.

Below is an example of where the session callback is used to print out the values of session every time a new session is generated by the tracker:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
...
let sessionConfig = SessionConfiguration()
    .onSessionStateUpdate { session in
        print("SessionState: id: \(session.sessionId) - index: \(session.sessionIndex) - userID: \(session.userId) - firstEventID: \(session.firstEventId)")
    }
...
let tracker = Snowplow.createTracker(namespace: kNamespace, network: networkConfig, configurations: [sessionConfig])
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val sessionConfig = SessionConfiguration(
    TimeMeasure(6, TimeUnit.SECONDS),
    TimeMeasure(30, TimeUnit.SECONDS)
)
    .onSessionUpdate { state ->
        log(
            "Session: " + state.getSessionId()
                .toString() + "\r\nprevious: " + state.getPreviousSessionId()
                .toString() + "\r\neventId: " + state.getFirstEventId()
                .toString() + "\r\nindex: " + state.getSessionIndex()
                .toString() + "\r\nuserId: " + state.getUserId()
        )
    }

Snowplow.createTracker(applicationContext, namespace, networkConfig, sessionConfig)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
...
SessionConfiguration sessionConfig = new SessionConfiguration(
    new TimeMeasure(6, TimeUnit.SECONDS),
    new TimeMeasure(30, TimeUnit.SECONDS)
)
    .onSessionUpdate(state -> log(
        "Session: " + state.getSessionId()
                + "\r\nprevious: " + state.getPreviousSessionId()
                + "\r\neventId: " + state.getFirstEventId()
                + "\r\nindex: " + state.getSessionIndex()
                + "\r\nuserId: " + state.getUserId()
    ));

...
Snowplow.createTracker(getApplicationContext(), namespace, networkConfig, sessionConfig);
```

  </TabItem>
</Tabs>

## Decorating outgoing links using cross-navigation tracking

:::note Not available before v6
This feature was introduced in version 6.0.0 of the iOS and Android trackers.
:::

The tracker provides a `decorateLink` API to decorate outgoing links from the mobile app to another mobile app or to a website.
This API adds an `_sp` parameter to the links containing information about the user, app, and current session.
This is useful for tracking the movement of users across different apps and platforms.
It is part of our cross-navigation solution and is equivalent to [cross-domain tracking on the JavaScript tracker](/docs/sources/trackers/web-trackers/cross-domain-tracking/index.md).

For example, calling `decorateLink` on `appSchema://path/to/page` will produce the following result:

```
appSchema://path/to/page?_sp=domainUserId.timestamp.sessionId.subjectUserId.sourceId.platform.reason
```

The `decorateLink` function adds the following information to the link (configurable using the `CrossDeviceParameterConfiguration` object passed to the method):

- `domainUserId` – The current tracker generated user identifier (value of `SessionController.userId`) – required.
- `timestamp` – The current ms precision epoch timestamp – required.
- `sessionId` - The current session identifier (value of `SessionController.sessionId`) – optional.
- `subjectUserId` - The custom business user identifier (value of `SubjectController.userId`) – optional.
- `sourceId` – The `appId` (value of `TrackerConfiguration.appId`) – optional.
- `platform` - The platform of the current device (value of `TrackerController.devicePlatform` – optional.
- `reason` – Identifier/information for cross-navigation – optional.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let link = URL(string: "https://example.com")!
let decoratedLink = Snowplow.defaultTracker()?.decorateLink(
  link,
  // optional configuration for which information to be added to the link
  extendedParameters: CrossDeviceParameterConfiguration(sessionId: true, subjectUserId: true)
)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val link = Uri.parse("http://example.com")
val decoratedLink = Snowplow.defaultTracker.decorateLink(
  link,
  // optional configuration for which information to be added to the link
  CrossDeviceParameterConfiguration(sessionId = true, subjectUserId = true)
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Uri link = Uri.parse("http://example.com");
Uri decoratedLink = Snowplow.getDefaultTracker().decorateLink(link, new CrossDeviceParameterConfiguration(
    true, // sessionId
    true, // subjectUserId
    false, // sourceId
    false, // sourcePlatform
    null // reason
));
```

  </TabItem>
</Tabs>

## Session behavior on app restarts

By default, each time the mobile app restarts (or when a new tracker instance is created), a new session is started regardless of whether the previous session timed out or not.

Since version 6.2 of the iOS and Android trackers, there is an option to continue the previously persisted session when the app restarts.
The previous session is only continued in case the app is restarted within the configured session timeout interval.
The option can be configured using `SessionConfiguration`:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let sessionConfig = SessionConfiguration()
    .continueSessionOnRestart(true)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val sessionConfig = SessionConfiguration()
    .continueSessionOnRestart(true)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
SessionConfiguration trackerConfig = new SessionConfiguration()
    .continueSessionOnRestart(true);
```

  </TabItem>
</Tabs>

With the option enabled, every session update is persisted to UserDefaults or shared preferences storage.
In case it's disabled, only session changes are persisted to UserDefaults.
This means that there is more overhead when the option is enabled.

---
title: "Anonymous tracking in the native mobile trackers"
sidebar_label: "Anonymous tracking"
date: "2022-08-30"
sidebar_position: 60
description: "Enable anonymous tracking to mask user identifiers and session information in mobile tracker events for privacy compliance."
keywords: ["anonymous tracking", "user anonymization", "mobile privacy"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info

This feature is available since v4.

:::

```mdx-code-block
import AnonymousTrackingSharedBlock from "@site/docs/reusable/anonymous-tracking-mobile/_index.md"

<AnonymousTrackingSharedBlock/>
```
There are several levels to the anonymisation depending on which of the three categories are affected.

Read more about anonymous tracking in the [overview page](/docs/events/anonymous-tracking/index.md).

## 1. Full client-side anonymisation

In this case, we want to anonymise both the client-side user identifiers as well as the client-side session identifiers. This means disabling the Session context altogether and enabling user anonymisation:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let config = TrackerConfiguration()
    .sessionContext(false) // Session context entity won't be added to events
    .userAnonymisation(true) // User identifiers in Platform context (IDFA and IDFV) will be anonymised
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val config = TrackerConfiguration("appId")
    .sessionContext(false) // Session context entity won't be added to events
    .userAnonymisation(true) // User identifiers in Platform context (IDFA and IDFV) will be anonymised
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration config = new TrackerConfiguration("appId")
    .sessionContext(false) // Session context entity won't be added to events
    .userAnonymisation(true); // User identifiers in Platform context (IDFA and IDFV) will be anonymised
```

  </TabItem>
</Tabs>

## 2. Client-side anonymisation with session tracking

This setting disables client-side user identifiers are but tracks session information. In practice, this means that events track the Session context entity but the `userId` property is a null UUID (`00000000-0000-0000-0000-000000000000`). In case Platform context is enabled, the IDFA identifiers will not be present.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let config = TrackerConfiguration()
    .sessionContext(true) // Session context is tracked with the session ID
    .userAnonymisation(true) // User identifiers in Session and Platform context are anonymised
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val config: TrackerConfiguration = TrackerConfiguration("appId")
    .sessionContext(true) // Session context is tracked with the session ID
    .userAnonymisation(true) // User identifiers in Session and Platform context are anonymised
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration config = new TrackerConfiguration("appId")
    .sessionContext(true) // Session context is tracked with the session ID
    .userAnonymisation(true); // User identifiers in Session and Platform context are anonymised
```

  </TabItem>
</Tabs>

:::note

When anonymous tracking is enabled or disabled using `tracker.setUserAnonymisation(true | false)`, the tracker starts a new session which results in a new `sessionId`.

:::

## 3. Server-side anonymisation

Server-side anonymisation affects user identifiers set server-side. In particular, these are the `network_userid` property set in server-side cookie and the user IP address. You can anonymise the properties using the `serverAnonymisation` flag in `EmitterConfiguration`:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let config = EmitterConfiguration()
    .serverAnonymisation(true)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val config = EmitterConfiguration()
    .serverAnonymisation(true)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EmitterConfiguration config = new EmitterConfiguration()
    .serverAnonymisation(true);
```

  </TabItem>
</Tabs>

Setting the flag will add a `SP-Anonymous` HTTP header to requests sent to the Snowplow collector. The Snowplow pipeline will take care of anonymising the identifiers.

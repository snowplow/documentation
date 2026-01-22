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
This feature is available since version 4.
:::

Anonymous tracking is a feature that enables anonymization of various user and session identifiers, to support user privacy when consent for tracking the identifiers isn't given.

On mobile, the following [user and session identifiers](/docs/events/ootb-data/user-and-session-identification/index.md) can be anonymized:

* Client-side user identifiers:
   * `user_id`, `domain_userid`, `network_userid`, and `user_ipaddress`, set by you in `Subject`
   * `userId`, a device ID, set automatically in the [session](/docs/sources/web-trackers/tracking-events/session/index.md) entity
   * IDFA identifiers (`appleIdfa` and `appleIdfv` for iOS, `androidIdfa` for Android) in the mobile entity
* Client-side session identifiers:
  * `previousSessionId` in the session entity, set automatically by the tracker
* Server-side user identifiers:
  * `network_userid` and `user_ipaddress`, set by the [Collector](/docs/pipeline/collector/index.md)

:::note User-set properties
The Collector captures the IP address from the request HTTP headers, and updates the `user_ipaddress` event property. However, if you set the `user_ipaddress` property in the `Subject`, that value has priority.

Similarly, if you set the `network_userid` property in the `Subject`, that value is used instead of the Collector cookie value.
:::

Read more about anonymous tracking in the [overview page](/docs/events/anonymous-tracking/index.md).

There are several levels to the anonymization depending on which of the categories are affected.

## 1. Full client-side anonymization

In this case, we want to anonymize both the client-side user identifiers as well as the client-side session identifiers. This means disabling the Session entity altogether and enabling user anonymization:

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

| Identifier          | Location in event | Included in event?                            |
| ------------------- | ----------------- | --------------------------------------------- |
| `user_id`           | Atomic            | ❌                                             |
| `domain_userid`     | Atomic            | ❌                                             |
| `userId`            | Session entity    | ❌ no session entity                           |
| `sessionId`         | Session entity    | ❌ no session entity                           |
| `previousSessionId` | Session entity    | ❌ no session entity                           |
| `appleIdfa`         | Mobile entity     | ❌                                             |
| `appleIdfv`         | Mobile entity     | ❌                                             |
| `androidIdfa`       | Mobile entity     | ❌                                             |
| `network_userid`    | Atomic            | ✅/❌ removed if you provided this in `Subject` |
| `user_ipaddress`    | Atomic            | ✅/❌ removed if you provided this in `Subject` |

## 2. Client-side anonymisation with session tracking

This setting disables client-side user identifiers are but tracks session information. In practice, this means that events track the Session entity but the `userId` property is a null UUID (`00000000-0000-0000-0000-000000000000`). If the mobile entity is enabled, the IDFA identifiers will not be present.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let config = TrackerConfiguration()
    .sessionContext(true) // Session entity is tracked with the session ID
    .userAnonymisation(true) // User identifiers in Session and Mobile entity are anonymized
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val config: TrackerConfiguration = TrackerConfiguration("appId")
    .sessionContext(true) // Session entity is tracked with the session ID
    .userAnonymisation(true) // User identifiers in Session and Mobile entity are anonymized
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration config = new TrackerConfiguration("appId")
    .sessionContext(true) // Session entity is tracked with the session ID
    .userAnonymisation(true); // User identifiers in Session and Mobile entity are anonymized
```

  </TabItem>
</Tabs>

| Identifier          | Location in event | Included in event?                            |
| ------------------- | ----------------- | --------------------------------------------- |
| `user_id`           | Atomic            | ❌                                             |
| `domain_userid`     | Atomic            | ❌                                             |
| `userId`            | Session entity    | ❌ null UUID                                   |
| `sessionId`         | Session entity    | ✅                                             |
| `previousSessionId` | Session entity    | ❌                                             |
| `appleIdfa`         | Mobile entity     | ❌                                             |
| `appleIdfv`         | Mobile entity     | ❌                                             |
| `androidIdfa`       | Mobile entity     | ❌                                             |
| `network_userid`    | Atomic            | ✅/❌ removed if you provided this in `Subject` |
| `user_ipaddress`    | Atomic            | ✅/❌ removed if you provided this in `Subject` |

:::note Toggling anonymous tracking

When anonymous tracking is enabled or disabled using `tracker.setUserAnonymisation(true | false)`, the tracker starts a new session. This results in a new `sessionId`.

:::

## 3. Server-side anonymization

Server-side anonymization affects user identifiers set server-side. In particular, these are the `network_userid` property set in server-side cookie and the user IP address. You can anonymize the properties using the `serverAnonymisation` flag in `EmitterConfiguration`:

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

| Identifier          | Location in event | Included in event?                                  |
| ------------------- | ----------------- | --------------------------------------------------- |
| `user_id`           | Atomic            | ✅                                                   |
| `domain_userid`     | Atomic            | ✅                                                   |
| `userId`            | Session entity    | ✅                                                   |
| `sessionId`         | Session entity    | ✅                                                   |
| `previousSessionId` | Session entity    | ✅                                                   |
| `appleIdfa`         | Mobile entity     | ✅                                                   |
| `appleIdfv`         | Mobile entity     | ✅                                                   |
| `androidIdfa`       | Mobile entity     | ✅                                                   |
| `network_userid`    | Atomic            | ❌/✅ still present if you provided this in `Subject` |
| `user_ipaddress`    | Atomic            | ❌/✅ still present if you provided this in `Subject` |

Setting the flag will add a `SP-Anonymous` HTTP header to requests sent to the Snowplow Collector. The Snowplow pipeline will take care of anonymizing the identifiers.

## 4. Full anonymization

Full anonymization combines client-side and server-side anonymization, to remove all user and session identifiers from events. This approach provides the highest level of privacy.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .sessionContext(false) // Session entity won't be added to events
    .userAnonymisation(true) // User identifiers in Platform context will be anonymized

let emitterConfig = EmitterConfiguration()
    .serverAnonymisation(true) // Collector won't track network_userid or user IP
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    .sessionContext(false) // Session entity won't be added to events
    .userAnonymisation(true) // User identifiers in Platform context will be anonymized

val emitterConfig = EmitterConfiguration()
    .serverAnonymisation(true) // Collector won't track network_userid or user IP
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .sessionContext(false) // Session entity won't be added to events
    .userAnonymisation(true); // User identifiers in Platform context will be anonymized

EmitterConfiguration emitterConfig = new EmitterConfiguration()
    .serverAnonymisation(true); // Collector won't track network_userid or user IP
```

  </TabItem>
</Tabs>

| Identifier          | Location in event | Included in event?  |
| ------------------- | ----------------- | ------------------- |
| `user_id`           | Atomic            | ❌                   |
| `domain_userid`     | Atomic            | ❌                   |
| `userId`            | Session entity    | ❌ no session entity |
| `sessionId`         | Session entity    | ❌ no session entity |
| `previousSessionId` | Session entity    | ❌ no session entity |
| `appleIdfa`         | Mobile entity     | ❌                   |
| `appleIdfv`         | Mobile entity     | ❌                   |
| `androidIdfa`       | Mobile entity     | ❌                   |
| `network_userid`    | Atomic            | ❌                   |
| `user_ipaddress`    | Atomic            | ❌                   |

---
title: "Anonymous Tracking"
date: "2022-08-30"
sidebar_position: 60
---

# Anonymous Tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info

This feature is available since v4.

:::

Anonymous tracking is a tracker feature that enables anonymising various user and session identifiers to support user privacy in case consent for tracking the identifiers is not given.

The affected user and session identifiers are stored in two context entities: [Session](tracking-events.md#session) and [Platform context](tracking-events.md#platform). The Session context entity contains user and session identifiers, while the Platform context entity contains user identifiers. Concretely, the following user and session identifiers can be anonymised:

1. Client-side user identifiers: the `userId` in Session context entity and the IDFA identifiers (`appleIdfa`, and `appleIdfv`) in the Platform context entity.
2. Client-side session identifiers: `sessionId` in Session context.
3. Server-side user identifiers: `network_userid` and `user_ipaddress` event properties.

There are several levels to the anonymisation depending on which of the three categories are affected:

## 1. Full client-side anonymisation

In this case, we want to anonymise both the client-side user identifiers as well as the client-side session identifiers. This means disabling the Session context altogether and enabling user anonymisation:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let config = TrackerConfiguration()
    .sessionContext(false) // Session context entity won't be added to events
    .userAnonymisation(true) // User identifiers in Platform context (IDFA and IDFV) will be anonymised
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration config = new TrackerConfiguration()
    .sessionContext(false) // Session context entity won't be added to events
    .userAnonymisation(true); // User identifiers in Platform context (IDFA and IDFV) will be anonymised
});
```

  </TabItem>
</Tabs>

## 2. Client-side anonymisation with session tracking

This setting disables client-side user identifiers are but tracks session information. In practice, this means that events track the Session context entity but the `userId` property is a null UUID (`00000000-0000-0000-0000-000000000000`). In case Platform context is enabled, the IDFA identifiers will not be present.

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let config = TrackerConfiguration()
    .sessionContext(true) // Session context is tracked with the session ID
    .userAnonymisation(true) // User identifiers in Session and Platform context are anonymised
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration config = new TrackerConfiguration()
    .sessionContext(true) // Session context is tracked with the session ID
    .userAnonymisation(true); // User identifiers in Session and Platform context are anonymised
```

  </TabItem>
</Tabs>

## 3. Server-side anonymisation

Server-side anonymisation affects user identifiers set server-side. In particular, these are the `network_userid` property set in server-side cookie and the user IP address. You can anonymise the properties using the `serverAnonymisation` flag in `EmitterConfiguration`:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let config = EmitterConfiguration()
    .serverAnonymisation(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
EmitterConfiguration config = new EmitterConfiguration()
    .serverAnonymisation(true);
```

  </TabItem>
</Tabs>

Setting the flag will add a `SP-Anonymous` HTTP header to requests sent to the Snowplow collector. The Snowplow pipeline will take care of anonymising the identifiers.

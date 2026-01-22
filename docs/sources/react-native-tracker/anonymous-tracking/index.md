---
title: "Anonymous tracking for the React Native tracker"
sidebar_label: "Anonymous tracking"
date: "2022-08-30"
sidebar_position: 25
description: "Enable anonymous tracking to disable user and session identifiers with client-side and server-side anonymization options."
keywords: ["react native anonymous tracking", "user anonymization", "privacy tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Anonymous tracking is a feature that enables anonymization of various user and session identifiers, to support user privacy when consent for tracking the identifiers isn't given.

On React Native, the following [user and session identifiers](/docs/events/ootb-data/user-and-session-identification/index.md) can be anonymized:

* Client-side user identifiers:
   * `user_id`, `domain_userid`, `network_userid`, and `user_ipaddress`, set by you in `Subject`
   * `userId`, a device ID, set automatically in the [session](/docs/sources/web-trackers/tracking-events/session/index.md) entity
   * For mobile only, IDFA identifiers (`appleIdfa` and `appleIdfv` for iOS, `androidIdfa` for Android) in the mobile entity [if configured](/docs/sources/react-native-tracker/tracking-events/platform-and-application-context/index.md#platform-context)
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

## Available anonymization options

Because of a change in architecture, the anonymous tracking options for the React Native tracker changed between version 2.x and version 4.x.

| Feature                                         | Version 4.x | Version 1.3 - 2.x |
| ----------------------------------------------- | ----------- | ----------------- |
| Full client-side anonymization                  | ❌           | ✅                 |
| Client-side anonymization with session tracking | ❌           | ✅                 |
| Toggle anonymous tracking at runtime            | ❌           | ✅                 |
| Server-side anonymization                       | ✅           | ✅                 |

## 1. Full client-side anonymization

In this case, you anonymize both client-side user identifiers and client-side session identifiers. This means disabling the session entity altogether.

<Tabs groupId="platform" queryString>
  <TabItem value="new" label="Version 4.x" default>

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    sessionContext: false, // Session entity won't be added to events
    platformContext: false, // Mobile entity won't be added to events

});
```

| Identifier          | Location in event        | Included in event?  |
| ------------------- | ------------------------ | ------------------- |
| `user_id`           | Atomic                   | ✅ if set            |
| `domain_userid`     | Atomic                   | ✅ if set            |
| `userId`            | Session entity           | ❌ no session entity |
| `sessionId`         | Session entity           | ❌ no session entity |
| `previousSessionId` | Session entity           | ❌ no session entity |
| `appleIdfa`         | Mobile (platform) entity | ❌ no mobile entity  |
| `appleIdfv`         | Mobile (platform) entity | ❌ no mobile entity  |
| `androidIdfa`       | Mobile (platform) entity | ❌ no mobile entity  |
| `network_userid`    | Atomic                   | ✅                   |
| `user_ipaddress`    | Atomic                   | ✅                   |

  </TabItem>
  <TabItem value="old" label="Version 1.3 - 2.x">

```typescript
const tracker = createTracker(
    'appTracker',
    { endpoint: COLLECTOR_URL },
    {
        trackerConfig: {
            sessionContext: false,   // Session entity won't be added to events
            userAnonymisation: true, // Remove user identifiers from Subject and platform entity
        },
    }
);
```

| Identifier          | Location in event        | Included in event?                            |
| ------------------- | ------------------------ | --------------------------------------------- |
| `user_id`           | Atomic                   | ❌                                             |
| `domain_userid`     | Atomic                   | ❌                                             |
| `userId`            | Session entity           | ❌ no session entity                           |
| `sessionId`         | Session entity           | ❌ no session entity                           |
| `previousSessionId` | Session entity           | ❌ no session entity                           |
| `appleIdfa`         | Mobile (platform) entity | ❌                                             |
| `appleIdfv`         | Mobile (platform) entity | ❌                                             |
| `androidIdfa`       | Mobile (platform) entity | ❌                                             |
| `network_userid`    | Atomic                   | ✅/❌ removed if you provided this in `Subject` |
| `user_ipaddress`    | Atomic                   | ✅/❌ removed if you provided this in `Subject` |

  </TabItem>
</Tabs>

## 2. Client-side anonymization with session tracking

This setting disables client-side user identifiers but tracks session information.

<Tabs groupId="platform" queryString>
  <TabItem value="new" label="Version 4.x" default>

Newer versions of the React Native tracker don't support client-side anonymization with session tracking. Unlike in version 2.x, you can't track the session entity with an anonymized `userId`.

  </TabItem>
  <TabItem value="old" label="Version 1.3 - 2.x">

```typescript
const tracker = createTracker(
    'appTracker',
    { endpoint: COLLECTOR_URL },
    {
        trackerConfig: {
            sessionContext: true,    // Session entity is tracked
            userAnonymisation: true, // User identifiers anonymized
        },
    }
);
```

With `userAnonymisation: true` and `sessionContext: true`, events include the session entity but the `userId` property is set to a null UUID (`00000000-0000-0000-0000-000000000000`). The IDFA identifiers are also removed from the platform entity.

| Identifier          | Location in event        | Included in event?                            |
| ------------------- | ------------------------ | --------------------------------------------- |
| `user_id`           | Atomic                   | ❌                                             |
| `domain_userid`     | Atomic                   | ❌                                             |
| `userId`            | Session entity           | ❌ null UUID                                   |
| `sessionId`         | Session entity           | ✅                                             |
| `previousSessionId` | Session entity           | ❌                                             |
| `appleIdfa`         | Mobile (platform) entity | ❌                                             |
| `appleIdfv`         | Mobile (platform) entity | ❌                                             |
| `androidIdfa`       | Mobile (platform) entity | ❌                                             |
| `network_userid`    | Atomic                   | ✅/❌ removed if you provided this in `Subject` |
| `user_ipaddress`    | Atomic                   | ✅/❌ removed if you provided this in `Subject` |

:::note Toggling anonymous tracking
When anonymous tracking is enabled or disabled using `tracker.setUserAnonymisation(true | false)`, the tracker starts a new session. This results in a new `sessionId`.
:::

  </TabItem>
</Tabs>

## 3. Server-side anonymization

Server-side anonymization affects user identifiers set by the Collector: the `network_userid` property (set in the server-side cookie) and the user IP address. Use the `serverAnonymization` flag to prevent the Collector from setting these values.

:::note Spelling
The new API uses the US English spelling "anonymization", rather than the British English "anonymisation" seen in the older API.
:::

<Tabs groupId="platform" queryString>
  <TabItem value="new" label="Version 4.x" default>

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    serverAnonymization: true,
});
```

  </TabItem>
  <TabItem value="old" label="Version 1.3 - 2.x">

```typescript
const tracker = createTracker(
    'appTracker',
    { endpoint: COLLECTOR_URL },
    {
        emitterConfig: {
            serverAnonymisation: true,
        },
    }
);
```

  </TabItem>
</Tabs>

Setting this flag adds an `SP-Anonymous` HTTP header to requests sent to the Collector. The Snowplow pipeline then anonymizes the `network_userid` and `user_ipaddress` identifiers.

| Identifier          | Location in event        | Included in event?                                  |
| ------------------- | ------------------------ | --------------------------------------------------- |
| `user_id`           | Atomic                   | ✅ if set                                            |
| `domain_userid`     | Atomic                   | ✅ if set                                            |
| `userId`            | Session entity           | ✅                                                   |
| `sessionId`         | Session entity           | ✅                                                   |
| `previousSessionId` | Session entity           | ✅                                                   |
| `appleIdfa`         | Mobile (platform) entity | ✅ if set                                            |
| `appleIdfv`         | Mobile (platform) entity | ✅ if set                                            |
| `androidIdfa`       | Mobile (platform) entity | ✅ if set                                            |
| `network_userid`    | Atomic                   | ❌/✅ still present if you provided this in `Subject` |
| `user_ipaddress`    | Atomic                   | ❌/✅ still present if you provided this in `Subject` |

## 4. Full anonymization

Full anonymization combines client-side and server-side anonymization to remove all user and session identifiers from events.

<Tabs groupId="platform" queryString>
  <TabItem value="new" label="Version 4.x" default>

Avoid configuring unwanted identifiers for full anonymization in version 4.x of the React Native tracker.

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    sessionContext: false,     // No session entity
    serverAnonymization: true, // Collector won't set network_userid or capture IP
    },
});
```

| Identifier          | Location in event        | Included in event?                                  |
| ------------------- | ------------------------ | --------------------------------------------------- |
| `user_id`           | Atomic                   | ✅ if set                                            |
| `domain_userid`     | Atomic                   | ✅ if set                                            |
| `userId`            | Session entity           | ❌ no session entity                                 |
| `sessionId`         | Session entity           | ❌ no session entity                                 |
| `previousSessionId` | Session entity           | ❌ no session entity                                 |
| `appleIdfa`         | Mobile (platform) entity | ✅ if set                                            |
| `appleIdfv`         | Mobile (platform) entity | ✅ if set                                            |
| `androidIdfa`       | Mobile (platform) entity | ✅ if set                                            |
| `network_userid`    | Atomic                   | ❌/✅ still present if you provided this in `Subject` |
| `user_ipaddress`    | Atomic                   | ❌/✅ still present if you provided this in `Subject` |

  </TabItem>
  <TabItem value="old" label="Version 1.3 - 2.x">

```typescript
const tracker = createTracker(
    'appTracker',
    { endpoint: COLLECTOR_URL },
    {
        trackerConfig: {
            sessionContext: false,     // Session entity won't be added to events
            userAnonymisation: true,   // Remove user identifiers from Subject and platform entity
        },
        emitterConfig: {
            serverAnonymisation: true, // Collector won't set network_userid or capture IP
        },
    }
);
```

| Identifier          | Location in event        | Included in event?  |
| ------------------- | ------------------------ | ------------------- |
| `user_id`           | Atomic                   | ❌                   |
| `domain_userid`     | Atomic                   | ❌                   |
| `userId`            | Session entity           | ❌ no session entity |
| `sessionId`         | Session entity           | ❌ no session entity |
| `previousSessionId` | Session entity           | ❌ no session entity |
| `appleIdfa`         | Mobile (platform) entity | ❌                   |
| `appleIdfv`         | Mobile (platform) entity | ❌                   |
| `androidIdfa`       | Mobile (platform) entity | ❌                   |
| `network_userid`    | Atomic                   | ❌                   |
| `user_ipaddress`    | Atomic                   | ❌                   |

  </TabItem>
</Tabs>

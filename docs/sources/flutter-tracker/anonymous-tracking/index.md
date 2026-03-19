---
title: "Enable anonymous tracking with the Flutter tracker"
sidebar_label: "Anonymous tracking"
description: "Anonymize user identifiers including domain_userid, session IDs, network_userid, and IP addresses. Configure client-side and server-side anonymization using userAnonymisation and serverAnonymisation flags."
keywords: ["anonymous tracking", "user anonymization", "privacy", "gdpr", "server anonymization"]
date: "2022-01-31"
sidebar_position: 6000
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Anonymous tracking is a feature that enables anonymization of various user and session identifiers, to support user privacy when consent for tracking the identifiers isn't given.

This table shows the [user and session identifiers](/docs/events/ootb-data/user-and-session-identification/index.md) that can be anonymized on web and mobile:

| Identifier          | Location in event        | Tracked on web                              | Tracked on mobile  |
| ------------------- | ------------------------ | ------------------------------------------- | ------------------ |
| `user_id`           | Atomic                   | ✅                                           | ✅                  |
| `domain_userid`     | Atomic                   | ✅ Non-configurable                          | ✅                  |
| `domain_sessionid`  | Atomic                   | ✅ Non-configurable                          | ❌                  |
| `domain_sessionidx` | Atomic                   | ✅ Non-configurable                          | ❌                  |
| `userId`            | Session entity           | ✅ Non-configurable, same as `domain_userid` | ✅ Non-configurable |
| `sessionId`         | Session entity           | ✅ Non-configurable                          | ✅ Non-configurable |
| `previousSessionId` | Session entity           | ✅ Non-configurable                          | ✅ Non-configurable |
| `appleIdfa`         | Mobile (platform) entity | ❌                                           | ✅                  |
| `appleIdfv`         | Mobile (platform) entity | ❌                                           | ✅                  |
| `androidIdfa`       | Mobile (platform) entity | ❌                                           | ✅                  |
| `network_userid`    | Atomic                   | ✅ Non-configurable                          | ✅                  |
| `user_ipaddress`    | Atomic                   | ✅ Non-configurable                          | ✅                  |

You can set some of these properties at [tracker initialization](/docs/sources/flutter-tracker/initialization-and-configuration/index.md).

:::note Network properties on mobile
The Collector captures the IP address from the request HTTP headers, and updates the `user_ipaddress` event property. However, if you set the `user_ipaddress` property at initialization, that value has priority.

Similarly, if you set the `network_userid` property, that value is used instead of the Collector cookie value.
:::


Read more about anonymous tracking in the [overview page](/docs/events/anonymous-tracking/index.md).

There are several levels to the anonymization depending on which of the categories are affected.

## 1. Full client-side anonymization

In this case, we want to anonymize both the client-side user identifiers as well as the client-side session identifiers. Here the Session entity is not configured: no session information will be tracked at all.

```dart
const TrackerConfiguration()
    .userAnonymisation(true)
    .sessionContext(false)
    .platformContext(true) // only relevant for mobile
```

On web, setting `userAnonymisation` stops any user identifiers or session information being stored in cookies or localStorage. This means that `domain_userid`, `domain_sessionid`, and `domain_sessionidx` will be anonymized. These properties are already not present in any mobile events.

On mobile, setting `userAnonymisation` affects properties in the Session and Platform entities. In this example, the Platform entity is enabled. The `appleIdfv` Platform property would be anonymized, as well as `appleIdfa`/`androidIdfa` if your app is configured to track those.

<Tabs groupId="platform" queryString>
  <TabItem value="web" label="Web" default>

| Identifier          | Location in event        | Included in event?  |
| ------------------- | ------------------------ | ------------------- |
| `user_id`           | Atomic                   | ❌                   |
| `domain_userid`     | Atomic                   | ❌                   |
| `domain_sessionid`  | Atomic                   | ❌                   |
| `domain_sessionidx` | Atomic                   | ❌                   |
| `userId`            | Session entity           | ❌ no session entity |
| `sessionId`         | Session entity           | ❌ no session entity |
| `previousSessionId` | Session entity           | ❌ no session entity |
| `appleIdfa`         | Mobile (platform) entity | N/A                 |
| `appleIdfv`         | Mobile (platform) entity | N/A                 |
| `androidIdfa`       | Mobile (platform) entity | N/A                 |
| `network_userid`    | Atomic                   | ✅                   |
| `user_ipaddress`    | Atomic                   | ✅                   |

  </TabItem>
  <TabItem value="mobile" label="Mobile">

| Identifier          | Location in event        | Included in event?          |
| ------------------- | ------------------------ | --------------------------- |
| `user_id`           | Atomic                   | ❌                           |
| `domain_userid`     | Atomic                   | ❌                           |
| `domain_sessionid`  | Atomic                   | N/A                         |
| `domain_sessionidx` | Atomic                   | N/A                         |
| `userId`            | Session entity           | ❌ no session entity         |
| `sessionId`         | Session entity           | ❌ no session entity         |
| `previousSessionId` | Session entity           | ❌ no session entity         |
| `appleIdfa`         | Mobile (platform) entity | ❌                           |
| `appleIdfv`         | Mobile (platform) entity | ❌                           |
| `androidIdfa`       | Mobile (platform) entity | ❌                           |
| `network_userid`    | Atomic                   | ✅/❌ removed if you set this |
| `user_ipaddress`    | Atomic                   | ✅/❌ removed if you set this |

  </TabItem>
</Tabs>

## 2. Client-side anonymization with session tracking

This setting disables client-side user identifiers but tracks session information.

```dart
const TrackerConfiguration()
    .userAnonymisation(true)
    .sessionContext(true)
    .platformContext(true) // only relevant for mobile
```
Enabling both `userAnonymisation` and `sessionContext` means that events will have the Session entity, but the `userId` property will be anonymised to a null UUID (`00000000-0000-0000-0000-000000000000`). The `sessionId` and `sessionIndex` are still present, as are `domain_sessionid` and `domain_sessionidx` for web events. As above, if the Platform entity is enabled, the IDFA identifiers will not be present.

<Tabs groupId="platform" queryString>
  <TabItem value="web" label="Web" default>

| Identifier          | Location in event        | Included in event? |
| ------------------- | ------------------------ | ------------------ |
| `user_id`           | Atomic                   | ❌                  |
| `domain_userid`     | Atomic                   | ❌                  |
| `domain_sessionid`  | Atomic                   | ✅                  |
| `domain_sessionidx` | Atomic                   | ✅                  |
| `userId`            | Session entity           | ❌ null UUID        |
| `sessionId`         | Session entity           | ✅                  |
| `previousSessionId` | Session entity           | ❌                  |
| `appleIdfa`         | Mobile (platform) entity | N/A                |
| `appleIdfv`         | Mobile (platform) entity | N/A                |
| `androidIdfa`       | Mobile (platform) entity | N/A                |
| `network_userid`    | Atomic                   | ✅                  |
| `user_ipaddress`    | Atomic                   | ✅                  |

  </TabItem>
  <TabItem value="mobile" label="Mobile">

| Identifier          | Location in event        | Included in event?          |
| ------------------- | ------------------------ | --------------------------- |
| `user_id`           | Atomic                   | ❌                           |
| `domain_userid`     | Atomic                   | ❌                           |
| `domain_sessionid`  | Atomic                   | N/A                         |
| `domain_sessionidx` | Atomic                   | N/A                         |
| `userId`            | Session entity           | ❌ null UUID                 |
| `sessionId`         | Session entity           | ✅                           |
| `previousSessionId` | Session entity           | ❌                           |
| `appleIdfa`         | Mobile (platform) entity | ❌                           |
| `appleIdfv`         | Mobile (platform) entity | ❌                           |
| `androidIdfa`       | Mobile (platform) entity | ❌                           |
| `network_userid`    | Atomic                   | ✅/❌ removed if you set this |
| `user_ipaddress`    | Atomic                   | ✅/❌ removed if you set this |

  </TabItem>
</Tabs>

## 3. Server-side anonymization

Server-side anonymization affects user identifiers set server-side. In particular, these are the `network_userid` property set in server-side cookie and the user IP address (`user_ipaddress`). You can anonymize the properties using the `serverAnonymisation` flag in `EmitterConfiguration`:

```dart
const EmitterConfiguration()
    .serverAnonymisation(true)
```

Setting this will add a `SP-Anonymous` HTTP header to requests sent to the Snowplow collector. The Snowplow pipeline will anonymize the identifiers.

On mobile, `serverAnonymisation` and `userAnonymisation` are separate. This means you can anonymize only the server-side identifiers without also anonymizing the client-side identifiers.

On web, setting `serverAnonymisation` provides full anonymization. It's effectively a subset of `userAnonymisation`. If `serverAnonymisation` is enabled, this will also set `userAnonymisation` to `true` (even if set to `false` in your `TrackerConfiguration`).

<Tabs groupId="platform" queryString>
  <TabItem value="web" label="Web" default>

| Identifier          | Location in event        | Included in event?  |
| ------------------- | ------------------------ | ------------------- |
| `user_id`           | Atomic                   | ❌                   |
| `domain_userid`     | Atomic                   | ❌                   |
| `domain_sessionid`  | Atomic                   | ❌                   |
| `domain_sessionidx` | Atomic                   | ❌                   |
| `userId`            | Session entity           | ❌ no session entity |
| `sessionId`         | Session entity           | ❌ no session entity |
| `previousSessionId` | Session entity           | ❌ no session entity |
| `appleIdfa`         | Mobile (platform) entity | N/A                 |
| `appleIdfv`         | Mobile (platform) entity | N/A                 |
| `androidIdfa`       | Mobile (platform) entity | N/A                 |
| `network_userid`    | Atomic                   | ❌                   |
| `user_ipaddress`    | Atomic                   | ❌                   |

  </TabItem>
  <TabItem value="mobile" label="Mobile">

| Identifier          | Location in event        | Included in event?                |
| ------------------- | ------------------------ | --------------------------------- |
| `user_id`           | Atomic                   | ✅                                 |
| `domain_userid`     | Atomic                   | ✅                                 |
| `domain_sessionid`  | Atomic                   | N/A                               |
| `domain_sessionidx` | Atomic                   | N/A                               |
| `userId`            | Session entity           | ✅                                 |
| `sessionId`         | Session entity           | ✅                                 |
| `previousSessionId` | Session entity           | ✅                                 |
| `appleIdfa`         | Mobile (platform) entity | ✅                                 |
| `appleIdfv`         | Mobile (platform) entity | ✅                                 |
| `androidIdfa`       | Mobile (platform) entity | ✅                                 |
| `network_userid`    | Atomic                   | ❌/✅ still present if you set this |
| `user_ipaddress`    | Atomic                   | ❌/✅ still present if you set this |

  </TabItem>
</Tabs>

## 4. Full anonymization for mobile

For full anonymization on mobile, set both client-side and server-side anonymization.

```dart
const TrackerConfiguration()
    .userAnonymisation(true)
    .sessionContext(false)
    .platformContext(true) // only relevant for mobile

const EmitterConfiguration()
    .serverAnonymisation(true)
```

| Identifier          | Location in event        | Included in event?  |
| ------------------- | ------------------------ | ------------------- |
| `user_id`           | Atomic                   | ❌                   |
| `domain_userid`     | Atomic                   | ❌                   |
| `domain_sessionid`  | Atomic                   | N/A                 |
| `domain_sessionidx` | Atomic                   | N/A                 |
| `userId`            | Session entity           | ❌ no session entity |
| `sessionId`         | Session entity           | ❌ no session entity |
| `previousSessionId` | Session entity           | ❌ no session entity |
| `appleIdfa`         | Mobile (platform) entity | ❌                   |
| `appleIdfv`         | Mobile (platform) entity | ❌                   |
| `androidIdfa`       | Mobile (platform) entity | ❌                   |
| `network_userid`    | Atomic                   | ❌                   |
| `user_ipaddress`    | Atomic                   | ❌                   |

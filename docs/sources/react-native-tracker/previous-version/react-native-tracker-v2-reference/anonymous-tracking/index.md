---
title: "Anonymous Tracking"
sidebar_label: "Anonymous Tracking"
date: "2022-08-30"
sidebar_position: 25
description: "Enable client-side and server-side user anonymization in React Native tracker v2 to disable user and session identifiers."
keywords: ["react native tracker v2 anonymous tracking", "user anonymization", "privacy tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info

This feature is available since v1.3.

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

There are several levels to the anonymization depending on which of the three categories are affected:

## 1. Full client-side anonymization

In this case, we want to anonymise both the client-side user identifiers as well as the client-side session identifiers. This means disabling the Session context altogether and enabling user anonymization:

```typescript
const tracker = createTracker(
    'appTracker',
    {endpoint: COLLECTOR_URL},
    {
        trackerConfig: {
            sessionContext: false, // Session context entity won't be added to events
            userAnonymisation: true // User identifiers in Platform context (IDFA and IDFV) will be anonymised
        }
    }
);
```

## 2. Client-side anonymization with session tracking

This setting disables client-side user identifiers but tracks session information. In practice, this means that events track the Session context entity but the `userId` property is a null UUID (`00000000-0000-0000-0000-000000000000`). In case Platform context is enabled, the IDFA identifiers will not be present.

```typescript
const tracker = createTracker(
    'appTracker',
    {endpoint: COLLECTOR_URL},
    {
        trackerConfig: {
            sessionContext: true, // Session context is tracked with the session ID
            userAnonymisation: true // User identifiers in Session and Platform context are anonymised
        }
    }
);
```

## 3. Server-side anonymization

Server-side anonymization affects user identifiers set server-side. In particular, these are the `network_userid` property set in server-side cookie and the user IP address. You can anonymise the properties using the `serverAnonymisation` flag in `EmitterConfiguration`:

```typescript
const tracker = createTracker(
    'appTracker',
    {endpoint: COLLECTOR_URL},
    {
        emitterConfig: {
            serverAnonymisation: true
        }
    }
);
```

Setting the flag will add a `SP-Anonymous` HTTP header to requests sent to the Snowplow collector. The Snowplow pipeline will take care of anonymising the identifiers.

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

:::info

This feature is available since v1.3.

:::

:::note
Version 4 of the React Native tracker does not yet provide full support for client-side anonymization, but this is something we plan to introduce in the upcoming versions.
:::

```mdx-code-block
import AnonymousTrackingSharedBlock from "@site/docs/reusable/anonymous-tracking-mobile/_index.md"

<AnonymousTrackingSharedBlock/>
```

There are several levels to the anonymization depending on which of the three categories are affected:

## 1. Full client-side anonymization

In this case, we want to anonymise both the client-side user identifiers as well as the client-side session identifiers. This means disabling the Session context altogether and enabling user anonymization:

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    sessionContext: false, // Session context entity won't be added to events
});
```

:::warning Subject and platform context properties not anonymised
The version 4 does not yet automatically anonymise the `userId` in the Subject and the IDFA and other identifiers in the platform context entity.
These need to be removed manually.
:::

## 2. Client-side anonymization with session tracking

This setting disables client-side user identifiers but tracks session information. In practice, this means that events track the Session context entity but the `userId` property is a null UUID (`00000000-0000-0000-0000-000000000000`). In case Platform context is enabled, the IDFA identifiers will not be present.

:::warning Not yet available
This option is not yet available in the version 4 of the React Native tracker.
:::

## 3. Server-side anonymization

Server-side anonymization affects user identifiers set server-side. In particular, these are the `network_userid` property set in server-side cookie and the user IP address. You can anonymise the properties using the `serverAnonymisation` flag in `EmitterConfiguration`:

```typescript
const tracker = await newTracker(
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    serverAnonymization: true,
});
```

Setting the flag will add a `SP-Anonymous` HTTP header to requests sent to the Snowplow collector. The Snowplow pipeline will take care of anonymising the identifiers.

---
title: "Anonymous tracking"
description: "Implement anonymous user tracking in Flutter applications for privacy-compliant behavioral analytics."
schema: "TechArticle"
keywords: ["Flutter Anonymous", "Flutter Privacy", "Anonymous Analytics", "Privacy Protection", "Flutter GDPR", "Mobile Privacy"]
date: "2022-01-31"
sidebar_position: 6000
---

```mdx-code-block
import AnonymousTrackingSharedBlock from "@site/docs/reusable/anonymous-tracking-mobile/_index.md"

<AnonymousTrackingSharedBlock/>
```

On web, the following identifiers can be anonymised:

* Web client-side user identifiers: `domain_userid` in the event, also present as `userId` in the [Session](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) context entity.
* Web client-side session identifiers: `domain_sessionid` and `domain_sessionidx` in the event, which are also present in the Session entity as `sessionId`, and `sessionIndex`.
* Server-side identifiers: `network_userid` and `user_ipaddress` event properties.

There are several levels to the anonymisation depending on which of the three categories are affected:

## 1. Full client-side anonymisation

In this case, we want to anonymise both the client-side user identifiers as well as the client-side session identifiers. Here the Session entity is not configured: no session information will be tracked at all.

```dart
const TrackerConfiguration()
    .userAnonymisation(true)
    .sessionContext(false)
    .platformContext(true) // only relevant for mobile
```

On web, setting `userAnonymisation` stops any user identifiers or session information being stored in cookies or localStorage. This means that `domain_userid`, `domain_sessionid`, and `domain_sessionidx` will be anonymised. These properties are already not present in any mobile events. 

On mobile, setting `userAnonymisation` affects properties in the Session and Platform entities. In this example, the Platform entity is enabled. The `appleIdfv` Platform property would be anonymised, as well as `appleIdfa`/`androidIdfa` if your app is [configured](/docs/sources/trackers/react-native-tracker/advanced-usage/index.md#tracking-user-identifiers) to track those.


## 2. Client-side anonymisation with session tracking

This setting disables client-side user identifiers but tracks session information.

```dart
const TrackerConfiguration()
    .userAnonymisation(true)
    .sessionContext(true)
    .platformContext(true) // only relevant for mobile
```
Enabling both `userAnonymisation` and `sessionContext` means that events will have the Session context entity, but the `userId` property will be anonymised to a null UUID (`00000000-0000-0000-0000-000000000000`). The `sessionId` and `sessionIndex` are still present, as are `domain_sessionid` and `domain_sessionidx` for web events. As above, if the Platform context entity is enabled, the IDFA identifiers will not be present.

## 3. Server-side anonymisation

Server-side anonymisation affects user identifiers set server-side. In particular, these are the `network_userid` property set in server-side cookie and the user IP address (`user_ipaddress`). You can anonymise the properties using the `serverAnonymisation` flag in `EmitterConfiguration`:

```dart
const EmitterConfiguration()
    .serverAnonymisation(true)
```

Setting this will add a `SP-Anonymous` HTTP header to requests sent to the Snowplow collector. The Snowplow pipeline will take care of anonymising the identifiers.

On mobile, `serverAnonymisation` and `userAnonymisation` are separate. This means you can anonymise only the server-side identifiers without also anonymising the client-side identifiers.

On web, `serverAnonymisation` is effectively a subset of `userAnonymisation`. If `serverAnonymisation` is enabled, this will also set `userAnonymisation` to `true` (even if set to `false` in your `TrackerConfiguration`).

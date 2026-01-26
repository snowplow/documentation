---
title: "Anonymous tracking"
sidebar_label: "Anonymous tracking"
sidebar_position: 3.1
description: "Track events without collecting user identifiers, IP addresses, or cookies to support privacy compliance and user consent requirements."
keywords: ["anonymous tracking", "privacy", "GDPR", "cookieless", "user identifiers", "PII"]
date: "2026-01-19"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Snowplow enables you to track events without collecting personally identifiable information (PII). Use anonymous tracking to respect user privacy preferences, comply with regulations such as GDPR, or track events before a user has provided consent.

Every Snowplow event includes a number of identifiers. Read more about them in the [overview](/docs/events/identifiers/index.md) and [out-of-the-box tracking](/docs/events/ootb-data/user-and-session-identification/index.md) pages. You can configure your trackers to prevent the collection of these identifiers, as well as IP addresses and cookies, using anonymous tracking.

Some Snowplow trackers also provide options for tracking [user consent](/docs/events/ootb-data/consent-events/index.md) interactions and GDPR basis for processing.

## Anonymization levels

Snowplow trackers support multiple levels of anonymization to balance privacy requirements with analytics needs. Combine client-side and server-side anonymization to achieve the desired level of privacy.

As well as anonymous tracking, you can also use enrichments to pseudonymize or mask identifiers for tracked events, before they arrive at the data warehouse. This uses the [PII pseudonymization](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md) or [IP anonymization](/docs/pipeline/enrichments/available-enrichments/ip-anonymization-enrichment/index.md) enrichments.

For more details on web cookie behavior, see [Cookies and local storage](/docs/sources/web-trackers/cookies-and-local-storage/index.md).

:::note Spelling
Some tracker APIs use the British English spelling: "anonymisation" rather than "anonymization".
:::

### Full client-side anonymization

When configured for full client-side anonymization, the tracker does not track any client-side user or session identifiers. Events can still be collected, but can't be grouped by user or session.

Here's some example code for enabling full client-side anonymization when creating a tracker on [web](/docs/sources/web-trackers/anonymous-tracking/index.md) or [mobile](/docs/sources/mobile-trackers/anonymous-tracking/index.md):

<Tabs groupId="platform" queryString>
  <TabItem value="web" label="JavaScript" default>

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  // No user or session identifiers will be added to events
  // Network identifiers will be tracked
  anonymousTracking: true,
});
```

By default, the tracker uses [cookies and local storage](/docs/sources/web-trackers/cookies-and-local-storage/index.md) to persist user and session information, as well as for buffering events. When anonymous tracking is enabled, identifiers are not saved to cookies or local storage.

  </TabItem>
  <TabItem value="ios" label="iOS">

```swift
Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com") {
  TrackerConfiguration()
    .userAnonymisation(true) // User identifiers in mobile entity (IDFA and IDFV) will not be tracked
    .sessionContext(false) // Session entity won't be added to events
    // Network identifiers will be tracked
}
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
createTracker(
    applicationContext,
    "appTracker",
    NetworkConfiguration("https://snowplow-collector-url.com"),
    TrackerConfiguration("appId")
        .userAnonymisation(true) // User identifiers in mobile entity (IDFA and IDFV) will not be tracked
        .sessionContext(false) // Session entity won't be added to events
        // Network identifiers will be tracked
)
```

  </TabItem>
</Tabs>

### Client-side anonymization with session tracking

In this mode, the tracker doesn't include user identifiers but preserves [session tracking](/docs/events/ootb-data/user-and-session-identification/index.md). You can analyze session-level behavior without identifying individual users.

Here's some example code for enabling client-side anonymization with session tracking when creating a tracker on [web](/docs/sources/web-trackers/anonymous-tracking/index.md) or [mobile](/docs/sources/mobile-trackers/anonymous-tracking/index.md):

<Tabs groupId="platform" queryString>
  <TabItem value="web" label="JavaScript" default>

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  // User identifiers won't be added to events
  // Session and network identifiers will be tracked
  anonymousTracking: { withSessionTracking: true },
});
```

The tracker uses cookies and local storage by default. With this configuration it will store session identifiers, but not user identifiers.

  </TabItem>
  <TabItem value="ios" label="iOS">

```swift
Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com") {
  TrackerConfiguration()
    .userAnonymisation(true) // User identifiers in mobile entity (IDFA and IDFV) will not be tracked
    .sessionContext(true) // Session entity will be added to events but with userId as a null UUID
    // Network identifiers will be tracked
}
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
createTracker(
    applicationContext,
    "appTracker",
    NetworkConfiguration("https://snowplow-collector-url.com"),
    TrackerConfiguration("appId")
        .userAnonymisation(true) // User identifiers in mobile entity (IDFA and IDFV) will not be tracked
        .sessionContext(true) // Session entity will be added to events but with userId as a null UUID
        // Network identifiers will be tracked
)
```

  </TabItem>
</Tabs>

### Server-side anonymization

Server-side anonymization prevents the event [Collector](/docs/pipeline/collector/index.md) setting the `sp` cookie for `network_userid`, or from capturing IP addresses.

Setting server-side anonymization will add a `SP-Anonymous` HTTP header to requests sent to the Collector. This requires the request method to be `POST`, which is the default for most trackers. When the `SP-Anonymous` header is present, the Collector doesn't set or read the `sp` cookie.

An alternative method for preventing IP address tracking is to set a null value, such as `0.0.0.0` within the tracker. Most Snowplow trackers [support this option](/docs/events/ootb-data/user-and-session-identification/index.md), although not the JavaScript trackers.

In the [JavaScript trackers](/docs/sources/web-trackers/anonymous-tracking/index.md), setting server-side anonymization also sets full client-side anonymization. In the [native mobile trackers](/docs/sources/mobile-trackers/anonymous-tracking/index.md), it's a separate configuration. You can choose either client-side anonymization, server-side anonymization, or both.

Here's some example code for enabling server-side anonymization when creating a tracker on [web](/docs/sources/web-trackers/anonymous-tracking/index.md) or [mobile](/docs/sources/mobile-trackers/anonymous-tracking/index.md):

<Tabs groupId="platform" queryString>
  <TabItem value="web" label="JavaScript" default>

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  // No user, session, or network identifiers will be tracked
  anonymousTracking: { withServerAnonymisation: true },
});
```

For fully [cookieless](/docs/sources/web-trackers/cookies-and-local-storage/index.md) web tracking, configure the tracker with:

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  // No user, session, or network identifiers will be tracked
  // No data will be stored in the browser
  anonymousTracking: { withServerAnonymisation: true },
  stateStorageStrategy: 'none',
});
```

This configuration prevents the tracker from storing any data in cookies or local storage.

  </TabItem>
  <TabItem value="ios" label="iOS">

```swift
Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com") {
  // User and session identifiers will be tracked
  // Network identifiers won't be added to events
  EmitterConfiguration().serverAnonymisation(true)
}
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
createTracker(
    applicationContext,
    "appTracker",
    NetworkConfiguration("https://snowplow-collector-url.com"),
    // User and session identifiers will be tracked
    // Network identifiers won't be added to events
    EmitterConfiguration().serverAnonymisation(true)
)
```

  </TabItem>
</Tabs>

## Tracker support TODO TNT flutter tracker add identifier tables NB distingusih web and mobile? take out reusable block?

This table shows the support for anonymous tracking across the main [Snowplow tracker SDKs](/docs/sources/index.md):

| Tracker                                                                                            | Supported | Since version | Client-side | Server-side | Notes                                                         |
| -------------------------------------------------------------------------------------------------- | --------- | ------------- | ----------- | ----------- | ------------------------------------------------------------- |
| [Web](/docs/sources/web-trackers/anonymous-tracking/index.md)                                      | ✅         | 3.0.0         | ✅           | ✅           |                                                               |
| [iOS](/docs/sources/mobile-trackers/anonymous-tracking/index.md)                                   | ✅         | 4.0.0         | ✅           | ✅           |                                                               |
| [Android](/docs/sources/mobile-trackers/anonymous-tracking/index.md)                               | ✅         | 4.0.0         | ✅           | ✅           |                                                               |
| [React Native](/docs/sources/react-native-tracker/anonymous-tracking/index.md)                     | ❌/✅       | 1.3.0         | ❌/✅         | ✅           | Version 4.x only supports server-side anonymization           |
| [Flutter](/docs/sources/flutter-tracker/anonymous-tracking/index.md)                               | ✅         | 0.3.0         | ✅           | ✅           |                                                               |
| [Roku](/docs/sources/roku-tracker/adding-data/index.md#adding-user-and-platform-data-with-subject) | ✅         | 0.3.0         | ✅           | ✅           | Use Subject configuration to manage client-side anonymization |
| [Node.js](/docs/sources/node-js-tracker/initialization/index.md)                                   | ✅         | 3.21.0        | ❌           | ✅           |                                                               |
| Golang                                                                                             | ❌         |               |             |             |                                                               |
| .NET                                                                                               | ❌         |               |             |             |                                                               |
| Java                                                                                               | ❌         |               |             |             |                                                               |
| Python                                                                                             | ❌         |               |             |             |                                                               |
| Scala                                                                                              | ❌         |               |             |             |                                                               |
| Ruby                                                                                               | ❌         |               |             |             |                                                               |
| Rust                                                                                               | ❌         |               |             |             |                                                               |
| [PHP](/docs/sources/php-tracker/emitters/index.md)                                                 | ✅         | 0.9.0         | ❌           | ✅           |                                                               |
| C++                                                                                                | ❌         |               |             |             |                                                               |
| Unity                                                                                              | ❌         |               |             |             |                                                               |
| Lua                                                                                                | ❌         |               |             |             |                                                               |
| [Google Tag Manager](/docs/sources/google-tag-manager/settings-template/index.md)                  | ✅         | v4            | ✅           | ✅           |                                                               |

### Toggle anonymous tracking

As well as setting it at tracker initialization, you can enable or disable anonymous tracking during a session. Use this to start with anonymous tracking until a user accepts a cookie banner, or to enable full tracking when a user logs in.

Here's some example code for toggling anonymization at runtime on [web](/docs/sources/web-trackers/anonymous-tracking/index.md) or [mobile](/docs/sources/mobile-trackers/anonymous-tracking/index.md):

<Tabs groupId="platform" queryString>
  <TabItem value="web" label="JavaScript" default>

```javascript
snowplow('enableAnonymousTracking');
snowplow('disableAnonymousTracking');
```

These methods also accept an [optional configuration object](/docs/sources/web-trackers/anonymous-tracking/index.md#toggling-anonymous-tracking) to specify which levels of anonymization to enable.

  </TabItem>
  <TabItem value="ios" label="iOS">

```swift
tracker.userAnonymisation = true
tracker.sessionContext = true
tracker.emitter?.serverAnonymisation = true
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
tracker.userAnonymisation = true
tracker.sessionContext = true
tracker.emitter.serverAnonymisation = true
```

  </TabItem>
</Tabs>

On web, enabling anonymous tracking removes user identifiers from outgoing events but doesn't delete existing cookies. On mobile, toggling anonymization starts a new session.

### Clear user data

When enabling anonymous tracking, you may want to clear any existing user identifiers stored in cookies or local storage.

Use the `clearUserData()` method in the JavaScript trackers to delete all data stored in the `_sp_id` and `_sp_ses` cookies. It takes an [optional configuration object](/docs/sources/web-trackers/anonymous-tracking/index.md#clear-user-data) to specify which identifiers to clear. To delete the `network_userid` in the Collector `sp` cookie, set server-side anonymization.

There's no equivalent API for deleting stored data on mobile.

## Anonymizable event properties

Use anonymous tracking to avoid collecting the following identifiers in your events. The table shows how you can anonymize each identifier using client-side anonymization, server-side anonymization, or enrichments.

:::note Atomic and session user IDs
Snowplow events have two properties with similar names: the `user_id` atomic event property and the `userId` property in the session entity.

The former is a business user identifier you set via the tracker API, while the latter is a device ID generated by the tracker. Both can be anonymized using client-side anonymization.
:::

| Property                   | Location in event                                                           | Identifier type | Description                                                 | Client-side anon | Server-side anon | Enrichment                                                                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------- | ---------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain_userid`            | [Atomic](/docs/fundamentals/canonical-event/index.md#user-fields)           | User            | UUID stored in a first-party cookie                         | ✅                |                  | ✅ [PII](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md)                                                                                                            |
| `domain_sessionid`         | [Atomic](/docs/fundamentals/canonical-event/index.md#user-fields)           | Session         | UUID for the current session                                | ✅                |                  | ✅ [PII](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md)                                                                                                            |
| `domain_sessionidx`        | [Atomic](/docs/fundamentals/canonical-event/index.md#user-fields)           | Session         | Count of sessions for this user                             | ✅                |                  |                                                                                                                                                                                                               |
| `network_userid`           | [Atomic](/docs/fundamentals/canonical-event/index.md#user-fields)           | Network         | UUID set by the Collector in a server-side cookie           |                  | ✅                | ✅ [PII](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md)                                                                                                            |
| `user_ipaddress`           | [Atomic](/docs/fundamentals/canonical-event/index.md#user-fields)           | Network         | IP address captured by the Collector                        |                  | ✅                | ✅ [PII](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md), [IP anonymization](/docs/pipeline/enrichments/available-enrichments/ip-anonymization-enrichment/index.md) |
| `user_id` in atomic fields | [Atomic](/docs/fundamentals/canonical-event/index.md#user-fields)           | User            | Business user identifier set via `setUserId` or similar API | ✅                |                  | ✅ [PII](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md)                                                                                                            |
| `userId` in session entity | [Entity](/docs/events/ootb-data/user-and-session-identification/index.md)   | User            | Device ID in the client session entity                      | ✅                |                  |                                                                                                                                                                                                               |
| `sessionId`                | [Entity](/docs/events/ootb-data/user-and-session-identification/index.md)   | Session         | UUID for the session                                        | ✅                |                  |                                                                                                                                                                                                               |
| `appleIdfa`                | [Entity](/docs/events/ootb-data/device-and-browser/index.md#mobile-entity)  | User            | Advertising identifier (IDFA) on iOS                        | ✅                |                  |                                                                                                                                                                                                               |
| `appleIdfv`                | [Entity](/docs/events/ootb-data/device-and-browser/index.md#mobile-entity)  | User            | Vendor identifier (IDFV) on iOS                             | ✅                |                  |                                                                                                                                                                                                               |
| `androidIdfa`              | [Entity](/docs/events/ootb-data/device-and-browser/index.md#mobile-entity)  | User            | Advertising identifier on Android                           | ✅                |                  |                                                                                                                                                                                                               |
| `tabId`                    | [Entity](/docs/events/ootb-data/device-and-browser/index.md#browser-entity) | User            | UUID for the browser tab                                    | ✅                |                  |                                                                                                                                                                                                               |

The [PII pseudonymization enrichment](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md) supports an `anonymousOnly` mode, available since Enrich version 5.3.0, that only pseudonymizes fields when the `SP-Anonymous` header is present. This lets you keep full identifiers for consented users while anonymizing non-consented users.

It can also pseudonymize fields for [structured](/docs/fundamentals/canonical-event/index.md#structured-events) and [legacy ecommerce](/docs/fundamentals/canonical-event/index.md#legacy-ecommerce-fields) events, as well as these fields that are populated during enrichment:

| Property             | Location in event                                                                  | Identifier type | Description                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `refr_domain_userid` | [Atomic](/docs/fundamentals/canonical-event/index.md#cross-domain-tracking-fields) | User            | From [cross-domain tracking](/docs/events/cross-navigation/index.md)                                                                  |
| `ip_organization`    | [Atomic](/docs/fundamentals/canonical-event/index.md#ip-address-fields)            | User            | Added by [IP enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md)                              |
| `ip_domain`          | [Atomic](/docs/fundamentals/canonical-event/index.md#ip-address-fields)            | User            | Added by [IP enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md)                              |
| `mkt_term`           | [Atomic](/docs/fundamentals/canonical-event/index.md#marketing-fields)             | Marketing       | Added by [campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md) |
| `mkt_content`        | [Atomic](/docs/fundamentals/canonical-event/index.md#marketing-fields)             | Marketing       | Added by [campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md) |
| `mkt_clickid`        | [Atomic](/docs/fundamentals/canonical-event/index.md#marketing-fields)             | Marketing       | Added by [campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md) |

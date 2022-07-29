---
title: "Sessions and data model"
date: "2022-01-31"
sidebar_position: 5000
---

The Flutter tracker gives you the option to adopt the [Snowplow mobile data model](/docs/migrated/modeling-your-data/the-snowplow-mobile-model/) across all supported platforms – Android, iOS, and Web. In contrast with the [web data model](/docs/migrated/modeling-your-data/the-snowplow-web-data-model/) which builds on page view and page ping events, the mobile data model uses screen view events. The mobile data model was chosen in order to make event tracking consistent across all supported Flutter platforms.

In addition to adopting screen view events, the mobile data model defines that sessions are represented using a [context entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-1). Concretely, the `client_session` context entity is added to all tracked events if session tracking is enabled in the tracker configuration (through the `sessionContext` property). This entity consists of the following properties:

| Attribute | Description | Required? |
| --- | --- | --- |
| `userId` | An identifier for the user of the session. | Yes |
| `sessionId` | An identifier (UUID) for the session. | Yes |
| `sessionIndex` | The index of the current session for this user. | Yes |
| `previousSessionId` | The previous session identifier (UUID) for this user. | No |
| `storageMechanism` | The mechanism that the session information has been stored on the device. | Yes |
| `firstEventId` | The optional identifier (UUID) of the first event id for this session. | No |

Behind the scenes, the Flutter tracker uses the default configuration for session management on the Android, iOS, and Web trackers.

On Android and iOS, session data is maintained for the life of the application being installed on a device. Essentially it will update if it is not accessed within a configurable timeout. There are two inactivity timeouts that result in updates to the `sessionId`: foreground inactivity, and background inactivity timeout. The default 30 minutes setting is used for both.

On the Web, the tracker uses domain (`duid`) and session cookies (`sid`) as implemented by the JavaScript tracker. The session cookie expires after 30 minutes of inactivity. This means that a user leaving the site and returning in under 30 minutes does not change the session. In contrast with the JavaScript tracker, the Flutter tracker also adds the `client_session` context entity that wraps the domain and session IDs.

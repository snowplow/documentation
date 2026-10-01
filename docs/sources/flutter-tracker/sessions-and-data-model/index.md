---
title: "Configure session tracking with the Flutter tracker and Unified Digital package"
sidebar_label: "Sessions and data model"
description: "Enable session tracking with the client_session entity across Android, iOS, and Web. Configure session timeouts, continue sessions after an app restart, and start a new session on demand."
keywords: ["session tracking", "client session", "unified data model", "session timeout", "session context", "new session", "SessionConfiguration"]
date: "2022-01-31"
sidebar_position: 5000
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Flutter tracker gives you the option to adopt the [Snowplow Unified data model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) across all supported platforms – Android, iOS, and Web.

In addition to adopting screen view events, the unified data model defines that sessions are represented using a [context entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-1) where it exists. Concretely, the `client_session` context entity is added to all tracked events if session tracking is enabled in the tracker configuration (through the `sessionContext` property). This entity consists of the following properties:

| Attribute           | Description                                                               | Required? |
| ------------------- | ------------------------------------------------------------------------- | --------- |
| `userId`            | An identifier for the user of the session.                                | Yes       |
| `sessionId`         | An identifier (UUID) for the session.                                     | Yes       |
| `sessionIndex`      | The index of the current session for this user.                           | Yes       |
| `previousSessionId` | The previous session identifier (UUID) for this user.                     | No        |
| `storageMechanism`  | The mechanism that the session information has been stored on the device. | Yes       |
| `firstEventId`      | The optional identifier (UUID) of the first event id for this session.    | No        |

## Configure session timeouts

The tracker ends the current session and starts a new one when it isn't used within an inactivity timeout. Both the timeouts and how they apply depend on the platform.

:::note[Version support]
The `SessionConfiguration` class was added in version 0.11.1. Earlier versions always use the default timeouts.
:::

<Tabs groupId="platform" queryString>
  <TabItem value="mobile" label="Android and iOS" default>

Session data is maintained for the life of the application being installed on a device. There are two inactivity timeouts: one while the app is in the foreground, and one while it's in the background. Both default to 30 minutes.

To change them, pass a `SessionConfiguration` to `Snowplow.createTracker`:

```dart
SnowplowTracker tracker = await Snowplow.createTracker(
    namespace: 'ns1',
    endpoint: 'http://...',
    sessionConfig: const SessionConfiguration(
        foregroundTimeout: Duration(minutes: 30),
        backgroundTimeout: Duration(minutes: 5)));
```

| Attribute                  | Type        | Description                                                                                                                  | Default    |
| -------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `foregroundTimeout`        | `Duration?` | Inactivity timeout while the app is in the foreground.                                                                       | 30 minutes |
| `backgroundTimeout`        | `Duration?` | Inactivity timeout while the app is in the background.                                                                       | 30 minutes |
| `continueSessionOnRestart` | `bool?`     | Whether to continue the previous session when the app restarts. See [Continue sessions after an app restart](#continue-sessions-after-an-app-restart). | false      |

  </TabItem>
  <TabItem value="web" label="Web">

The tracker uses domain (`duid`) and session cookies (`sid`) as implemented by the JavaScript tracker. The session cookie expires after 30 minutes of inactivity by default. This means that a user leaving the site and returning in under 30 minutes does not change the session. In contrast with the JavaScript tracker, the Flutter tracker also adds the `client_session` entity that wraps the domain and session IDs.

To change the timeout, set `foregroundTimeout` in a `SessionConfiguration`. It sets the JavaScript tracker's session cookie timeout:

```dart
SnowplowTracker tracker = await Snowplow.createTracker(
    namespace: 'ns1',
    endpoint: 'http://...',
    sessionConfig: const SessionConfiguration(
        foregroundTimeout: Duration(minutes: 30)));
```

| Attribute           | Type        | Description                     | Default    |
| ------------------- | ----------- | ------------------------------- | ---------- |
| `foregroundTimeout` | `Duration?` | Timeout of the session cookie.  | 30 minutes |

The session cookie timeout counts down regardless of whether the page is visible. All trackers on a page share the session cookie, so give them the same timeout. The `backgroundTimeout` and `continueSessionOnRestart` options have no effect on Web.

  </TabItem>
</Tabs>

Timeouts use whole seconds and must be at least 1 second. The tracker throws an `ArgumentError` for shorter values. Options that you don't set keep their default values.

## Continue sessions after an app restart

By default, the tracker on Android and iOS starts a new session each time the app is launched, even if the previous session hasn't timed out yet. Set `continueSessionOnRestart` to `true` to resume the persisted session instead, as long as it's still within the timeout:

```dart
SnowplowTracker tracker = await Snowplow.createTracker(
    namespace: 'ns1',
    endpoint: 'http://...',
    sessionConfig: const SessionConfiguration(continueSessionOnRestart: true));
```

This option is only available on Android and iOS. On Web, the session is kept in a cookie across page loads.

## Start a new session

:::note[Version support]
The `startNewSession` method was added in version 0.11.1.
:::

You can end the current session and start a new one, for example when the user logs out. Combine it with `setUserId(null)` to also clear the business user ID:

```dart
// On the tracker instance:
await tracker.setUserId(null);
await tracker.startNewSession();

// Or via the static API, using the tracker namespace:
await Snowplow.startNewSession(tracker: 'ns1');
```

When the new session starts depends on the platform:

<Tabs groupId="platform" queryString>
  <TabItem value="mobile" label="Android and iOS" default>

The new session starts with the next tracked event. Until then, `tracker.sessionId` and `tracker.sessionIndex` return the values of the previous session. If the `sessionContext` option is disabled, the method has no effect.

  </TabItem>
  <TabItem value="web" label="Web">

The JavaScript tracker rotates the session cookie immediately. All trackers on the page share the session, so the method starts a new session for all of them. This happens even if the `sessionContext` option is disabled.

  </TabItem>
</Tabs>

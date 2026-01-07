---
title: "Sessions"
sidebar_position: 35
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The web tracker can add a context entity to events with information about the current session. The context entity repeats some of the session information stored in canonical event properties (e.g. `domain_userid`, `domain_sessionid`), but also adds new information.

It adds a reference to the previous session (`previousSessionId`) and first event in the current session (`firstEventId`, `firstEventTimestamp`). It also adds an index of the event in the session, useful for ordering events as they were tracked (`eventIndex`).

:::note
Because session tracking requires the session cookie, no session context entities will be added to events if anonymous tracking is enabled.
:::

The default session expiry time is 30 minutes.

## Tracking the session entity

The session entity is **automatically tracked** once configured.

<details>
    <summary>Client session entity properties</summary>

The [client_session](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2/) context entity consists of the following properties:

| Attribute             | Description                                                                                                   | Required? |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | --------- |
| `userId`              | An identifier for the user of the session (same as `domain_userid`).                                          | Yes       |
| `sessionId`           | An identifier (UUID) for the session (same as `domain_sessionid`).                                            | Yes       |
| `sessionIndex`        | The index of the current session for this user (same as `domain_sessionidx`).                                 | Yes       |
| `eventIndex`          | Optional index of the current event in the session. Signifies the order of events in which they were tracked. | No        |
| `previousSessionId`   | The previous session identifier (UUID) for this user.                                                         | No        |
| `storageMechanism`    | The mechanism that the session information has been stored on the device.                                     | Yes       |
| `firstEventId`        | The optional identifier (UUID) of the first event id for this session.                                        | No        |
| `firstEventTimestamp` | Optional date-time timestamp of when the first event in the session was tracked.                              | No        |

:::note
Please note that the session context entity is only available since version 3.5 of the tracker.
:::
</details>

## Starting a new session

The tracker automatically tracks session information and implements session timeouts after which the session is reset.

However, in case you want to trigger a new session manually (e.g., after logging out a user), you can use the `newSession` call to do that.

This will expire the current session and start a new session.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('newSession');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newSession } from '@snowplow/browser-tracker';

newSession();
```
  </TabItem>
</Tabs>


## On session update callback

The `onSessionUpdateCallback` option, allows you to supply a callback function to be executed whenever a new session is generated on the tracker.

The callback's signature is:
`(clientSession: ClientSession) => void`
where clientSession includes the same values as you would expect on the [`client_session`](https://iglucentral.com/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) context.

_Note:_ The callback is **not** called whenever a session is expired, but only when a new one is generated.

:::note
Please note that the session context entity is only available since version 3.11 of the tracker.
:::

## Session cookie duration

Whenever an event fires, the tracker creates a session cookie. If the cookie didn’t previously exist, the tracker interprets this as the start of a new session.

By default the session cookie expires after 30 minutes. This means that a user leaving the site and returning in under 30 minutes does not change the session. You can override this default by setting `sessionCookieTimeout` to a duration (in seconds) in the initial tracker configuration object. For example,

```json
{
  ...
  sessionCookieTimeout: 3600
  ...
}
```

would set the session cookie lifespan to an hour.

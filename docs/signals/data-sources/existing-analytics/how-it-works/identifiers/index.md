---
title: "Identifiers and attribute keys for events from your existing tool"
sidebar_label: "Identifiers"
sidebar_position: 20
description: "Which ID becomes domain_userid on each approach, which keys are safe on the public intervention endpoint, and how to join and resolve identities across your tool and Snowplow."
keywords: ["domain_userid", "attribute keys", "external_identity", "interventions", "snowplow_id", "identity resolution"]
date: "2026-11-17"
content_type: concept
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Signals calculates and serves attributes per [attribute key](/docs/signals/attributes/attribute-keys/index.md), such as `domain_userid` for a visitor or `domain_sessionid` for a session. Client-side approaches fill these with Snowplow's own random IDs. Server-side approaches fill them with your tool's IDs. Either way, your tool's IDs are also kept in the `external_identity` entity, so you can join back to your tool's data.

## Which IDs become domain_userid and domain_sessionid

| Tool | Client-side approach | Server-side approach | Warehouse history |
| --- | --- | --- | --- |
| Segment | Snowplow's random ID | `anonymousId` | `anonymousId` |
| RudderStack | Snowplow's random ID | `anonymousId` | `anonymous_id` |
| GA4 and GTM | Snowplow's random ID | GA client ID | `user_pseudo_id`, the GA client ID |
| Amplitude | Snowplow's random ID | `device_id` | `device_id` |
| Adobe | Snowplow's random ID | ECID | `mcvisid`, the ECID |
| PostHog | Snowplow's random ID | `$device_id` | `$device_id`, or `distinct_id` |

Amplitude's [variant without the Snowplow tracker](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/amplitude.md#send-without-the-snowplow-tracker) keys on `device_id`, like the server-side approaches. Server libraries accept any string as an anonymous ID, so check what your server sources send.

### Sessions

On client-side approaches, sessions use Snowplow's `domain_sessionid`. Server-side approaches have no Snowplow sessions, except on two tools whose events carry a session ID:

- **PostHog:** `$session_id` becomes `domain_sessionid` unchanged.
- **Amplitude:** the adapter builds a session key from `device_id` and Amplitude's session ID. Your page can build the same key from `amplitude.getDeviceId()` and `amplitude.getSessionId()` to read session attributes.

<details>
<summary>How the Amplitude session key is built</summary>

```js
function sessionKey(deviceId, sessionId) {
  if (!deviceId || sessionId === undefined || sessionId === null || sessionId < 0) return undefined;
  var d = String(deviceId).toLowerCase();
  var tail = ('000000000000' + Number(sessionId).toString(16)).slice(-12);
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(d)) return d.slice(0, 24) + tail;
  // device_id isn't a UUID: derive a stable UUIDv5 from both values instead.
  return uuidv5('amplitude-session:' + deviceId + ':' + sessionId, NAMESPACE);
}
```

</details>

Other tools' session IDs, where they have one, are kept in `external_identity.session_id` for joins only.

## Tool IDs by tool

Each tool's IDs, where they land in Snowplow, and whether you can use them as a Signals attribute key.

<Tabs groupId="analytics-tool" queryString>
  <TabItem value="segment" label="Segment" default>

| Segment field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow cookie ID (client-side) | `domain_userid` | Yes. Random, and safe on the public intervention endpoint |
| Snowplow session ID (client-side) | `domain_sessionid` | Yes, for session attributes |
| `anonymousId` | Server-side: `domain_userid`. Both: `external_identity.anonymous_id` | Server-side key, for reads from your backend only. Never on the public intervention endpoint |
| `userId` | `user_id`, `external_identity.user_id`, and `identify.id`, unchanged. If it's an email address, the email reaches Snowplow | Backend reads only. Never on the public intervention endpoint |
| `groupId` | `external_event.group_id` | Backend reads only, for account attributes |
| `messageId` | `event_id` (server-side) | No |

  </TabItem>
  <TabItem value="rudderstack" label="RudderStack">

| RudderStack field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow cookie ID (client-side) | `domain_userid` | Yes. Random, and safe on the public intervention endpoint |
| Snowplow session ID (client-side) | `domain_sessionid` | Yes, for session attributes |
| `anonymousId` | Server-side: `domain_userid`. Both: `external_identity.anonymous_id` | Server-side key, for reads from your backend only. Read it in the page with `rudderanalytics.getAnonymousId()`. Never on the public intervention endpoint |
| `userId` | `user_id`, `external_identity.user_id`, and `identify.id`, unchanged. If it's an email address, the email reaches Snowplow | Backend reads only. Never on the public intervention endpoint |
| `context.sessionId` | `external_identity.session_id` | No. It's a timestamp, so it can be guessed |
| `groupId` | `external_event.group_id` | Backend reads only, for account attributes |
| `messageId` | `event_id` | No |

On the server-side approaches, an event with no `anonymousId`, such as a server call with only a `userId`, has no `domain_userid` and a null `external_identity.anonymous_id`. Calculate attributes for those events on `user_id`.

  </TabItem>
  <TabItem value="ga4-and-google-tag-manager" label="GA4 and GTM">

| GA4 or GTM field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow first-party cookie | `domain_userid` | Yes. A random ID, safe on the public intervention endpoint |
| Snowplow session | `domain_sessionid` | Yes, for session attributes. Server-side GTM has none |
| GA client ID (`_ga` cookie, `user_pseudo_id` in BigQuery) | `external_identity.anonymous_id`. On server-side GTM, also `domain_userid` | Only for reads from your own servers. Never on the public intervention endpoint |
| GA session ID and session number | `external_identity.session_id` and `session_number` | No |
| GA `user_id` | `user_id`, `external_identity.user_id`, and `identify.id` on login | Only for reads from your own servers |

  </TabItem>
  <TabItem value="amplitude" label="Amplitude">

| Amplitude field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow's own visitor and session cookies (with the tracker) | `domain_userid`, `domain_sessionid` | Yes, including on the public intervention endpoint |
| `device_id` | `external_identity.anonymous_id`. Also `domain_userid` without the tracker and on the webhook | Server-side reads only: a `?deviceId=` link can set it |
| `session_id` | `external_identity.session_id`. Without the tracker and on the webhook, also part of `domain_sessionid` | Never on its own: it's a timestamp |
| `user_id` | `user_id`, `external_identity.user_id`, and `identify.id`, unchanged | Server-side reads only |
| `groups` | `external_event.group_id` | As a custom key for account attributes, server-side reads only |

To combine a visitor's activity across devices and logins, key stream attribute groups on `snowplow_id` with Snowplow Identities.

  </TabItem>
  <TabItem value="adobe" label="Adobe">

| Adobe field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow visitor ID, client-side approaches | `domain_userid` | Yes. A random ID, safe on the public intervention endpoint |
| Snowplow session ID, client-side approaches | `domain_sessionid` | Yes, for session attributes |
| ECID | `external_identity.anonymous_id`; on event forwarding, also `domain_userid` | Only for reads from your own servers. Never on the public intervention endpoint |
| Authenticated ID: Web SDK `identityMap` CRMID, or your user ID eVar | `user_id`, `external_identity.user_id`, and `identify.id`, unchanged | Only for reads from your own servers |
| Adobe visit | Nothing | Adobe computes visits on its servers |

  </TabItem>
  <TabItem value="posthog" label="PostHog">

| PostHog field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow's own visitor and session cookies (client-side) | `domain_userid`, `domain_sessionid` | Yes, including on the public intervention endpoint |
| `$device_id` | `external_identity.anonymous_id`. Server-side, also `domain_userid` | Server-side reads only |
| `$session_id` | `external_identity.session_id`. Server-side, also `domain_sessionid` | Server-side reads only |
| `distinct_id` after `identify` | `user_id`, `external_identity.user_id`, and `identify.id`, unchanged | Server-side reads only |
| `$group_key` on `$groupidentify` | `external_event.group_id` | Server-side reads only, for account attributes |

`$device_id` can't be guessed, but it includes the time of the visitor's first visit, and PostHog's server SDKs accept any value for it. For interventions, use the client-side approach. If you run PostHog in cookieless mode, there's no `$device_id`, so use the client-side approach, which keys on Snowplow's own IDs.

Events from PostHog's server SDKs and the capture API usually carry only a `distinct_id`. The destination then sends the `distinct_id` as the anonymous ID, in `domain_userid` and `external_identity.anonymous_id`, with an empty `user_id`. To send it as the user ID, add a `$device_id` to those events that differs from the `distinct_id`.

  </TabItem>
</Tabs>

## Keys you can use on the public intervention endpoint

Your application subscribes to [interventions](/docs/signals/interventions/index.md) through a public endpoint, by attribute key value. Anyone who knows or can guess a value could subscribe to it, so use a random value nobody can enumerate.

| Key | Safe on the public endpoint? |
| --- | --- |
| Snowplow `domain_userid` and `domain_sessionid` on client-side approaches | Yes |
| Segment and RudderStack `anonymousId`, PostHog `$device_id` and `$session_id` | Not recommended: they can be predicted in part, or set to any value by server SDKs |
| Amplitude `device_id`, Adobe ECID, GA client ID, GA and RudderStack session IDs | No: they can be set from a link, aren't documented as random, or contain timestamps |
| `user_id`, `group_id` | No: chosen by you and often guessable |

The recommended pattern:

- **Interventions:** a client-side approach, keyed on `domain_userid` or `domain_sessionid`.
- **Logged-in reads from your backend:** read by `user_id` through the Profiles API, which isn't public.
- **Server-side approaches:** read attributes from your backend by your tool's ID.

## Join back to your tool with external_identity

Every event carries an `external_identity` entity with the IDs your tool assigned and the original event name:

```json
{
  "schema": "iglu:com.example/external_identity/jsonschema/1-0-0",
  "data": {
    "tool": "amplitude",
    "anonymous_id": "56faf157-e1d8-4e4c-9e1f-3886820b6190",
    "user_id": "user-123",
    "session_id": "1794586019823",
    "event_name": "$identify"
  }
}
```

| Field | Holds |
| --- | --- |
| `anonymous_id` | Your tool's visitor ID: `anonymousId`, the GA client ID, `device_id`, the ECID, or `$device_id` |
| `user_id` | Your tool's user ID |
| `session_id` | Your tool's session ID, where it has one |
| `session_number` | GA4's session number, on GA4 only |
| `event_name` | The event's name in your tool |

Use it to join Snowplow events to your tool's own export, to compare counts by event name while you check the setup, and to keep history keyed on your tool's ID when you move to native tracking. Until your tool has set its ID, the entity is sent with a null `anonymous_id`.

The schema is under your own vendor, shown here as `com.example`. See [Create the schemas in your registry](/docs/signals/data-sources/existing-analytics/reference/index.md#create-the-schemas-in-your-registry).

## Combine keys and keep history

Each attribute key gives you a separate set of attributes. You can add a key on your tool's own ID, combine keys for the same person with identity resolution, and keep history when you move to native tracking.

### Calculate attributes on your tool's ID

To calculate attributes per ID your tool assigned, define a custom attribute key on `anonymous_id`. Read these attributes from your backend only.

```python
from snowplow_signals import AttributeKey, EntityProperty

tool_visitor = AttributeKey(
    name="tool_anonymous_id",
    description="The visitor ID your analytics tool assigned",
    property=EntityProperty(
        vendor="com.example",
        name="external_identity",
        major_version=1,
        path="anonymous_id",
    ),
)
```

### Resolve identities with snowplow_id

One attribute read uses one key, so attributes keyed on `domain_userid` and on `user_id` stay separate. To combine a person's anonymous and logged-in activity, use [identity resolution](/docs/signals/attributes/identity-resolution/index.md), which needs [Snowplow Identities](/docs/identities/index.md) on the same pipeline.

Key stream attribute groups on `snowplow_id` and select up to three lookup identifiers, such as `domain_userid` and `user_id`. Your website then reads by `domain_userid` and your backend by `user_id`, and both get the same person's attributes. Interventions are still delivered to `domain_userid`, so the public endpoint keeps a random key. This works for stream attribute groups only, from events processed after you publish.

### When you move to native tracking

On client-side approaches, `domain_userid` is already Snowplow's own ID, so attributes carry over when you replace the adapter with native tracking. On server-side approaches, history keyed on your tool's ID needs a custom key on `external_identity.anonymous_id`. See [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).

---
title: "Identifiers and attribute keys for events from your existing tool"
sidebar_label: "Identifiers"
sidebar_position: 20
description: "Which ID becomes domain_userid on each approach, which keys are safe on the public intervention endpoint, and how to join and resolve identities across your tool and Snowplow."
keywords: ["domain_userid", "attribute keys", "external_identity", "interventions", "snowplow_id", "identity resolution"]
date: "2026-11-17"
content_type: concept
---

Signals calculates and serves attributes per [attribute key](/docs/signals/attributes/attribute-keys/index.md), such as `domain_userid` for a visitor or `domain_sessionid` for a session. Client-side approaches fill these with Snowplow's own random IDs. Server-side approaches fill them with your tool's IDs. Either way, your tool's IDs are also kept in the `external_identity` entity, so you can join back to your tool's data.

## Which ID becomes domain_userid

| Tool | Client-side approach | Server-side approach | Warehouse history |
| --- | --- | --- | --- |
| Segment | Snowplow's random ID | `anonymousId` | `anonymousId` |
| RudderStack | Snowplow's random ID | `anonymousId` | `anonymous_id` |
| GA4 and GTM | Snowplow's random ID | GA client ID | `user_pseudo_id`, the GA client ID |
| Amplitude | Snowplow's random ID | `device_id` | `device_id` |
| Adobe | Snowplow's random ID | ECID | `mcvisid`, the ECID |
| PostHog | Snowplow's random ID | `$device_id` | `$device_id`, or `distinct_id` |

Amplitude's [variant without the Snowplow tracker](/docs/signals/data-sources/existing-analytics/tools/amplitude/index.md#send-without-the-snowplow-tracker) keys on `device_id`, like the server-side approaches. Server libraries accept any string as an anonymous ID, so check what your server sources send.

## Sessions

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
  "schema": "iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0",
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
| `anonymous_id` | Your tool's visitor ID: `anonymousId`, the GA client ID, `device_id`, the ECID or `$device_id` |
| `user_id` | Your tool's user ID |
| `session_id` | Your tool's session ID, where it has one |
| `session_number` | GA4's session number, on GA4 only |
| `event_name` | The event's name in your tool |

Use it to join Snowplow events to your tool's own export, to compare counts by event name while you check the setup, and to keep history keyed on your tool's ID when you move to native tracking. Until your tool has set its ID, the entity is sent with a null `anonymous_id`.

### Calculate attributes on your tool's ID

To calculate attributes per ID your tool assigned, define a custom attribute key on `anonymous_id`. Read these attributes from your backend only.

```python
from snowplow_signals import AttributeKey, EntityProperty

tool_visitor = AttributeKey(
    name="tool_anonymous_id",
    description="The visitor ID your analytics tool assigned",
    property=EntityProperty(
        vendor="com.snowplowanalytics.snowplow",
        name="external_identity",
        major_version=1,
        path="anonymous_id",
    ),
)
```

## Resolve identities with snowplow_id

One attribute read uses one key, so attributes keyed on `domain_userid` and on `user_id` stay separate. To combine a person's anonymous and logged-in activity, use [identity resolution](/docs/signals/attributes/identity-resolution/index.md), which needs [Snowplow Identities](/docs/identities/index.md) on the same pipeline.

Key stream attribute groups on `snowplow_id` and select up to three lookup identifiers, such as `domain_userid` and `user_id`. Your website then reads by `domain_userid` and your backend by `user_id`, and both get the same person's attributes. Interventions are still delivered to `domain_userid`, so the public endpoint keeps a random key. This works for stream attribute groups only, from events processed after you publish.

## When you move to native tracking

On client-side approaches, `domain_userid` is already Snowplow's own ID, so attributes carry over when you replace the adapter with native tracking. On server-side approaches, history keyed on your tool's ID needs a custom key on `external_identity.anonymous_id`. See [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).

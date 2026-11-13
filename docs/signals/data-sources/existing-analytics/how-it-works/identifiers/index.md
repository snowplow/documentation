---
title: "Identifiers and attribute keys for events from your existing tool"
sidebar_label: "Identifiers"
sidebar_position: 20
description: "Which ID becomes domain_userid on each approach, which keys are safe on the public intervention endpoint, and how to join and resolve identities across your tool and Snowplow."
keywords: ["domain_userid", "attribute keys", "external_identity", "interventions", "snowplow_id", "identity resolution"]
date: "2026-11-13"
content_type: concept
---

Signals calculates and serves attributes per [attribute key](/docs/signals/attributes/attribute-keys/index.md), such as `domain_userid` for a visitor or `domain_sessionid` for a session. Which value ends up in those fields depends on the approach you choose. Client-side approaches use Snowplow's own random IDs. Server-side approaches use your tool's IDs. Either way, your tool's IDs are kept in the `external_identity` entity so you can join back to your tool's data.

## Which ID becomes domain_userid

| Tool | Client-side approach | Server-side approach | Warehouse history |
| --- | --- | --- | --- |
| Segment | Snowplow's random ID from the tracker's `_sp_id` cookie | `anonymousId` | `anonymousId` |
| RudderStack | Snowplow's random ID from `_sp_id` | `anonymousId` | `anonymous_id` |
| GA4 and GTM | Snowplow's random ID from `_sp_id` | GA client ID (server-side GTM) | `user_pseudo_id`, the GA client ID |
| Amplitude | Snowplow's random ID from `_sp_id` | `device_id` | `device_id` |
| Adobe | Snowplow's random ID from `_sp_id` | ECID (event forwarding) | `mcvisid`, the ECID |
| PostHog | Snowplow's random ID from `_sp_id` | `$device_id` | `$device_id` from the event properties, or `distinct_id` |

On every approach, `network_userid` follows the same pattern: the Collector's own cookie on client-side approaches, and your tool's ID on server-side approaches.

Amplitude also has a lighter client-side variant that posts each event straight to the Collector without loading the Snowplow tracker. It keys on Amplitude's `device_id`, like the server-side approaches. See [Send without the Snowplow tracker](/docs/signals/data-sources/existing-analytics/tools/amplitude/index.md#send-without-the-snowplow-tracker).

A few edge cases on server-side approaches:

- **IDs longer than 128 characters** are replaced by their SHA-256 hash, because `domain_userid` and `network_userid` hold at most 128 characters. The original stays in `external_identity`.
- **Events with only a user ID**, which server libraries often send, are handled differently by each adapter. The Segment adapter leaves `domain_userid` empty, sets a random `network_userid` and sends no `external_identity` entity, because that entity requires an anonymous ID; read these events by `user_id`. The RudderStack transformation falls back to the user ID, so the user ID becomes `domain_userid`, `network_userid` and `external_identity.anonymous_id`. That key is guessable, and holds an email in clear if your user IDs are emails.
- **Server libraries accept any string** as an anonymous ID. A Segment server-side event with the anonymous ID `x` writes `x` into `domain_userid`. Check what your server sources send.

## Sessions

| Tool | Client-side approach | Server-side approach |
| --- | --- | --- |
| Segment, RudderStack | Snowplow's `domain_sessionid` | None |
| GA4 and GTM | Snowplow's `domain_sessionid` | None |
| Amplitude | Snowplow's `domain_sessionid` | A key built from `device_id` and Amplitude's session ID |
| Adobe | Snowplow's `domain_sessionid` | None |
| PostHog | Snowplow's `domain_sessionid` | PostHog's `$session_id`, unchanged |

Amplitude and PostHog are the tools here whose events carry a session ID. PostHog's `$session_id` is a UUID version 7, so the PostHog adapter uses it as `domain_sessionid` as it is. Amplitude's is a start time in milliseconds. Because `domain_sessionid` must be a UUID, the Amplitude adapter keeps the first 24 characters of `device_id` and puts the session ID, in hexadecimal, in the last 12:

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

Your page can build the same key from `amplitude.getDeviceId()` and `amplitude.getSessionId()` to read session attributes.

The other tools' session IDs, where they have one, are kept in `external_identity.session_id` for joins only. RudderStack's `context.sessionId` and GA4's session ID are session start times, so they're guessable. Adobe sends no session ID: visits are calculated on Adobe's servers.

## Keys you can use on the public intervention endpoint

Your application subscribes to [interventions](/docs/signals/interventions/index.md) through a public endpoint, by attribute key value. Anyone who knows or can guess a value could subscribe to it, so the value must be random and impossible to enumerate. Use Snowplow's own IDs wherever you can.

| Key | Safe on the public endpoint? | Why |
| --- | --- | --- |
| Snowplow `domain_userid`, `domain_sessionid` and `network_userid` on client-side approaches | Yes | Random UUIDs set by the Snowplow tracker and Collector |
| Segment `anonymousId` | Not recommended | A random UUID in analytics.js, but analytics-next 1.84.3 builds it from `Math.random` and from the same pool as the event's `messageId`, so anyone who sees raw message IDs, such as another Segment destination, can nearly reconstruct it. Server libraries and `setAnonymousId()` accept any value |
| RudderStack `anonymousId` | Not recommended | A UUID in the JavaScript SDK, but RudderStack doesn't document how it's generated, and server SDKs accept any value |
| Amplitude `device_id`, and the session key built from it | No | A `?deviceId=` link parameter sets it to any value, and the value sticks on later visits, so anyone who gets a visitor to open a link knows their key |
| Adobe ECID | No | Adobe derives it from your org ID and the Audience Manager user ID and doesn't document how random it is |
| GA client ID | No | Half of it is the first visit time in seconds. With analytics storage denied, GA4 sets no `_ga` cookie, so the ID changes on every full page load |
| GA session ID, RudderStack `sessionId` | No | Session start times |
| PostHog `$device_id` and `$session_id` | Not recommended | UUIDs version 7 that posthog-js builds from `crypto.getRandomValues`, so they can't be guessed, but their first 48 bits are the time they were created, to the millisecond. Any script on the page can read them, and `bootstrap.distinctID`, PostHog's server SDKs and the capture API accept any value |
| `user_id`, `group_id` | No | Chosen by you and often sequential or guessable. Use them only for server-side reads |

So the recommended pattern is:

- **Interventions:** client-side approach, keyed on `domain_userid` or `domain_sessionid`.
- **Logged-in reads from your backend:** read by `user_id` through the Profiles API. These reads aren't public.
- **Server-side approaches:** read attributes server-side by your tool's ID. Don't target interventions at it unless your tool page says it's safe.

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

| Field | Segment | RudderStack | GA4 | Amplitude | Adobe | PostHog |
| --- | --- | --- | --- | --- | --- | --- |
| `anonymous_id` | `anonymousId` | `anonymousId` | GA client ID | `device_id` | ECID | `$device_id` |
| `user_id` | `userId` | `userId` | GA `user_id` | `user_id` | CRM ID from `identityMap` or `setCustomerIDs` | `distinct_id` after `identify`, hashed when it contains `@` |
| `session_id` | Empty | `context.sessionId` | GA session ID | Amplitude session ID | Empty | `$session_id` |
| `session_number` | Empty | Empty | GA session number | Not set | Empty | Empty |
| `event_name` | Event name or call type | Event name or call type | GA4 event name | `event_type` | XDM `eventType`, link name or `page_view` | PostHog event name |

Use it to:

- Join Snowplow events to your tool's own export, such as the GA4 BigQuery export on `user_pseudo_id` or Adobe Data Feeds on `mcvisid`.
- Compare counts between your tool and Snowplow by event name while you check the setup.
- Keep history keyed on your tool's ID when you later move to native Snowplow tracking.

On client-side approaches, an event can only carry the entity once your tool has set its ID. On the GTM tag template approach, the first page view tag fires on Window Loaded rather than All Pages, so that gtag has set the GA client ID. The GA4 page script waits for it for up to three seconds. The Adobe adapter waits for the ECID from alloy's first response, for up to five seconds, then sends without it. Page pings repeat the entity of the page view they belong to, including its event name.

### Calculate attributes on your tool's ID

To calculate attributes per ID your tool assigned, define a custom attribute key on `anonymous_id`. Every event that carries the entity counts towards it, including page pings on client-side approaches:

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

Read these attributes from your backend only. Your tool's ID isn't safe on the public intervention endpoint (see the table above).

### Alias calls

Segment and RudderStack alias calls, and PostHog `$create_alias` events, become `external_event` with `previous_id` set. This is a record only: Signals doesn't merge the two IDs. Amplitude's Browser SDK has no alias call, and Adobe has none.

## Resolve identities with snowplow_id

One attribute read uses one attribute key and one value, so attributes keyed on `domain_userid` and attributes keyed on `user_id` stay separate. To combine a person's anonymous and logged-in activity, use [identity resolution](/docs/signals/attributes/identity-resolution/index.md). It needs [Snowplow Identities](/docs/identities/index.md) set up on the same pipeline.

With Identities, each event gets a Snowplow ID, `snowplow_id`, for the person. You key stream attribute groups on `snowplow_id` and select up to three lookup identifiers, such as `domain_userid` and `user_id`. Your website then reads by `domain_userid` and your backend by `user_id`, and both get the same person's attributes. Interventions can use criteria on `snowplow_id` attributes and still be delivered to `domain_userid`, so the public endpoint keeps a random key.

Limits that matter for events from another tool:

- Attributes keyed on `snowplow_id` are stream only, so history from your tool's warehouse export can't be merged into them.
- Only identifiers configured in Identities can be lookup identifiers.
- Attributes build up only from events processed after you publish the attribute group.

## When you move to native tracking

On client-side approaches, `domain_userid` is already Snowplow's own ID, so attributes carry over unchanged when you replace an adapter with native Snowplow tracking. On server-side approaches, `domain_userid` is your tool's ID, and native tracking changes it, so history keyed on it needs a custom attribute key on `external_identity.anonymous_id` or a one-off mapping. See [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).

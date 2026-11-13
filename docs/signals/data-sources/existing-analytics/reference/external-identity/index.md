---
title: "external_identity schema reference"
sidebar_label: "external_identity schema"
sidebar_position: 20
description: "Fields of the external_identity entity, which keeps the visitor, user and session IDs another analytics tool assigned, so Snowplow data can be joined back to that tool."
keywords: ["external_identity", "entity", "schema", "iglu", "anonymous id", "ga client id", "ecid", "device_id"]
date: "2026-11-13"
content_type: reference
---

`external_identity` is an entity that adapters attach to every event they send. It keeps the IDs your analytics tool assigned to the visitor, user and session, and the event's original name. Use it to join Snowplow data back to your tool's data, and to filter attributes on the original event name.

| | |
| --- | --- |
| Schema | `iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0` |
| Type | Entity |
| Attached to | Every event an adapter sends, whichever rung of the [event mapping ladder](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) it takes |

:::note
`external_identity` is published on Iglu Central. If you register your own copy, for example under your own vendor, deploy it to production before you send events that carry it. Events sent before deployment are rejected for several minutes after it.
:::

## Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tool` | string, one of `segment`, `rudderstack`, `amplitude`, `mixpanel`, `ga4`, `adobe`, `heap`, `tealium`, `other` | Yes | The tool that assigned the IDs |
| `anonymous_id` | string, 1 to 255 characters | Yes | The tool's visitor or device ID |
| `user_id` | string or null, up to 255 characters | No | The tool's user ID for a known user |
| `session_id` | string or null, up to 255 characters | No | The tool's session ID, where it has one |
| `session_number` | integer or null, 0 or more | No | The tool's count of the visitor's sessions, where it has one |
| `event_name` | string or null, up to 255 characters | No | The original event name in the source tool |

No other properties are allowed.

`anonymous_id` is required, so the Segment adapter sends an event that has no visitor ID, such as a server-side call with only a `userId`, without this entity. The RudderStack transformation puts the `userId` in `anonymous_id` instead.

## What each tool puts in it

| Tool | `anonymous_id` | `user_id` | `session_id` | `session_number` |
| --- | --- | --- | --- | --- |
| Segment | `anonymousId` | `userId`, hashed with SHA-256 if it looks like an email address | Empty: Segment has no session ID | Empty |
| RudderStack | `anonymousId`, or `userId` when the event has no `anonymousId` | `userId`, unhashed | `context.sessionId`, where sent | Empty |
| GA4 | GA client ID | GA `user_id` | GA session ID | GA session number |
| Amplitude | `device_id` | `user_id`, unhashed | Amplitude `session_id` | Empty |
| Adobe | ECID | The authenticated ID from `identityMap` or `setCustomerIDs` | Empty: Adobe computes visits on its servers | Empty |

`event_name` is the name your tool used, such as a Segment track event name, a GA4 event name, an Amplitude `event_type`, or an Adobe XDM `eventType` or link name. On client-side approaches, page pings carry the entity of the page view they belong to, including its event name.

See each tool page under [tools](/docs/signals/data-sources/existing-analytics/tools/segment/index.md) for details.

## Don't use these IDs as public keys

The IDs in this entity are your tool's, not Snowplow's. Several are guessable or can be set from outside:

- A GA client ID is half timestamp, and a GA session ID is the session start time.
- Amplitude and RudderStack session IDs are timestamps.
- `user_id` values are chosen by you and often guessable.
- How random an Adobe ECID is isn't documented.
- An Amplitude `device_id` can be set by a `?deviceId=` link parameter.
- A Segment `anonymousId` can nearly be rebuilt by anyone who sees raw Segment message IDs, and server libraries accept any value.

Never use them as the key on the public intervention endpoint. Use them for joins and for reads from your backend. See [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

## Example

A Segment track call, as it arrives in Snowplow:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0",
  "data": {
    "tool": "segment",
    "anonymous_id": "a525264d-56e3-4050-9599-397af94571a2",
    "user_id": "user-123",
    "session_id": null,
    "session_number": null,
    "event_name": "Signup Form Submitted"
  }
}
```

## Use it in Signals

Read `event_name` to count or list your tool's original event names on any event, including those mapped to standard Snowplow events such as orders:

```python
from snowplow_signals import EntityProperty

original_event_name = EntityProperty(
    vendor="com.snowplowanalytics.snowplow",
    name="external_identity",
    major_version=1,
    path="event_name",
)
```

You can also define a custom attribute key on `anonymous_id`, to calculate attributes on your tool's visitor ID. Only events that carry the entity count towards it. See [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md#keep-attributes-on-a-server-side-approach).

## JSON schema

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "The identifiers another tool assigned to the user and session, so Snowplow data can be joined back to that tool's data.",
  "self": {"vendor": "com.snowplowanalytics.snowplow", "name": "external_identity", "format": "jsonschema", "version": "1-0-0"},
  "type": "object",
  "properties": {
    "tool": {"type": "string", "enum": ["segment", "rudderstack", "amplitude", "mixpanel", "ga4", "adobe", "heap", "tealium", "other"]},
    "anonymous_id": {"type": "string", "minLength": 1, "maxLength": 255},
    "user_id": {"type": ["string", "null"], "maxLength": 255},
    "session_id": {"type": ["string", "null"], "maxLength": 255},
    "session_number": {"type": ["integer", "null"], "minimum": 0},
    "event_name": {"type": ["string", "null"], "maxLength": 255, "description": "The original event name in the source tool"}
  },
  "required": ["tool", "anonymous_id"],
  "additionalProperties": false
}
```

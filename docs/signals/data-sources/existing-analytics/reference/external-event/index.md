---
title: "external_event schema reference"
sidebar_label: "external_event schema"
sidebar_position: 10
description: "Fields of the external_event schema, which carries events from other analytics tools that have no standard Snowplow schema."
keywords: ["external_event", "schema", "iglu", "self-describing event", "segment", "ga4", "amplitude", "adobe", "rudderstack"]
date: "2026-11-16"
content_type: reference
---

`external_event` is the self-describing event an adapter sends when an event from your analytics tool has no standard Snowplow schema. It is the last rung of the [event mapping ladder](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md): page views, ecommerce events, site searches and identify calls use Snowplow's own schemas instead.

| | |
| --- | --- |
| Schema | `iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0` |
| Type | Self-describing event |
| Sent with | The [`external_identity`](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md) entity |

:::note
`external_event` is published on Iglu Central. If you register your own copy, for example under your own vendor, deploy it to production before you send events that use it. Events sent before deployment are rejected for several minutes after it. An event that uses a schema your pipeline can't resolve still gets a 200 response from the Collector, then fails validation, with no error in your page or your tool. Check failed events after your first test.
:::

## Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string, up to 255 characters | Yes | The event name in the source tool, such as `Signup Form Submitted`. For calls that aren't named events, the call type, such as `group` or `alias` |
| `tool` | string, lower-case letters, digits, `_`, `.` and `-`, up to 64 characters | Yes | The tool the event came from, such as `segment`, `rudderstack`, `ga4`, `amplitude`, `adobe` or `posthog` |
| `kind` | string, one of `track`, `identify`, `group`, `alias`, `screen`, `page` | Yes | The kind of call in the source tool |
| `value` | number or null | No | A monetary or numeric value on the event, such as revenue or price |
| `currency` | string or null, three capital letters | No | The ISO 4217 currency code for `value`, such as `USD` |
| `item_id` | string or null, up to 255 characters | No | A product or item ID. For events with several items, the first item only |
| `item_category` | string or null, up to 255 characters | No | The category of the item in `item_id` |
| `search_term` | string or null, up to 255 characters | No | A search query sent on the event |
| `plan` | string or null, up to 255 characters | No | The plan or tier the user or account is on |
| `group_id` | string or null, up to 255 characters | No | The account or group ID, from a group call |
| `previous_id` | string or null, up to 255 characters | No | The previous user ID, from an alias call |

No other properties are allowed. Signals only calculates attributes on properties a schema declares, so the fields are fixed and typed. Any property from your tool that doesn't fit one of them is dropped by the adapter, which also keeps personal data such as email addresses out of Snowplow.

## How adapters fill the fields

Each adapter maps your tool's properties to these fields. As examples, the Segment and PostHog adapters fill them like this:

| Field | Segment source | PostHog source |
| --- | --- | --- |
| `tool` | `segment` | `posthog` |
| `name` | `event` for track calls; otherwise the call type | The PostHog event name, such as `$pageleave` or `Signup Form Submitted` |
| `kind` | The call type | `group` for `$groupidentify`, `alias` for `$create_alias`, `identify` for `$identify`, otherwise `track` |
| `value` | The first of `revenue`, `value`, `total` and `price` | The first of `revenue`, `value`, `total` and `price`. On `$pageleave`, `$prev_pageview_duration`, the seconds the page was open |
| `currency` | `currency`, if it is three letters, in capitals | `currency`, if it is three letters, in capitals |
| `item_id` | `product_id` or `sku`, or the first product's `product_id` | `product_id` or `sku`, or the first product's `product_id` |
| `item_category` | `category`, or the first product's `category` | `category`, or the first product's `category` |
| `search_term` | `query` | `query` |
| `plan` | `plan` in track properties, or in group traits on a group call | `plan` in event properties, or in `$group_set` on `$groupidentify` |
| `group_id` | `groupId` on a group call | `$group_key` on `$groupidentify` |
| `previous_id` | `previousId` on an alias call | The `alias` property on `$create_alias` |

Each tool page lists its own mapping. See the [tools](/docs/signals/data-sources/existing-analytics/tools/segment/index.md) section.

## Example

A Segment track call, as it arrives in Snowplow:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0",
  "data": {
    "name": "Signup Form Submitted",
    "tool": "segment",
    "kind": "track",
    "search_term": "snowplow signals",
    "plan": "pro"
  }
}
```

A Segment group call:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0",
  "data": {
    "name": "group",
    "tool": "segment",
    "kind": "group",
    "plan": "enterprise",
    "group_id": "acct-9"
  }
}
```

## Use it in Signals

Every custom event from your tool shares this one schema, so attributes tell events apart with a criterion on `name`. Use `kind` instead when the name differs between tools, as it does for group calls. See [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) for examples.

```python
from snowplow_signals import Criteria, Criterion, EventProperty

signup_only = Criteria(
    all=[
        Criterion.eq(
            EventProperty(
                vendor="com.snowplowanalytics.snowplow",
                name="external_event",
                major_version=1,
                path="name",
            ),
            "Signup Form Submitted",
        )
    ]
)
```

When you need a property that isn't on this schema, track that event with a schema of your own. See [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).

## JSON schema

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "An event first tracked by another analytics tool and sent to Snowplow, for events that no more specific Snowplow schema describes",
  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "external_event",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "name": {
      "description": "The event name in the source tool",
      "type": "string",
      "maxLength": 255
    },
    "tool": {
      "description": "The tool that first tracked the event, in lower case",
      "type": "string",
      "pattern": "^[a-z0-9_.-]+$",
      "maxLength": 64
    },
    "kind": {
      "description": "The type of call in the source tool",
      "type": "string",
      "enum": ["track", "identify", "group", "alias", "screen", "page"]
    },
    "value": {
      "description": "A monetary or numeric value carried by the event",
      "type": ["number", "null"]
    },
    "currency": {
      "description": "ISO 4217 currency code for value",
      "type": ["string", "null"],
      "pattern": "^[A-Z]{3}$"
    },
    "item_id": {
      "description": "Identifier of the item the event refers to",
      "type": ["string", "null"],
      "maxLength": 255
    },
    "item_category": {
      "description": "Category of the item the event refers to",
      "type": ["string", "null"],
      "maxLength": 255
    },
    "search_term": {
      "description": "Search term carried by the event",
      "type": ["string", "null"],
      "maxLength": 255
    },
    "plan": {
      "description": "Plan or tier carried by the event",
      "type": ["string", "null"],
      "maxLength": 255
    },
    "group_id": {
      "description": "Identifier of the group or account the event refers to",
      "type": ["string", "null"],
      "maxLength": 255
    },
    "previous_id": {
      "description": "Previous user identifier, for alias calls",
      "type": ["string", "null"],
      "maxLength": 255
    }
  },
  "required": ["name", "tool", "kind"],
  "additionalProperties": false
}
```

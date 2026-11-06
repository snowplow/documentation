---
title: "Retrieve attributes in your application"
sidebar_position: 20
sidebar_label: "Retrieve attributes"
description: "Retrieve calculated attribute values from the Profiles Store using the Signals Python SDK, Node.js SDK, or API, either via a service or directly from an attribute group."
keywords: ["retrieve attributes", "services", "signals python sdk", "signals node sdk", "signals api", "profiles store"]
date: "2026-06-11"
content_type: how-to
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Calculated attribute values are stored in the Profiles Store and consumed by your applications via the Python SDK, Node.js SDK, or API. If you'd rather an agent chose what to read at runtime, it can fetch attribute values itself through the [Signals MCP server](/docs/signals/applications/mcp-server/index.md).

Start by [connecting to Signals](/docs/signals/connection/index.md) to create a `Signals` client object.

## Use a service

The preferred way to retrieve attributes is via a [service](/docs/signals/concepts/index.md#services), which lets you fetch attributes from multiple groups in one call. See [Services](/docs/signals/applications/services/index.md) to define one using the Console or Python SDK.

<Tabs groupId="signals-retrieve" queryString>
<TabItem value="python" label="Python" default>

Use `get_service_attributes()` to retrieve attributes from a service.

```python
calculated_values = sp_signals.get_service_attributes(
    name="my_service",
    attribute_key="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the service | `string` | ✅ |
| `attribute_key` | The attribute key to retrieve attributes for. Use the key the service's attribute groups are calculated on. | `string` | ✅ |
| `identifier` | The specific attribute key value | `string` | ✅ |

</TabItem>
<TabItem value="nodejs" label="Node.js">

Use `getServiceAttributes()` to retrieve attributes for a single identifier, or `getBatchServiceAttributes()` for multiple identifiers in one call.

```typescript
const calculatedValues = await signals.getServiceAttributes({
  name: "my_service",
  attribute_key: "domain_userid",
  identifier: "218e8926-3858-431d-b2ed-66da03a1cbe5",
});
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the service | `string` | ✅ |
| `attribute_key` | The attribute key to retrieve attributes for. Use the key the service's attribute groups are calculated on. | `string` | ✅ |
| `identifier` | The specific attribute key value | `string` | ✅ |

```typescript
const batchResults = await signals.getBatchServiceAttributes({
  name: "shopping_cart_service",
  attribute_key: "domain_userid",
  identifiers: [
    "218e8926-3858-431d-b2ed-66da03a1cbe5",
    "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ]
});
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the service | `string` | ✅ |
| `attribute_key` | The attribute key to retrieve attributes for. Use the key the service's attribute groups are calculated on. | `string` | ✅ |
| `identifiers` | Array of attribute key values to look up | `string[]` | ✅ |

</TabItem>
</Tabs>

## Retrieve individual attributes

You can also retrieve attributes directly from a specific [attribute group](/docs/signals/concepts/index.md#attribute-groups), without a service. This is useful when you want a small subset of attributes or haven't defined a service yet.

<Tabs groupId="signals-retrieve" queryString>
<TabItem value="python" label="Python" default>

Use `get_group_attributes()` to retrieve specific attributes.

```python
calculated_values = sp_signals.get_group_attributes(
    name="my_attribute_group",
    version=1,
    attributes=["page_view_count"],
    attribute_key="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the attribute group | `string` | ✅ |
| `version` | The attribute group version | `int` | ✅ |
| `attributes` | The names of the attributes to retrieve | `string` or list of `string` | ✅ |
| `attribute_key` | The attribute key name. Use the key the attribute group is calculated on. | `string` | ✅ |
| `identifier` | The specific attribute key value | `string` | ✅ |

</TabItem>
<TabItem value="nodejs" label="Node.js">

Use `getGroupAttributes()` to retrieve specific attributes from an attribute group.

```typescript
const calculatedValues = await signals.getGroupAttributes({
  name: "my_attribute_group",
  version: 1,
  attributes: ["page_view_count"],
  attribute_key: "domain_userid",
  identifier: "218e8926-3858-431d-b2ed-66da03a1cbe5",
});
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the attribute group | `string` | ✅ |
| `version` | The attribute group version | `number` | ✅ |
| `attributes` | The names of the attributes to retrieve | `string[]` | ✅ |
| `attribute_key` | The attribute key name. Use the key the attribute group is calculated on. | `string` | ✅ |
| `identifier` | The specific attribute key value | `string` | ✅ |

</TabItem>
</Tabs>

## Handle the response

A read returns an object with one entry per attribute. For example, a service with session attributes returns:

```json
{
  "page_views_count": 12,
  "unique_pages_viewed": 5,
  "first_event_timestamp": "2026-04-09T14:23:01.000Z",
  "last_event_timestamp": "2026-04-09T14:41:03.000Z"
}
```

When you handle the response:
* If Signals hasn't seen the identifier on an event yet, each attribute is `null`.
* Read with the attribute key that the attribute groups in the service are calculated on. For attributes keyed on `snowplow_id`, reading by any key other than `snowplow_id` or one of its [lookup identifiers](/docs/signals/attributes/identity-resolution/index.md#retrieve-attributes-by-a-lookup-identifier) returns an HTTP 400 error.
* Reads need an API key, so they run on your backend. A web app passes `domain_userid` or `domain_sessionid` from the browser to its server, for example as a request parameter. Read the session ID with the browser tracker's [`getDomainSessionId`](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md#domain-session-id) method.

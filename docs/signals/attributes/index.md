---
title: "Define and retrieve attributes in Signals"
sidebar_position: 20
sidebar_label: "Attributes"
description: "Define attributes to calculate behavioral data from real-time streams or your warehouse, then retrieve calculated values using services or attribute groups."
keywords: ["attributes", "attribute groups", "services", "signals python sdk", "signals node sdk", "signals api"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

[Attributes](/docs/signals/concepts/index.md#attribute-groups) are the behavioral facts you want Signals to calculate, such as a user's page view count or lifetime value. There are three ways to interact with Signals attributes:

* **[Snowplow Console](https://console.snowplowanalytics.com)** — a UI for defining and managing attribute configurations. Covered in the sub-pages of this section.
* **[Signals Python SDK](https://pypi.org/project/snowplow-signals/)** — define and publish attribute configurations programmatically from a notebook or script. Covered in the sub-pages of this section alongside the Console approach.
* **[Signals API](/docs/signals/connection/index.md#signals-api)** — interact with Signals directly over HTTP, including both configuration and retrieval.

## Defining attributes

Attributes are defined within [attribute groups](/docs/signals/attributes/attribute-groups/index.md). Each group specifies an [attribute key](/docs/signals/attributes/attribute-keys/index.md) (the identifier to calculate against), the [attributes](/docs/signals/attributes/attributes/index.md) to compute, and a data source — either a real-time event stream or a [warehouse table](/docs/signals/attributes/warehouse-config/index.md). Once published, attribute groups are grouped into [services](/docs/signals/attributes/services/index.md) for retrieval.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Log in to [Snowplow Console](https://console.snowplowanalytics.com) and navigate to the **Signals** section. Use the **Attribute groups**, **Attribute keys**, and **Services** pages to create and manage your configuration.

![Signals section of the Console navigation sidebar showing Overview, Attribute groups, Services, Attribute keys, and Interventions as menu items](../images/console-navbar.png)

</TabItem>
<TabItem value="sdk" label="Python SDK">

Start by [connecting to Signals](/docs/signals/connection/index.md) to create a `Signals` object, then use the `publish()` method to register your configuration.

```python
from snowplow_signals import Signals, StreamAttributeGroup

sp_signals = Signals({{ config }})

sp_signals.publish([my_attribute_group, my_service])
```

</TabItem>
</Tabs>

## Retrieving attributes

Calculated attribute values are stored in the Profiles Store and consumed by your applications via the Python SDK, Node.js SDK, or API.

Start by [connecting to Signals](/docs/signals/connection/index.md).

### Using a service

The preferred way to retrieve attributes is via a [service](/docs/signals/concepts/index.md#services), which lets you fetch attributes from multiple groups in one call. See [Services](/docs/signals/attributes/services/index.md) to define one using the Console or Python SDK.

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
| `attribute_key` | The attribute key to retrieve attributes for | `string` | ✅ |
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
| `attribute_key` | The attribute key to retrieve attributes for | `string` | ✅ |
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
| `attribute_key` | The attribute key to retrieve attributes for | `string` | ✅ |
| `identifiers` | Array of attribute key values to look up | `string[]` | ✅ |

</TabItem>
</Tabs>

### Retrieve individual attributes

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
| `attribute_key` | The attribute key name | `string` | ✅ |
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
| `attribute_key` | The attribute key name | `string` | ✅ |
| `identifier` | The specific attribute key value | `string` | ✅ |

</TabItem>
</Tabs>

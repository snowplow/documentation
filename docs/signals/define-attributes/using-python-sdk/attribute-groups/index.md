---
title: "Attribute groups"
sidebar_position: 30
sidebar_label: "Attribute groups"
description: "Configure stream, batch, and external batch attribute groups programmatically using the Snowplow Signals Python SDK."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Define the behavior you want to capture in [attribute groups](/docs/signals/concepts/index.md#attribute-groups).

## Attribute groups by data source

Each of the three available data sources has its own attribute group class. Choose which one to use depending on how you want to calculate and sync the attributes.

<Tabs groupId="source" queryString>
<TabItem value="stream" label="StreamAttributeGroup" default>

Use a `StreamAttributeGroup` to calculate attributes from the real-time event stream. Read more about this in the [stream calculations](/docs/signals/define-attributes/using-python-sdk/stream-calculations/index.md) section.

```python
from snowplow_signals import StreamAttributeGroup, domain_sessionid

my_stream_attribute_group = StreamAttributeGroup(
    name="my_stream_attribute_group",
    version=1,
    attribute_key=domain_sessionid,
    owner="user@company.com",
    attributes=[
        # Previously defined attributes
        page_view_count,
        products_added_to_cart_feature,
    ],
)
```

</TabItem>
<TabItem value="batch" label="BatchAttributeGroup">

Use a `BatchAttributeGroup` to calculate attributes from the atomic events table. Read more about this in the [batch calculations](/docs/signals/define-attributes/using-python-sdk/batch-calculations/index.md) section.

```python
from snowplow_signals import BatchAttributeGroup, domain_sessionid

my_batch_attribute_group = BatchAttributeGroup(
    name="my_batch_attribute_group",
    version=1,
    attribute_key=domain_sessionid,
    owner="user@company.com",
    attributes=[
        # Previously defined attributes
        page_view_count,
        products_added_to_cart_feature,
    ],
)
```

</TabItem>
<TabItem value="external" label="ExternalBatchAttributeGroup">

Use an `ExternalBatchAttributeGroup` to sync attributes from an existing warehouse table. Read more about this in the [batch calculations](/docs/signals/define-attributes/using-python-sdk/batch-calculations/index.md) section.

```python
from snowplow_signals import ExternalBatchAttributeGroup, domain_sessionid, Field

my_external_batch_attribute_group = ExternalBatchAttributeGroup(
    name="my_external_batch_attribute_group",
    version=1,
    attribute_key=domain_sessionid,
    owner="user@company.com",
    batch_source=data_source, # Assuming Data source previously configured
    fields=[
        Field(
            name="TOTAL_TRANSACTIONS",
            type="int32",
        ),
        Field(
            name="TOTAL_REVENUE",
            type="int32",
        ),
        Field(
            name="AVG_TRANSACTION_REVENUE",
            type="int32",
        ),
    ],
)
```

</TabItem>
</Tabs>

## Attribute group options

The tables below list all available arguments for each type of attribute group:

<Tabs groupId="source" queryString>
<TabItem value="stream" label="StreamAttributeGroup" default>

| Argument        | Description                                           | Type                | Default | Required? |
| --------------- | ----------------------------------------------------- | ------------------- | ------- | --------- |
| `name`          | The name of the attribute group                       | `string`            |         | ✅         |
| `version`       | The version of the attribute group                    | `int`               | 1       | ❌         |
| `attribute_key` | The attribute key associated with the attribute group | `AttributeKey`      |         | ✅         |
| `owner`         | The owner of the attribute group                      | `Email`             |         | ✅         |
| `description`   | A description of the attribute group                  | `string`            |         | ❌         |
| `ttl`           | Time-to-live for attributes in the Profile Store      | `timedelta`         |         | ❌         |
| `tags`          | Metadata key-value pairs                              | `dict`              |         | ❌         |
| `attributes`    | List of attributes to calculate                       | list of `Attribute` |         | ✅         |
| `online`        | Enable online retrieval (`True`) or not (`False`)     | `bool`              | `True`  | ❌         |

</TabItem>
<TabItem value="batch" label="BatchAttributeGroup">

| Argument        | Description                                           | Type                | Default | Required? |
| --------------- | ----------------------------------------------------- | ------------------- | ------- | --------- |
| `name`          | The name of the attribute group                       | `string`            |         | ✅         |
| `version`       | The version of the attribute group                    | `int`               | 1       | ❌         |
| `attribute_key` | The attribute key associated with the attribute group | `AttributeKey`      |         | ✅         |
| `owner`         | The owner of the attribute group                      | `Email`             |         | ✅         |
| `description`   | A description of the attribute group                  | `string`            |         | ❌         |
| `ttl`           | Time-to-live for attributes in the Profile Store      | `timedelta`         |         | ❌         |
| `tags`          | Metadata key-value pairs                              | `dict`              |         | ❌         |
| `attributes`    | List of attributes to calculate                       | list of `Attribute` |         | ✅         |
| `batch_source`  | The batch data source for the attribute group         | `BatchSource`       |         | ❌         |
| `online`        | Enable online retrieval (`True`) or not (`False`)     | `bool`              | `True`  | ❌         |

</TabItem>
<TabItem value="external" label="ExternalBatchAttributeGroup">

| Argument        | Description                                           | Type            | Default | Required? |
| --------------- | ----------------------------------------------------- | --------------- | ------- | --------- |
| `name`          | The name of the attribute group                       | `string`        |         | ✅         |
| `version`       | The version of the attribute group                    | `int`           | 1       | ❌         |
| `attribute_key` | The attribute key associated with the attribute group | `AttributeKey`  |         | ✅         |
| `owner`         | The owner of the attribute group                      | `Email`         |         | ✅         |
| `description`   | A description of the attribute group                  | `string`        |         | ❌         |
| `ttl`           | Time-to-live for attributes in the Profile Store      | `timedelta`     |         | ❌         |
| `tags`          | Metadata key-value pairs                              | `dict`          |         | ❌         |
| `batch_source`  | The batch data source for the attribute group         | `BatchSource`   |         | ✅         |
| `fields`        | Table columns for syncing                             | list of `Field` |         | ✅         |
| `online`        | Enable online retrieval (`True`) or not (`False`)     | `bool`          | `True`  | ❌         |

</TabItem>
</Tabs>

If no `ttl` is set, the attribute key's `ttl` will be used. If the attribute key also has no `ttl`, there will be no time limit for attributes.

### Versioning

Use `version=1` for the first version of an attribute group. After publishing, if you want to change the definition in any way, iterate the version number.

## Extended stream attribute group example

This example shows all the available configuration options for a stream attribute group.

This attribute group groups attributes for a user attribute key, to be calculated in real-time.

```python
from snowplow_signals import StreamAttributeGroup, user_id

stream_attribute_group = StreamAttributeGroup(
    name="comprehensive_stream_attribute_group",
    version=2,
    attribute_key=user_id,
    owner="data-team@company.com",
    attributes=[
        page_view_count,
        session_duration,
        conversion_rate,
    ],
    description="User engagement attributes in real-time",
    ttl=timedelta(days=90),  # Attributes live in the Profiles Store for 90 days
    tags={
        "team": "growth",
        "priority": "high",
    },

    # Note: batch_source and fields are not used for stream attribute groups
)
```

Signals will start calculating attributes as soon as this attribute group configuration is applied.

## Testing attribute groups

To understand what the output of an attribute group will look like, use the Signals `test` method. This will output a table of attributes calculated from your `atomic` events table.

```python
from snowplow_signals import Signals

# Connect to Signals
# See the main Configuration section for more on this
sp_signals = Signals(
        {{ config }}
    )

# Run the test
test_data = sp_signals.test(
    attribute_group=my_attribute_group,
    app_ids=["website"] # The app_id in your Snowplow events
)
```

:::note
While you can filter on specific app_ids during testing, both the streaming and batch engines may be configured to process only a subset of relevant app_ids to avoid unnecessary compute. As a result, testing with an arbitrary app_id may not yield expected data if it isn’t included in the configured subset.
:::

To see which attributes an attribute group has, use `get_attribute_group()`. Here's an example:

```python
attribute_definitions = sp_signals.get_attribute_group(
    name="my_attribute_group",
    version=1,
)

print(attribute_definitions)
```

The table below lists all available arguments for `get_attribute_group()`

| Argument  | Description                     | Type     | Required? |
| --------- | ------------------------------- | -------- | --------- |
| `name`    | The name of the attribute group | `string` | ✅         |
| `version` | The attribute group version     | `int`    | ❌         |

If you don't specify a version, Signals will retrieve the latest version.

## Attribute groups can be set to expire

Some attributes will only be relevant for a certain amount of time, and eventually stop being updated.

To avoid stale attributes staying in your Profiles Store forever, you can configure TTL lifetimes for attribute keys and attribute groups. When none of the attributes for an attribute key or attribute group have been updated for the defined lifespan, the attribute key or attribute group expires. Any attribute values for this attribute key or attribute group will be deleted: fetching them will return `None` values.

If Signals then processes a new event that calculates the attribute again, or syncs the attribute from the warehouse again, the expiration timer is reset.

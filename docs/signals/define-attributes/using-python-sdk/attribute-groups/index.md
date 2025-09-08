---
title: "Attribute groups"
sidebar_position: 30
sidebar_label: "Attribute groups"
---

Signals has two attribute groupings:
* Attribute groups, for defining attributes
* Services, for consuming attributes

An attribute group is a versioned collection of attributes; the attributes are the properties of the attribute group. Each attribute group is specific to one attribute key and one data source (stream or batch).

## Attribute management

Every attribute group has a version number.

Signals provides functionality for separating attribute definition from calculation. This allows you to set up your attributes and business logic before putting them into production. The options are different depending on whether the attribute group is for stream or batch attributes.

To configure a table for batch attributes, you may choose to set up an attribute group using that source without defining any attributes initially. This ensures that the table is ready and tested for adding and calculating attributes. Read more about configuring batch attributes and attribute groups in the [batch calculations](/docs/signals/define-attributes/using-python-sdk/batch-calculations/index.md) section.

For stream attributes, you can choose to configure and apply attribute groups that don't calculate their attribute values.

This means that configuration, calculation, materialization, and retrieval are fully decoupled.

## Versioning

TODO

## Types of attribute groups

Signals includes three types of attribute groups. Choose which one to use depending on how you want to calculate and materialize the attributes:

- `StreamAttributeGroup`: processed from the real-time event stream
- `BatchAttributeGroup`: processed using the batch engine
- `ExternalBatchAttributeGroup`: uses precalculated attributes from an existing warehouse table that's materialized into Signals

### StreamAttributeGroup

Use a `StreamAttributeGroup` to calculate attributes from the real-time event stream. Read more about this in the [Stream calculations](/docs/signals/define-attributes/using-python-sdk/stream-calculations/index.md) section.

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

### BatchAttributeGroup

Use a `BatchAttributeGroup` to calculate attributes from batch data sources (e.g., warehouse tables).

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

### ExternalBatchAttributeGroup

Use an `ExternalBatchAttributeGroup` to materialize attributes from an existing warehouse table.


```python
from snowplow_signals import ExternalBatchAttributeGroup, domain_sessionid

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



## Attribute group options

The table below lists all available arguments for all types of `attribute groups`:

Below is a summary of all options available for configuring attribute groups in Signals. The "Applies to" column shows which attribute group types each option is relevant for.

| Argument        | Description                                            | Type                | Default | Required? | Applies to                                          |
| --------------- | ------------------------------------------------------ | ------------------- | ------- | --------- | --------------------------------------------------- |
| `name`          | The name of the attribute group                        | `string`            |         | ✅         | All                                                 |
| `version`       | The version of the attribute group                     | `int`               | 1       | ❌         | All                                                 |
| `attribute_key` | The attribute key associated with the attribute group  | `AttributeKey`      |         | ✅         | All                                                 |
| `owner`         | The owner of the attribute group                       | `Email`             |         | ✅         | All                                                 |
| `description`   | A description of the attribute group                   | `string`            |         | ❌         | All                                                 |
| `ttl`           | Time-to-live for attributes in the Profile Store       | `timedelta`         |         | ❌         | All                                                 |
| `tags`          | Metadata key-value pairs                               | `dict`              |         | ❌         | All                                                 |
| `attributes`    | List of attributes to calculate                        | list of `Attribute` |         | ✅         | `StreamAttributeGroup`, `BatchAttributeGroup`       |
| `batch_source`  | The batch data source for the attribute group          | `BatchSource`       |         | ✅/❌       | `BatchAttributeGroup`/`ExternalBatchAttributeGroup` |
| `fields`        | Table columns for materialization                      | `Field`             |         | ✅         | `ExternalBatchAttributeGroup`                       |
| `offline`       | Calculate in warehouse (`True`) or real-time (`False`) | `bool`              | varies  | ❌         | All                                                 |
| `online`        | Enable online retrieval (`True`) or not (`False`)      | `bool`              | `True`  | ❌         | All                                                 |


If no `ttl` is set, the attribute key's `ttl` will be used. If the attribute key also has no `ttl`, there will be no time limit for attributes.

## Extended stream attribute group example

This example shows all the available configuration options for a stream attribute group. To find out how to configure a batch attribute group, see the [batch calculations](/docs/signals/define-attributes/using-python-sdk/batch-calculations/index.md) section.

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

If Signals then processes a new event that calculates the attribute again, or materializes the attribute from the warehouse again, the expiration timer is reset.

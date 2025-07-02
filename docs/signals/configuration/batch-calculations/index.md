---
title: "Batch calculations"
sidebar_position: 50
---

In addition to stream sources, Signals allows you to create attributes based on data stored in your warehouse. Batch sources are ideal for metrics calculated over longer periods of time, such as:
- Previous purchase history
- Number of site visits in the last 7 days
- Average session length

You can use existing attributes that are already in your warehouse, or use the Signals batch engine to calculate new attributes in a new table.

To use warehouse attributes in your real-time use cases, you will need to sync the data to the Profiles Store, using the materialization engine.

:::note Warehouse support
Only Snowflake is supported currently.
:::

## What do you need to configure?

Signals is configured slightly differently depending if you're using existing tables or creating new ones.

| Signals component      | Required for existing attributes | Required for creating new attributes |
| ---------------------- | -------------------------------- | ------------------------------------ |
| `BatchSource`          | ✅                                | ❌                                    |
| `View`                 | with `fields` ✅                  | with `attributes` ✅                  |
| Batch engine           | ❌                                | ✅                                    |
| Materialization engine | ✅                                | ✅                                    |

To create new attribute tables, the batch engine will help you set up the required dbt projects and models.

## Multi-step process ?? online offline 🤔

TODO something something online offline?

## Using existing attributes

Using existing tables in your warehouse is the more straight-forward approach, as it doesn't require any additional modeling.

The `BatchSource` defines how to connect to the table of interest in your warehouse. Here's an example:

```python
from snowplow_signals import BatchSource

data_source = BatchSource(
    name="ecommerce_transaction_interactions_source",
    database="SNOWPLOW_DEV1",
    schema="SIGNALS",
    table="SNOWPLOW_ECOMMERCE_TRANSACTION_INTERACTIONS_FEATURES",
    timestamp_field="UPDATED_AT",
    owner="user@company.com",
)
```

### Source options

The table below lists all available arguments for a `BatchSource`:

| Argument                   | Description                                                                         | Type       | Required? |
| -------------------------- | ----------------------------------------------------------------------------------- | ---------- | --------- |
| `name`                     | The name of the source                                                              | `string`   | ✅         |
| `description`              | A description of the source                                                         | `string`   | ❌         |
| `database`                 | The database where the attributes are stored                                        | `string`   | ✅         |
| `schema`                   | The schema for the table of interest                                                | `string`   | ✅         |
| `table`                    | The table where the attributes are stored                                           | `string`   | ✅         |
| `timestamp_field`          | The timestamp field to use for point-in-time joins of attribute values              | `string`   | ❌         |
| `created_timestamp_column` | A timestamp column indicating when the row was created, used for deduplicating rows | `string`   | ❌         |
| `date_partition_column`    | A timestamp column used for partitioning data                                       | `string`   | ❌         |
| `owner`                    | The owner of the source, typically the email of the primary maintainer              | `string`   | ❌         |
| `tags`                     | String key-value pairs of arbitrary metadata                                        | dictionary | ❌         |

The `timestamp_field` is optional but recommended for incremental or snapshot-based tables. It should show the last modified time of a record. It's used during materialization to identify which rows have changed since the last sync. The materialization engine only sends those with a newer timestamp to the Profiles Store.

### Defining a view with fields

Pass your source to a new view.

For stream or batch attributes that are calculated by Signals, a view contains references to your attribute definitions. In this case, the attributes are already defined elsewhere and pre-calculated in the warehouse. Instead of `attributes`, this view will have `fields`.

Specify the fields (columns) you want to use from the source table, using `Field`. Here's an example:

```python
from snowplow_signals import View, domain_userid, Field

view = View(
    name="ecommerce_transaction_interactions_attributes",
    version=1,
    entity=domain_userid,
    owner="user@company.com",
    offline=True, # Set this to True because this is a batch view
    online=False, # Set this to False until the configuration is complete
    batch_source=data_source,
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

The table below lists all available arguments for a `Field`:

| Argument      | Description                                  | Type                                                                                                                                                                                                                | Required? |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `name`        | The name of the field                        | `string`                                                                                                                                                                                                            | ✅         |
| `description` | A description of the field                   | `string`                                                                                                                                                                                                            | ❌         |
| `type`        | The type of the field                        | One of: `bytes`, `string`, `int32`, `int64`, `double`, `float`, `bool`, `unix_timestamp`, `bytes_list`, `string_list`, `int32_list`, `int64_list`, `double_list`, `float_list`, `bool_list`, `unix_timestamp_list`, | ✅         |
| `tags`        | String key-value pairs of arbitrary metadata |                                                                                                                                                                                                                     | ❌         |

### Registering the table with Signals

Apply the view configuration to Signals.

```python
sp_signals.apply([view])
```

Signals will connect to the table, but the attributes will not be materialized into Signals yet because the view has `online=False`.

TODO why separate these steps?

To send the attributes to the Profiles Store, change the `online` parameter to `True`, and apply the view again.

```python
sp_signals.apply([view])
```

The sync will begin: the materialization engine will look for new records at a given interval, based on the `timestamp_field` and the last time it ran. The default time interval is 5 minutes.

## Creating new attribute tables

To create new batch attributes, you'll need to define attributes and views as for stream attributes. However, further steps are necessary to create the required dbt models and tables in your warehouse, and register them with Signals.

The included batch engine CLI tool will help you generate the attributes. Check out the full instructions in [Creating new batch attributes](/docs/signals/configuration/batch-calculations/batch-engine/index.md) or the [batch engine tutorial](/tutorials/snowplow-batch-engine/start/).

### Defining a view with attributes

### Setting up the table

### Registering the table with Signals

---
examples

TODO example

<details>
<summary>Example batch attribute definitions</summary>

Each block creates a single attribute definition including the logic how it should be calculated (its filters and aggregation).

```python
from snowplow_signals import (
    Attribute,
    Criteria,
    Criterion,
    Event,
)
from datetime import timedelta

products_added_to_cart_last_7_days = Attribute(
    name="products_added_to_cart_last_7_days",
    type="string_list",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="snowplow_ecommerce_action",
            version="1-0-2",
        )
    ],
    aggregation="unique_list",
    property="contexts_com_snowplowanalytics_snowplow_ecommerce_product_1[0].name",
    criteria=Criteria(
        all=[
            Criterion(
                property="unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type",
                operator="=",
                value="add_to_cart",
            ),
        ],
    ),
    period=timedelta(days=7),
)

total_product_price_clv = Attribute(
    name="total_product_price_clv",
    type="float",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="snowplow_ecommerce_action",
            version="1-0-2",
        )
    ],
    aggregation="sum",
    property="contexts_com_snowplowanalytics_snowplow_ecommerce_product_1[0].price",
    criteria=Criteria(
        all=[
            Criterion(
                property="unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type",
                operator="=",
                value="add_to_cart"
            )
        ]
    ),
)

first_mkt_source = Attribute(
    name="first_mkt_source",
    type="string",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="first",
    property="mkt_source",
)

last_device_class = Attribute(
    name="last_device_class",
    type="string",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="last",
    property="contexts_nl_basjes_yauaa_context_1[0]:deviceClass",
)
```
</details>

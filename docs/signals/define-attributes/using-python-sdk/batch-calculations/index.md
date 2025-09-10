---
title: "Calculate from warehouse"
sidebar_position: 50
description: "Use existing warehouse data or create new batch attribute tables with dbt to sync historical attributes to the Signals Profiles Store."
---

You can use existing attributes that are already in your warehouse, or use the Signals batch engine to calculate new attributes in a new table.

To use historical, warehouse attributes in your real-time use cases, you will need to sync the data to the Profiles Store. Signals includes a sync engine to do this.

:::note Warehouse support
Only Snowflake and BigQuery are supported currently.
:::

## Existing or new attributes?

Signals is configured slightly differently depending if you're using existing tables or creating new ones.

| Attribute group class         | Calculates new attributes | Define attributes or fields? | Requires `BatchSource` |
| ----------------------------- | ------------------------- | ---------------------------- | ---------------------- |
| `BatchAttributeGroup`         | ✅                         | `attributes`                 | ✅                      |
| `ExternalBatchAttributeGroup` | ❌                         | `fields`                     | ❌                      |

To create new attribute tables, the batch engine will help you set up the required dbt projects and models.

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

| Argument          | Description                                                                                                                                     | Type       | Required? |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------- |
| `name`            | The name of the source                                                                                                                          | `string`   | ✅         |
| `description`     | A description of the source                                                                                                                     | `string`   | ❌         |
| `database`        | The database where the attributes are stored                                                                                                    | `string`   | ✅         |
| `schema`          | The schema for the table of interest                                                                                                            | `string`   | ✅         |
| `table`           | The table where the attributes are stored                                                                                                       | `string`   | ✅         |
| `timestamp_field` | Primary timestamp of the attribute value, the sync engine uses this to incrementally process only the rows that have changed since the last run | `string`   | ❌         |
| `owner`           | The owner of the source, typically the email of the primary maintainer                                                                          | `string`   | ❌         |
| `tags`            | String key-value pairs of arbitrary metadata                                                                                                    | dictionary | ❌         |

The sync engine only sends rows with a newer timestamp to the Profiles Store, based on the `timestamp_field`. For each attribute key, make sure there is only one row per timestamp — otherwise, one value may be discarded arbitrarily.


### Defining an attribute group with fields

Pass your source to a new `ExternalBatchAttributeGroup` so that Signals does not sync the attributes. This will be done later, once Signals has connected to the table.

For stream or batch attributes that are calculated by Signals, an attribute group contains references to your attribute definitions. In this case, the attributes are already defined elsewhere and pre-calculated in the warehouse. Instead of `attributes`, this attribute group will have `fields`.

Specify the fields (columns) you want to use from the source table, using `Field`. Here's an example:

```python
from snowplow_signals import ExternalBatchAttributeGroup, domain_userid, Field

attribute_group = ExternalBatchAttributeGroup(
    name="ecommerce_transaction_interactions_attributes",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com",
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

Apply the attribute group configuration to Signals.

```python
sp_signals.publish([attribute_group])
```

Signals will connect to the table, but the attributes will not be synced into Signals yet because the attribute group has `online=False`.

To send the attributes to the Profiles Store, change the `online` parameter to `True`, and apply the attribute group again.

```python
sp_signals.publish([attribute_group])
```

The sync will begin: the sync engine will look for new records at a given interval, based on the `timestamp_field` and the last time it ran. The default time interval is 1 hour.

## Creating new attribute tables

To create new batch attributes, you'll need to define attributes and attribute groups as for stream attributes. However, further steps are necessary to create the required dbt models and tables in your warehouse, and register them with Signals.

The included batch engine CLI tool will help you with this process. Check out the full instructions in [Creating new batch attributes](/docs/signals/define-attributes/using-python-sdk/batch-calculations/batch-engine/index.md) or the [batch engine tutorial](/tutorials/signals-batch-engine/start/).

### Defining an attribute group with attributes

The key difference between a standard stream [attribute_group](/docs/signals/define-attributes/using-python-sdk/attribute-groups/index.md) and one meant for batch processing is the `offline=True` parameter.

The attribute key here is typically the user, which may be the `domain_userid` or other Snowplow identifier fields, such as the logged in `user_id`.

```python
from snowplow_signals import BatchAttributeGroup, domain_userid

attribute_group = BatchAttributeGroup(
    name="batch_ecommerce_attributes",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com"
    attributes=[
        products_added_to_cart_last_7_days,
        total_product_price_clv,
        first_mkt_source,
        last_device_class
    ],
)
```

### Creating and registering tables

Signals uses dbt to create attribute group-specific attribute tables. The Signals Python SDK includes an optional CLI tool called the batch engine for configuring this.

It will help you create the required dbt models and tables in your warehouse, and register them with Signals.

Check out the full instructions in [Creating new batch attributes](/docs/signals/define-attributes/using-python-sdk/batch-calculations/batch-engine/index.md).

## Sync engine

The sync engine is a cron job that sends warehouse attributes to the Profiles Store.

The engine will be enabled when you either:
* Apply an `ExternalBatchAttributeGroup` for an existing table
* Run the batch engine `sync` command after creating new attribute tables

Once enabled, syncs begin at a fixed interval. By default, this is every 5 minutes. Only the records that have changed since the last sync are sent to the Profiles Store.

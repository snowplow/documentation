---
title: "Connect to existing warehouse tables"
sidebar_position: 30
sidebar_label: "Warehouse configuration"
description: "Connect Signals to existing warehouse tables using ExternalBatchAttributeGroup and BatchSource objects. Define table details, timestamp fields, and field mappings to sync pre-calculated attributes."
keywords: ["external batch", "batch source", "warehouse tables", "field mapping", "timestamp sync"]
---

To sync existing, pre-calculated attributes to Signals, use an `ExternalBatchAttributeGroup` attribute group to define which source table to use, and which fields (columns) to use from the table. Using existing warehouse tables doesn't require any additional modeling.

Configure which table to sync by specifying a `BatchSource` object for the group.

:::info

A `BatchSource` isn't required for `BatchAttributeGroup` objects, only `ExternalBatchAttributeGroup`.

:::

## Provide source table details

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

The table below lists all available arguments for a `BatchSource`:

| Argument          | Description                                                            | Type     | Required? |
| ----------------- | ---------------------------------------------------------------------- | -------- | --------- |
| `name`            | The name of the source                                                 | `string` | ✅         |
| `description`     | A description of the source                                            | `string` | ❌         |
| `database`        | The database where the attributes are stored                           | `string` | ✅         |
| `schema`          | The schema for the table of interest                                   | `string` | ✅         |
| `table`           | The table where the attributes are stored                              | `string` | ✅         |
| `timestamp_field` | Primary timestamp of the attribute value                               | `string` | ❌         |
| `owner`           | The owner of the source, typically the email of the primary maintainer | `string` | ❌         |

The sync engine only sends rows with a newer timestamp to the Profiles Store, based on the `timestamp_field`. For each attribute key, make sure there is only one row per timestamp — otherwise, one value may be discarded arbitrarily.

## Define which fields to sync

Instead of `attributes`, this attribute group class has `fields`.

Here's an example:

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

| Argument      | Description                | Type                                                                                                                                                                                                                | Required? |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `name`        | The name of the field      | `string`                                                                                                                                                                                                            | ✅         |
| `description` | A description of the field | `string`                                                                                                                                                                                                            | ❌         |
| `type`        | The type of the field      | One of: `bytes`, `string`, `int32`, `int64`, `double`, `float`, `bool`, `unix_timestamp`, `bytes_list`, `string_list`, `int32_list`, `int64_list`, `double_list`, `float_list`, `bool_list`, `unix_timestamp_list`, | ✅         |

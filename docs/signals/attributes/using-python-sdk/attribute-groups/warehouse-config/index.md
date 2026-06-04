---
title: "Sync warehouse tables to Signals"
sidebar_position: 30
sidebar_label: "Warehouse configuration"
description: "Connect Signals to existing warehouse tables using ExternalBatchAttributeGroup and BatchSource objects. Define table details, timestamp fields, field mappings, and a backfill start timestamp to sync pre-calculated attributes."
keywords: ["warehouse attributes", "batch source", "warehouse tables", "field mapping", "backfill", "timestamp sync"]
---

To sync existing, pre-calculated attributes from your warehouse to Signals, use an `ExternalBatchAttributeGroup` to define which source table to use, and which fields (columns) to sync. No additional modeling is required.

Once published, the batch engine handles syncing: it reads rows from your warehouse table at a fixed interval and sends them to the Profiles Store.

:::tip[Use stream attributes with backfill for most use cases]
If your source data comes from Snowplow events, consider using a stream attribute group with the backfill option enabled instead. It gives you real-time updates from your event stream alongside historical backfill, without needing to maintain a separate warehouse table. `ExternalBatchAttributeGroup` is best suited for pre-calculated values from non-Snowplow sources, or tables that already exist independently of your event pipeline.
:::

## Provide source table details

Configure which table to sync by specifying a `BatchSource` object for the group.

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
| `timestamp_field` | Primary timestamp of the attribute value, indicating data freshness    | `string` | ❌         |
| `owner`           | The owner of the source, typically the email of the primary maintainer | `string` | ❌         |

The batch engine only sends rows with a newer timestamp to the Profiles Store, based on the `timestamp_field`. If multiple rows exist for the same attribute key within a sync period, the engine uses the row with the greatest `timestamp_field` value.

## Define which fields to sync

Instead of `attributes`, this attribute group class has `fields` — abstractions over the warehouse columns.

You must set `backfill_since_tstamp` to tell the batch engine the earliest timestamp from which to read rows on the first sync. Without this, no historical data will be loaded. Set this to the earliest date in your warehouse table that contains data you want to sync.

Here's an example:

```python
from datetime import datetime, timezone
from snowplow_signals import ExternalBatchAttributeGroup, domain_userid, Field

attribute_group = ExternalBatchAttributeGroup(
    name="ecommerce_transaction_interactions_attributes",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com",
    batch_source=data_source,
    backfill_since_tstamp=datetime(2026, 6, 1, tzinfo=timezone.utc),
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

The table below lists all available arguments for an `ExternalBatchAttributeGroup`:

| Argument                | Description                                                                                                                                                                | Type          | Required? |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------- |
| `name`                  | The name of the attribute group                                                                                                                                            | `string`      | ✅         |
| `version`               | The version of the attribute group                                                                                                                                         | `int`         | ✅         |
| `attribute_key`         | The key used to identify profiles (e.g. `domain_userid`)                                                                                                                  | `key`         | ✅         |
| `batch_source`          | The `BatchSource` defining the warehouse table to sync from                                                                                                                | `BatchSource` | ✅         |
| `backfill_since_tstamp` | The earliest timestamp from which to read rows on the first sync. Set this to the earliest date in your table that contains data you want to sync. Accepts tz-aware or naive UTC `datetime`; tz-aware is recommended. | `datetime` | ✅ |
| `fields`                | The list of `Field` objects defining which columns to sync                                                                                                                 | `list`        | ✅         |
| `description`           | A description of the attribute group                                                                                                                                       | `string`      | ❌         |
| `owner`                 | The owner of the attribute group, typically the email of the primary maintainer                                                                                            | `string`      | ❌         |

The table below lists all available arguments for a `Field`:

| Argument      | Description                | Type                                                                                                                                                                                                                | Required? |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `name`        | The name of the field      | `string`                                                                                                                                                                                                            | ✅         |
| `description` | A description of the field | `string`                                                                                                                                                                                                            | ❌         |
| `type`        | The type of the field      | One of: `bytes`, `string`, `int32`, `int64`, `double`, `float`, `bool`, `unix_timestamp`, `bytes_list`, `string_list`, `int32_list`, `int64_list`, `double_list`, `float_list`, `bool_list`, `unix_timestamp_list`, | ✅         |

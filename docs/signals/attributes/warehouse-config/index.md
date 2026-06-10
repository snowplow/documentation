---
title: "Sync warehouse tables to Signals"
sidebar_position: 30
sidebar_label: "Warehouse configuration"
description: "Connect Signals to existing warehouse tables to sync pre-calculated attributes. Configure table details, timestamp fields, and field mappings using the Console or the Python SDK."
keywords: ["warehouse attributes", "batch source", "warehouse tables", "field mapping", "backfill", "timestamp sync", "ExternalBatchAttributeGroup"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

To sync existing, pre-calculated attributes from your warehouse to Signals, configure an attribute group with a warehouse source. No additional modeling is required — the batch engine reads rows from your warehouse table at a fixed interval and sends them to the Profiles Store.

:::tip[Use stream attributes with backfill when possible]
If your source data comes from Snowplow events, consider using a stream attribute group with the backfill option enabled instead. It gives you real-time updates from your event stream alongside historical backfill, without needing to maintain a separate warehouse table. Attributes that are fetched from a warehouse are best suited for pre-calculated values from non-Snowplow sources, or tables that already exist independently of your event pipeline.
:::

## Provide source table details

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

When creating an attribute group, select **Warehouse** as the data source. Provide the warehouse and table details, and select which fields you want to send to Signals.

![Warehouse source configuration showing warehouse table and field mapping options](../../images/attribute-group-warehouse-fields.png)

</TabItem>
<TabItem value="sdk" label="Python SDK">

Configure which table to sync by specifying a `BatchSource` object.

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

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the source | `string` | ✅ |
| `description` | A description of the source | `string` | ❌ |
| `database` | The database where the attributes are stored | `string` | ✅ |
| `schema` | The schema for the table of interest | `string` | ✅ |
| `table` | The table where the attributes are stored | `string` | ✅ |
| `timestamp_field` | Primary timestamp of the attribute value, indicating data freshness | `string` | ❌ |
| `owner` | The owner of the source | `string` | ❌ |

The batch engine only sends rows with a newer timestamp to the Profiles Store, based on the `timestamp_field`. If multiple rows exist for the same attribute key within a sync period, the engine uses the row with the greatest `timestamp_field` value.

</TabItem>
</Tabs>

## Define which fields to sync

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Select the fields (columns) from your warehouse table that you want to sync to the Profiles Store. You must also specify a backfill start date — the earliest date from which Signals should read rows on the first sync.

</TabItem>
<TabItem value="sdk" label="Python SDK">

Use `ExternalBatchAttributeGroup` to define which source table and fields to use. Instead of `attributes`, this class uses `fields` — abstractions over the warehouse columns.

You must set `backfill_since_tstamp` to tell the batch engine the earliest timestamp from which to read rows on the first sync. Without this, no historical data will be loaded.

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
        Field(name="TOTAL_TRANSACTIONS", type="int32"),
        Field(name="TOTAL_REVENUE", type="int32"),
        Field(name="AVG_TRANSACTION_REVENUE", type="int32"),
    ],
)
```

The table below lists all available arguments for `ExternalBatchAttributeGroup`:

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the attribute group | `string` | ✅ |
| `version` | The version of the attribute group | `int` | ✅ |
| `attribute_key` | The key used to identify profiles (e.g. `domain_userid`) | `key` | ✅ |
| `batch_source` | The `BatchSource` defining the warehouse table to sync from | `BatchSource` | ✅ |
| `backfill_since_tstamp` | The earliest timestamp from which to read rows on the first sync. Accepts tz-aware or naive UTC `datetime`; tz-aware is recommended. | `datetime` | ✅ |
| `fields` | The list of `Field` objects defining which columns to sync | `list` | ✅ |
| `description` | A description of the attribute group | `string` | ❌ |
| `owner` | The owner of the attribute group | `string` | ❌ |

The table below lists all available arguments for a `Field`:

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the field | `string` | ✅ |
| `description` | A description of the field | `string` | ❌ |
| `type` | The type of the field | one of: `bytes`, `string`, `int32`, `int64`, `double`, `float`, `bool`, `unix_timestamp`, `bytes_list`, `string_list`, `int32_list`, `int64_list`, `double_list`, `float_list`, `bool_list`, `unix_timestamp_list` | ✅ |

</TabItem>
</Tabs>

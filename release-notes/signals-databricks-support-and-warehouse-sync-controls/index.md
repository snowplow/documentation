---
title: "New in Signals: Databricks support and warehouse sync controls"
description: "Signals now works with Databricks warehouses, and warehouse attribute groups let you choose how often they sync."
date: "2026-08-27"
category:
  - "Product news"
components:
  - "Signals"
platforms:
  - "Databricks"
---
Signals can now connect to a Databricks warehouse, alongside Snowflake and BigQuery. We've also added a sync frequency setting for warehouse attribute groups.

## Databricks is now supported

Databricks joins Snowflake and BigQuery as a supported warehouse for Signals. This covers both places Signals reads from a warehouse: backfilling a stream attribute group from your `atomic` events table, and syncing pre-calculated attributes from your own tables.

You can still deploy Signals without a warehouse connection if you only need attributes calculated from the live event stream. See [Set up Signals](/docs/signals/setup/) for how to connect one.

## Choose how often warehouse attributes sync

Warehouse attribute groups sync hourly by default. If your source table updates less often than that, hourly syncing costs you warehouse compute for no new data.

You can now pick a sync frequency of 6, 12, or 24 hours when you create the group in Console. In the Python SDK, set `refresh_rate` on your `ExternalBatchAttributeGroup`:

```python
from datetime import datetime, timedelta, timezone

attribute_group = ExternalBatchAttributeGroup(
    name="user_transactions",
    version=1,
    attribute_key=domain_userid,
    batch_source=data_source,
    backfill_since_tstamp=datetime(2026, 6, 1, tzinfo=timezone.utc),
    refresh_rate=timedelta(hours=6),
    fields=[...],
)
```

For the full configuration reference, see [Sync warehouse tables to Signals](/docs/signals/attributes/warehouse-config/).

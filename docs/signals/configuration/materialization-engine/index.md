---
title: "Materialization Engine"
sidebar_position: 50
description: "In depth explanation on how the Materialization Engine works."
sidebar_label: "Materialization Engine"
---

If you plan on using batch attributes that need to be computed in the warehouse, the `Materialization Engine` is used to sync the data between the attribute table and the Profiles Store.

## Prerequisites
- have the attributes table ready in the warehouse
- have a [View](/docs/signals/configuration/views-services/index.md) defined together with Attributes with the `offline` parameter set to `True`
- have the [BatchSource](/docs/signals/configuration/sources/batch.md) registered in the View

## Enabling Materialization
The process of enabling Materialization depends on which kind of batch attributes you would like to sync: 

### 1. Attributes computed by yourself in the warehouse:

You would need to set `online=True` and apply the view. More details on this: [here](/docs/signals/configuration/sources/batch.md#start-materialization) 

### 2. Attributes you would like the Batch Engine to compute for you:

Use the Signals CLI and run the materialize command:

```bash
snowplow-batch-autogen materialize \
  --view-name "ecommerce" \
  --view-version 1 \
  --verbose
```

You can follow the [batch engine tutorial](/tutorials/snowplow-batch-engine/materialize-models/) for a step-by-step guide. 

This will take care of the same steps under the hood as you would do for attributes computed by yourself in the warehouse.

Once materialization is enabled, syncs begin at a fixed interval (default: every 5 minutes). During the batch source setup —regardless of the method— you’ll need to specify a timestamp_field. This field determines which records have changed since the last sync, and only those are included in the next materialization run.

## Supported Warehouses
Currently only `Snowflake` is supported. `BigQuery` support is coming soon.


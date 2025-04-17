---
position: 6
title: Materializing Models to Signals
---

## What is Model Materialization?

Model materialization is the process of taking your tested and validated dbt models and making them available in Snowplow Signals. 

## Why This Matters

This enables you to:
- Serve your attributes in production (with regular updates to keep the warehouse and Signals in sync)
- Monitor feature performance
- Manage feature metadata

It also:
- Bridges the gap between development and production
- Ensures consistent feature serving

Stay tuned for updates on this exciting feature! 

## Materializing your attribute table
Once you are happy with the dbt package generated outputs, you already have the attributes table in the warehouse, and you are ready to commit to it for production you are ready to start materializing your table.

### Step 1. - Fill out the batch_source_config
At the time of the data model generation, a config file is generated for you to adjust, under `config/batch_source_config.json`. You will see a similar structure to this:

```yml
{
    "database": "",
    "wh_schema": "",
    "table": "ecommerce_1_attributes",
    "name": "ecommerce_1_attributes",
    "timestamp_field": "lower_limit",
    "created_timestamp_column": "valid_at_tstamp",
    "description": "Table containing attributes for ecommerce_1 view",
    "tags": {},
    "owner": ""
}
```
Make sure you fill out the database and wh_schema (this will be your dbt profile's `{target_name}_derived`), which will need to correspond to the attributes table the dbt package has already produced. The rest you can leave unchanged.

### Step 2. - Run the materialize command

Run the following CLI command:

```bash
snowplow-batch-autogen materialize \
  --view-name "ecommerce" \
  --view-version 1 \
  --verbose
```
Based on the output you will see if it was successful. First it attempts to register the Batch Source for the view in question, if all good you will see the relevant message:

✅ Successfully added Batch Source information to view ecommerce_1

It then updates Signals which registers the table and the syncing should automatically begin from that point onwards:

✅ Successfully registered table ecommerce_transaction_interactions_features_1_attributes

For now there is no way to alter the update schedule, but watch out for updates on this in the near future!

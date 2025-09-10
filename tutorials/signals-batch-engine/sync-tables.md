---
position: 6
title: Sync attribute tables
description: "Connect warehouse attribute tables to Snowplow Signals for periodic syncing to the Profiles Store."
---

Syncing is the process of making your modeled and validated attributes table, and its calculated attributes available in Signals for production use. Under the hood the attributes table in your warehouse will be synced to the online store periodically. In order for it to work you need to let the sync engine know about your attributes table.

There are two steps to enable syncing:
1. Fill out the `batch_source_config.json` file for each model
2. Run the `sync` command

You'll need to sync each attributes table individually.


## Update configuration file

During data model generation, a config file is generated in `config/batch_source_config.json`. It will have a similar structure to this:

```yml
{
    "database": "",       # Add your database name
    "wh_schema": "",      # Add your schema
    "table": "user_attributes_1_attributes",
    "name": "user_attributes_1_attributes",
    "timestamp_field": "valid_at_tstamp",
    "description": "Table containing attributes for user_attributes_1 attribute group",
    "tags": {},
    "owner": ""
}
```

Fill out the `database` (for BigQuery this should be the project) and `wh_schema` values as per your [dbt target](https://docs.getdbt.com/reference/dbt-jinja-functions/target) setup.

The warehouse schema should be the `schema` defined in your dbt target, suffixed with _derived (`target_schema}_derived`). This is where the generated attributes tables are located by default.

## Run the sync command

Adjust the following CLI command according your use case (e.g. Change the target type to `bigquery`) and run it:

```bash
snowplow-batch-engine sync \
  --attribute-group-name "user_attributes" \
  --attribute-group-version 1 \
  --target-type snowflake \
  --verbose
```

The batch engine will first register the batch source for the attribute group. It will also publish the attribute group so that syncing can begin. 

Signals will check for updates to the table every hour. Your attributes will soon be available to retrieve in your applications.

Please note that syncing happens based on the records being updated since the last time a job was run. This is determined by the `timestamp_field` specified in the `batch_source_config.json`. As the attributes table is regenerated each time, this means that all the records will get synced. To keep costs down, please schedule the dbt run frequency accordingly (e.g. run it daily).

```bash
# Progress messages
✅ Successfully added Batch Source information to attribute group user_attributes_1
✅ Successfully registered table user_attributes_1_attributes
```

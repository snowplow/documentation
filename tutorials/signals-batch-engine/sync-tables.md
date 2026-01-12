---
position: 7
title: Sync the attribute tables with the Signals Profiles Store
sidebar_label: Sync attribute snapshot
description: "Register warehouse attribute tables as batch sources in Signals to enable hourly syncing to the Profiles Store for real-time access in applications."
keywords: ["signals profiles store sync", "batch source registration", "dbt snapshot"]
---

Syncing is the process of making your calculated attributes available in Signals for production use. After the attributes table is ready for production use, you should run `dbt snapshot`. The sync engine will use this table to understand which records have been changed since the last sync. In order for it to work you need to let the sync engine know about the location of your dbt snapshot.

There are two steps to enable syncing:
1. Fill out the `batch_source_config.json` file for each dbt project (one project per attribute group)
2. Run the `sync` command

## Update configuration file

During data model generation, a config file is generated in `config/batch_source_config.json`. It will have a similar structure to this:

```yml
{
    "database": "",       # Add your database name
    "wh_schema": "",      # Add your schema
    "table": "user_attributes_1_attributes_snapshot",
    "name": "user_attributes_1_attributes",
    "timestamp_field": "dbt_valid_from",
    "description": "Table containing attributes for user_attributes_1 attribute group",
    "tags": {},
    "owner": ""
}
```

Fill out the `database` (for BigQuery this should be the project) and `wh_schema` values as per your [dbt target](https://docs.getdbt.com/reference/dbt-jinja-functions/target) setup.

The warehouse schema should be the `schema` defined in your dbt target, suffixed with `_derived` (`{target_schema}_derived`). This is where the generated attributes table and snapshot are located by default.

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

Signals will check for updates to the table every hour. Changes will be captured in the next sync if both the dbt run and the dbt snapshot update have finished. Your attributes will then become available to retrieve in your applications.

```bash
# Progress messages
✅ Successfully added Batch Source information to attribute group user_attributes_1
✅ Successfully registered table user_attributes_1_attributes
```

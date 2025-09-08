---
position: 6
title: Materialize models
---

Model materialization is the process of making your validated dbt models, and the calculated attributes, available in Signals for production use.

There are two steps for materialization:
1. Fill out the `batch_source_config.json` file for each model
2. Run the `materialize` command

You'll need to materialize each project individually.

The `materialize` command uses the [materialization engine](/docs/signals/define-attributes/using-python-sdk//batch-calculations#materialization-engine) under the hood.

## Update configuration file

During data model generation, a config file is generated in `config/batch_source_config.json`. It will have a similar structure to this:

```yml
{
    "database": "",       # Add your database name
    "wh_schema": "",      # Add your schema
    "table": "user_attributes_1_attributes",
    "name": "user_attributes_1_attributes",
    "timestamp_field": "lower_limit",
    "created_timestamp_column": "valid_at_tstamp",
    "description": "Table containing attributes for user_attributes_1 view",
    "tags": {},
    "owner": ""
}
```

Fill out the `database` and `wh_schema` values. For schema, use your dbt profile's `{target_name}_derived`. These values will need to correspond to the attributes table the dbt package has already produced.

## Run the materialize command

Run the following CLI command:

```bash
snowplow-batch-autogen materialize \
  --view-name "user_attributes" \
  --view-version 1 \
  --verbose
```

The batch engine will first register the batch source for the view. It will then update the Signals configuration to register the table.

```bash
# Progress messages
✅ Successfully added Batch Source information to view user_attributes_1
✅ Successfully registered table user_attributes_1_attributes
```

Syncing to the Profiles Store will begin automatically. By default, Signals will check for updates to the table every 5 minutes. Your attributes will soon be available to retrieve in your applications.

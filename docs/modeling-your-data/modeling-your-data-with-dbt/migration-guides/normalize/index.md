---
title: "Migration guide for Normalize"
sidebar_label: "Normalize"
sidebar_position: 40
description: "Migration guide for upgrading the Snowplow Normalize dbt package including breaking changes and configuration updates."
keywords: ["normalize migration", "normalize upgrade", "dbt normalize version"]
---

### Upgrading to 0.3.0
- Version 1.4.0 of `dbt-core` now required
- You must add the following to the top level of your project yaml
    ```yml title="dbt_project.yml"
    dispatch:
      - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```
- Other changes required by [snowplow-utils version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/index.md#upgrading-to-0140)

### Upgrading to 0.2.0
- Version 1.3.0 of `dbt-core` now required
- Upgrading your config file
    - Change the `event_name` field to `event_names` and make the value a list
    - Change the `self_describing_event_schema` field to `self_describing_event_schemas` and make the value a list
    - If you wish to make use of the new features, see the example config or the docs for more information
- Upgrading your models (preferred method is to re-run the python script, but can be done manually following these steps)
    - For each normalized model:
        - Convert the `event_name` and `sde_cols` fields to lists, and pluralize the names in both the set and the macro call
        - Add a new field, `sde_aliases` which is an empty list, add this between `sde_types` and `context_cols` in the macro call
    - For your filtered events table:
        - Change the `unique_key` in the config section to `unique_id`
        - Add a line between the `event_table_name` and from lines for each select statement; `, event_id||'-'||'<that_event_table_name>' as unique_id`, with the event table name for that select block.
    - For your users table:
        - Add 3 new values to the start of the macro call, `'user_id','',''`, before the `user_cols` argument.
- Upgrade your filtered events table
    - If you use the master filtered events table, you will need to add a new column for the latest version to work. If you have not processed much data yet it may be easier to simply re-run the package from scratch using dbt run --full-refresh --vars 'snowplow__allow_refresh: true', alternatively run the following in your warehouse, replacing the schema/dataset/warehouse and table name for your table:
        ```sql
        ALTER TABLE {schema}.{table} ADD COLUMN unique_id STRING;
        UPDATE {schema}.{table} SET unique_id = event_id||'-'||event_table_name WHERE 1 = 1;
        ```

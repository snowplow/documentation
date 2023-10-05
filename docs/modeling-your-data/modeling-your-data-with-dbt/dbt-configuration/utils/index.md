---
title: "Utils"
sidebar_position: 300
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info
The models, functionality, and variables described below are only available from `snowplow-utils v0.15.0` and above, as earlier packages do not utilize these variables.
:::

## Package Configuration Variables

This package utilizes a set of variables that are configured to recommended values for optimal performance of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file. We have provided a [tool](#config-generator) below to help you with that.


:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::

### Warehouse
| Variable Name     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                | Default                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `dev_target_name` | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/#manifest-tables) section for more details.                                                                                                                                                         | `dev`                                     | `snowplow_base_sessions_this_run`                                  |
| `events_schema`   | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                  | `atomic`                                  |
| `events_table`        | The name of your events table where your events land.                                                                                                                                                                                                                                                                                                                                                                                       | `events`


### Operation and logic
| Variable Name           | Description                                                                                                                                                                                                                                                                                                                                                                                                      | Default        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `allow_refresh`         | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/#manifest-tables) section for more details.                                                                                         | `false`        |
| `backfill_limit_days`   | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/#package-state) section for more details.                                                                                                                  | `30`           |
| `custom_sql`     | This allows you to introduce custom sql to the `snowplow_base_events_this_run` table, which you can then leverage in downstream models. For more information on it's usage, see the following page on the [advanced usage of the utils package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/dbt-utils-advanced-operation/index.md). | `''` |
| `days_late_allowed`     | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                         | `3`            |
| `max_session_days`      | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                             | `3`            |
| `package_name`  | The name of the package you are running this macro under. This has implications for your `manifest` table. | `snowplow`           |
| `session_lookback_days` | Number of days to limit scan on `snowplow_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of the model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                             | `730`          |
| `start_date`            | The date to start processing events from in the package on first run or a full refresh, based on the value of `session_timestamp` variable.                                                                                                                                                                                                                                                                                             | `'2020-01-01'` |
| `upsert_lookback_days`  | Number of days to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the [Snowplow Optimized Materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-materialization/) section for more details. | `30`           |

### Custom identifiers & timestamps

:::info
If you are looking to customize identifiers and timestamps heavily, please see the [Utils advanced operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/dbt-utils-advanced-operation/index.md) section for more details and advanced usage examples to help you better understand how these variables work.
:::

| Variable Name        | Description                                                                                                                                                                                                                                                                                          | Default |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `session_identifiers` | A list of key:value dictionaries which contain all of the contexts and fields where your session identifiers are located. For each entry in the list, if your map contains the `schema` value `atomic`, then this refers to a field found directly in the atomic `events` table. If you are trying to introduce a context/entity with an identifier in it, the package will look for the context in your events table with the name specified in the `schema` field. It will use the specified value in the `field` key as the field name to access. For Redshift/Postgres, using the `schema` key the package will try to find a table in your `snowplow__events_schema` schema with the same name as the `schema` value provided, and join that. If multiple fields are specified, the package will try to coalesce all fields in the order specified in the list. For a better understanding of the advanced usage of this variable, please see the [Utils advanced operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/dbt-utils-advanced-operation/index.md) section for more details. |  `[{"schema" : "atomic", "field" : "domain_sessionid"}]` |
| `session_sql` | This allows you to override the `session_identifiers` SQL, to define completely custom SQL in order to build out a session identifier for your events. If you are interested in using this instead of providing identifiers through the `session_identifiers` variable, please see the [Utils advanced operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/dbt-utils-advanced-operation/index.md) section for more details on how to do that. |  `''` |
| `session_timestamp` | Determines which timestamp is used to build the sessionization logic. It's a good idea to have this timestamp be the same timestamp as the field you partition your events table on. | `collector_tstamp` |
| `user_identifiers` | A list of key:value dictionaries which contain all of the contexts and fields where your user identifiers are located. For each entry in the list, if your map contains the `schema` value `atomic`, then this refers to a field found directly in the atomic `events` table. If you are trying to introduce a context/entity with an identifier in it, the package will look for the context in your events table with the name specified in the `schema` field. It will use the specified value in the `field` key as the field name to access. For Redshift/Postgres, using the `schema` key the package will try to find a table in your `snowplow__events_schema` schema with the same name as the `schema` value provided, and join that. If multiple fields are specified, the package will try to coalesce all fields in the order specified in the list. For a better understanding of the advanced usage of this variable, please see the [Utils advanced operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/dbt-utils-advanced-operation/index.md) section for more details. | `[{"schema" : "atomic", "field" : "domain_userid"}]` |
| `user_sql` | This allows you to override the `user_identifiers` SQL, to define completely custom SQL in order to build out a user identifier for your events. If you are interested in using this instead of providing identifiers through the `user_identifiers` variable, please see the [Utils advanced operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/dbt-utils-advanced-operation/index.md) section for more details on how to do that. |  `''` |
### Model renaming

| Variable Name        | Description                                                                                                                                                                                                                                                                                          | Default |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `base_sessions`   | The name of the table that contains your base sessions this run.                                                                                                                                                                                                                                                                                                                                                                  | `snowplow_base_sessions_this_run`
| `event_limits`          | This is used internally by the packages to reference your events table based on other variable values and should not be changed.                                                                                                                                                                                                                                                                                                           | `snowplow_base_new_event_limits`                                  |
| `incremental_manifest`    | The name of the table that contains your atomic events.                                                                                                                                                                                                                                                                                                                                                                                    | `snowplow_incremental_manifest`                                  |
| `quarantined_sessions` | The name of the table that stores information on all sessions that are quarantined. | `snowplow_base_quarantined_sessions` |

### Warehouse Specific

<Tabs groupId="warehouse" queryString>
<TabItem value="databricks" label="Databricks" default>

| Variable Name        | Description                                                                                                                                                                                                                                                                                          | Default |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `databricks_catalog` | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). |      `hive_metastore`   |

</TabItem>
<TabItem value="bigquery" label="Bigquery" default>

| Variable Name                | Description                                                                                          | Default |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `derived_tstamp_partitioned` | Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp` . | `true`  |

</TabItem>
<TabItem value="snowflake" label="Snowflake" default>

| Variable Name | Description                                                                                                                                                                    | Default        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `query_tag`   | This sets the value of the `query_tag` for all sql executed against the database. This is used internally for metric gathering in Snowflake and its value should not be changed. | `snowplow_dbt` |

</TabItem>
</Tabs>

## Output Schemas
```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md"

<DbtSchemas/>
```

```yml title="dbt_project.yml"
models:
  my_dbt_project:
    base:
      +schema: my_scratch_schema
```

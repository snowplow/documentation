---
title: "Utils"
sidebar_position: 103
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Package Configuration Variables

This package utilizes a set of variables that are configured to recommended values for optimal performance of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

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
| `backfill_limit_days`   | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/#identification-of-events-to-process) section for more details.                                                                                                                  | `30`           |
| `base_sessions`   | The name of the table that contains your base sessions this run.                                                                                                                                                                                                                                                                                                                                                                  | `snowplow_base_sessions_this_run`
| `days_late_allowed`     | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                         | `3`            |
| `event_limits`          | This is used internally by the packages to reference your events table based on other variable values and should not be changed.                                                                                                                                                                                                                                                                                                           | `snowplow_base_new_event_limits`                                  |
| `incremental_manifest`    | The name of the table that contains your atomic events.                                                                                                                                                                                                                                                                                                                                                                                    | `snowplow_incremental_manifest`                                  |
| `max_session_days`      | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                             | `3`            |
| `session_identifiers` | A key:value map which contains all of the contexts and fields where your session identifiers are located. If the key is `atomic`, then this refers to a field found directly in the `events` table. If this key has a different value, the package will look for a context in your events table with that name, and it will use the specified value as the field name to access, either in the atomic table directly or in the specified context. If multiple fields are specified, the package will try to coalesce all fields in the order specified in the map. | `{"atomic": "domain_sessionid"}`
| `session_lookback_days` | Number of days to limit scan on `snowplow_mobile_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                             | `730`          |
| `session_timestamp` | Determines which timestamp is used to build the sessionization logic. It's a good idea to have this timestamp be the same timestamp as the field you partition your events table on. | `collector_tstamp`
| `start_date`            | The date to start processing events from in the package on first run or a full refresh, based on the value of `session_timestamp` variable.                                                                                                                                                                                                                                                                                             | `'2020-01-01'` |
| `upsert_lookback_days`  | Number of days to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the [Snowplow Optimized Materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-materialization/) section for more details. | `30`           |
| `user_identifiers` | A key:value map which contains all of the contexts and fields where your user identifiers are located. If the key is `atomic`, then this refers to a field found directly in the `events` table. If this key has a different value, the package will look for a context in your events table with that name, and it will use the specified value as the field name to access, either in the atomic table directly or in the specified context. If multiple fields are specified, the package will try to coalesce all fields in the order specified in the map. | `{"atomic": "domain_userid"}` |
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

```yml
# dbt_project.yml
...
models:
  my_dbt_project:
    base:
      +schema: my_scratch_schema
```

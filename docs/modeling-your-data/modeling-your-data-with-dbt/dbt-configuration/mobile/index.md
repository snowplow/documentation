---
title: "Mobile"
sidebar_position: 102
---
## Model Configuration

This packages make use of a series of other variables, which are all set to the recommend values for the operation of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::

In addition the mobile package has some contexts that can be enabled depending on your tracker configuration, see the [mobile package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-mobile-data-model/index.md) for more information.

| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Default                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `allow_refresh`               | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                  | `false`                                   |
| `app_id`                      | A list of `app_id`s to filter the events table on for processing within the package.                                                                                                                                                                                                                                                                                                                                                 | `[ ]` (no filter applied)                 |
| `atomic_schema`               | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                            | `atomic`                                  |
| `backfill_limit_days`         | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the back-filling section for more details.                                                                                                                                                                                                                                                                                 | 30                                        |
| `database`                    | The database that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                                 | `target.database`                         |
| `databricks_catalog`          | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic').                                                                                                                                 |                                           |
| `days_late_allowed`           | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                                             | 3                                         |
| `derived_tstamp_partitioned`  | Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp` (BigQuery only).                                                                                                                                                                                                                                                                                                                  | `true`                                    |
| `dev_target_name`             | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                                                        | `dev`                                     |
| `enable_app_errors_module`    | Flag to enable the app errors module (details relating to app errors that occur during sessions).                                                                                                                                                                                                                                                                                                                                    | `false`                                   |
| `enable_application_context`  | Flag to include the Application context (app version and build) columns in the models.                                                                                                                                                                                                                                                                                                                                               | `false`                                   |
| `enable_geolocation_context`  | Flag to include the Geolocation context (device latitude, longitude, bearing, etc.) columns in the models.                                                                                                                                                                                                                                                                                                                           | `false`                                   |
| `enable_mobile_context`       | Flag to include the Mobile context (device type, OS, etc.) columns in the models.                                                                                                                                                                                                                                                                                                                                                    | `false`                                   |
| `enable_screen_context`       | Flag to include the Screen context (screen details associated with mobile event) columns in the models.                                                                                                                                                                                                                                                                                                                              | `false`                                   |
| `events_table`                | The table that contains your atomic events.                                                                                                                                                                                                                                                                                                                                                                                          | `events`                                  |
| `has_log_enabled`             | When executed, the package logs information about the current run to the CLI. This can be disabled by setting to `false`.                                                                                                                                                                                                                                                                                                            | `true`                                    |
| `incremental_materialization` | The materialization used for all incremental models within the package. `snowplow_incremental` builds upon the default incremental materialization provided by dbt, improving performance when modeling event data. If however you prefer to use the native dbt incremental materialization, or any other, then adjust accordingly.                                                                                                  | `snowplow_incremental`                    |
| `lookback_window_hours`       | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                                         | 6                                         |
| `max_session_days`            | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                                                 | 3                                         |
| `query_tag`                   | This sets the value of the query_tag for Snowflake database use. This is used internally for metric gathering in Snowflake and its value should not be changed.                                                                                                                                                                                                                                                                      | `snowplow_dbt`                            |
| `session_lookback_days`       | Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                                                    | 730                                       |
| `session_stitching`           | Determines whether to apply the user mapping to the sessions table. Please see the 'User Mapping' section for more details.                                                                                                                                                                                                                                                                                                          | `True`                                    |
| `sessions_table`              | The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. `{{ ref('snowplow_web_sessions_custom') }}`. Please see the [README](https://github.com/snowplow/dbt-snowplow-web/tree/main/custom_example) in the `custom_example` directory for more information on this sort of implementation. | `{{ ref( 'snowplow_mobile_sessions' ) }}` |
| `start_date`                  | The date to start processing events from in the package, based on `collector_tstamp`.                                                                                                                                                                                                                                                                                                                                                | '2020-01-01'                              |
| `upsert_lookback_days`        | Number of day to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the incremental materialization section for more details.                                                                                                                                         | 30                                        |

## Output Schemas
```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md"

<DbtSchemas/>
```

```yml
# dbt_project.yml
...
models:
  snowplow_mobile:
    base:
      manifest:
        +schema: my_manifest_schema
      scratch:
        +schema: my_scratch_schema
    sessions:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    user_mapping:
      +schema: my_derived_schema
    users:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    screen_views:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    optional_modules:
      app_errors:
        +schema: my_derived_schema
        scratch:
          +schema: my_scratch_schema
```

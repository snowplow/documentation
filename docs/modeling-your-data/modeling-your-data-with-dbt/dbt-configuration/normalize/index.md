---
title: "Normalize"
sidebar_position: 104
---
## Model Configuration

This packages make use of a series of other variables, which are all set to the recommend values for the operation of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::


| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                         | Default                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `allow_refresh`               | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the 'Manifest Tables' section for more details.                                                                                                 | `false`                   |
| `app_id`                      | A list of `app_id`s to filter the events table on for processing within the package.                                                                                                                                                                                                                                                | `[ ]` (no filter applied) |
| `atomic_schema`               | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                           | `atomic`                  |
| `backfill_limit_days`         | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the back-filling section for more details.                                                                                                                                                                                | 30                        |
| `database`                    | The database that contains your atomic events table.                                                                                                                                                                                                                                                                                | `target.database`         |
| `databricks_catalog`          | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic').                                |                           |
| `derived_tstamp_partitioned`  | Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp` (BigQuery only).                                                                                                                                                                                                                 | `true`                    |
| `dev_target_name`             | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the 'Manifest Tables' section for more details.                                                                                                                                       | `dev`                     |
| `incremental_materialization` | The materialization used for all incremental models within the package. `snowplow_incremental` builds upon the default incremental materialization provided by dbt, improving performance when modeling event data. If however you prefer to use the native dbt incremental materialization, or any other, then adjust accordingly. | `snowplow_incremental`    |
| `lookback_window_hours`       | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                        | 6                         |
| `query_tag`                   | This sets the value of the query_tag for Snowflake database use. This is used internally for metric gathering in Snowflake and its value should not be changed.                                                                                                                                                                     | `snowplow_dbt`            |
| `start_date`                  | The date to start processing events from in the package, based on `collector_tstamp`.                                                                                                                                                                                                                                               | '2020-01-01'              |
| `upsert_lookback_days`        | Number of day to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the incremental materialization section for more details.                                        | 30                        |

## Output Schemas
```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md"

<DbtSchemas/>
```

```yml
# dbt_project.yml
...
models:
  snowplow_normalize:
    base:
      manifest:
        +schema: my_manifest_schema
      scratch:
        +schema: my_scratch_schema
        +tags: my_scratch_schema
```

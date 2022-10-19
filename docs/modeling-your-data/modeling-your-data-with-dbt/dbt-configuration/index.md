---
title: "Configuration"
date: "2022-10-05"
sidebar_position: 350
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::caution

When using multiple dbt packages you must be careful to specify which scope a variable or configuration is defined within. In general, always specify each value in your `dbt_project.yml` nested under the specific package e.g.

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__atomic_schema: schema_with_snowplow_web_events
  snowplow_mobile:
    snowplow__atomic_schema: schema_with_snowplow_mobile_events
```

You can read more about variable scoping in dbt's docs around [variable precedence](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-variables#variable-precedence).

:::

Each model has specific configuration variables, however some variables are applied across multiple packages and in some cases may have the same name. Ensure you provide the variable and/or configuration value for each package you are using by defining them in the scope of the package. 

## Output Schemas
By default all scratch/staging tables will be created in the `<target.schema>_scratch` schema, the derived tables ( e.g. `snowplow_web_page_views`, `snowplow_web_sessions`, `snowplow_web_users`) will be created in `<target.schema>_derived` and all manifest tables in `<target.schema>_snowplow_manifest`. Some of these schemas are only used by specific packages, ensure you add the correct configurations for each packages you are using. To change, please add the following to your `dbt_project.yml` file:

:::tip

If you want to use just your connection schema with no suffixes, set the `+schema:` values to `null`

:::

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```yml
# dbt_project.yml
...
models:
  snowplow_web:
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
    page_views: 
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
```
</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

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

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

```yml
# dbt_project.yml
...
models:
  snowplow_media_player:
    web:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    custom:
      +schema: my_scratch_schema
```
</TabItem>
</Tabs>

------

## Disabling a standard module

If you do not require certain modules provided by the package you have the option to disable them. For instance to disable the users module in the `snowplow_web` package:

```yml
# dbt_project.yml
...
models:
  snowplow_web:
    users:
      enabled: false
```

Note that any dependent modules will also need to be disabled - for instance if you disabled the sessions module in the web package, you will also have to disable the users module.

## Model Configuration

This packages make use of a series of other variables, which are all set to the recommend values for the operation of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

In general, when adding new variables to the dbt project we have to be careful around scoping the variables appropriately, especially when using multiple packages, which is the case when running the snowplow web and mobile packages.

Although we try and name our package variables uniquely across all Snowplow dbt packages, when making any changes to them it's best to keep them separate in their appropriate scoping level. In other words, variables introduced in the web model should be set under snowplow_web and the same goes for the mobile related variables as illustrated below:

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__backfill_limit_days: 60
  snowplow_media_player:
    snowplow__percent_progress_boundaries: [20, 40, 60, 80]
```

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

| Variable Name                           | Default                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `snowplow__lookback_window_hours`       | 6                                       | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                                         |
| `snowplow__backfill_limit_days`         | 30                                      | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the back-filling section for more details.                                                                                                                                                                                                                                                                                 |
| `snowplow__session_lookback_days`       | 730                                     | Number of days to limit scan on snowplow_web_base_sessions_lifecycle_manifest manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                                                      |
| `snowplow__days_late_allowed`           | 3                                       | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                                             |
| `snowplow__max_session_days`            | 3                                       | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                                                 |
| `snowplow__upsert_lookback_days`        | 30                                      | Number of day to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the incremental materialization section for more details.                                                                                                                                         |
| `snowplow__sessions_table`              | `{{ ref( 'snowplow_mobile_sessions' ) }}` | The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. `{{ ref('snowplow_web_sessions_custom') }}`. Please see the [README](https://github.com/snowplow/dbt-snowplow-web/tree/main/custom_example) in the `custom_example` directory for more information on this sort of implementation. |
| `snowplow__has_log_enabled`             | `true`                                  | When executed, the package logs information about the current run to the CLI. This can be disabled by setting to `false`.                                                                                                                                                                                                                                                                                                            |
| `snowplow__query_tag`                   | `snowplow_dbt`                          | This sets the value of the query_tag for Snowflake database use. This is used internally for metric gathering in Snowflake and its value should not be changed.                                                                                                                                                                                                                                                                      |
| `snowplow__incremental_materialization` | `snowplow_incremental`                  | The materialization used for all incremental models within the package. `snowplow_incremental` builds upon the default incremental materialization provided by dbt, improving performance when modeling event data. If however you prefer to use the native dbt incremental materialization, or any other, then adjust accordingly.                                                                                                  |
| `snowplow__allow_refresh`               | `false`                                 | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                  |
| `snowplow__dev_target_name`             | `dev`                                   | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                                                        |
| `snowplow__session_stitching`           | `True`                                  | Determines whether to apply the user mapping to the sessions table. Please see the 'User Mapping' section for more details.                                                                                                                                                                                                                                                                                                          |
| `snowplow__ua_bot_filter` | `true`  | Configuration to filter out bots via the useragent string pattern match. |

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

In addition the mobile package has some contexts that can be enabled depending on your tracker configuration, see the [mobile package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-mobile-data-model/index.md) for more information.

| Variable Name                           | Default                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `snowplow__lookback_window_hours`       | 6                                       | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                                         |
| `snowplow__backfill_limit_days`         | 30                                      | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the back-filling section for more details.                                                                                                                                                                                                                                                                                 |
| `snowplow__session_lookback_days`       | 730                                     | Number of days to limit scan on snowplow_web_base_sessions_lifecycle_manifest manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                                                      |
| `snowplow__days_late_allowed`           | 3                                       | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                                             |
| `snowplow__max_session_days`            | 3                                       | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                                                 |
| `snowplow__upsert_lookback_days`        | 30                                      | Number of day to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the incremental materialization section for more details.                                                                                                                                         |
| `snowplow__sessions_table`              | `{{ ref( 'snowplow_mobile_sessions' ) }}` | The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. `{{ ref('snowplow_web_sessions_custom') }}`. Please see the [README](https://github.com/snowplow/dbt-snowplow-web/tree/main/custom_example) in the `custom_example` directory for more information on this sort of implementation. |
| `snowplow__has_log_enabled`             | `true`                                  | When executed, the package logs information about the current run to the CLI. This can be disabled by setting to `false`.                                                                                                                                                                                                                                                                                                            |
| `snowplow__query_tag`                   | `snowplow_dbt`                          | This sets the value of the query_tag for Snowflake database use. This is used internally for metric gathering in Snowflake and its value should not be changed.                                                                                                                                                                                                                                                                      |
| `snowplow__incremental_materialization` | `snowplow_incremental`                  | The materialization used for all incremental models within the package. `snowplow_incremental` builds upon the default incremental materialization provided by dbt, improving performance when modeling event data. If however you prefer to use the native dbt incremental materialization, or any other, then adjust accordingly.                                                                                                  |
| `snowplow__allow_refresh`               | `false`                                 | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                  |
| `snowplow__dev_target_name`             | `dev`                                   | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                                                        |
| `snowplow__session_stitching`           | `True`                                  | Determines whether to apply the user mapping to the sessions table. Please see the 'User Mapping' section for more details.                                                                                                                                                                                                                                                                                                          |


</TabItem>
<TabItem value="media" label="Snowplow Media Player">

| Variable Name                           | Default          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `snowplow__percent_progress_boundaries` | [10, 25, 50, 75] | The list of percent progress values. It needs to be aligned with the values being tracked by the tracker. It is worth noting that the more these percent progress boundaries are being tracked the more accurate the play time calculations become. Please note that tracking 100% is unnecessary as there is a separate `ended` event which the model equates to achieving 100% and it also gets included automatically to this list, in case it is not added (you can refer to the helper macro `get_percentage_boundaries` ([source](https://snowplow.github.io/dbt-snowplow-media-player/#!/macro/macro.snowplow_media_player.get_percentage_boundaries)) for details). |
| `snowplow__valid_play_sec`              | 30               | The minimum number of seconds that a media play needs to last to consider that interaction a valid play. The default is 30 seconds (based on the YouTube standard) but it can be modified here, if needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `snowplow__complete_play_rate`          | 0.99             | The rate to set what percentage of a media needs to be played in order to consider that complete. 0.99 (=99%) is set as a default value here but it may be increased to 1 (or decreased) depending on the use case.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `snowplow__max_media_pv_window`         | 10               | The number of hours that needs to pass before new page_view level media player metrics from the `snowplow_media_player_base` table are safe to be processed by the model downstream in the `snowplow_media_player_media_stats` table. Please note that even if new events are added later on ( e.g. new `percentprogress` events are fired indicating potential replay) and the `snowplow_media_player_base` table is changed, the model will not update them in the media_stats table, therefore it is safer to set as big of a number as still convenient for analysis and reporting.                                                                                     |
| `snowplow__enable_youtube`              | `false`          | Set to `true` if the HTML5 media element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `snowplow__enable_whatwg_media`         | `false`          | Set to `true` if the HTML5 video element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `snowplow__enable_whatwg_video`         | `false`          | Set to `true` if the HTML5 video element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

</TabItem>
</Tabs>

------
## Warehouse specific configurations
### Postgres

In most modern analytical data warehouses constraints are usually either unsupported or unenforced. For this reason it is better to use dbt to assert the data constraints without actually materializing them in the database using `dbt test`. Here you can test the constraint is unique and not null. The snowplow_web package already includes these dbt tests for primary keys, see the testing section for more details.

To optimism performance of large Postgres datasets you can create [indexes](https://docs.getdbt.com/reference/resource-configs/postgres-configs#indexes) in your dbt model config for columns that are commonly used in joins or where clauses. For example:

``` yaml
# snowplow_web_sessions_custom.sql
{{
  config(
    ...
    indexes=[{'columns': [‘domain_sessionid’], 'unique': True}]
  )
}}
```

### Databricks


You can connect to Databricks using either the `dbt-spark` or the `dbt-databricks` connectors. The `dbt-spark` adapter does not allow dbt to take advantage of certain features that are unique to Databricks, which you can take advantage of when using the `dbt-databricks` adapter. Where possible, we would recommend using the `dbt-databricks` adapter.

#### Unity Catalog support

With the rollout of Unity Catalog (UC), the `dbt-databricks` adapter has added support in dbt for the three-level-namespace as of `dbt-databricks>=1.1.1`. As a result of this, we have introduced the `snowplow__databricks_catalog` variable which should be used **if** your Databricks environment has UC enabled, and you are using a version of the `dbt-databricks` adapter that supports UC. The default value for this variable is `hive_metastore` which is also the default name of your UC, but this can be changed with the `snowplow__databricks_catalog` variable.

Since there are many different situations, we've created the following table to help guide your setup process (this should help resolve the `Cannot set database in Databricks!` error):

|                                             | Adapter supports UC and UC Enabled                                                                     | Adapter supports UC and UC not enabled         | Adapter does not support UC                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Events land in default `atomic` schema      | `snowplow__databricks_catalog` = '{name_of_catalog}'                                                   | Nothing needed                                 | `snowplow__databricks_catalog` = 'atomic'                                                             |
| Events land in custom schema (not `atomic`) | `snowplow__atomic_schema` = '{name_of_schema}'  `snowplow__databricks_catalog` = '{name_of_catalog}' | `snowplow__atomic_schema` = '{name_of_schema}' | `snowplow__atomic_schema` = '{name_of_schema}'  `snowplow__databricks_catalog` = '{name_of_schema}' |

#### Optimization of models

The `dbt-databricks` adapter allows our data models to take advantage of the auto-optimization features in Databricks. If you are using the `dbt-spark` adapter, you will need to manually alter the table properties of your derived and manifest tables using the following command after running the data model at least once. You will need to run the command in your Databricks environment once for each table, and we would recommend applying this to the tables in the `_derived` and `_snowplow_manifest` schemas:

```SQL
ALTER TABLE {TABLE_NAME} SET TBLPROPERTIES (delta.autoOptimize.optimizeWrite = true, delta.autoOptimize.autoCompact = true);
```


### BigQuery

As mentioned in the [Quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md) You can verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__derived_tstamp_partitioned: false
```

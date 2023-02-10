---
title: "Configuration"
description: "Information for the configuration of our dbt packages"
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
<TabItem value="normalize" label="Snowplow Normalize">

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
</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

```yml
# dbt_project.yml
...
models:
  snowplow_ecommerce:
    base:
      manifest:
        +schema: my_manifest_schema
      scratch:
        +schema: my_scratch_schema
    carts:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    checkouts:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    products:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    transactions:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    users:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema

```
</TabItem>
</Tabs>


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

:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Default                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `allow_refresh`               | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                  | `false`                                |
| `app_id`                      | A list of `app_id`s to filter the events table on for processing within the package.                                                                                                                                                                                                                                                                                                                                                 | `[ ]` (no filter applied)              |
| `atomic_schema`               | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                            | `atomic`                               |
| `backfill_limit_days`         | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the back-filling section for more details.                                                                                                                                                                                                                                                                                 | 30                                     |
| `database`                    | The database that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                                 | `target.database`                      |
| `databricks_catalog`          | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic').                                                                                                                                 |                                        |
| `days_late_allowed`           | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                                             | 3                                      |
| `derived_tstamp_partitioned`  | Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp` (BigQuery only).                                                                                                                                                                                                                                                                                                                  | `true`                                 |
| `dev_target_name`             | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                                                        | `dev`                                  |
| `enable_iab`                  | Flag to include the [IAB enrichment](/docs/enriching-your-data/available-enrichments/iab-enrichment/index.md) columns in the models.                                                                                                                                                                                                                                                                                                       | `false`                                |
| `enable_ua`                   | Flag to include the [UA Parser enrichment](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md) columns in the models.                                                                                                                                                                                                                                                                                     | `false`                                |
| `enable_yauaa`                | Flag to include the [YAUAA enrichment](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) columns in the models.                                                                                                                                                                                                                                                                                             | `false`                                |
| `has_log_enabled`             | When executed, the package logs information about the current run to the CLI. This can be disabled by setting to `false`.                                                                                                                                                                                                                                                                                                            | `true`                                 |
| `heartbeat`                   | Page ping heartbeat time as defined in your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#activity-tracking-page-pings).                                                                                                                                                            | 10                                     |
| `incremental_materialization` | The materialization used for all incremental models within the package. `snowplow_incremental` builds upon the default incremental materialization provided by dbt, improving performance when modeling event data. If however you prefer to use the native dbt incremental materialization, or any other, then adjust accordingly.                                                                                                  | `snowplow_incremental`                 |
| `limit_page_views_to_session` | A boolean whether to ensure page view aggregations are limited to pings in the same session as the `page_view` event, to ensure deterministic behavior. If false you may get different results for the same `page_view` depending on which sessions are included in a run.                                                                                                                                                           | `true`                                 |
| `lookback_window_hours`       | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                                         | 6                                      |
| `max_session_days`            | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                                                 | 3                                      |
| `min_visit_length`            | Minimum visit length as defined in your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#activity-tracking-page-pings).                                                                                                                                                                | 5                                      |
| `query_tag`                   | This sets the value of the query_tag for Snowflake database use. This is used internally for metric gathering in Snowflake and its value should not be changed.                                                                                                                                                                                                                                                                      | `snowplow_dbt`                         |
| `session_lookback_days`       | Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                                                    | 730                                    |
| `session_stitching`           | Determines whether to apply the user mapping to the sessions table. Please see the 'User Mapping' section for more details.                                                                                                                                                                                                                                                                                                          | `True`                                 |
| `sessions_table`              | The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. `{{ ref('snowplow_web_sessions_custom') }}`. Please see the [README](https://github.com/snowplow/dbt-snowplow-web/tree/main/custom_example) in the `custom_example` directory for more information on this sort of implementation. | `{{ ref( 'snowplow_web_sessions' ) }}` |
| `start_date`                  | The date to start processing events from in the package, based on `collector_tstamp`.                                                                                                                                                                                                                                                                                                                                                | '2020-01-01'                           |
| `ua_bot_filter`               | Configuration to filter out bots via the useragent string pattern match.                                                                                                                                                                                                                                                                                                                                                             | `true`                                 |
| `upsert_lookback_days`        | Number of day to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the incremental materialization section for more details.                                                                                                                                         | 30                                     |

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

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

</TabItem>
<TabItem value="media" label="Snowplow Media Player">


| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `complete_play_rate`          | The rate to set what percentage of a media needs to be played in order to consider that complete. 0.99 (=99%) is set as a default value here but it may be increased to 1 (or decreased) depending on the use case.                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 0.99             |
| `enable_whatwg_media`         | Set to `true` if the HTML5 video element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`          |
| `enable_whatwg_video`         | Set to `true` if the HTML5 video element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`          |
| `enable_youtube`              | Set to `true` if the HTML5 media element context schema is enabled. This variable is used to handle syntax depending on whether the context fields are available in the database or not.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`          |
| `max_media_pv_window`         | The number of hours that needs to pass before new page_view level media player metrics from the `snowplow_media_player_base` table are safe to be processed by the model downstream in the `snowplow_media_player_media_stats` table. Please note that even if new events are added later on ( e.g. new `percentprogress` events are fired indicating potential replay) and the `snowplow_media_player_base` table is changed, the model will not update them in the media_stats table, therefore it is safer to set as big of a number as still convenient for analysis and reporting.                                                                                     | 10               |
| `percent_progress_boundaries` | The list of percent progress values. It needs to be aligned with the values being tracked by the tracker. It is worth noting that the more these percent progress boundaries are being tracked the more accurate the play time calculations become. Please note that tracking 100% is unnecessary as there is a separate `ended` event which the model equates to achieving 100% and it also gets included automatically to this list, in case it is not added (you can refer to the helper macro `get_percentage_boundaries` ([source](https://snowplow.github.io/dbt-snowplow-media-player/#!/macro/macro.snowplow_media_player.get_percentage_boundaries)) for details). | [10, 25, 50, 75] |
| `valid_play_sec`              | The minimum number of seconds that a media play needs to last to consider that interaction a valid play. The default is 30 seconds (based on the YouTube standard) but it can be modified here, if needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 30               |

</TabItem>
<TabItem value="normalize" label="Snowplow Normalize">


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

</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

In addition the e-commerce package has some contexts that can be enabled depending on your tracker configuration, see the [e-commerce package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) for more information.

| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Default                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `allow_refresh`               | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                  | `false`                                   |
| `app_id`                      | A list of `app_id`s to filter the events table on for processing within the package.                                                                                                                                                                                                                                                                                                                                                 | `[ ]` (no filter applied)                 |
| `atomic_schema`               | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                            | `atomic`                                  |
| `backfill_limit_days`         | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the back-filling section for more details.                                                                                                                                                                                                                                                                                 | 30                                        |
| `categories_separator`        | The separator used to split out your subcategories from your main subcategory. If for example your category field is filled as follows: `books/fiction/magical-fiction` then you should specify `'/'` as the separator in order for the subcolumns to be properly parsed. | `'/'` |
| `database`                    | The database that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                                 | `target.database`                         |
| `databricks_catalog`          | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic').                                                                                                                                 |                                           |
| `days_late_allowed`           | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                                             | 3                                         |
| `derived_tstamp_partitioned`  | Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp` (BigQuery only).                                                                                                                                                                                                                                                                                                                  | `true`                                    |
| `dev_target_name`             | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                                                        | `dev`                                     |
| `ecommerce_event_names` | The list of event names that the Snowplow e-commerce package will filter on when extracting events from your atomic events table. If you have included any custom e-commerce events, feel free to add their event name in this list to include them in your data models. | `['snowplow_ecommerce_action']`         |
| `events`                | The table that contains your atomic events.                                                                                                                                                                                                                                                                                                                                                                                          | `events`                                  |
| `incremental_materialization` | The materialization used for all incremental models within the package. `snowplow_incremental` builds upon the default incremental materialization provided by dbt, improving performance when modeling event data. If however you prefer to use the native dbt incremental materialization, or any other, then adjust accordingly.                                                                                                  | `snowplow_incremental`                    |
| `lookback_window_hours`       | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                                         | 6                                         |
| `max_session_days`            | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                                                 | 3                                         |
| `number_category_levels`      | The **maximum** number of levels (depth) of subcategories that exist on your website for products. These subcategories are recorded in the category field of the product context, and should be separated using the separator which is defined below. For example, `books/fiction/magical-fiction` has a level of 3. The value is the number of columns that will be generated in the product tables created by this Snowplow dbt package. Please note that some products can have less than the maximum number of categories specified. | `4`|
| `number_checkout_steps`       |  The index of the checkout step which represents a completed transaction. This is required to enable working checkout funnel analysis, and has a default value of 4. | `4`                                     |
| `query_tag`                   | This sets the value of the query_tag for Snowflake database use. This is used internally for metric gathering in Snowflake and its value should not be changed.                                                                                                                                                                                                                                                                      | `snowplow_dbt`                            |
| `session_lookback_days`       | Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                                                    | 730                                       |
| `start_date`                  | The date to start processing events from in the package, based on `collector_tstamp`.                                                                                                                                                                                                                                                                                                                                                | '2020-01-01'                              |
| `upsert_lookback_days`        | Number of day to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the incremental materialization section for more details.                                                                                                                                         | 30                                        |
| `use_product_quantity`       | Whether the `product_quantity` field in the product context should be used to sum up the total number of products in a transaction. If this value is set to false, then your `number_products` field in your `transaction` tables will instead be calculated by counting the number of product entities within the transaction i.e. treating each product as having a quantity of 1. | `false` |

</TabItem>
</Tabs>

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

|                                             | Adapter supports UC and UC Enabled                                                                   | Adapter supports UC and UC not enabled         | Adapter does not support UC                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Events land in default `atomic` schema      | `snowplow__databricks_catalog` = '{name_of_catalog}'                                                 | Nothing needed                                 | `snowplow__databricks_catalog` = 'atomic'                                                           |
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

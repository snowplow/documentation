---
title: "Modeling your data with dbt"
date: "2022-10-05"
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

[dbt](https://docs.getdbt.com/) enables analytics engineers to transform data in their warehouses by simply writing select statements. It is the preferred method for transforming Snowplow event and supersedes our use of [SQL Runner](/docs/modeling-your-data/modeling-your-data-with-sql-runner/index.md).

To setup dbt, Snowplow open source users can start with the [dbt User Guide](https://docs.getdbt.com/guides/getting-started) and then we have prepared some [introduction videos](https://www.youtube.com/watch?v=1kd6BJhC4BE) for working with the Snowplow dbt packages.

For Snowplow BDP customers, currently dbt is not supported in the console, but this is in development and we expect to be able to support dbt models in BDP soon. 

# Snowplow dbt Packages


|Package |Repo|Model Docs|
| --- | --- | --- |
|**Snowplow Web**|[Github](https://github.com/snowplow/dbt-snowplow-web)|[Docs](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web)|
|**Snowplow Mobile**|[Github](https://github.com/snowplow/dbt-snowplow-mobile)|[Docs](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile)|
|**Snowplow Media Player**|[Github](https://github.com/snowplow/dbt-snowplow-media-player)|[Docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/overview/snowplow_media_player)|
|_Snowplow Utils_| [Github](https://github.com/snowplow/dbt-snowplow-utils)| |


Currently there are 3 core snowplow dbt packages; [Snowplow Web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-web-data-model/index.md), [Snowplow Mobile](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-mobile-data-model/index.md), and [Snowplow Media Player](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-media-player-data-model/index.md). The Snowplow Media Player package is designed to be used with the Snowplow Web package and not as a standalone model so much of the information on this page applies primarily to the web and mobile packages. There is a fourth package, Snowplow Utils that is used to collect together utility macros for the three main packages, but you will not need to interact with this package.

The 'standard' modules in each package can be thought of as source code for the core logic of the model, which Snowplow maintains. These modules carry out the incremental logic in such a way that custom modules can be written to plug into the models' structure, without needing to write a parallel incremental logic. We recommend that all customizations are written in this way, which allows us to safely maintain and roll out updates to the model, without impact on dependent custom sql. See the page on [custom modules](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) for more information.

Each module produces a table which acts as the input to the subsequent module (the `_this_run` tables), and updates a derived table - with the exception of the Base module, which takes atomic data as its input, and does not update a derived table. The Snowplow Media Player package works slightly differently as it is used in addition to the Web package, not as a standalone set of models, see it's [documentation page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-media-player-data-model/index.md) for further information.

The latest versions of all packages support BigQuery, Databricks, Postgres, Redshift, and Snowflake warehouses.


<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

| snowplow-web version | dbt versions        | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| -------------------- | ------------------- | --------- | ----------- | --------- | ---------- | --------- |
| 0.9.2                | >=1.0.0 to <2.0.0   | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.5.1                | >=0.20.0 to <1.0.0  | ✅        | ❌          | ✅        | ✅         | ✅        |
| 0.4.1                | >=0.18.0 to <0.20.0 | ✅        | ❌          | ✅        | ✅         | ❌        |
| 0.4.1                | >=0.19.0 to <0.20.0 | ❌        | ❌          | ❌        | ❌         | ✅        |

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

| snowplow-mobile version | dbt versions       | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| ----------------------- | ------------------ | --------- | ----------- | --------- | ---------- | --------- |
| 0.5.4                   | >=1.0.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.2.0                   | >=0.20.0 to <1.0.0 | ✅        | ❌          | ✅        | ✅         | ✅        |

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

| snowplow-media-player version | snowplow-web version | dbt versions       | BigQuery  | Databricks  | Redshift  | Snowflake  | Postgres  |
| ----------------------------- | -------------------- | ------------------ | --------- | ----------- | --------- | ---------- | --------- |
| 0.3.1                         | >=0.9.0 to <0.10.0   | >=1.0.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.1.0                         | >=0.6.0 to <0.7.0    | >=0.20.0 to <1.1.0 | ❌        | ❌          | ✅        | ❌         | ✅        |

</TabItem>
</Tabs>

------

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

## Requirements

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web events dataset being available in your database:

- [Snowplow Javascript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md) version 2 or later implemented.
- Web Page context [enabled](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracker-setup/initializing-a-tracker-2/index.md#webPage_context) (enabled by default in [v3+](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/index.md#webPage_context)).
- [Page view events](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#page-views) implemented.

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a mobile events dataset being available in your database:

- Snowplow [Android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/index.md) or [iOS](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/index.md) mobile tracker version 1.1.0 or later implemented.
- Mobile session context enabled ([ios](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/#session-context) or  [android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/#session-tracking)).
- Screen view events enabled ([ios](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/#tracking-features) or [android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/#tracking-features)). 


</TabItem>
<TabItem value="media" label="Snowplow Media Player">

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web events dataset being available in your database:

- A dataset of media-player web events from the [Snowplow JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/index.md)] must be available in the database. In order for this to happen at least one of the JavaScript based media tracking plugins need to be enabled: [Media Tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/media-tracking/index.md) or [YouTube Tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/youtube-tracking/index.md)
- Have the [`webPage` context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/index.md#adding-predefined-contexts) enabled.
- Have the [media-player event schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player_event/jsonschema/1-0-0) enabled.
- Have the [media-player context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0) enabled.
- Depending on the plugin / intention have all the relevant contexts from below enabled:
  - in case of embedded YouTube tracking: Have the [YouTube specific context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.youtube/youtube/jsonschema/1-0-0) enabled.
  - in case of HTML5 audio or video tracking: Have the [HTML5 media element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0) enabled.
  - in case of HTML5 video tracking: Have the [HTML5 video element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/video_element/jsonschema/1-0-0) enabled.

</TabItem>
</Tabs>

------

## Installation

Check [dbt Hub](https://hub.getdbt.com/snowplow/snowplow_web/latest/) for the latest installation instructions, or read the [dbt docs](https://docs.getdbt.com/docs/building-a-dbt-project/package-management) for more information on installing packages. If you are using multiple packages you may need to up/downgrade a specific package to ensure compatibility, especially when using the web and media player packages together.

## Quickstart

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

#### 1. Adding the `selector.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](./index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-web/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

#### 2. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile). In order to change this, please add the following to your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
```

**Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.**

#### 3. Enabled desired contexts

The web package has the option to join in data from the following 3 Snowplow enrichments:

- [IAB enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/iab-enrichment/)
- [UA Parser enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/)
- [YAUAA enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/yauaa-enrichment/)

By default these are **all disabled** in the web package. Assuming you have the enrichments turned on in your Snowplow pipeline, to enable the contexts within the package please add the following to your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__enable_iab: true
    snowplow__enable_ua: true
    snowplow__enable_yauaa: true
```

#### 4. Filter your data set

You can specify both `start_date` at which to start processing events and the `app_id`'s to filter for. By default the `start_date` is set to `2020-01-01` and all `app_id`'s are selected. To change this please add the following to your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
```


#### 5. Verify page ping variables

The web package processes page ping events to calculate web page engagement times. If your [tracker configuration](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/#activity-tracking-page-pings) for `min_visit_length` (default 5) and `heartbeat` (default 10) differs from the defaults provided in this package, you can override by adding to your `dbt_project.yml`:

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__min_visit_length: 5 # Default value
    snowplow__heartbeat: 10 # Default value
```

#### 6. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__derived_tstamp_partitioned: false
```
:::

:::info Databricks only - setting the databricks_catalog

Add the following variable to your dbt project's `dbt_project.yml` file

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__databricks_catalog: 'hive_metastore'
```
Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to 'hive_metastore') or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). This is needed to handle the database property within `models/base/src_base.yml`.

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](./index.md#unity-catalog-support).**

:::

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

#### 1. Adding the `selector.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](./index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-mobile/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

#### 2. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile), in the table labeled `events`. In order to change this, please add the following to your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
    snowplow__events_table: table_of_snowplow_events
```

**Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.**
#### 3. Enabled desired contexts

The mobile package has the option to join in data from the following 4 Snowplow contexts:

- Mobile context -- Device type, OS, etc.
- Geolocation context -- Device latitude, longitude, bearing, etc.
- Application context -- App version and build
- Screen context -- Screen details associated with mobile event

By default these are **all disabled** in the mobile package. Assuming you have the enrichments turned on in your Snowplow pipeline, to enable the contexts within the package please modify the following in your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__enable_mobile_context: true
    snowplow__enable_geolocation_context: true
    snowplow__enable_application_context: true
    snowplow__enable_screen_context: true
```

#### 4. Enable desired modules

The mobile package has the option to join in data from the following 1 Snowplow module:

- App Errors module -- Details relating to app errors that occur during sessions

By default this module is **disabled** in the mobile package. Assuming you have the enrichments turned on in your Snowplow pipeline, to enable the module within the package please modify the following in your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__enable_app_errors_module: true
```

#### 5. Filter your data set

You can specify both `start_date` at which to start processing events and the `app_id`'s to filter for. By default the `start_date` is set to `2020-01-01` and all `app_id`'s are selected. To change this please add/modify the following in your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
```
#### 6. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__derived_tstamp_partitioned: false
```

:::

:::info Databricks only - setting the databricks_catalog

Add the following variable to your dbt project's `dbt_project.yml` file

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__databricks_catalog: 'hive_metastore'
```
Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to 'hive_metastore') or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). This is needed to handle the database property within m`odels/base/src_base.yml`.

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](./index.md#unity-catalog-support).**

:::

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

#### 1. Adding the `selector.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](./index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-media-player/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

#### 2. Configuring the web model (in case it has not been run before)

Please refer to the `Quick Start` guide for the Snowplow Web package to make sure you configure the web model appropriately. (e.g. checking the source data or enabling desired contexts).

One thing to highlight here: as the package is built onto the snowplow_incremental_materialization logic provided by the web package, please leave the `snowplow__incremental_materialization` variable as is with the default `snowplow_incremental` value.

#### 3. Enable desired contexts

If you have enabled a specific context you will need to enable it in your `dbt_project.yml` file:

```yaml
 dbt_project.yml
...
vars:
  snowplow_media_player:
    # set to true if the YouTube context schema is enabled
    snowplow__enable_youtube: true
    # set to true if the HTML5 media element context schema is enabled
    snowplow__enable_whatwg_media: true
    # set to true if the HTML5 video element context schema is enabled
    snowplow__enable_whatwg_video: true
```

For other variables you can configure please see the [model configuration](./index.md#model-configuration) section.

</TabItem>
</Tabs>

------

## Configuration
Each model has specific configuration variables, however some variables are applied across multiple packages and in some cases may have the same name. Ensure you provide the variable and/or configuration value for each package you are using by defining them in the scope of the package. 

### Output Schemas
By default all scratch/staging tables will be created in the `<target.schema>_scratch` schema, the derived tables ( e.g. `snowplow_web_page_views`, `snowplow_web_sessions`, `snowplow_web_users`) will be created in `<target.schema>_derived` and all manifest tables in `<target.schema>_snowplow_manifest`. Some of these schemas are only used by specific packages, ensure you add the correct configurations for each packages you are using. To change, please add the following to your `dbt_project.yml` file:

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

### Disabling a standard module

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

### Model Configuration

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
### Postgres Only

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



## Operation

:::info
Due to its unique relationship with the web package, the media player package operates in a different way. More information can be found on the [media player package page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-media-player-data-model/index.md).

:::

The Snowplow models are designed to be run as a whole, which ensures all incremental tables are kept in sync. As such, run the model using:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt run --select snowplow_web tag:snowplow_web_incremental
```
The `snowplow_web` selection will execute all nodes within the relevant Snowplow package, while the `tag:snowplow_web_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the [YAML selectors](./index.md#yaml-selectors) we have provided. The equivalent command using the selector flag would be:

```bash
dbt run --selector snowplow_web
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt run --select snowplow_mobile tag:snowplow_mobile_incremental
```

The `snowplow_mobile` selection will execute all nodes within the Snowplow mobile package, while the `tag:snowplow_mobile_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the [YAML selectors](./index.md#yaml-selectors) we have provided. The equivalent command using the selector flag would be:

```bash
dbt run --selector snowplow_mobile
```

</TabItem>
</Tabs>

------

### YAML Selectors

Within the packages we have provided a suite of suggested selectors to run and test the models within the packages. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax).

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

- `snowplow_web`: Recommended way to run the package. This selection includes all models within the Snowplow Web as well as any custom models you have created.
- `snowplow_web_lean_tests`: Recommended way to test the models within the package. See the testing section for more details.

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

- `snowplow_mobile`: Recommended way to run the package. This selection includes all models within the Snowplow Mobile as well as any custom models you have created.
- `snowplow_mobile_lean_tests`: Recommended way to test the models within the package. See the testing section for more details.

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

- `snowplow_web`:  Recommended way to run the package. This selection includes all models within the Snowplow Web and Snowplow Media Player as well as any custom models you have created.
- `snowplow_web_lean_and_media_player_tests`: Recommended way to test the models within the package. See the testing section for more details.
- `snowplow_media_player_tests`: Runs all tests within the Snowplow Media Player Package and any custom models tagged with `snowplow_media_player`.
- `snowplow_web_and_media_player_tests`: Runs all tests within the Snowplow Web and Snowplow Media Player Package and any custom models tagged with `snowplow_media_player` or `snowplow_web_incremental`.

</TabItem>
</Tabs>

------

These are defined in each `selectors.yml` file within the packages, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

### Manifest Tables
<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

There are 3 manifest tables included in this package:

- `snowplow_web_incremental_manifest`: Records the current state of the package.
- `snowplow_web_base_sessions_lifecycle_manifest`: Records the start & end timestamp of all sessions.
- `snowplow_web_base_quarantined_sessions`: Records sessions that have exceeded the maximum allowed session length, defined by `snowplow__max_session_days` (default 3 days).


</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

There are 2 manifest tables included in this package:

- `snowplow_mobile_incremental_manifest`: Records the current state of the package.
- `snowplow_mobile_base_sessions_lifecycle_manifest`: Records the start & end timestamp of all sessions.

</TabItem>
</Tabs>

------

Please refer to the [Incremental Logic](./index.md#incremental-logic) section more details on the purpose of each of these tables.

These manifest models are critical to the package **and as such are protected from full refreshes, i.e. being dropped, by default when running in production, while in development refreshes are allowed.**

The `allow_refresh()` macro defines this behavior. As [dbt recommends](https://docs.getdbt.com/faqs/target-names), target names are used here to differentiate between your prod and dev environment. By default, this macro assumes your dev target is named `dev`. This can be changed by setting the `snowplow__dev_target_name` var in your `dbt_project.yml` file.

To full refresh any of the manifest models in production, set the `snowplow__allow_refresh` to `true` at run time (see below).

Alternatively, you can amend the behavior of this macro entirely by overwriting it. See the [Overwriting Macros](./index.md#overriding-macros) section for more details.

### Complete refresh of Snowplow package

While you can drop and recompute the incremental tables within this package using the standard `--full-refresh` flag, as mentioned above all manifest tables are protected from being dropped in production. Without dropping the manifest during a full refresh, the selected derived incremental tables would be dropped but the processing of events would resume from where the package left off (as captured by the `snowplow_web_incremental_manifest` table) rather than your `snowplow__start_date`.

In order to drop all the manifest tables and start again set the `snowplow__allow_refresh` var to `true` at run time:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt run --select snowplow_web tag:snowplow_web_incremental --full-refresh --vars 'snowplow__allow_refresh: true'
# or using selector flag
dbt run --selector snowplow_web --full-refresh --vars 'snowplow__allow_refresh: true'
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt run --select snowplow_mobile tag:snowplow_mobile_incremental --full-refresh --vars 'snowplow__allow_refresh: true'
# or using selector flag
dbt run --selector snowplow_mobile --full-refresh --vars 'snowplow__allow_refresh: true'
```

</TabItem>
</Tabs>

------

### Back-filling custom modules

Overtime you may wish to add custom modules to extend the functionality of this package. As you introduce new custom modules into your project, assuming they are tagged correctly (see page on [custom modules](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md)), the web and mobile models will automatically replay all events up until the latest event to have been processed by the other modules.

Note that the batch size of this back-fill is limited as outlined in the [identification of events to process](./index.md#identification-of-events-to-process) section. This means it might take several runs to complete the back-fill, **during which time no new events will be processed by the main model**.

During back-filling, the derived page/screen views, sessions and users tables are blocked from updating. This is to protect against a batched back-fill temporarily introducing incomplete data into these derived tables.

Back-filling a module can be performed either as part of the entire run of the Snowplow package, or in isolation to reduce cost (recommended):

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt run --select snowplow_web tag:snowplow_web_incremental # Will execute all Snowplow web modules, as well as custom.
dbt run --select +my_custom_module # Will execute only your custom module + any upstream nodes.
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt run --select snowplow_mobile tag:snowplow_mobile_incremental # Will execute all Snowplow mobile modules, as well as custom.
dbt run --select +my_custom_module # Will execute only your custom module + any upstream nodes.
```

</TabItem>
</Tabs>

------

### Tearing down a subset of models

As the code base for your custom modules evolves, you will likely need to replay events through a given module. In order to do so, you first need to manually drop the models within your custom module from your database. Then these models need to be removed from the incremental manifest table. See the [Complete refresh](./index.md#complete-refresh-of-snowplow-package) section for an explanation as to why. This removal can be achieved by passing the model's name to the `models_to_remove` var at run time. If you want to replay events through a series of dependent models, you only need to pass the name of the endmost model within the run:


<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt run --select +snowplow_web_custom_incremental_model --vars '{snowplow__start_date: your_backfill_start_date, models_to_remove: snowplow_web_custom_incremental_model}'
```

By removing the `snowplow_web_custom_incremental_model` model from the manifest the web packages will be in state 2 (see the section on [incremental logic](./index.md#incremental-logic)) and will replay all events.

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt run --select +snowplow_mobile_custom_incremental_model --full-refresh --vars 'models_to_remove: snowplow_mobile_custom_incremental_model'
```

By removing the `snowplow_mobile_custom_incremental_model` model from the manifest the mobile packages will be in state 2 and will replay all events.

</TabItem>
</Tabs>

------




## Tests

The packages contains tests for both the scratch and derived models. Depending on your use case you might not want to run all tests in production, for example to save costs. There are several tags included in the packages to help select subsets of tests. Tags:

- `this_run`: Any model with the `_this_run` suffix
- `scratch`: Any model in the scratch sub directories.
- `derived`: Any of the derived models i.e. page views, sessions and users.
- `primary-key`: Any test on the primary keys of all models in this package.

For example if your derived tables are very large you may want to run the full test suite on the `this_run` tables, which act as the input for the derived tables, but only primary key schema tests on the derived tables to ensure no duplicates. If using such a set up, we would also recommend including the `page/screen_view_in_session_value` data test for the page/screen views derived tables. For Media Player tests depending on the selector chosen it will include the web tests as well as the bespoke media tests.

This is our recommended approach to testing and can be implemented using the selector flag (see [YAML selectors](./index.md#yaml-selectors) section for more details) as follows:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt test --selector snowplow_web_lean_tests
```

This is equivalent to:

```bash
dbt test --select snowplow_web,tag:this_run # Full tests on _this_run models
dbt test --select snowplow_web,tag:manifest # Full tests on manifest models
dbt test --select snowplow_web,tag:primary-key,tag:derived # Primary key tests only on derived tables.
dbt test --select snowplow_web,tag:derived,test_type:data  # Include the page_view_in_session_value data test
```

Alternatively, if you wanted to run all available tests in both the Snowplow web package and your custom modules:

```bash
dbt test --selector snowplow_web
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt test --selector snowplow_mobile_lean_tests
```

This is equivalent to:

```bash
dbt test --select snowplow_mobile,tag:this_run # Full tests on _this_run models
dbt test --select snowplow_mobile,tag:manifest # Full tests on manifest models
dbt test --select snowplow_mobile,tag:primary-key,tag:derived # Primary key tests only on derived tables.
dbt test --select snowplow_mobile,tag:derived,test_type:data  # Include the screen_view_in_session_values data test
```

Alternatively, if you wanted to run all available tests in both the Snowplow web package and your custom modules:

```bash
dbt test --selector snowplow_mobile
```

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

```bash
dbt test --selector snowplow_web_lean_and_media_player_tests
```

This is equivalent to running the lean tests on the web-model as well as all media_player tests and any tests on any custom models tagged `snowplow_media_player`.

Alternatively, if you wanted to run all available tests in both the Snowplow Web and Media Player package (plus any tests on any custom models tagged `snowplow_media_player`):

```bash
dbt test --selector snowplow_media_player_tests
```

</TabItem>
</Tabs>

------



## Incremental Logic

The general principle behind an incremental model is to identify new events/rows since the previous run of the model, and then only process these new events. This minimizes cost and reduces run times.

For mobile and web event data we typically consider a session to be a complete 'visit' and as such calculate metrics across the entire session. This means that when we have a new event for a previously processed session, we have to reprocess all historic events for that session as well as the new events. The logic followed is:

1. Identify new events since the previous run of the package.
2. Identify the `session_id` associated with the new events.
3. Look back over the events table to find all events associated with these `sessions_id`.
4. Run all these events through the page/screen views, sessions and users modules.

Given the large nature of event tables, Step 3 can be an expensive operation. To minimize cost ideally we want to:

- Know when any given session started. This would allow us to limit scans on the events table when looking back for previous events.
  - This is achieved by the `snowplow_web/mobile_base_sessions_lifecycle_manifest` model, which records the start and end timestamp of all sessions.
- Limit the maximum allowed session length. Sessions generated by bots can persist for years. This would mean scanning years of data every run of the package.
  - For the web package this is achieved by the `snowplow_web_base_quarantined_sessions` model, which stores the `session_id` of any sessions that have exceeded the max allowed session length (`snowplow__max_session_days`). For such sessions, all events are processed up until the max allowed length. Moving forward, no more data is processed for that session. This is not required for mobile.

### The Incremental Manifest

The web and mobile packages use centralized manifest tables, `snowplow_web/mobile_incremental_manifest`, to record what events have already been processed and by which model/node. This allows for easy identification of what events to process in subsequent runs of the package. The manifest table is updated as part of an `on-run-end` hook, which calls the `snowplow_incremental_post_hook()` macro.

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

Example `snowplow_web_incremental_manifest`:

| model                            | last_success |
|----------------------------------|--------------|
| snowplow_web_page_views_this_run | '2021-06-03' |
| snowplow_web_page_views          | '2021-06-03' |
| snowplow_web_sessions            | '2021-06-02' |

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

Example `snowplow_mobile_incremental_manifest`:

| model                                 | last_success |
| ------------------------------------- | ------------ |
| snowplow_mobile_screen_views_this_run | '2021-06-03' |
| snowplow_mobile_screen_views          | '2021-06-03' |
| snowplow_mobile_sessions              | '2021-06-02' |

</TabItem>
</Tabs>

------
### Identification of events to process

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

The identification of which events to process is performed by the `get_run_limits` macro which is called in the `snowplow_web_base_new_event_limits` model. This macro uses the metadata recorded in `snowplow_web_incremental_manifest` to determine the correct events to process next based on the current state of the Snowplow dbt Web model. The selection of these events is done by specifying a range of `collector_tstamp`'s to process, between `lower_limit` and `upper_limit`. The calculation of these limits is as follows.


First we query `snowplow_web_incremental_manifest`, filtering for all enabled models tagged with `snowplow_web_incremental` within your dbt project:

```sql
select 
    min(last_success) as min_last_success,
    max(last_success) as max_last_success,
    coalesce(count(*), 0) as models
from snowplow_web_incremental_manifest
where model in (array_of_snowplow_tagged_enabled_models)
```
</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

The identification of which events to process is performed by the `get_run_limits` macro which is called in the `snowplow_mobile_base_new_event_limits` model. This macro uses the metadata recorded in `snowplow_mobile_incremental_manifest` to determine the correct events to process next based on the current state of the Snowplow dbt Mobile model. The selection of these events is done by specifying a range of `collector_tstamp`'s to process, between `lower_limit` and `upper_limit`. The calculation of these limits is as follows.

First we query `snowplow_mobile_incremental_manifest`, filtering for all enabled models tagged with `snowplow_mobile_incremental` within your dbt project:

```sql
select 
    min(last_success) as min_last_success,
    max(last_success) as max_last_success,
    coalesce(count(*), 0) as models
from snowplow_mobile_incremental_manifest
where model in (array_of_snowplow_tagged_enabled_models)
```

</TabItem>
</Tabs>

------

Based on the results the web model enters 1 of 4 states:

:::tip

In all states the `upper_limit` is limited by the `snowplow__backfill_limit_days` variable. This protects against back-fills with many rows causing very long run times.

:::
#### State 1: First run of the package

The query returns `models = 0` indicating that no models exist in the manifest.

**`lower_limit`**: `snowplow__start_date`  
**`upper_limit`**: `least(current_tstamp, snowplow__start_date + snowplow__backfill_limit_days)`

#### State 2: New model introduced

`models < size(array_of_snowplow_tagged_enabled_models)` and therefore a new model, tagged with `snowplow_web_incremental`, has been added since the last run. The package will replay all previously processed events in order to back-fill the new model.

**`lower_limit`**: `snowplow__start_date`  
**`upper_limit`**: `least(max_last_success, snowplow__start_date + snowplow__backfill_limit_days)`

#### State 3: Models out of sync

`min_last_success < max_last_success` and therefore the tagged models are out of sync, for example due to a particular model failing to execute successfully during the previous run. The package will attempt to sync all models.

**`lower_limit`**: `min_last_success - snowplow__lookback_window_hours`  
**`upper_limit`**: `least(max_last_success, min_last_success + snowplow__backfill_limit_days)`

#### State 4: Standard run

If none of the above criteria are met, then we consider it a 'standard run' and we carry on from the last processed event.

**`lower_limit`**: `max_last_success - snowplow__lookback_window_hours`  
**`upper_limit`**: `least(current_tstamp, max_last_success + snowplow__backfill_limit_days)`


#### How to identify the current state

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

If you want to check the current state of the web model, run the `snowplow_web_base_new_event_limits` model. This will log the current state to the CLI while causing no disruption to the incremental processing of events.

```bash
dbt run --select snowplow_web_base_new_event_limits
...
00:26:28 | 1 of 1 START table model scratch.snowplow_web_base_new_event_limits.. [RUN]
00:26:29 + Snowplow: Standard incremental run
00:26:29 + Snowplow: Processing data between 2021-01-05 17:59:32 and 2021-01-07 23:59:32
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

If you want to check the current state of the mobile model, run the `snowplow_mobile_base_new_event_limits` model. This will log the current state to the CLI while causing no disruption to the incremental processing of events.

```bash
dbt run --select snowplow_mobile_base_new_event_limits
...
00:26:28 | 1 of 1 START table model scratch.snowplow_mobile_base_new_event_limits.. [RUN]
00:26:29 + Snowplow: Standard incremental run
00:26:29 + Snowplow: Processing data between 2021-01-05 17:59:32 and 2021-01-07 23:59:32
```

</TabItem>
</Tabs>

------


## Incremental Materialization

This package makes use of the `snowplow_incremental` materialization from the `snowplow_utils` package for the incremental models. This builds upon the out-of-the-box incremental materialization provided by dbt. Its key advantage is that it limits table scans on the target table when updating/inserting based on the new data. This improves performance and reduces cost.

As is the case with the native incremental materialization, the strategy varies between adapters.

Please refer to the [snowplow-utils](https://github.com/snowplow/dbt-snowplow-utils) docs for the full documentation on `snowplow_incremental` materialization.

#### Usage Notes

- If using this the `snowplow_incremental` materialization, the native dbt `is_incremental()` macro will not recognize the model as incremental. Please use the `snowplow_utils.snowplow_is_incremental()` macro instead, which operates in the same way.
- If you would rather use an alternative incremental materialization for all incremental models within the package, set the variable `snowplow__incremental_materialization` to your preferred materialization. See the [Configuration](./index.md#configuration) section for more details.

## Duplicates

The web and mobile packages performs de-duplication on both `event_id`'s and `page/screen_view_id`'s, in the base and page/screen views modules respectively. The de-duplication method for Redshift & Postgres is different to BigQuery, Snowflake, & Databricks due to their federated table design. The key difference between the two methodologies is that for Redshift and Postgres an `event_id` may be removed entirely during de-duplication, where as for BigQuery & Snowflake we keep all `event_id`'s. See below for a detailed explanation.

#### Redshift & Postgres
Using `event_id` de-duplication as an example, for duplicates we:

- Keep the first row per `event_id` ordered by `collector_tstamp` i.e. the earliest occurring row.
- If there are multiple rows with the same `collector_tstamp`, *we discard the event all together*. This is done to avoid 1:many joins when joining on context tables such as the page view context.

The same methodology is applied to `page/screen_view_id`s, however we order by `derived_tstamp`.

#### BigQuery, Snowflake, & Databricks

Using `event_id` de-duplication as an example, for duplicates we:

- Keep the first row per `event_id` ordered by `collector_tstamp` i.e. the earliest occurring row.

The same methodology is applied to `page/screen_view_id`s, however we order by `derived_tstamp`.

## User Mapping

The web and mobile packages contains a User Mapping module that aims to link user identifiers, namely `domain_userid`/`device_user_id` to `user_id`. The logic is to take the latest `user_id` per `domain_userid`/`device_user_id`.

The `domain_userid`/`device_user_id` is cookie/device based and therefore expires/changes over time, where as `user_id` is typically populated when a user logs in with your own internal identifier (dependent on your tracking implementation).

This mapping is applied to the sessions table by a post-hook which updates the `stitched_user_id` column with the latest mapping. If no mapping is present, the default value for `stitched_user_id`  is the `domain_userid`/`device_user_id`. This process is known as session stitching, and effectively allows you to attribute logged-in and non-logged-in sessions back to a single user.

If required, this update operation can be disabled by setting in your `dbt_project.yml` file (selecting one of web/mobile, or both, as appropriate):

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__session_stitching: false
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__session_stitching: false
```

</TabItem>
</Tabs>

------

User mapping is typically not a 'one size fits all' exercise. Depending on your tracking implementation, business needs and desired level of sophistication you may want to write bespoke logic. Please refer to this [blog post](https://snowplow.io/blog/developing-a-single-customer-view-with-snowplow/) for ideas.


## Databricks Specific Information


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


## Advanced Usage

### Asynchronous Runs

You may wish to run the modules asynchronously, for instance run the screen views module hourly but the sessions and users modules daily. You would assume this could be achieved using e.g.:

```bash
dbt run --select +snowplow_mobile.screen_views
```

Currently however it is not possible during a dbt jobs start phase to deduce exactly what models are due to be executed from such a command. This means the package is unable to select the subset of models from the manifest. Instead all models from the standard and custom modules are selected from the manifest and the package will attempt to synchronize all models. This makes the above command unsuitable for asynchronous runs.

However we can leverage dbt's `ls` command in conjunction with shell substitution to explicitly state what models to run, allowing a subset of models to be selected from the manifest and thus run independently.

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

To run just the page views module asynchronously:

```bash
dbt run --select +snowplow_web.page_views --vars "{'models_to_run': '$(dbt ls --m  +snowplow_web.page_views --output name)'}"
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

To run just the screen views module asynchronously:

```bash
dbt run --model +snowplow_mobile.screen_views --vars "{'models_to_run': '$(dbt ls --m  +snowplow_mobile.screen_views --output name)'}"
```

</TabItem>
</Tabs>

------
### Cluster Keys

All the incremental models in the Snowplow packages have recommended cluster keys applied to them. Depending on your specific use case, you may want to change or disable these all together. This can be achieved by overriding the following macros with your own version within your project:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

- `web_cluster_by_fields_sessions_lifecycle()`
- `web_cluster_by_fields_page_views()`
- `web_cluster_by_fields_sessions()`
- `web_cluster_by_fields_users()`


</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

- `mobile_cluster_by_fields_sessions_lifecycle()`
- `mobile_cluster_by_fields_screen_views()`
- `mobile_cluster_by_fields_sessions()`
- `mobile_cluster_by_fields_users()`

</TabItem>

</Tabs>

------

### Overriding Macros

Both the cluster key macros (see above) and the `allow_refresh()` macro can be overridden. These are both [dispatched macros](https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch) and can be overridden by creating your own version of the macro and setting a project level dispatch config. More details can be found in [dbt's docs](https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch#overriding-package-macros).



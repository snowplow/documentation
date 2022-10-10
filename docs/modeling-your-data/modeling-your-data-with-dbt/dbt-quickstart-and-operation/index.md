---
title: "Quickstart and Operation"
date: "2022-10-05"
sidebar_position: 100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Quickstart

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

#### 1. Adding the `selector.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](#yaml-selectors) section.

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

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#unity-catalog-support).**

:::

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

#### 1. Adding the `selector.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](#yaml-selectors) section.

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

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#unity-catalog-support).**

:::

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

#### 1. Adding the `selector.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](#yaml-selectors) section.

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

For other variables you can configure please see the [model configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#model-configuration) section.

</TabItem>
</Tabs>

------

## Operation

:::info
Due to its unique relationship with the web package, the media player package operates in a different way. More information can be found on the [media player package section](#media-player-package).

:::

The Snowplow models are designed to be run as a whole, which ensures all incremental tables are kept in sync. As such, run the model using:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt run --select snowplow_web tag:snowplow_web_incremental
```
The `snowplow_web` selection will execute all nodes within the relevant Snowplow package, while the `tag:snowplow_web_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the [YAML selectors](#yaml-selectors) we have provided. The equivalent command using the selector flag would be:

```bash
dbt run --selector snowplow_web
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt run --select snowplow_mobile tag:snowplow_mobile_incremental
```

The `snowplow_mobile` selection will execute all nodes within the Snowplow mobile package, while the `tag:snowplow_mobile_incremental` will execute all custom modules that you may have created.

Given the verbose nature of this command we suggest using the [YAML selectors](#yaml-selectors) we have provided. The equivalent command using the selector flag would be:

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

Please refer to the [Incremental Logic](#incremental-logic) section more details on the purpose of each of these tables.

These manifest models are critical to the package **and as such are protected from full refreshes, i.e. being dropped, by default when running in production, while in development refreshes are allowed.**

The `allow_refresh()` macro defines this behavior. As [dbt recommends](https://docs.getdbt.com/faqs/target-names), target names are used here to differentiate between your prod and dev environment. By default, this macro assumes your dev target is named `dev`. This can be changed by setting the `snowplow__dev_target_name` var in your `dbt_project.yml` file.

To full refresh any of the manifest models in production, set the `snowplow__allow_refresh` to `true` at run time (see below).

Alternatively, you can amend the behavior of this macro entirely by overwriting it. See the [Overwriting Macros](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/index.md#overriding-macros) section for more details.

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

### Media Player Package

Due to its unique relationship with the web package, in order to operate the media player package together with the web model there are several considerations to keep in mind. Depending on the use case one of the following scenarios may happen:

1. The web package is already being used and the media tracking package needs to be added at a later time.
2. The web package has not been used but it needs to be run together with the media player package.
3. Only the media player package needs to be run.
------
#### 1. Adding the media player data model to an existing dbt project with web model data already running

Supposing there are months of data being collected using the web package and media tracking is introduced at that later stage there is no need to fully reprocess the web data from the date media tracking was deployed.

As models from both packages need to be run in sync, first the backfilling of the models from the new package needs to happen. Please note that during backfill no new web data is allowed to be processed and depending on the `snowplow_backfill_limit_days` configured and the period that needs backfilling it can take a while for all models to sync up and new web events to be processed.

To begin the synching process please run the following script:

```bash
dbt run -m snowplow_web.base snowplow_media_player --vars 'snowplow__start_date: <date_when_media_player_tracking_starts>'
```
This way only the base module is reprocessed which is used as one of the main sources for the media player package. The web model's update logic should recognize the new media player models (as all are tagged with `snowplow_web_incremental`) and backfilling should start between the date you defined within `snowplow_start_date` and the upper limit defined by the variable `snowplow_backfill_limit_days` that is set for the web model.

```bash
Snowplow: New Snowplow incremental model. Backfilling
```

 You can overwrite this limit for this backfilling process temporarily while it lasts, if needed:

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__backfill_limit_days: 1
```

After this you should be able to see all media_player models added to the `derived.snowplow_web_incremental_manifest` table. Any subsequent run from this point onwards could be carried out using the recommended web model running method - using the snowplow_web selector - which automatically adds all media_models as they are within the project directory and are all tagged with `snowplow_web_incremental`.

```bash
dbt run --selector snowplow_web
```
As soon as backfilling finishes, running the model results in both the web and the media player models being updated during the same run for the same period, both using the same latest set of data from the `_base_events_this_run` table.

#### 2. Starting both the media and web model from scratch

The easiest implementation out of the three scenarios. As the `snowplow_web_incremental_manifest` table is new, all models from both packages (plus any custom modules tagged with `snowplow_web_incremental`) will be processed using the recommended web model running method - using the snowplow_web selector without any extra step.

```bash
dbt run --selector snowplow_web
```

#### 3. Only running the media player package from the same dbt project

Although the media player package is not designed for standalone usage, there can be scenarios where only the media player models are targeted for the update, not the web model. In such case the web model still has to be configured with the main difference that all modules that the media player model does not rely on need to be disabled. It is essentially only the base model that is needed, so please disable all the rest like so:

```yml
# dbt_project.yml
...
models:
  snowplow_web:
    page_views:
      enabled: false
    sessions:
      enabled: false
    user_mapping:
      enabled: false
    users:
      enabled: false
```
Running it, however can still be achieved by running the selector as defined in the web model. In order for it to work, you can copy the selectors.yml file ([source](https://github.com/snowplow/dbt-snowplow-media-player/blob/main/selectors.yml)) from the package to your dbt project's main directory.

```bash
dbt run --selector snowplow_web
```

After the run finishes, you should only see the media player related models to be present within the snowplow_web_incremental_manifest table.



---
title: "Quick Start"
date: "2022-10-05"
sidebar_position: 200
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

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
- Mobile session context enabled ([ios](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/index.md#session-context) or  [android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/index.md#session-tracking)).
- Screen view events enabled ([ios](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/index.md#tracking-features) or [android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/index.md#tracking-features)). 


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

## Setup

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
:::info Databricks only 

Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::

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

#### 7. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_web
```

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

:::info Databricks only 

Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::
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
Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to 'hive_metastore') or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). This is needed to handle the database property within `models/base/src_base.yml`.

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#unity-catalog-support).**

:::

#### 7. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_web
```


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

#### 4. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_web
```



</TabItem>
</Tabs>



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
<TabItem value="normalize" label="Snowplow Normalize">

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed:

- Python 3.7 or later

</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web events dataset being available in your database:

- A dataset of e-commerce web events from the [Snowplow JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/index.md) must be available in the database.
- Have the [`webPage` context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/index.md#adding-predefined-contexts) enabled.
- Have the following e-commerce contexts enabled: `cart`, `checkout_step`, `page` `transaction`, `user`
- Track the e-commerce tracking action events on your website

</TabItem>
<TabItem value="fractribution" label="Snowplow Fractribution">

 In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a web events dataset being available in your database:

 - have `snowplow_web_page_views` derived table available as a source (generated by the [snowplow_web package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md))
 - have a table with revenue data by users (`domain_userid`, `user_id`) that serves as another source for the fractribution calculations, you can choose either of the following options:
     - your `atomic.events` table with any [self-describing event](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/#self-describing-events) that captures revenue data
     - the `snowplow_ecommerce_transaction_interactions` derived table generated by the [snowplow_ecommerce](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) package
     - any custom incremental table that is built on top of the `snowplow_web` model that results in an aggregated revenue dataset

</TabItem>
</Tabs>


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

- [IAB enrichment](/docs/enriching-your-data/available-enrichments/iab-enrichment/index.md)
- [UA Parser enrichment](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA enrichment](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md)

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

The web package processes page ping events to calculate web page engagement times. If your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#activity-tracking-page-pings) for `min_visit_length` (default 5) and `heartbeat` (default 10) differs from the defaults provided in this package, you can override by adding to your `dbt_project.yml`:

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

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the mobile model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](#yaml-selectors) section.

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
  snowplow_mobile:
    snowplow__databricks_catalog: 'hive_metastore'
```
Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to 'hive_metastore') or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). This is needed to handle the database property within `models/base/src_base.yml`.

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#unity-catalog-support).**

:::

#### 7. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_mobile
```

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

If you are not starting the media player package at the same time as the web package, see the [media player package operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md#operating-with-the-web-package) for how to best sync them.

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
<TabItem value="normalize" label="Snowplow Normalize" default>

#### 1. Adding the `selector.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-normalize/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

#### 2. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile). In order to change this, please add the following to your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_normalize:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
```
:::info Databricks only
Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::

#### 3. Filter your data set

You can specify both `start_date` at which to start processing events and the `app_id`'s to filter for. By default the `start_date` is set to `2020-01-01` and all `app_id`'s are selected. To change this please add the following to your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_normalize:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
```


#### 4. Install additional python packages

The script only requires 2 additional packages (`jsonschema` and `requests`) that are not built into python by default, you can install these by running the below command, or by installing them by your preferred method.

```bash
pip install -r dbt_packages/snowplow_normalize/utils/requirements.txt
```

#### 5. Setup the generator configuration file

You can use the example provided in `utils/example_normalize_config.json` to start your configuration file to specify which events, self-describing events, and contexts you wish to include in each table. For more information on this file see the [normalize package docs](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-normalize-data-model/index.md).

#### 6. Setup your resolver connection file *(optional)*

If you are not using iglu central as your only iglu registry then you will need to set up an [iglu resolver](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) file and point to this in your generator config.

#### 7. Generate your models

At the root of your dbt project, running `python dbt_packages/snowplow_normalize/utils/snowplow_normalize_model_gen.py path/to/your/config.json`  will generate all models specified in your configuration.

#### 8. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml
# dbt_project.yml
...
vars:
  snowplow_normalize:
    snowplow__derived_tstamp_partitioned: false
```
:::

:::info Databricks only - setting the databricks_catalog

Add the following variable to your dbt project's `dbt_project.yml` file

```yml
# dbt_project.yml
...
vars:
  snowplow_normalize:
    snowplow__databricks_catalog: 'hive_metastore'
```
Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to 'hive_metastore') or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). This is needed to handle the database property within `models/base/src_base.yml`.

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#unity-catalog-support).**

:::


#### 9. Run your model(s)

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_normalize
```

</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

#### 1. Adding the `selector.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the e-commerce model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/selectors.yml)) within the package, however in order to use these selectors you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

#### 2. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile), in the table labeled `events`. In order to change this, please add the following to your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_ecommerce:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
    snowplow__events_table: table_of_snowplow_events
```

:::info Databricks only

Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::

#### 3. Filter your data set

You can specify both `start_date` at which to start processing events, the `app_id`'s to filter for, and the `event_name` value to filter on. By default the `start_date` is set to `2020-01-01`, all `app_id`'s are selected, and only the `snowplow_ecommerce_action` name is being surfaced. To change this please add/modify the following in your `dbt_project.yml` file:

```yml
# dbt_project.yml
...
vars:
  snowplow_ecommerce:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
    snowplow__ecommerce_event_names: ['snowplow_ecommerce_action', 'my_custom_ecommerce_event']
```
#### 4. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml
# dbt_project.yml
...
vars:
  snowplow_ecommerce:
    snowplow__derived_tstamp_partitioned: false
```

:::

#### 5. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_ecommerce
```

</TabItem>
<TabItem value="fractribution" label="Snowplow Fractribution">


 #### 1. Overwrite variable defaults (where necessary)

- `conversion_window_start_date`: The start date in UTC for the window of conversions to include
- `conversion_window_end_date`: The end date in UTC for the window of conversions to include
- `conversion_hosts`: `url_hosts` to consider
- `path_lookback_steps`: The limit for the number of marketing channels to look at before the conversion (default is 0 = unlimited)
- `path_lookback_days`: Restrict the model to marketing channels within this many days of the conversion (values of 30, 14 or 7 are recommended)
- `path_transforms`: An array of path transforms and their arguments (see [Path Transform Options](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-fractribution-data-model/index.md#path-transform-options) section)
- `consider_intrasession_channels`: Boolean. If `false`, only considers the channel at the start of the session (i.e. first page view). If `true`, considers multiple channels in the conversion session as well as historically.
- `page_views_source`: The source (schema and table) of the derived `snowplow_web_page_views` table. Defaulted to `derived.snowplow_web_page_views`.
- `conversions_source`: The source (schema and table) of the conversion event data. Defaulted to `atomic.events`.

#### 2. Configure macros

##### Configure the conversion_clause macro

 The `conversion_clause` specifies how to filter Snowplow events to only conversion events. How this is filtered will depend on your definition of a conversion. The default is filtering to events where `tr_total > 0`, but this could instead filter on `event_name = 'checkout'`, for example. If you are using the e-commerce model, you will still need to set this for the fractribution code to run (even though all events are conversions in the e-commerce model), in this case change it to `transaction_revenue > 0`.

 If you wish to change this filter, copy the `conversion_clause.sql` file from the macros folder in the `snowplow_fractribution` package (at `[dbt_project_name]/dbt_packages/snowplow_fractribution/macros/conversion_clause.sql`) and add it to the macros folder of your own dbt project. Update the filter and save the file.

##### Configure the conversion_value macro

 The `conversion_value` macro specifies either a single column or a calculated value that represents the value associated with that conversion. The default is `tr_total`, but revenue or a calculation using revenue and discount_amount from the default e-commerce schema, for example, could similarly be used.

 If you wish to change this value, copy the `conversion_value.sql` file from the macros folder in the snowplow_fractribution package (at `[dbt_project_name]/dbt_packages/snowplow_fractribution/macros/conversion_value.sql`) and add it to the macros folder of your own dbt project. Update the value and save the file.

##### Configure the default channel_classification macro

 The `channel_classification` macro is used to perform channel classifications. This can be altered to generate your expected channels if they differ from the channels generated in the default macro. It is highly recommended that you examine and configure this macro when using your own data, as the default values will not consider any custom marketing parameters.

 If you wish to change the channel classification macro, copy the `channel_classification.sql` file from the macros folder in the snowplow_fractribution package (at `[dbt_project_name]/dbt_packages/snowplow_fractribution/macros/channel_classification.sql`) and add it to the macros folder of your own dbt project. Update the SQL and save the file.

 ##### Configure the channel_spend macro

 The `channel_spend` macro is used to query the spend by channels. It requires a user supplied SQL script to extract the total ad spend by channel.

 Required output schema:
 - channel: STRING NOT NULL
 - spend: FLOAT64 (Use the same monetary units as conversion revenue, and NULL if unknown.)

If you wish to change the channel classification macro, copy the `channel_spend.sql` file from the macros folder in the snowplow_fractribution package (at `[dbt_project_name]/dbt_packages/snowplow_fractribution/macros/channel_spend.sql`) and add it to the macros folder of your own dbt project. Update the SQL and save the file.

 #### 3. Run the model

 Execute the following either through your CLI, within dbt Cloud, or within [Snowplow BDP](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/dbt/using-dbt/index.md)

 ```yml
 dbt run --select snowplow_fractribution
 ```
 #### 4. Run the python script to generate the final models

Python scripts and `requirements.txt` can be found at `[dbt_project_name]/dbt_packages/snowplow_fractribution/utils/`. To run the fractribution script locally in Python, we recommend using a virtual environment.

Snowpark requires Python 3.8. To use conda:

```
conda create --name fractribution_env -c https://repo.anaconda.com/pkgs/snowflake python=3.8 absl-py
conda activate fractribution_env
```
***

**M1 Instructions**

:::caution
There is an issue with running Snowpark on M1 chips. A workaround recommended by Snowflake is to set up a virtual environment that uses x86 Python:

```
CONDA_SUBDIR=osx-64 conda create -n fractribution_env python=3.8 absl-py -c https://repo.anaconda.com/pkgs/snowflake
conda activate fractribution_env
conda config --env --set subdir osx-64
```
:::
***

Install snowpark in this environment (all computers):

```
conda install snowflake-snowpark-python
```

Set the connection parameters to your Snowflake warehouse on the command line:

```
export snowflake_account=my_account\
export snowflake_user=sf_user\
export snowflake_password=password\
export snowflake_user_role=special_role\
export snowflake_warehouse=warehouse_name\
export snowflake_database=database_name\
export snowflake_schema=schema_name
```
***

Run the fractribution script by specifying the conversion window start and end dates and the attribution model (if you are not using the default (`shapely`)). Example:

```
python main_snowplow_snowflake.py --conversion_window_start_date '2022-06-03' --conversion_window_end_date '2022-08-01' --attribution_model last_touch
```

The output of the fractribution analysis will be built into the schema specified in your connection parameters. There are three tables that will be created are:
- `snowplow_fractribution_report_table`: The main output table that shows conversions, revenue, spend and ROAS per channel.
- `snowplow_fractribution_channel_attribution`: The conversion and revenue attribution per channel (used to create the report table).
- `snowplow_fractribution_path_summary_with_channels`: An intermediate table that shows, for each unique path, a summary of conversions, non conversions and revenue, as well as which channels were assigned a contribution.

</TabItem>
</Tabs>

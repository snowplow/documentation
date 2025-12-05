---
sidebar_label: "Mobile"
sidebar_position: 800
title: "Mobile Quickstart"
---

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed and a mobile events dataset being available in your database, the requirements are:

- Snowplow [Android](/docs/sources/trackers/mobile-trackers/previous-versions/android-tracker/index.md) or [iOS](/docs/sources/trackers/mobile-trackers/previous-versions/objective-c-tracker/index.md) mobile tracker version 1.1.0 or later implemented.
- Mobile session context enabled ([ios](/docs/sources/trackers/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/index.md#session-context) or  [android](/docs/sources/trackers/mobile-trackers/previous-versions/android-tracker/android-1-7-0/index.md#session-tracking)).
- Screen view events enabled ([ios](/docs/sources/trackers/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/index.md#tracking-features) or [android](/docs/sources/trackers/mobile-trackers/previous-versions/android-tracker/android-1-7-0/index.md#tracking-features)).


## Installation

```mdx-code-block
import DbtPackageInstallation from "@site/docs/reusable/dbt-package-installation/_index.md"

<DbtPackageInstallation package='mobile' fullname='dbtSnowplowMobile'/>
```

## Setup

### 1. Override the dispatch order in your project
To take advantage of the optimized upsert that the Snowplow packages offer you need to ensure that certain macros are called from `snowplow_utils` first before `dbt-core`. This can be achieved by adding the following to the top level of your `dbt_project.yml` file:

```yml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

If you do not do this the package will still work, but the incremental upserts will become more costly over time.

### 2. Adding the `selectors.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the mobile model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-mobile/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

### 3. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile), in the table labeled `events`. In order to change this, please add the following to your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_mobile:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
    snowplow__events_table: table_of_snowplow_events
```

:::info Databricks only

Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::
### 4. Enabled desired contexts

The mobile package has the option to join in data from the following 4 Snowplow contexts:

- Mobile context -- Device type, OS, etc.
- Geolocation context -- Device latitude, longitude, bearing, etc.
- Application context -- App version and build
- Screen context -- Screen details associated with mobile event

By default these are **all disabled** in the mobile package. Assuming you have the enrichments turned on in your Snowplow pipeline, to enable the contexts within the package please modify the following in your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_mobile:
    snowplow__enable_mobile_context: true
    snowplow__enable_geolocation_context: true
    snowplow__enable_application_context: true
    snowplow__enable_screen_context: true
```

### 5. Enable desired modules

The mobile package has the option to join in data from the following 1 Snowplow module:

- App Errors module -- Details relating to app errors that occur during sessions

By default this module is **disabled** in the mobile package. Assuming you have the enrichments turned on in your Snowplow pipeline, to enable the module within the package please modify the following in your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_mobile:
    snowplow__enable_app_errors_module: true
```

### 6. Filter your data set

You can specify both `start_date` at which to start processing events and the `app_id`'s to filter for. By default the `start_date` is set to `2020-01-01` and all `app_id`'s are selected. To change this please add/modify the following in your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_mobile:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
```
### 7. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml title="dbt_project.yml"
vars:
  snowplow_mobile:
    snowplow__derived_tstamp_partitioned: false
```

:::

:::info Databricks only - setting the databricks_catalog

Add the following variable to your dbt project's `dbt_project.yml` file

```yml title="dbt_project.yml"
vars:
  snowplow_mobile:
    snowplow__databricks_catalog: 'hive_metastore'
```
Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to 'hive_metastore') or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). This is needed to handle the database property within `models/base/src_base.yml`.

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#unity-catalog-support).**

:::

### 8. Run your model

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_mobile
```

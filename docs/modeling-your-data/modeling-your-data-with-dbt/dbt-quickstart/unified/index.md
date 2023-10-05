---
sidebar_label: "Unified"
sidebar_position: 100
title: "Unified Quickstart"
---

## Requirements

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed:

To model web events:

- web events dataset being available in your database
- [Snowplow Javascript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md) version 2 or later implemented.
- Web Page context [enabled](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracker-setup/initializing-a-tracker-2/index.md#webPage_context) (enabled by default in [v3+](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/index.md#webPage_context)).
- [Page view events](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#page-views) implemented.

To model mobile events:
- mobile events dataset being available in your database
- Snowplow [Android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/index.md) or [iOS](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/index.md) mobile tracker version 1.1.0 or later implemented.
- Mobile session context enabled ([ios](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/index.md#session-context) or  [android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/index.md#session-tracking)).
- Screen view events enabled ([ios](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/objective-c-tracker/ios-tracker-1-7-0/index.md#tracking-features) or [android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/previous-versions/android-tracker/android-1-7-0/index.md#tracking-features)).

```mdx-code-block
import DbtPrivs from "@site/docs/reusable/dbt-privs/_index.md"

<DbtPrivs/>
```

```mdx-code-block
import DbtPackageInstallation from "@site/docs/reusable/dbt-package-installation/_index.md"

<DbtPackageInstallation/>
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

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the web model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-web/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

### 3. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile). In order to change this, please add the following to your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
```
:::info Databricks only

Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::

### 4. Enabled desired contexts

The unified package has the option to join in data from the following Snowplow enrichments and out-of-the-box contexts:

- [IAB enrichment](/docs/enriching-your-data/available-enrichments/iab-enrichment/index.md)
- [UA Parser enrichment](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA enrichment](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md)
- Browser context
- Mobile context
- Geolocation context
- App context
- Screen context
- App Error event
- Deep Link context

By default these are **all disabled** in the unified package. Assuming you have the enrichments turned on in your Snowplow pipeline, to enable the contexts within the package please add the following to your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__enable_iab: true
    snowplow__enable_ua: true
    snowplow__enable_yauaa: true
    snowplow__enable_browser_context: false
    snowplow__enable_mobile_context: false
    snowplow__enable_geolocation_context: false
    snowplow__enable_app_context: false
    snowplow__enable_screen_context: false
    snowplow__enable_app_error_event: false
    snowplow__enable_deep_link_context: false
```

### 5. Filter your data set

You can specify both `start_date` at which to start processing events and the `app_id`'s to filter for. By default the `start_date` is set to `2020-01-01` and all `app_id`'s are selected. To change this please add the following to your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
```


### 6. Verify page ping variables

The unified package processes page ping events to calculate web page engagement times. If your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#activity-tracking-page-pings) for `min_visit_length` (default 5) and `heartbeat` (default 10) differs from the defaults provided in this package, you can override by adding to your `dbt_project.yml`:

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__min_visit_length: 5 # Default value
    snowplow__heartbeat: 10 # Default value
```

### 7. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__derived_tstamp_partitioned: false
```
:::

:::info Databricks only - setting the databricks_catalog

Add the following variable to your dbt project's `dbt_project.yml` file

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__databricks_catalog: 'hive_metastore'
```
Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to 'hive_metastore') or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). This is needed to handle the database property within `models/base/src_base.yml`.

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#unity-catalog-support).**

:::

### 8. Run your model

You can run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package). As this package contains some seed files, you will need to seed these first

```bash
dbt seed --select snowplow_unified --full-refresh
dbt run --selector snowplow_unified
```

### 9. Enable extras
The package comes with additional modules and functionality that you can enable, for more information see the [consent tracking](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/consent-module/index.md), [conversions](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/conversions/index.md), and [core web vitals](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/core-web-vitals-module/index.md) documentation.

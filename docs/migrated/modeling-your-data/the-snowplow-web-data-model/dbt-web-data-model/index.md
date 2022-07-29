---
title: "dbt: Web data model"
date: "2021-07-27"
sidebar_position: 200
---

The snowplow-web dbt package provides a means to run the standard web model via dbt. It processes events incrementally and is designed in a modular manner, allowing you to easily integrate your own custom SQL into the incremental framework provided by the package.

**The package can be found in the [snowplow/dbt-snowplow-web repo](https://github.com/snowplow/dbt-snowplow-web), with the full doc site hosted [here](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web).**

## Quickstart

#### Requirements

- [Snowplow Javascript tracker](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-tracker/) version 2 or later implemented.
- Web Page context [enabled](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracker-setup/initializing-a-tracker-2/#webPage_context) (enabled by default in [v3+](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracker-setup/initialization-options/#webPage_context)).
- [Page view events](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/#page-views) implemented.

#### Prerequisites

- [dbt](https://github.com/dbt-labs/dbt) must be installed.
- A dataset of web events from the [Snowplow Javascript tracker](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-tracker/) must be available in the database.

#### Supported Warehouses

- Redshift, Snowflake, BigQuery and PostgreSQL

#### Installing the package

Add the snowplow-web package to your `packages.yml` file. For more information refer to dbt's [package hub](https://hub.getdbt.com/snowplow/snowplow_web/latest/).

#### Essential Configuration

##### 1 - Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile). In order to change this, please add the following to your `dbt_project.yml` file:

```
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
```

##### 2 - Enabled desired contexts

The web package has the option to join in data from the following 3 Snowplow enrichments:

- [IAB enrichment](/docs/migrated/enriching-your-data/available-enrichments/iab-enrichment/)
- [UA Parser enrichment](/docs/migrated/enriching-your-data/available-enrichments/ua-parser-enrichment/)
- [YAUAA enrichment](/docs/migrated/enriching-your-data/available-enrichments/yauaa-enrichment/)

By default these are **all disabled** in the web package. Assuming you have the enrichments turned on in your Snowplow pipeline, to enable the contexts within the package please add the following to your `dbt_project.yml` file:

```
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__enable_iab: true
    snowplow__enable_ua: true
    snowplow__enable_yauaa: true
```

##### 3 - Filter your data set

You can specify both `start_date` at which to start processing events and the `app_id`'s to filter for. By default the `start_date` is set to `2020-01-01` and all `app_id`'s are selected. To change this please add the following to your `dbt_project.yml` file:

```
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
```

##### 4 - Verify page ping variables

The web package processes page ping events to calculate web page engagement times. If your [tracker configuration](https://snowplow.github.io/dbt-snowplow-web/(/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/#activity-tracking-page-pings) for `min_visit_length` (default 5) and `heartbeat` (default 10) differs from the defaults provided in this package, you can override by adding to your `dbt_project.yml`:

```
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__min_visit_length: 5 # Default value
    snowplow__heartbeat: 10 # Default value
```

#### [](https://github.com/snowplow/data-models/tree/feature-redshift-web-v1/web/v1/redshift#configuration)Further configuration

There are many additional configurations you can make to the model such as changing destination schemas, disabling modules and removing bot traffic.

For more details please refer to the [snowplow-web package documentation](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web).

#### Operation

The Snowplow web model is designed to be run as a whole, which ensures all incremental tables are kept in sync. As such, we suggest running the model using:

```
dbt run --models snowplow_web tag:snowplow_web_incremental
```

We strongly advise reading the operation section on the [full doc site](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web) for more information on operations such as full-refreshes of the web model and backfilling data, since operations such as full refreshes deviate slightly from the native dbt implementation.

#### Testing

A full suite of tests are included within the package to ensure data quality. For more information on these and suggested implementations when running in orchestration please refer to the [doc site](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web).

## Customizing the web model

The package is designed in a modular manner, allowing you to easily add in your own custom SQL as well incorporate data from events outside of page views and page pings.

For more information on customizing the model please refer to the [full doc site](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web). A dummy example of dbt project with customisations applied can also be found in the [package repo](https://github.com/snowplow/dbt-snowplow-web/tree/main/custom_example).

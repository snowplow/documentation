---
title: "dbt: Mobile data model"
date: "2022-05-14"
sidebar_position: 2000
---

The snowplow-mobile dbt package provides a means to run the standard mobile model via dbt. It processes events incrementally and is designed in a modular manner, allowing you to easily integrate your own custom SQL into the incremental framework provided by the package.

The package can be found in the [snowplow/dbt-snowplow-mobile repo](https://github.com/snowplow/dbt-snowplow-mobile), with the full doc site hosted [here](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile).

## Quickstart

### Requirements

- Snowplow [Android](/docs/migrated/collecting-data/collecting-from-own-applications/android-tracker/) or [iOS](/docs/migrated/collecting-data/collecting-from-own-applications/objective-c-tracker/) mobile tracker version 1.1.0 or later implemented.
- Mobile session context enabled.
- Screen view events enabled.

### Prerequisities

- [dbt](https://github.com/dbt-labs/dbt) must be installed.
- A dataset of mobile events from the mobile trackers must be available in the database.

### Supported Warehouses

- Redshift, Snowflake, BigQuery, and PostgreSQL

### Installing the package

Add the snowplow-mobile package to your `packages.yml` file. For more information, refer to dbt's [package hub](https://hub.getdbt.com/snowplow/snowplow_mobile/latest/).

### Essential Configuration

#### 1 - Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile). In order to change this, please add the following to your `dbt_project.yml` file:

```
# dbt_project.yml
...
vars:
    snowplow_mobile:
        snowplow__atomic_schema: schema_with_snowplow_events
        snowplow__database: database_with_snowplow_events
```

#### 2 - Enable desired contexts

The mobile package has the option to join in data from the following 4 Snowplow contexts:

- Mobile context -- Device type, OS, etc.
- Geolocation context -- Device latitude, longitude, bearing, etc.
- Application context -- App version and build
- Screen context -- Screen details associated with mobile event

By default, these are **all disabled** in the mobile package. Assuming you have the contexts turned on in your Snowplow pipeline, to enable the contexts within the package please add the following to your `dbt_project.yml` file:

```
# dbt_project.yml
...
vars:
    snowplow__enable_mobile_context: true
    snowplow__enable_geolocation_context: true
    snowplow__enable_application_context: true
    snowplow__enable_screen_context: true
```

#### 3 - Enable optional modules

The mobile package also has the option to join in data from the following 1 Snowplow module:

- App Errors module -- Details relating to app errors that occur during sessions

By default this module is **disabled** in the mobile package. Assuming you have the module turned on in your Snowplow pipeline, to enable the module within the package please add the following to your `dbt_project.yml` file:

```
# dbt_project.yml
...
vars:
    snowplow_mobile:
        snowplow__enable_app_errors_module: true
```

#### 4 - Filter your data set

You can specify both the `start_date` at which to start processing events and the `app_id`'s to filter for. By default, the `start_date` is set to `2020-01-01` and all `app_id`'s are selected. To change this, please add the following to your `dbt_project.yml` file:

```
# dbt_project.yml
...
vars:
    snowplow_mobile:
        snowplow__start_date: 'yyyy-mm-dd'
        snowplow__app_id: ['mobile_app_1', 'mobile_app_2']
```

### Further configuration

There are many additional configurations you can make to the model such as changing destination schemas, disabling modules, etc.

For more details, please refer to the [snowplow-mobile package documentation](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile).

### Operation

The Snowplow mobile model is designed to be run as a whole, which ensures all incremental tables are kept in sync. As such, we suggest running the model using:

```
dbt run --models snowplow_mobile tag:snowplow_mobile_incremental
```

We strongly advise reading the operation section on the [full doc site](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile) for more information on operations such as full-refreshes of the mobile model and backfilling data, since operations such as full refreshes deviate slightly from the native dbt implementation.

### Testing

A full suite of tests are included within the package to ensure data quality. For more information on these and suggested implementations when running in orchestration, please refer to the [doc site](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile).

## Customising the mobile model

The package is designed in a modular manner, allowing you to easily add in your own custom SQL as well as incorporate data from events outside of just screen views. For more information on customising the model, please refer to the [full doc site](https://snowplow.github.io/dbt-snowplow-mobile/#!/overview/snowplow_mobile). A dummy example of a dbt project with customisations applied can also be found in the [package repo](https://github.com/snowplow/dbt-snowplow-mobile/tree/main/custom_example).

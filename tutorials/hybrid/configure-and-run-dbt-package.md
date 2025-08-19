---
title: Configure and run dbt package
position: 4
---

This step assumes you have data in the `ATOMIC.SAMPLE_EVENTS_HYBRID` table which will be used to demonstrate how to set up and run the snowplow-mobile dbt package to model Snowplow mobile data.

## Set up variables

The snowplow_mobile dbt package comes with a list of variables specified with a default value that you may need to overwrite in your own dbt project's `dbt_project.yml` file. For details you can have a look at our [docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/mobile/) which contains descriptions and default values of each variable.

For simplicity we have selected the variables that you will most likely need to overwrite:

- `snowplow__start_date`: The date of the first tracked event
- `snowplow__enable_mobile_context`: Disabled by default, enables the mobile (or platform) context with device information
- `snowplow__enable_geolocation_context`: Disabled by default, enables geolocation context
- `snowplow__enable_application_context`: Disabled by default, enables application context
- `snowplow__enable_screen_context`: Disabled by default, enables screen context with the current screen view information
- `snowplow__events`: Variable to overwrite the events table in case it is named differently. It needs to be modified when using the sample_events table as a base

Add the following snippet to the `dbt_project.yml`:

```yml
vars:
  snowplow_mobile:
    snowplow__start_date: '2021-09-01'
    snowplow__backfill_limit_days: 400 # in order to load the whole sample dataset
    snowplow__enable_mobile_context: true
    snowplow__enable_geolocation_context: true
    snowplow__enable_application_context: true
    snowplow__enable_screen_context: true
    snowplow__events: 'atomic.sample_events_hybrid'
```

## Add the selectors.yml to your project

The mobile package provides a suite of suggested selectors to help run and test the models, these group our (and any custom) models together in a single identifier.

These are defined in the [selectors.yml](https://github.com/snowplow/dbt-snowplow-mobile/blob/main/selectors.yml) file within the package, however to use these model selections you will need to copy this file into your own dbt project directory.

This is a top-level file and therefore should sit alongside your `dbt_project.yml` file.

## Run the model

Execute the following either through your CLI or from within dbt Cloud:

```bash
dbt run --selector snowplow_mobile
```

This should take a couple of minutes to run. The model will process both native mobile events and web view events from your hybrid app, creating unified session and user tables that span both contexts.

The derived tables will include:

- **Screen views** - Both native screens and web view page visits
- **Sessions** - Unified sessions across native and web view interactions
- **Users** - Complete user journey data combining both native app and web view behavior

This unified modeling approach allows you to analyze the complete user experience in your hybrid app.

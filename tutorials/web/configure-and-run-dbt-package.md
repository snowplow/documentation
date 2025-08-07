---
title: Configure and run the dbt package
position: 4
---

This step assumes you have data in the `ATOMIC.SAMPLE_EVENTS_WEB` table which will be used to demonstrate how to set up and run the snowplow-web dbt package to model Snowplow web data.

## Set up variables

The snowplow_web dbt package comes with a list of variables specified with a default value that you may need to overwrite in your own dbt project's `dbt_project.yml` file. For details you can have a look at our [docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/web/) which contains descriptions and default values of each variable, or you can look in the installed package's project file which can be found at `[dbt_project_name]/dbt_packages/snowplow_web/dbt_project.yml`.

For the sake of simplicity we have selected the variables that you will most likely need to overwrite, the rest can be changed at a later stage if and when it is needed.

- `snowplow__start_date`: The date of the first tracked event
- `snowplow__enable_iab`: Variable that by default is disabled but needed if the IAB enrichment is used
- `snowplow__enable_ua`: Variable that by default is disabled but needed if the UA enrichment is used
- `snowplow__enable_yauaa`: Variable that by default is disabled but needed if the YAUAA enrichment is used
- `snowplow__events`: Variable to overwrite the events table in case it is named differently. It would have to be modified when using the *sample_events* table as a base

Add the following snippet to the `dbt_project.yml`:

```yml
vars:
  snowplow_web:
    snowplow__start_date: '2022-08-19'
    snowplow__enable_iab: true
    snowplow__enable_ua: true
    snowplow__enable_yauaa: true
    snowplow__events: 'atomic.sample_events_web'
```

## Add the selectors.yml to your project

The web package provides a suite of suggested selectors to help run and test the models, these group our (and any custom) models together in a single identifier.

These are defined in the [selectors.yml](https://github.com/snowplow/dbt-snowplow-web/blob/main/selectors.yml) file within the package, however to use these model selections you will need to copy this file into your own dbt project directory.

This is a top-level file and therefore should sit alongside your `dbt_project.yml` file.

## Run the model

Execute the following either through your CLI or from within dbt Cloud:

```bash
dbt seed --select snowplow_web --full-refresh
dbt run --selector snowplow_web
```

This should take a couple of minutes to run. The first step is only required to be run once, as we have some reference tables that need to be loaded (seeded) into your data warehouse. The second line then runs all our models to process the raw Snowplow events data into derived tables for analytics and visualization.

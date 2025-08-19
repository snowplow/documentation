---
title: Configure and run snowplow web package
position: 4
---

We will use the *snowplow_web_page_views* table created by the [snowplow-web](https://hub.getdbt.com/snowplow/snowplow_web/latest/) dbt package, as well as the Snowplow events table, to create an attribution report table. This table provides the marginal contribution of each channel to a user-level conversion event as well as the monetary value attributed to that channel from the conversion event. It will also contain spend information and calculated ROAS per channel.

This tutorial assumes that you are already familiar with the `snowplow-web` dbt package.

## Update variables for provided sample data

Ensure that snowplow_web specific variables are set in your `dbt_project.yml` file that are appropriate for the provided sample data, particularly:

```yaml
vars:
  snowplow_web:
    snowplow__start_date: '2022-06-03'
    snowplow__enable_iab: false
    snowplow__enable_ua: false
    snowplow__enable_yauaa: false
    snowplow__events: 'atomic.sample_events_attribution'
    snowplow__backfill_limit_days: 60
```

For further details you can have a look at our [docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/web/) which contains descriptions and default values of each variable.

## Add the selectors.yml to your project

The web package provides a suite of suggested selectors to help run and test the models, these group our (and any custom) models together in a single identifier.

These are defined in the [selectors.yml](https://github.com/snowplow/dbt-snowplow-web/blob/main/selectors.yml) file within the package, however to use these model selections you will need to copy this file into your own dbt project directory.

This is a top-level file and therefore should sit alongside your `dbt_project.yml` file.

## Run the web package

:::note
It is important to ensure that the schemas and tables this will build into will not overwrite any tables you wish to keep. You can change the schema in your `profiles.yml` if you wish to ensure nothing will be overwritten.
:::

Run the `snowplow_web` package by using the following command:

```bash
dbt seed --select snowplow_web --full-refresh
dbt run --selector snowplow_web --full-refresh --vars 'snowplow__allow_refresh: true'
```

This should have created the table `<your_schema>_derived.snowplow_web_page_views` in addition to the other tables from the web package. This is the table that we will be using in the `snowplow_fractribution` package.

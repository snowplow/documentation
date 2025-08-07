---
title: Configure and run the Unified Digital dbt package
position: 4
---

This step assumes you have data in the `ATOMIC.SAMPLE_EVENTS_WEB` table which will be used to demonstrate how to set up and run the `snowplow-unified` dbt package to model Snowplow web data.

:::info Important differences from `snowplow-web` package
The `snowplow-unified` package supersedes the legacy `snowplow-web` package and provides several key advantages:
- **Unified approach**: handles both web and mobile data in a single package
- **Enhanced performance**: optimized processing for high-volume data
- **Future-proof**: active development and new feature additions
- **Consistent schema**: unified table structures across data sources

For this web-focused tutorial, we'll configure the package to process web data only.
:::

## Set up variables

The `snowplow_unified` dbt package comes with a list of variables specified with a default value that you may need to overwrite in your own dbt project's `dbt_project.yml` file. For details you can have a look at our [docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/unified/) which contains descriptions and default values of each variable, or you can look in the installed package's project file which can be found at `[dbt_project_name]/dbt_packages/snowplow_unified/dbt_project.yml`.

For this tutorial we have selected the key variables that you will need to set up:

### Essential configuration

Add the following snippet to the `dbt_project.yml`:

```yml
vars:
  snowplow_unified:
    # Source data location (update these with your actual values)
    snowplow__atomic_schema: 'atomic'
    snowplow__database: 'your_database_name'  # Required: Replace with your actual database name
    snowplow__events: 'sample_events_web'

    # Data processing settings
    snowplow__start_date: '2022-08-19'

    # Enable only web data for this tutorial
    snowplow__enable_web: true
    snowplow__enable_mobile: false

    # Enable enrichments (enable only those you have configured)
    snowplow__enable_iab: true
    snowplow__enable_ua: true
    snowplow__enable_yauaa: true
    snowplow__enable_browser_context: true
    snowplow__enable_geolocation_context: true
```

:::warning Database configuration
Unlike the legacy `snowplow-web` package, the `snowplow-unified` package requires explicit database configuration. Make sure to:
1. Replace `'your_database_name'` with your actual database name
2. Update the schema name to match where your events are stored
3. For Databricks users, you may also need to set `snowplow__databricks_catalog`
:::

### Additional configuration

You may also want to add the dispatch configuration to optimize macro usage:

```yml
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

## Add the selectors.yml to your project

The unified package provides a suite of suggested selectors to help run and test the models, these group our (and any custom) models together in a single identifier.

These are defined in the [selectors.yml](https://github.com/snowplow/dbt-snowplow-unified/blob/main/selectors.yml) file within the package, however to use these model selections you will need to copy this file into your own dbt project directory.

This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

## Run the model

Execute the following either through your CLI or from within dbt Cloud:

```bash
dbt seed --select snowplow_unified --full-refresh
dbt run --selector snowplow_unified
```

This should take a couple of minutes to run. The first step is only required to be run once, as we have some reference tables that need to be loaded (seeded) into your data warehouse. The second line then runs all our models to process the raw Snowplow events data into derived tables for analytics and visualization.

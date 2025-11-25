---
title: "Set up the Attribution dbt package locally"
sidebar_label: "Set up locally"
position: 4
---


1. Create a new dbt project in a new directory

:::info
Please Note: Skip this step if you want to add the Attribution package to the same project as Unified.
:::

```bash
dbt init
```

2. Create a `packages.yml` file in the same directory as the newly created `dbt_project.yml`

:::info
Please Note: Skip this step if you want to add the Attribution package to the same project as Unified.
:::

3. Add the following code to your `packages.yml` file

```yml
packages:
  - package: snowplow/snowplow_attribution
    version: 0.4.0
```

4. Run the following command to install the package

```bash
dbt deps
```

5. Now open your `dbt_project.yml` where we will configure the package. A full list of configuration options can be seen on [this page](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/attribution/).

6. Add the following to your `dbt_project.yml` file and configure it accordingly for your use-case.

```yml
vars:
  snowplow_attribution:
    # Attribution Package configuration
    snowplow__attribution_start_date: 'YYYY-MM-DD' # Required, the start date for conversions to be processed from.
    snowplow__attribution_list: ['first_touch', 'last_touch', 'linear', 'position_based'] # Optional, by default all are calculated

    # Configure input sources
    snowplow__conversion_path_source: 'my_schema_derived.snowplow_unified_views' # Location of your snowplow_unified_views table
    snowplow__conversions_source: 'my_schema_derived.snowplow_unified_conversions' # Location of your snowplow_unified_conversions table
```

:::info
Please Note: If you are running Unified in the same project as Attribution and intend to run them in the same run, set the conversion_path_source and conversions_source to the following so that dbt can run the models in the correct order:
:::

```yml
vars:
  snowplow_attribution:
    snowplow__conversion_path_source: "{{ ref('snowplow_unified_views') }}"
    snowplow__conversions_source: "{{ ref('snowplow_unified_conversions') }}"
    snowplow__user_mapping_source: "{{ ref('snowplow_unified_user_mapping') }}"
```

7. Run the dbt package

```yml
dbt run --select snowplow_attribution
```
:::info
Please Note: If you are running Unified in the same project as Attribution and intend to run them in the same run, you can execute dbt run instead, but better handle it through a custom selectors.yml file
:::

8. After running the package you should see the following tables in your `my_schema_derived` schema:
- `SNOWPLOW_ATTRIBUTION_PATHS_TO_CONVERSION` - Row per conversion that shows the channel and campaign path, both the raw path and the transformed path.
- `SNOWPLOW_ATTRIBUTION_CHANNEL_ATTRIBUTIONS` - Row for each conversion and each channel step to show how much revenue is attributed to that channel step for each attribution methodology.
- `SNOWPLOW_ATTRIBUTION_CAMPAIGN_ATTRIBUTIONS` - Row for each conversion and each campaign step to show how much revenue is attributed to that campaign step for each attribution methodology.
1. Additionally, you will have a `attribution_overview` view in your `my_schema_derived` that is useful to ingest directly into a BI tool to provide a summary of attributed conversions and revenue by attribution method and touchpoint (by default it shows the last 30 days, however this can be configured). See the optional guide below on how to integrate marketing spend data to calculate ROAS within the attribution overview view.

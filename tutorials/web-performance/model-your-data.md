---
title: Model your data
position: 5
---

To process raw events created by the Snowplow Web Vitals plugin (@snowplow/browser-plugin-web-vitals) we have included an optional module to model core web vital events in the [snowplow-web dbt package](https://hub.getdbt.com/snowplow/snowplow_web/latest/).

In this section you will learn how to enable and run the core web vitals module within the snowplow-web package.

## Step 1: Enable the optional core web vitals module

As the [advanced-analytics-for-web accelerator](https://docs.snowplow.io/accelerators/web/) is a prerequisite, it is assumed that you already have a dbt project set up to process basic web events.

To enable the optional `core web vitals` module, you must add the following code snippet to your dbt_project.yml file:

```yml
models:
  snowplow_web:
    snowplow__enable_cwv: true
```

## Step 2: Change optional parameters

By default, following industry standard practice, the core web vitals are evaluated against the 75th percentile value of all pageviews. You can use the `snowplow__cwv_percentile` variable to overwrite this logic.

The measurements are executed in a drop and recompute fashion to fit BI tool purposes and would always show the last 28 days data by default which can be modified through a variable in the model (`snowplow__cwv_days_to_measure`).

To change either of these default values you can modify the relevant variable in your dbt_project.yml file like so:

```yml
models:
  snowplow_web:
    snowplow__enable_cwv: true
    snowplow__cwv_days_to_measure: 28
    snowplow__cwv_percentile: 75
```

## Step 3: Override the module specific macros

There are configurable default sql scripts that you might want to overwrite (mainly the one defined in `core_web_vital_page_groups()` macro). Please take a look at them and, if needed, copy the original sql file from the macros within the dbt_packages folder (which should appear after you executed `dbt deps`), add it to the macros of your own dbt project without changing the name. Update the sql to your preference and save the file.

{{% notice info %}}
For information about overriding our macros, see [here](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-advanced-operation/#overriding-macros)
{{% /notice %}}

- The `core_web_vital_page_groups()` macro is used to let the user classify their urls to specific page groups. It returns the sql to provide the classification expected in the form of case when statements. ([source](https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/core_web_vital_page_groups.sql))

- The `core_web_vital_results_query()` macro is used to let the user classify the thresholds to be applied for the measurements. It returns the sql to provide the logic for the evaluation based on user defined thresholds (expected in the form of case when statements). Please make sure you set the results you would like the measurements to pass to `good` or align it with the `macro_core_web_vital_pass_query()` macro. ([source](https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/core_web_vital_results_query.sql))

- The `core_web_vital_pass_query()` macro is used to let the user define what counts as the overall pass condition for the core web vital measurements. ([source](https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/core_web_vital_pass_query.sql))

## Step 4: Run the package

If this is your first time processing the snowplow_web package then you can run the package the recommended way either through your CLI or from within dbt Cloud with the following command:

```bash
dbt run --selector snowplow_web
```

If you already have a working snowplow_web package and would like to enable the core web vitals module you do not need to rebuild the whole model from scratch. For the least amount of reprocessing impact execute the first run the following way:

```bash
dbt run -m snowplow_web.base --vars 'snowplow__start_date: <date_when_core_web_vital_tracking_starts>'
```

This way only the base module is reprocessed. The web model's update logic will recognize the newly enabled models and backfilling should start between the date you defined within snowplow_start_date and the upper limit defined by the variable `snowplow_backfill_limit_days` that is set for the web model.

`Snowplow: New Snowplow incremental model. Backfilling`

You can overwrite this limit for the backfilling process temporarily if needed:

```yml
# dbt_project.yml

vars:
  snowplow_web:
    snowplow__backfill_limit_days: 1
```

After this you should be able to see all core web vitals models created. Any subsequent run from this point onwards could be carried out using the recommended web model running method - using the snowplow_web selector.

```bash
dbt run --selector snowplow_web
```

As soon as backfilling finishes, running the model results in both the web and the core web vital models being updated during the same run for the same period, both using the same latest set of data from the `_base_events_this_run` table. Please note that while the backfilling process lasts, no new web events are going to be processed.

The following models will be generated:

- **snowplow_web_vitals**: Incremental table used as a base for storing core web vital events (first event per pageview).

- **snowplow_web_vital_measurements**: Drop and recompute table to use for visualizations that takes core web vital measurements at the user specified percentile point (defaulted to 75).

For more information about the derived tables (e.g. columns and definitions) check out the optional modules/core_web_vitals section of the related [dbt docs](https://snowplow.github.io/dbt-snowplow-web/#!/overview/snowplow_web).

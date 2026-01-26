---
title: "Full or partial table refreshes"
sidebar_label: "Full or partial refreshes"
sidebar_position: 20
description: "Perform full or partial refreshes of Snowplow dbt package models to reprocess data or fix issues."
keywords: ["dbt refresh", "full refresh", "partial refresh", "reprocess data"]
---

```mdx-code-block
import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

You can choose to refresh all or only some tables.

## Complete refresh of Snowplow package

While you can drop and recompute the incremental tables within this package using the standard `--full-refresh` flag, all [manifest tables](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/index.md) are protected from being dropped in production (as defined by a target not matching your `snowplow__dev_target_name`).

Without dropping the manifest during a full refresh, the selected derived incremental tables would be dropped but the processing of events would resume from where the package left off, as captured by the `snowplow_<package_name>_incremental_manifest` table, rather than your `snowplow__start_date`.

In order to drop all the manifest tables and start again set the `snowplow__allow_refresh` var to `true` at run time:

<Tabs groupId="refresh" queryString>
<TabItem value="Other packages" label="Other packages">

```bash
dbt run --select snowplow_<package_name> tag:snowplow_<package>_incremental --full-refresh --vars 'snowplow__allow_refresh: true'
# or using selector flag
dbt run --selector snowplow_<package_name> --full-refresh --vars 'snowplow__allow_refresh: true'
```

</TabItem>

<TabItem value="Attribution" label="Attribution">

```bash
dbt run --full-refresh --vars 'snowplow__allow_refresh: true'
```

</TabItem>
</Tabs>


When doing a full refresh of the package, it will begin again from your `snowplow__start_date` and backfill based on the calculations explained in the [Incremental Sessionization Logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) page. Please ensure you trigger enough runs to catch back up with live data, or adjust your variables for these runs accordingly (see our page on [backfilling](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/backfilling/index.md) for more information).


## Refresh only some models in a package

You may at times wish to refresh only some derived models in a package, either a built in one, or a [custom model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md). This may be due to changes you have made to variable, a change in logic, or some other reason. To achieve this:

1. Manually drop the table(s) in your database (you may wish to simply rename them until the back-fill is completed in case of any issues).
2. Remove the models from the manifest table; this can be achieved either by:
   1. *(Recommended)* using the `models_to_remove` variable at run time
    ```bash
    dbt run --select +snowplow_<package_name>_model_name --vars '{snowplow__start_date: "yyyy-mm-dd", models_to_remove: snowplow_<package>_model_name}'
    ```
    2. *(High Risk)* manually deleting the record from the `snowplow_<package_name>_incremental_manifest` table.

By removing the model from the manifest the `<package\>` will be in [State 2](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md#state-2-new-model-introduced) and will replay all events.

## Custom period re-processing

There may be times where you need to re-run some or all of the models for a period of data, potentially due to incorrect supplemental data brought into a model, or in case of a mistake in your model code itself. There are two methods to do this: one is simpler but must complete in a single run, the other is more complex but can be executed over multiple runs. Either will work for any custom models, assuming they were built using [Snowplow incremental materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/optimized-upserts/index.md).

Note that it is not currently possible to re-process a fixed period in the past, it is only possible to re-process from a given date up to the current date of the data.

:::danger

Both methods are only suitable if the value of your source data in your `upsert` and date keys have not changed (e.g. `view_id` and `derived_tstamp` for the `snowplow_unified_views` model). If this is not the case, or your custom models are not built using this approach, there is no choice but to run a full refresh of the model.

:::
### Option 1: Altering the look back window

As defined in the [standard run incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md#state-4-standard-run), the lower limit for the events to be processed in the models is `max_last_success - snowplow__lookback_window_hours`. If you increase the value of `snowplow__lookback_window_hours` to a number that goes beyond the period you wish to re-run from, then all events from that time will be reprocessed and fed through all models in the package.

For example, if your last run success was `2022-10-30 13:00:00` and you needed to reprocess events from `2022-10-25 02:00:00`, you would set your `snowplow__lookback_window_hours` to `137` (5 days × 24 hours + 11 hours, and 6 hours of an additional buffer the look back window would usually provide). This will reprocess all the events in a single run, which may be larger than the value you have set in `snowplow__backfill_limit_days`. If you wish to avoid going over the backfill limit you have set, please use option 2. Don't forget to change your value back once the run has completed!

<p align="center">
<ThemedImage
alt="Demonstration of data processing through option 1 approach"
sources={{
    light: require('./images/data_progress_example1_light.drawio.png').default,
    dark: require('./images/data_progress_example1_dark.drawio.png').default
}}/>
</p>

### Option 2: Manipulating the manifest table

It is possible to update the value in the [manifest tables](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/index.md) so that the `max_last_success` values for the relevant models are set to the date you wish to re-run from. In this case, it may take multiple runs for your data to be completely re-run, based on your `snowplow__backfill_limit_days` value, and you may be left with abnormal data until all runs are completed. In the case where you have aggregations in your models (such as the `snowplow_unified_users` model), or have downstream reports/visualization/ML models based on these tables, we recommend setting the `snowplow__backfill_limit_days` to a large enough value that it can be completed in one run to minimize downstream issues (or to use option 1, where this happens by default).

For example, if your last run success was `2022-10-30 13:00:00` and you needed to reprocess events from `2022-10-25 02:00:00`, you would set the value in your manifest table for the model(s) to `2022-10-25 02:00:00`. This will then process data from that point (minus the `snowplow__lookback_window_hours` buffer) until either the current date, or according to your `snowplow__backfill_limit_days`, whichever yields a smaller time period. This will repeat until the data is fully reprocessed.

<p align="center">
<ThemedImage
alt="Demonstration of data processing through multiple runs of the option 2 approach"
sources={{
    light: require('./images/data_progress_example2_light.drawio.png').default,
    dark: require('./images/data_progress_example2_dark.drawio.png').default
    }}
/>
</p>

:::danger

Manipulating the values in the manifest tables can cause unexpected outcomes if you don't understand the Snowplow [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md)). Where possible, use option 1.

:::

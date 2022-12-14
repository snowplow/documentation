---
title: "Advanced Operation"
date: '2022-10-05'
sidebar_position: 999
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';
```

## Asynchronous Runs

You may wish to run the modules asynchronously, for instance run the screen views module hourly but the sessions and users modules daily. You would assume this could be achieved using e.g.:

```bash
dbt run --select +snowplow_mobile.screen_views
```

Currently however it is not possible during a dbt jobs start phase to deduce exactly what models are due to be executed from such a command. This means the package is unable to select the subset of models from the manifest. Instead all models from the standard and custom modules are selected from the manifest and the package will attempt to synchronize all models. This makes the above command unsuitable for asynchronous runs.

However we can leverage dbt's `ls` command in conjunction with shell substitution to explicitly state what models to run, allowing a subset of models to be selected from the manifest and thus run independently.


For example to run just the screen views module asynchronously:

```bash
dbt run --select +snowplow_mobile.screen_views --vars "{'models_to_run': '$(dbt ls --m  +snowplow_mobile.screen_views --output name)'}"
```
## Custom re-running of specific models

There may be times where you need to re-run some or all of the models for a period of data, potentially due to incorrect supplemental data brought into a model, or in case of a mistake in your model code itself. There are two methods to do this: one is simpler but must complete in a single run, the other is more complex but can be executed over multiple runs. Either will work for any custom models, assuming they were built using [Snowplow incremental materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-materialization/index.md).

:::danger

Both methods are only suitable if the value of your source data in your `upsert` and date keys have not changed (e.g. `page_view_id` and `derived_tstamp` for the `snowplow_web_page_views` model). If this is not the case, or your custom models are not built using this approach, there is no choice but to run a full refresh of the model.

:::
### Option 1: Altering the look back window

As defined in the [standard run incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/#state-4-standard-run), the lower limit for the events to be processed in the models is `max_last_success - snowplow__lookback_window_hours`. If you increase the value of `snowplow__lookback_window_hours` to a number that goes beyond the period you wish to re-run from, then all events from that time will be reprocessed and fed through all models in the package.

For example, if your last run success was `2022-10-30 13:00:00` and you needed to reprocess events from `2022-10-25 02:00:00`, you would set your `snowplow__lookback_window_hours` to `137` (5 days × 24 hours + 11 hours, and 6 hours of an additional buffer the look back window would usually provide). This will reprocess all the events in a single run, which may be larger than the value you have set in `snowplow__backfill_limit_days`. If you wish to avoid going over the backfill limit you have set, please use option 2. Don't forget to change your value back once the run has completed!

<ThemedImage alt="Demonstration of data processing through option 1 approach" sources={{light: require('./images/data_progress_example1_light.drawio.png').default, dark: require('./images/data_progress_example1_dark.drawio.png').default}}/>

### Option 2: Manipulating the manifest table

It is possible to update the value in the [manifest tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) so that the `max_last_success` values for the relevant models are set to the date you wish to re-run from. In this case, it may take multiple runs for your data to be completely re-run, based on your `snowplow__backfill_limit_days` value, and you may be left with abnormal data until all runs are completed. In the case where you have aggregations in your models (such as the `snowplow_web_users` model), or have downstream reports/visualization/ML models based on these tables, we recommend setting the `snowplow__backfill_limit_days` to a large enough value that it can be completed in one run to minimize downstream issues (or to use option 1, where this happens by default).

For example, if your last run success was `2022-10-30 13:00:00` and you needed to reprocess events from `2022-10-25 02:00:00`, you would set the value in your manifest table for the model(s) to `2022-10-25 02:00:00`. This will then process data from that point (minus the `snowplow__lookback_window_hours` buffer) until either the current date, or according to your `snowplow__backfill_limit_days`, whichever yields a smaller time period. This will repeat until the data is fully reprocessed.

<ThemedImage
    alt="Demonstration of data processing through multiple runs of the option 2 approach"
    sources={{
        light: require('./images/data_progress_example2_light.drawio.png').default,
        dark: require('./images/data_progress_example2_dark.drawio.png').default
        }}
/>

:::danger

Manipulating the values in the manifest tables can cause unexpected outcomes if you don't understand the Snowplow [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md)). Where possible, use option 1.

:::

## Cluster Keys

All the incremental models in the Snowplow packages have recommended cluster keys applied to them. Depending on your specific use case, you may want to change or disable these all together. This can be achieved by overriding the following macros with your own version within your project:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

- `web_cluster_by_fields_sessions_lifecycle()`
- `web_cluster_by_fields_page_views()`
- `web_cluster_by_fields_sessions()`
- `web_cluster_by_fields_users()`


</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

- `mobile_cluster_by_fields_sessions_lifecycle()`
- `mobile_cluster_by_fields_screen_views()`
- `mobile_cluster_by_fields_sessions()`
- `mobile_cluster_by_fields_users()`

</TabItem>

</Tabs>

## Overriding Macros

The cluster key macros (see above), the `allow_refresh()` and the `filter_bots` macro can be overridden. These are all [dispatched macros](https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch) and can be overridden by creating your own version of the macro and setting a project level dispatch config. More details can be found in [dbt's docs](https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch#overriding-package-macros)

``` yaml
# Your_dbt_project/macros/filter_bots.sql
{% macro default__filter_bots() %}
and ev.useragent not similar to '%(YOUR_CUSTOM_PATTERN|bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt)%'
{% endmacro %}
```

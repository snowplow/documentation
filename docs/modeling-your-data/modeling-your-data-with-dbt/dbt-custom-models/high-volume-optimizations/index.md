---
title: "High volume optimizations"
description: "Optimize dbt models for high-volume behavioral data processing and performance requirements."
schema: "TechArticle"
keywords: ["High Volume", "Performance Optimization", "Scale Optimization", "Big Data", "Volume Handling", "Performance Tuning"]
sidebar_position: 20
---

For users with very high data volumes (>100M daily events) you may find that, even with our [optimized upserts](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/optimized-upserts/index.md) and [incremental sessionization](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md), the package is still slow in any given run or the processing cost is high. There are a few specific things you can do to help optimize the package even further, which require various levels of effort on your part. In general we have taken the decision to not do these things as part of the "normal" deployment of our packages as there is a trade-off for each one and in the vast majority of use cases they aren't required.

## Tune the incremental logic parameters
Our [incremental sessionization](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) by default will look back and reprocess 6 hours of data; if you are confident there is no delay in data loading, or if you are using the `load_tstamp` as the `snowplow__session_timestamp` then there is much less need to have such a big lookback window, decreasing this to 1 hour will greatly reduce volumes of data for regular (~hourly) package runs.

Decreasing the backfill limit days will only impact on backfill runs so once models are up to date this will have little impact. Decreasing the upsert lookback days, or the session lookback days can have benefits but come at the risk of duplicates making it into the manifest or derived tables so do this at your own risk.

## Reduce the number of columns written + ephemeral this run
:::danger

These configurations have not been fully tested and leave you at risk of issues occurring when we make upgrades to our packages. Continue at your own risk.

:::

### Derived Tables

In general we try to only write the columns into [this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md), and therefore derived tables, that are populated and relevant to that table. However, there may by many columns in these tables that you don't require and as as cloud warehouses are usually [columnar warehouses](https://en.wikipedia.org/wiki/Column-oriented_DBMS) this leads to more compute required to write these columns, and more storage to keep and maintain the metadata for them.

Rather than edit the this run tables directly, as this could leave you out of sync with our updates, we recommend changing the materialization of all this run models (except the events and base sessions) to be `ephemeral`, this stops the incremental data being first written as a table before being merged into the derived table. Doing this may not be the best option if you re-use any of these tables in multiple custom models as it will have to run them each time.

Next instead of selecting all columns from your now ephemeral this run models, disable our derived model and build your own to explicitly select just the columns that you require. See the [adding fields to derived table](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/examples/adding-fields-to-derived-table/index.md) example for how to do this.

Your derived table will now be writing and storing fewer columns, and the this run tables will optionally not be written at all.

### Events this run

The [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) by design contains every column that your atomic events table does including all self-describing events and entities (except in Redshift where these must be specified by a variable to be joined on). This can mean a very large amount of columns and data that you never use have to be read and written in every single run.

In general, it is a bad idea to alter the events this run table, as it can lead to issues elsewhere in the package, but it is also one of the largest places to reduce the amount of read/written data in a given run. The easiest thing to do in this case is to disable the events this run table from the package and duplicate the model into your top level project. Note the model must have the exact same name as the one you disabled, and you will need to duplicate many of the variables from the package into your project yaml to ensure they are available in the correct scope.

Nearly all our packages will have the same structure for this model; a macro is called, this is used within a CTE, and then we do some further SQL on this CTE. In your case, you could select only the columns required for **all** downstream models explicitly within this model


#### Example from unified
<details>
<summary>Project yaml</summary>

Note that any variables used in the model need to be made available in your project scope

```yaml title=dbt_project.yaml
models:
  snowplow_unified:
    base:
      scratch:
        snowplow_unified_base_events_this_run:
          +enabled: false

vars:
  my_project_name:
    snowplow__session_timestamp: ...
    ...

```
</details>


<details>
<summary>snowplow_unified_base_events_this_run (copy)</summary>
We have removed the vast majority of the code from the original model code. The changes are the addition of the `default_cte` and then the selection of specific columns below.

```jinja2 title=models/snowplow_custom/snowplow_unified_base_events_this_run
...
with base_query as (
  {{ base_events_query }}
)

default_cte as (
  select
    *
    -- extract commonly used contexts / sdes (prefixed)
    {{ snowplow_unified.get_web_page_context_fields() }}
    {{ snowplow_unified.get_iab_context_fields() }}
    {{ snowplow_unified.get_ua_context_fields() }}
    {{ snowplow_unified.get_yauaa_context_fields() }}
    {{ snowplow_unified.get_browser_context_fields() }}
    {{ snowplow_unified.get_screen_view_event_fields() }}
    {{ snowplow_unified.get_session_context_fields() }}
    {{ snowplow_unified.get_mobile_context_fields() }}
    {{ snowplow_unified.get_geo_context_fields() }}
    {{ snowplow_unified.get_app_context_fields() }}
    {{ snowplow_unified.get_screen_context_fields() }}
    {{ snowplow_unified.get_deep_link_context_fields() }}
    {{ snowplow_unified.get_app_error_event_fields() }}
    {{ snowplow_unified.get_screen_summary_context_fields() }}


  {% if var('snowplow__enable_consent', false) -%}
    {{ snowplow_unified.get_consent_event_fields() }}
    {{ snowplow_unified.get_cmp_visible_event_fields() }}
  {% endif -%}

  {% if var('snowplow__enable_cwv', false) -%}
    {{ snowplow_unified.get_cwv_fields() }}
  {% endif -%}
  from base_query
)

select
  ... -- your specific columns here
from
  default_cte

```

</details>

:::tip

In the case of the unified package, there are two event this run tables, normally we recommend editing the latter one via the macro that creates it, but in this case you need to edit the upstream one to remove the columns as early as possible.

:::

---
title: "New Derived Model"
description: "Example of creating new derived models in dbt for custom behavioral data analysis requirements."
schema: "TechArticle"
keywords: ["Derived Model", "Custom Model", "Model Creation", "New Model", "Model Development", "DBT Examples"]
sidebar_position: 20
---

We have always seen our packages as a starting point for your analysis and insight generation; there to get you started and give you an idea of what you can do, while providing the framework to build your own models on top to meet your bespoke needs. Assuming that customizing the existing derived tables does not suit your needs the next steps is to create a custom derived model.

As you are building this for yourself, there is no need to follow our usual this run -> derived approach, and you can just build an incremental model on top of events this run!

:::note

Any custom derived model must build only to session-level or _lower_ because of the [incremental sessionization](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) of our packages. For example you can't build a table that aggregates per day using the standard sessionisation as not all events from a given day are always processed in the same run, at least not on any of the [this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md), see the [Daily Aggregate Table](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/examples/daily-aggregate-table/index.md) for how to do this.

:::

## A simple example
Let's say we want to do a very simple model built in the unified package - we want to keep a count of the number of each type of event per session in a table. This table would be 1 row per session+event name, and can build incrementally as it's at a lower level than session.

The skeleton of the model would be to make an incremental model, ensure we add the [optimized upsert](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/optimized-upserts/index.md), [tag](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md#tagging-models) the model, checking for new events, and selecting from [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run).

```jinja2 title=models/custom_snowplow_derived/session_event_counts.sql
{{
  config(
    materialized='incremental',
    unique_key='session_identifier',
    upsert_date_key='start_tstamp',
    tags=['snowplow_unified_incremental', 'derived'],
    snowplow_optimize = true
  )
}}

select *
    ...
from {{ ref('snowplow_unified_events_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_unified') }} --returns false if run doesn't contain new events.
```

Then it is simply a case of writing the actual model content itself, which in this case is very straight forward. You may have a more complex model, perhaps bringing in data from another source or model in your dbt project, but the idea is the same. Note that we need a date key to be able to use our optimized upsert.

```jinja2 title=models/custom_snowplow_derived/session_event_counts.sql
{{
  config(
    materialized='incremental',
    unique_key='session_identifier',
    upsert_date_key='start_tstamp',
    snowplow_optimize = true
  )
}}

select
    session_identifier,
    min(derived_tstamp) as start_tstamp,
    event_name,
    count(*) as event_vol
from {{ ref('snowplow_unified_events_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_unified') }} --returns false if run doesn't contain new events.
group by 1, 3
```

Follow the steps to [backfill](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/backfilling/index.md) the model. Make sure to add any additional config for optimizing your tables based on your warehouse.

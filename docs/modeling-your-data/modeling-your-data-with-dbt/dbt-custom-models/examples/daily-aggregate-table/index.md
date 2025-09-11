---
title: "Daily Aggregate Model"
description: "Create daily aggregate tables in dbt for behavioral data summarization and reporting."
schema: "TechArticle"
keywords: ["Daily Aggregates", "Aggregate Tables", "Daily Reports", "Aggregation Models", "Daily Analytics", "Aggregate Data"]
sidebar_position: 20
---

Because of the [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) of our packages, all of the [this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md) tables contain events (or a higher level) for only the sessions being processed in that run. For this reason, it is not possible to build daily aggregate tables directly off of any this run tables.

To better understand why, consider a late arriving event for a session that started 2 days ago; because we would reprocess all events for this session our sessions this run table would contain a record for that session with a start date 2 days ago, but all other sessions for that day would already have been processed and would **not** be in this table. If you try to get a count of sessions, you'll report that there was only 1 session that day. You could try to be clever with incremental additions, but this session may have already been partially processed so may or may not have already been counted. 

The only way to accurately do daily aggregates in our packages is to calculate these off the *derived tables*, i.e. the persistent tables in the package. This would be inefficient to scan the whole table every time, so we can be smart and use the _range of dates_ in the [events this run table](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) to identify which dates we need to rescan, thus reducing the compute cost.

## A simple example
Let's say we want to do a simple daily aggregates model built in the Unified package - we want to keep a count of the number of sessions and the average engaged time per day. This table would be 1 row per day, and we would need to read from the `snowplow_unified_sessions` *derived* table for the reasons discussed above.

The skeleton of the model would be to make an incremental model, ensure we add the [optimized upsert](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/optimized-upserts/index.md), checking for new events, and selecting from the sessions model.

Note there is no need to [tag](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md#tagging-models) the model as this is not reading directly from a this run table.

```jinja2 title=models/custom_snowplow_derived/session_event_counts.sql
{{
  config(
    materialized='incremental',
    unique_key='session_date',
    upsert_date_key='session_date',
    tags=['derived'],
    snowplow_optimize = true
  )
}}

-- depends_on: {{ ref('snowplow_unified_events_this_run') }}

{# Get the range of dates processed in the current run to limit the later scan #}
{% if is_incremental() %}
{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_unified_events_this_run'),
                                                                           'derived_tstamp',
                                                                           'derived_tstamp') %}
{% endif %}

select
  date(start_tstamp) as session_date,
  count(*) as num_sessions,
  avg(engaged_time_in_s) as average_engaged_time
from {{ ref('snowplow_unified_sessions') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_unified') }} --returns false if run doesn't contain new events.
{% if is_incremental() %}
  and start_tstamp >= date({{ lower_limit }})
  and start_tstamp <= {{ dateadd(datepart="day", interval=1, from_date_or_timestamp= upper_limit) }}
{% endif %}
group by 1

```

:::tip

Notice that we are filtering on the `start_tstamp` column from the sessions table, because this is the partition/sort key for that table. Make sure you used the right column for the derived table you are querying. 

:::

We need to add a dependency on events this run to ensure dbt runs everything in the right order, we do this by adding the `-- depends_on: {{ ref('snowplow_unified_events_this_run') }}` comment. Next we get the limits for the current run and those are the dates we then use to work out what range we have to scan the sessions table on. On the first run, it will do a full scan to backfill the table from the existing derived sessions data.

You could add additional buffers around the limits if required, but make sure that you are always processing full days of data from the sessions table (at least up to the current max timestamp). You can also extend this as needed to add other fields, joins, or anything else you require.

If you need weekly/monthly aggregates, the ideas are the same, just make sure you are always scanning and reprocessing a whole period in each run.

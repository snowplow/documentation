---
title: "Duplicates"
date: "2022-10-05"
sidebar_position: 200
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```


The e-commerce, web, and mobile packages perform de-duplication on both `event_id`'s and `page/screen_view_id`'s, in the base and page/screen views modules respectively. The normalize package only de-dupes on `event_id`. The de-duplication method for Redshift & Postgres is different to BigQuery, Snowflake, & Databricks due to their shredded table design. See below for a detailed explanation and how to process potential duplicates in any custom models.

## Redshift & Postgres

:::note

In earlier versions of the packages different de-duplication logic was used, see the changelog of each package for more information.

:::

### Single entity contexts
When events are expected to only have at most a single entity in the attached context, any duplicate `event_id`s are removed from the atomic events table, and any context/self-describing event tables, by taking the earliest `collector_tstamp` record. In the case of multiple rows with this timestamp, we take one at random (as they will all be the same).

While the `*_base_events_this_run` table now contains unique records, any custom models must make sure to de-duplicate contexts and/or self-describing events before joining to this table. The easiest way to do this is to use the `get_sde_or_context()` macro in the v0.14.0+ snowplow-utils package. Check out the [package documentation](https://snowplow.github.io/dbt-snowplow-utils/#!/overview/snowplow_utils) for how to use it. In this case it is only required to then join on `root_id` and `root_tstamp`, as we expect a 1-to-1 join.

In this case, a custom model may look something like:

```jinja2
with {{ snowplow_utils.get_sde_or_context('atomic', 'nl_basjes_yauaa_context_1', "'2023-01-01'", "'2023-02-01'")}}

select
    a.*,
    b.yauaa_context_agent_name_version
from {{ ref('snowplow_web_base_events_this_run) }} a
left join nl_basjes_yauaa_context_1 b on 
    a.event_id = b.yauaa_context__id 
    and a.collector_tstamp = b.yauaa_context__tstamp
```


### Multiple entity contexts
In the case where it may be possible for a context to contain multiple entities (e.g. products returned in a search result) a more complex approach is taken to ensure that all of the entities in the attached context are still in the table before the join, even in the case where some of these entities may be identical. 

We de-duplicate the events table in the same way as with a single entity context, but we also keep the number of duplicates there were. In the context table we generate a row number per unique combination of **all** fields in the record. A join is then made on `root_id` and `root_tstamp` as before, but with an **additional** clause that the row number is a multiple of the number of duplicates to support the 1-to-many join. This ensures all duplicates are removed while retaining all original entities in the context. 

The good news is we do most of this for you in the `get_sde_or_context()` macro when the `single_entity` argument is set to `false`, and you just need to add the extra condition to your join in a custom model. Any join using this can result in multiple rows per event and you may need to aggregate them into an array if this is not your intended use case.

In this case, a custom model may look something like:

```jinja2
with {{ snowplow_utils.get_sde_or_context('atomic', 'nl_basjes_yauaa_context_1', "'2023-01-01'", "'2023-02-01'", single_entity = false)}}

select`
    a.*,
    b.yauaa_context_agent_name_version
from {{ ref('snowplow_web_base_events_this_run) }} a
left join nl_basjes_yauaa_context_1 b on 
    a.event_id = b.yauaa_context__id 
    and a.collector_tstamp = b.yauaa_context__tstamp
    and mod(b.yauaa_context__index, a.event_id_dedupe_count) -- ensure one version of each potentially duplicated entity in context
```

:::info

Currently not all our packages provide the `event_id_dedupe_count` field in the `*_base_events_this_run` table, but it will be added in the future.

:::

## BigQuery, Snowflake, & Databricks

Any duplicate `event_id`s are removed by taking the earliest `collector_tstamp` record. In the case of multiple rows with this timestamp, we take one at random (as they will all be the same). The same methodology is applied to `page/screen_view_id`s, however we order by `derived_tstamp`. 

There should be no need to further de-duplicate the base `..._base_events_this_run_table` or any contexts for each row.

---
title: "Using multi-valued entities"
sidebar_label: "Using multi-valued entities"
description: "Extract and use multi-valued entities in Snowplow dbt custom models with warehouse-specific unnesting techniques."
keywords: ["multi-valued entities", "entity arrays", "unnest entities", "context arrays"]
sidebar_position: 30
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

When building [custom derived models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/examples/new-derived-model/index.md) you may find yourself needing to use a multi-valued entity, i.e. an entity with multiple entries in the array. These fields should not be extracted as part of the [event this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table because it would lead to duplicate rows, and so are only extracted as part of the custom model where you are either keeping the rows at that level or aggregating back up.

In this page we will just showcase the SQL required, including some of our specialist macros, to extract out these entities into a 1-row per value table, for you to then use in any specific model.


## SQL to extract each value
<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake" default>

To make use of a multi-valued entity in BigQuery, you can make use of the `LATERAL FLATTEN` function.

```jinja2
SELECT
    ...
    r.value:myField::varchar,  -- field will be variant type so important to cast
    ...
FROM
    {{ ref('snowplow_<package_name>_base_events_this_run') }} t,
    LATERAL FLATTEN(input => t.contexts_my_entity_1) r
```

</TabItem>
<TabItem value="bigquery" label="BigQuery">

To make use of a multi-valued entity in BigQuery, you can make use of the `unnest` function. Note that you will need to do this for each version of the context.

```jinja2
SELECT
    ...
    my_ent.my_field AS my_field,
    ...
FROM
    {{ ref('snowplow_<package_name>_base_events_this_run') }}
LEFT JOIN
    unnest(contexts_my_entity_1_0_0) AS my_ent -- left join to avoid discarding events without values in this entity
```

</TabItem>
<TabItem value="databricks" label="Databricks">

To make use of a multi-valued entity in BigQuery, you can make use of the `LATERAL VIEW EXPLODE` function.

```jinja2
SELECT
    ...
    my_ent.my_field,
    ...
FROM
    {{ ref('snowplow_<package_name>_base_events_this_run') }}
    LATERAL VIEW EXPLODE(contexts_my_entity_1) AS my_ent
```

</TabItem>
<TabItem value="redshift" label="Redshift">

As the fields in Redshift are part of a different table, we need to join that table onto the events this run model. We do this in 3 steps:
1. Get the limits for the current run to reduce the scan on the entity table
2. Use a CTE and macro to get the records from the entity table, adding fields needed to deduplicate
3. Join this onto events this run, using a specific set of conditions to manage duplicates but keep _genuine_ same-valued records.

We use the [`snowplow_utils.get_sde_or_context` macro](https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_sde_or_context.sql), which takes five arguments:
- `schema`: the schema in your warehouse that the table is in
- `identifier`: the table name for the entity
- `lower_limit`: the lower limit of the event time to scan
- `upper_limit`: the upper limit of the event time to scan
- `prefix`: the prefix to apply to all column names
- `single_entity`: if it is a single-valued entity

In this case, we want to make sure to set `single_entity` to false as we are explicitly using a multi-valued entity.

```jinja2
{# Get the limits for the run to reduce the scan on the entity table#}
{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_<package_name>_base_sessions_this_run'),
                                                                            'start_tstamp',
                                                                            'end_tstamp') %}

{# Use the macro as part of a CTE which will select the relevant data, prefix the columns, and add the de-dupe fields #}
with {{ snowplow_utils.get_sde_or_context(var('snowplow__atomic_schema', 'atomic'), 'contexts_my_entity_1', lower_limit, upper_limit, 'my_ent', single_entity = false) }},

select
    a.*,
    b.my_ent_my_field
from {{ ref('snowplow_<package_name>_base_events_this_run') }} a
left join contexts_my_entity_1 b on
    a.event_id = b.yauaa__id  -- match the event id between the tables, note the dobule underscore
    and a.collector_tstamp = b.yauaa__tstamp -- match the collector timestamp between the tables, note the double underscore
    and mod(b.yauaa__index, a.event_id_dedupe_count) = 0 -- ensure one version of each potentially duplicated entity in context
```

</TabItem>
</Tabs>

This table can then be used to do any further analysis required, either in the same model or for use in another model.

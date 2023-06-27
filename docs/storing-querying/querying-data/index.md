---
title: "Querying Snowplow data"
sidebar_label: "Querying data"
sidebar_position: 2
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Basic queries

You will typically find most of your Snowplow data in the `atomic.events` table in the `snowplow` schema, unless you configured your loader to use a different location. (In case of Redshift and Postgres, there will be extra tables for [self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md) — see [below](#self-describing-events)).

Please refer to [the structure of Snowplow data](/docs/understanding-your-pipeline/canonical-event/index.md) for the principles behind our approach, as well as the descriptions of the various standard columns.

:::tip Data models

Querying the “atomic” data directly can be useful for exploring your events or building custom analytics. However, for many common use cases it’s much easier to use our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md), which provide a pre-aggregated view of your data.

:::

The simplest query could look like this:

```sql
SELECT * FROM atomic.events
WHERE event_name = 'page_view'
```

:::caution

With large data volumes (read: any production system), you should always include a filter on the partition key (normally, `collector_tstamp`), for example:

```sql
WHERE ... AND collector_tstamp > '2023-10-23'
```

This ensures that you read from the minimum number of partitions necessary, making the query run much faster.

:::

## Dealing with duplicates

In some cases, your data might contain duplicate events (full deduplication _before_ the data lands in the warehouse is optionally available for [Redshift, Snowflake and Databricks on AWS](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/deduplication/index.md)).

TODO: tips for deduplication?

## Self-describing events

[Self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) can contain their own set of fields, defined by their [schema](/docs/understanding-your-pipeline/schemas/index.md).

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift/Postgres" default>

For Redshift and Postgres users, self-describing events are not part of the standard `atomic.events` table. Instead, each type of event is in its own table. The table name and the fields in the table will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query just the table for that particular self-describing event, if that's all that's required for your analysis, or join that table back to the `atomic.events` table:

```sql
select 
    ...
from 
    atomic.events ev
left join 
    atomic.my_example_unstruct_event_table sde
    on sde.root_id = ev.event_id and sde.root_tstamp = ev.collector_tstamp
```

:::caution

You may need to take care of [duplicate events](#dealing-with-duplicates).

:::

</TabItem>
<TabItem value="bigquery" label="BigQuery">

Each type of self-describing event is in a dedicated `RECORD`-type column. The column name and the fields in the record will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event like so:

```sql
select
...
unstruct_event_my_example_event_1_0_0.my_custom_field,
...
from 
    atomic.events
```

</TabItem>
<TabItem value="snowflake" label="Snowflake">

Each type of self-describing event is in a dedicated `OBJECT`-type column. The column name will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event like so:

```sql
select
...
unstruct_event_my_example_event_1:myCustomField::varchar, -- field will be variant type so important to cast
...
from 
    atomic.events
```

</TabItem>
<TabItem value="databricks" label="Databricks">

Each type of self-describing event is in a dedicated `STRUCT`-type column. The column name and the fields in the `STRUCT` will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event by extracting them like so:

```sql
select
...
unstruct_event_my_example_event_1.my_custom_field,
...
from 
    atomic.events
```

</TabItem>
</Tabs>

## Entities

[Entities](/docs/understanding-your-pipeline/entities/index.md) (also known as contexts) provide extra information about the event, such as data describing a product or a user.

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift/Postgres" default>

For Redshift and Postgres users, entities are not part of the standard `atomic.events` table. Instead, each type of entity is in its own table. The table name and the fields in the table will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

The entities can be joined back to the core `atomic.events` table by the following, which is a one-to-one join (for a single record entity) or a one-to-many join (for a multi-record entity), assuming no duplicates.

```sql
select 
    ...
from 
    atomic.events ev
left join -- assumes no duplicates, and will return all events regardless of if they have this entity
    atomic.my_custom_context_table ctx
    on ctx.root_id = ev.event_id and ctx.root_tstamp = ev.collector_tstamp
```

:::caution

You may need to take care of [duplicate events](#dealing-with-duplicates).

<details>
<summary>How to join your data with duplicates?</summary>

The method to apply de-duplication depends on if the entity is used as a single record or may have contained multiple records, as in the latter case it is entirely possible that two of the records are identical, making de-duplication a more complex task.

For single record entity the de-duplication simply requires the use of a row number over `event_id` to get each unique event:

```sql
with unique_events as (
    select
        ev.*,
        row_number() over (partition by a.event_id order by a.collector_tstamp) as event_id_dedupe_index
    from 
        atomic.events ev
),

unique_my_custom_context as (
    select
        ctx.*,
        row_number() over (partition by a.root_id order by a.root_tstamp) as my_custom_context_index
    from 
        atomic.my_custom_context_table ctx
)

select 
    ...
from 
    unique_events u_ev
left join 
    unique_my_custom_context u_ctx
    on u_ctx.root_id = u_ev.event_id and u_ctx.root_tstamp = u_ev.collector_tstamp and u_ctx.my_custom_context_index = 1
where
    u_ev.event_id_dedupe_index = 1
```

For the case of a potential multiple-record entity we need to employ a slightly more complex logic.

First de-duplicate the events table in the same way as with a single entity context, but we also keep the number of duplicates there were. In the entity table we generate a row number per unique combination of **all** fields in the record. A join is then made on `root_id` and `root_tstamp` as before, but with an **additional** clause that the row number is a multiple of the number of duplicates, to support the 1-to-many join. This ensures all duplicates are removed while retaining all original records of the entity. This may look like a weird join condition, but it works.

Unfortunately listing all fields manually can be quite tedious, but we have added support for this in the [de-duplication logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-duplicates/index.md#multiple-entity-contexts) of our dbt packages.

```sql
with unique_events as (
    select
        ev.*,
        row_number() over (partition by a.event_id order by a.collector_tstamp) as event_id_dedupe_index,
    count(*) over (partition by a.event_id) as event_id_dedupe_count
    from 
        atomic.events ev
),

unique_my_custom_context as (
    select
        ctx.*,
        row_number() over (partition by a.root_id, a.root_tstamp, ... /*all columns listed here for your context */ order by a.root_tstamp) as my_custom_context_index
    from 
        atomic.my_custom_context_table ctx
)

select 
    ...
from 
    unique_events u_ev
left join 
    unique_my_custom_context u_ctx
    on u_ctx.root_id = u_ev.event_id and u_ctx.root_tstamp = u_ev.collector_tstamp and mod(u_ctx.my_custom_context_index, u_ev.event_id_dedupe_count) = 0
where
    u_ev.event_id_dedupe_index = 1
```

</details>


:::

</TabItem>
<TabItem value="bigquery" label="BigQuery">

Each type of entity is in a dedicated `REPEATED RECORD`-type column. The column name and the fields in the record will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
select
...
contexts_my_custom_context_1_0_0[SAFE_OFFSET(0)].my_custom_field,
...
from 
    atomic.events
```

Alternatively, you can use the [`unnest`](https://cloud.google.com/bigquery/docs/reference/standard-sql/arrays#flattening_arrays) function to explode out the array:

```sql
select 
  ...,
  my_ent.a_property as my_prop
from  atomic.events
left join unnest(contexts_my_custom_context_1_0_0) as my_ent -- left join to avoid discarding events without values in this entity
```

</TabItem>
<TabItem value="snowflake" label="Snowflake">

Each type of entity is in a dedicated `ARRAY`-type column. The column name will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
select
...
contexts_my_custom_context_1[0]:myCustomField::varchar,  -- field will be variant type so important to cast
...
from 
    atomic.events
```

Alternatively, you can use the [`lateral flatten`](https://docs.snowflake.com/en/sql-reference/functions/flatten) function to explode out the array.

</TabItem>
<TabItem value="databricks" label="Databricks">

Each type of entity is in a dedicated `ARRAY<STRUCT>`-type column. The column name and the fields in the `STRUCT` will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
select
...
contexts_my_custom_context_1[0].my_custom_field,
...
from 
    atomic.events
```

Alternatively, you can use the [`LATERAL VIEW`](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-qry-select-lateral-view.html) function to explode out the array.

</TabItem>
</Tabs>

## Failed events

See [Querying failed events](/docs/managing-data-quality/exploring-failed-events/querying/index.md).

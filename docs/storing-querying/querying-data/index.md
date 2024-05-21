---
title: "Querying Snowplow data"
sidebar_label: "Querying data"
sidebar_position: 3
description: "An introduction to querying Snowplow data, including self-describing events and entities, as well tips for dealing with duplicate events"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Basic queries

You will typically find most of your Snowplow data in the `events` table. If you are using Redshift or Postgres, there will be extra tables for [self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md) — see [below](#self-describing-events).

Please refer to [the structure of Snowplow data](/docs/understanding-your-pipeline/canonical-event/index.md) for the principles behind our approach, as well as the descriptions of the various standard columns.

:::tip Data models

Querying the `events` table directly can be useful for exploring your events or building custom analytics. However, for many common use cases it’s much easier to use our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md), which provide a pre-aggregated view of your data.

:::

The simplest query could look like this:

```sql
SELECT * FROM <events>
WHERE event_name = 'page_view'
```

You will need to replace `<events>` with the appropriate location — the database, schema and table name will depend on your setup. See this [first steps section](/docs/first-steps/querying/index.md#connection-details) for details.

:::caution

With large data volumes (read: any production system), you should always include a filter on the partition key (normally, `collector_tstamp`), for example:

```sql
WHERE ... AND collector_tstamp between timestamp '2023-10-23' and timestamp '2023-11-23'
```

This ensures that you read from the minimum number of (micro-)partitions necessary, making the query run much faster and reducing compute cost (where applicable).

:::

## Self-describing events

[Self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) can contain their own set of fields, defined by their [schema](/docs/understanding-your-pipeline/schemas/index.md).

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift, Postgres" default>

For Redshift and Postgres users, self-describing events are not part of the standard `events` table. Instead, each type of event is in its own table. The table name and the fields in the table will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query just the table for that particular self-describing event, if that's all that's required for your analysis, or join that table back to the `events` table:

```sql
SELECT
    ...
FROM
    <schema>.<events> ev
LEFT JOIN
    <schema>.my_example_event_table sde
    ON sde.root_id = ev.event_id AND sde.root_tstamp = ev.collector_tstamp
```

:::caution

You may need to take care of [duplicate events](#dealing-with-duplicates).

:::

</TabItem>
<TabItem value="bigquery" label="BigQuery">

Each type of self-describing event is in a dedicated `RECORD`-type column. The column name and the fields in the record will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event like so:

```sql
SELECT
    ...
    unstruct_event_my_example_event_1.my_field,
    ...
FROM
    <events>
```

:::note
Column name produced by previous versions of the BigQuery Loader (<2.0.0) would contain full schema version, e.g. `unstruct_event_my_example_event_1_0_0`
:::

</TabItem>
<TabItem value="snowflake" label="Snowflake">

Each type of self-describing event is in a dedicated `OBJECT`-type column. The column name will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event like so:

```sql
SELECT
    ...
    unstruct_event_my_example_event_1:myField::varchar, -- field will be variant type so important to cast
    ...
FROM
    <events>
```

</TabItem>
<TabItem value="databricks" label="Databricks, Spark SQL">

Each type of self-describing event is in a dedicated `STRUCT`-type column. The column name and the fields in the `STRUCT` will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event by extracting them like so:

```sql
SELECT
    ...
    unstruct_event_my_example_event_1.my_field,
    ...
FROM
    <events>
```

</TabItem>
<TabItem value="synapse" label="Synapse Analytics">

Each type of self-describing event is in a dedicated column in JSON format. The column name will be determined by the event’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query fields in the self-describing event like so:

```sql
SELECT
    ...
    JSON_VALUE(unstruct_event_my_example_event_1, '$.myField')
    ...
FROM
    OPENROWSET(BULK 'events', DATA_SOURCE = '<events>', FORMAT = 'DELTA') AS events
```

</TabItem>
</Tabs>

## Entities

[Entities](/docs/understanding-your-pipeline/entities/index.md) (also known as contexts) provide extra information about the event, such as data describing a product or a user.

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift, Postgres" default>

For Redshift and Postgres users, entities are not part of the standard `events` table. Instead, each type of entity is in its own table. The table name and the fields in the table will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

The entities can be joined back to the core `events` table by the following, which is a one-to-one join (for a single record entity) or a one-to-many join (for a multi-record entity), assuming no duplicates.

```sql
SELECT
    ...
FROM
    <schema>.<events> ev
LEFT JOIN -- assumes no duplicates, and will return all events regardless of if they have this entity
    <schema>.my_entity ent
    ON ent.root_id = ev.event_id AND ent.root_tstamp = ev.collector_tstamp
```

:::caution

You may need to take care of [duplicate events](#dealing-with-duplicates).

:::

</TabItem>
<TabItem value="bigquery" label="BigQuery">

Each type of entity is in a dedicated `REPEATED RECORD`-type column. The column name and the fields in the record will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
SELECT
    ...
    contexts_my_entity_1[SAFE_OFFSET(0)].my_field AS my_field,
    ...
FROM
    <events>
```

Alternatively, you can use the [`unnest`](https://cloud.google.com/bigquery/docs/reference/standard-sql/arrays#flattening_arrays) function to explode out the array into one row per entity value.

```sql
SELECT
    ...
    my_ent.my_field AS my_field,
    ...
FROM
    <events>
LEFT JOIN
    unnest(contexts_my_entity_1) AS my_ent -- left join to avoid discarding events without values in this entity
```
:::note
Column name produced by previous versions of the BigQuery Loader (<2.0.0) would contain full schema version, e.g.  `contexts_my_entity_1_0_0`.
:::

</TabItem>
<TabItem value="snowflake" label="Snowflake">

Each type of entity is in a dedicated `ARRAY`-type column. The column name will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
SELECT
    ...
    contexts_my_entity_1[0]:myField::varchar,  -- field will be variant type so important to cast
    ...
FROM
    <events>
```

Alternatively, you can use the [`lateral flatten`](https://docs.snowflake.com/en/sql-reference/functions/flatten) function to explode out the array into one row per entity value.

```sql
SELECT
    ...
    r.value:myField::varchar,  -- field will be variant type so important to cast
    ...
FROM
    <events> AS t,
    LATERAL FLATTEN(input => t.contexts_my_entity_1) r
```

</TabItem>
<TabItem value="databricks" label="Databricks, Spark SQL">

Each type of entity is in a dedicated `ARRAY<STRUCT>`-type column. The column name and the fields in the `STRUCT` will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
SELECT
    ...
    contexts_my_entity_1[0].my_field,
    ...
FROM
    <events>
```

Alternatively, you can use the [`LATERAL VIEW`](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-qry-select-lateral-view.html) clause combined with [`EXPLODE`](https://docs.databricks.com/sql/language-manual/functions/explode.html) to explode out the array into one row per entity value.

```sql
SELECT
    ...
    my_ent.my_field,
    ...
FROM
    <events>
    LATERAL VIEW EXPLODE(contexts_my_entity_1) AS my_ent
```

</TabItem>
<TabItem value="synapse" label="Synapse Analytics">

Each type of entity is in a dedicated column in JSON format. The column name will be determined by the entity’s schema. See [how schemas translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md) for more details.

You can query a single entity’s fields by extracting them like so:

```sql
SELECT
    ...
    JSON_VALUE(contexts_my_entity_1, '$[0].myField')
    ...
FROM
    OPENROWSET(BULK 'events', DATA_SOURCE = '<events>', FORMAT = 'DELTA') AS events
```

Alternatively, you can use the [`CROSS APPLY` clause combined with `OPENJSON`](https://learn.microsoft.com/en-us/azure/synapse-analytics/sql/query-parquet-nested-types#project-values-from-repeated-columns) to explode out the array into one row per entity value.

```sql
SELECT
    ...
    JSON_VALUE(my_ent.[value], '$.my_field')
    ...
FROM
    OPENROWSET(BULK 'events', DATA_SOURCE = '<events>', FORMAT = 'DELTA') as events
    CROSS APPLY OPENJSON(contexts_my_entity_1) AS my_ent
```

</TabItem>
</Tabs>

## Failed events

See [Exploring failed events](/docs/managing-data-quality/exploring-failed-events/index.md).

## Dealing with duplicates

In some cases, your data might contain duplicate events (full deduplication _before_ the data lands in the warehouse is optionally available for [Redshift, Snowflake and Databricks on AWS](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/deduplication/index.md)).

While our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) deal with duplicates for you, there may be cases where you need to de-duplicate the events table yourself.

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift/postgres" label="Redshift, Postgres" default>

In Redshift/Postgres you must first generate a `ROW_NUMBER()` on your events and use this to de-duplicate.

```sql
WITH unique_events AS (
    SELECT
        ...
        ROW_NUMBER() OVER (PARTITION BY a.event_id ORDER BY a.collector_tstamp) AS event_id_dedupe_index
    FROM
        <events> a
)

SELECT
    ...
FROM
    unique_events
WHERE
    event_id_dedupe_index = 1
```

Things get a little more complicated if you want to join your event data with a table containing [entities](#entities).

Suppose your entity is called `my_entity`. If you know that each of your events has at most 1 such entity attached, the de-duplication requires the use of a row number over `event_id` to get each unique event:

```sql
WITH unique_events AS (
    SELECT
        ev.*,
        ROW_NUMBER() OVER (PARTITION BY a.event_id ORDER BY a.collector_tstamp) AS event_id_dedupe_index
    FROM
        <schema>.<events> ev
),

unique_my_entity AS (
    SELECT
        ent.*,
        ROW_NUMBER() OVER (PARTITION BY a.root_id ORDER BY a.root_tstamp) AS my_entity_index
    FROM
        <schema>.my_entity_1 ent
)

SELECT
    ...
FROM
    unique_events u_ev
LEFT JOIN
    unique_my_entity u_ent
    ON u_ent.root_id = u_ev.event_id AND u_ent.root_tstamp = u_ev.collector_tstamp AND u_ent.my_entity_index = 1
WHERE
    u_ev.event_id_dedupe_index = 1
```

If your events might have more than one `my_entity` attached, the logic is slightly more complex.

<details>

First, de-duplicate the events table in the same way as above, but also keep track of the number of duplicates (see `event_id_dedupe_count` below). In the entity table, generate a row number per unique combination of _all_ fields in the record. Then join on `root_id` and `root_tstamp` as before, but with an _additional_ clause that the row number is a multiple of the number of duplicates, to support the 1-to-many join. This ensures all duplicates are removed while retaining all original records of the entity. This may look like a weird join condition, but it works.

Unfortunately, listing all fields manually can be quite tedious, but we have added support for this in the [de-duplication logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/deduplication/index.md#multiple-entity-contexts) of our dbt packages.

```sql
WITH unique_events AS (
    SELECT
        ev.*,
        ROW_NUMBER() OVER (PARTITION BY a.event_id ORDER BY a.collector_tstamp) AS event_id_dedupe_index,
        COUNT(*) OVER (PARTITION BY a.event_id) AS event_id_dedupe_count
    FROM
        <schema>.<events> ev
),

unique_my_entity AS (
    SELECT
        ent.*,
        ROW_NUMBER() OVER (PARTITION BY a.root_id, a.root_tstamp, ... /*all columns listed here for your entity */ ORDER BY a.root_tstamp) AS my_entity_index
    FROM
        <schema>.my_entity_1 ent
)

SELECT
    ...
FROM
    unique_events u_ev
LEFT JOIN
    unique_my_entity u_ent
    ON u_ent.root_id = u_ev.event_id AND u_ent.root_tstamp = u_ev.collector_tstamp AND mod(u_ent.my_entity_index, u_ev.event_id_dedupe_count) = 0
WHERE
    u_ev.event_id_dedupe_index = 1
```

</details>

</TabItem>
<TabItem value="bigquery" label="BigQuery">

In BigQuery it is as simple as using a `QUALIFY` statement over your initial query:

```sql
SELECT
    ...
FROM <events> a
QUALIFY ROW_NUMBER() OVER (PARTITION BY a.event_id ORDER BY a.collector_tstamp) = 1
```

</TabItem>
<TabItem value="snowflake" label="Snowflake">

In Snowflake it is as simple as using a `qualify` statement over your initial query:

```sql
SELECT
    ...
FROM <events> a
QUALIFY ROW_NUMBER() OVER (PARTITION BY a.event_id ORDER BY a.collector_tstamp) = 1
```

</TabItem>
<TabItem value="databricks" label="Databricks, Spark SQL">

In Databricks it is as simple as using a `qualify` statement over your initial query:

```sql
SELECT
    ...
FROM <events> a
QUALIFY ROW_NUMBER() OVER (PARTITION BY a.event_id ORDER BY a.collector_tstamp) = 1
```

</TabItem>
<TabItem value="synapse" label="Synapse Analytics">

In Synapse you must first generate a `ROW_NUMBER()` on your events and use this to de-duplicate.

```sql
WITH unique_events AS (
    SELECT
        ...
        ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY collector_tstamp) AS event_id_dedupe_index
    FROM
        OPENROWSET(BULK 'events', DATA_SOURCE = '<events>', FORMAT = 'DELTA') AS events
)

SELECT
    ...
FROM
    unique_events
WHERE
    event_id_dedupe_index = 1
```

</TabItem>
</Tabs>

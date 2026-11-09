---
title: "Query your first events"
sidebar_position: 6.5
sidebar_label: "Query your first events"
description: "Connect to your warehouse or lake, find the page views you tracked, and query the fields of your first custom event and entity."
keywords: ["querying data", "atomic events", "data warehouse", "SQL queries", "first events"]
content_type: tutorial
date: "2026-11-09"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Snowplow loads every validated event into one `events` table in your warehouse or lake, with a row per event. This page follows on from [Create your first custom events](/docs/get-started/custom-events/index.md): you'll find the page views you tracked, then read the fields of the `product_viewed` event and `user` entity.

## Connect to your warehouse

In [Snowplow Console](https://console.snowplowanalytics.com/destinations/warehouses-lakes), open **Destinations** and select your warehouse or lake destination to see its connection details: the database or catalog, the schema, and the `events` table. Connect with your usual SQL client or the warehouse's own UI.

On Snowplow Self-Hosted, the connection details come from your Terraform variables instead. See [connect to your warehouse](/docs/destinations/warehouses-lakes/querying-data/index.md#snowplow-self-hosted) for each warehouse.

Events usually take a few minutes to arrive after you track them. In the queries below, replace `<events>` with the full name of your `events` table.

## Find your page views

Every event has the same standard columns, such as `event_name`, `app_id`, `collector_tstamp`, and `domain_userid`. This query returns the most recent page views:

```sql
SELECT
    collector_tstamp,
    app_id,
    domain_userid,
    page_urlpath
FROM <events>
WHERE event_name = 'page_view'
    AND collector_tstamp > CURRENT_DATE - 1
ORDER BY collector_tstamp DESC
LIMIT 10
```

The filter on `collector_tstamp` matters: the `events` table is partitioned on it, so the filter keeps the query fast and cheap as your data grows. [Atomic event fields](/docs/fundamentals/canonical-event/index.md) describes every standard column.

If you don't see your events, check that they passed validation. Events that fail validation aren't loaded: you'll find them in [Inspect your first failed events](/docs/get-started/failed-events/index.md).

## Query your custom event and entity

Each custom event and entity gets its own column in the `events` table, named after its schema. For the `product_viewed` event with the vendor `com.example_company`, the column is `unstruct_event_com_example_company_product_viewed_1`. The `user` entity is in `contexts_com_example_company_user_1`, as an array, because an event can carry more than one entity of the same type.

<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake" default>

```sql
SELECT
    collector_tstamp,
    unstruct_event_com_example_company_product_viewed_1:productId::varchar AS product_id,
    unstruct_event_com_example_company_product_viewed_1:price::number(10,2) AS price,
    contexts_com_example_company_user_1[0]:userType::varchar AS user_type
FROM <events>
WHERE event_name = 'product_viewed'
    AND collector_tstamp > CURRENT_DATE - 1
```

Fields are `VARIANT` values, so cast them to the type you need.

</TabItem>
<TabItem value="bigquery" label="BigQuery">

```sql
SELECT
    collector_tstamp,
    unstruct_event_com_example_company_product_viewed_1.product_id,
    unstruct_event_com_example_company_product_viewed_1.price,
    contexts_com_example_company_user_1[SAFE_OFFSET(0)].user_type
FROM <events>
WHERE event_name = 'product_viewed'
    AND collector_tstamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
```

Field names are converted to snake case, so `productId` becomes `product_id`.

</TabItem>
<TabItem value="databricks" label="Databricks">

```sql
SELECT
    collector_tstamp,
    unstruct_event_com_example_company_product_viewed_1.product_id,
    unstruct_event_com_example_company_product_viewed_1.price,
    contexts_com_example_company_user_1[0].user_type
FROM <events>
WHERE event_name = 'product_viewed'
    AND collector_tstamp > current_date() - 1
```

Field names are converted to snake case, so `productId` becomes `product_id`.

</TabItem>
<TabItem value="redshift" label="Redshift">

On Redshift, each custom event and entity is in its own table, named after its schema, such as `com_example_company_product_viewed_1`. Join it to the `events` table on the event ID and timestamp:

```sql
SELECT
    ev.collector_tstamp,
    pv.product_id,
    pv.price
FROM <schema>.events ev
JOIN <schema>.com_example_company_product_viewed_1 pv
    ON pv.root_id = ev.event_id AND pv.root_tstamp = ev.collector_tstamp
WHERE ev.collector_tstamp > CURRENT_DATE - 1
```

</TabItem>
</Tabs>

[How schemas become columns](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md) explains the naming rules, including what happens when you publish a new schema version. For entities with several values, duplicate events, and Synapse Analytics, see [Query Snowplow data in your warehouse](/docs/destinations/warehouses-lakes/querying-data/index.md).

Rather than writing every query against raw events, most teams [run a data model](/docs/get-started/modeling/index.md) next, which builds page view, session, and user tables from the `events` table.

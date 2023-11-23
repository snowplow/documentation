---
title: "Querying failed events in Postgres"
sidebar_label: "Using Postgres"
sidebar_position: 3
---

If you use the [Postgres Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md) (not recommended for large volume production use cases), you can load your [failed events](/docs/understanding-your-pipeline/failed-events/index.md) into Postgres.

Each type of failed event is stored in its own table. You can get a full list of tables with the following query:

```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'badrows';
```

:::info Database schema name

The example above uses `badrows` as the database schema name in Postgres. This will depend on how you’ve set up your loader. Typically, it’s `badrows` for [Try Snowplow](/docs/try-snowplow/index.md) and `atomic_bad` for [Community Edition Quick Start](/docs/getting-started-on-snowplow-open-source/what-is-quick-start/index.md).

We will use `badrows` throughout the rest of this page — feel free to substitute your own schema name.

:::

For instance, to check the number of [schema violations](/docs/understanding-your-pipeline/failed-events/index.md#schema-violation), you can query the respective table:

```sql
SELECT COUNT(*) FROM badrows.com_snowplowanalytics_snowplow_badrows_schema_violations_2;
```

Taking it further, you can check how many failed events you have by [schema](/docs/understanding-your-pipeline/schemas/index.md) and error type:

```sql
SELECT
   "failure.messages"->0->'error'->'error' AS error,
   "failure.messages"->0->'schemaKey' AS schema,
   count(*) AS failed_events
FROM badrows.com_snowplowanalytics_snowplow_badrows_schema_violations_2
GROUP BY 1,2
ORDER BY 3 DESC
```

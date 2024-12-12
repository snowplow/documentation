---
title: "Querying failed events in Postgres"
sidebar_label: "Using Postgres"
sidebar_position: 3
---

If you use the [Postgres Loader](/docs/api-reference/loaders-storage-targets/snowplow-postgres-loader/index.md) (not recommended for large volume production use cases), you can load your [failed events](/docs/fundamentals/failed-events/index.md) into Postgres.

Each type of failed event is stored in its own table. You can get a full list of tables with the following query:

```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'atomic_bad';
```

For instance, to check the number of [schema violations](/docs/fundamentals/failed-events/index.md#schema-violation), you can query the respective table:

```sql
SELECT COUNT(*) FROM atomic_bad.com_snowplowanalytics_snowplow_badrows_schema_violations_2;
```

Taking it further, you can check how many failed events you have by [schema](/docs/fundamentals/schemas/index.md) and error type:

```sql
SELECT
   "failure.messages"->0->'error'->'error' AS error,
   "failure.messages"->0->'schemaKey' AS schema,
   count(*) AS failed_events
FROM atomic_bad.com_snowplowanalytics_snowplow_badrows_schema_violations_2
GROUP BY 1,2
ORDER BY 3 DESC
```

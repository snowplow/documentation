---
title: "Migrating to Snowflake Streaming Loader from RDB Loader"
sidebar_label: "Migrating from RDB Loader"
sidebar_position: 2
description: "Migrate from RDB Loader to Snowflake Streaming Loader for lower latency and cost with same table or fresh table strategies."
keywords: ["snowflake migration", "rdb to streaming", "loader migration", "streaming upgrade", "snowflake switch"]
---

This guide is aimed at Snowplow users who load events into Snowflake via the [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md).

We recommend migrating to use the [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) because it has a much lower latency and is cheaper to run.

There are two migration strategies you might take:

1. [Load into the same table as before](#load-into-the-same-table-as-before). This way you have a single events table, containing old events loaded with RDB Loader and new events loaded by the Streaming Loader.
2. [Load into a fresh new table](#load-into-a-fresh-new-table-with-the-streaming-loader) with the Streaming Loader. This is a more cautious approach, but you will need to point any data models or downstream applications, dashboards, etc, to the new table.

## Load into the same table as before

The Streaming Loader is fully compatible with the table created and managed by the recent versions of RDB Loader.  In particular, these aspects are exactly the same as before:

- There are 129 columns for the atomic fields, common to all Snowplow events
- [Self-describing events](/docs/fundamentals/events/index.md#self-describing-events) are loaded into columns named like `unstruct_event_com_example_button_press_1`
- [Entities](/docs/fundamentals/entities/index.md) are loaded into columns named like `contexts_com_example_user_1`
- For both self-describing events and entities, a new column is created for each major version of the Iglu schema

:::tip

[This page](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md) explains how Snowplow data maps to the warehouse in more detail.

:::

You will notice some subtle differences:

#### New `_schema_version` property in entities

Previously, when loading entities into the table, RDB Loader would drop any information about exactly which version of the schema had been used to validate them.

The Streaming Loader adds an extra property called `_schema_version`, so the versioning information is not lost in the warehouse.

For example, if a tracker sends an entity like this:

```json
{
  "schema": "iglu:com.example/my_schema/jsonschema/1-0-3",
  "data": {
    "a": 1
  }
}
```

Then the value loaded into the `contexts_com_example_my_schema_1` column is this:

```json
{
  "a": 1,
  "_schema_version": "1-0-3"
}
```

#### Null values omitted from entities

For self-describing events and entities, the Streaming Loader omits values that are explicitly set to `null`.  This differs from RDB loader, which stores them.

For example, if a tracker sends an entity like this:

```json
{
  "schema": "iglu:com.example/my_schema/jsonschema/1-0-0",
  "data": {
    "a": 1,
    "b": null,
    "c": null
  }
}
```

Then the value loaded into the `contexts_com_example_my_schema_1` column is this (note the `b` and `c` fields are missing):

```json
{
  "a": 1
}
```

We made this change as a performance optimization for querying data.  The Snowflake docs [explain](https://docs.snowflake.com/en/user-guide/semistructured-considerations) that JSON `null` values affect how Snowflake extracts nested properties. Snowflake automatically builds indexes on the nested properties of VARIANT columns, but only if those properties do not contain explicit `null` values.

#### The `load_tstamp` field is required before migrating

:::note

This only affects users migrating from RDB Loader older than version 4.0.0.

:::

The Snowflake events table must have a column named `load_tstamp` of type `TIMESTAMP`.  If you have ever used a version of RDB Loader newer than 4.0.0, then it will have already added this column for you.  But if you are migrating from an older version of RDB Loader then you will need to add the column manually:

```sql
ALTER TABLE events ADD COLUMN load_tstamp TIMESTAMP
```

## Load into a fresh new table with the Streaming Loader

The Snowflake Streaming Loader will automatically create the events table when you run it for the first time. If you are familiar with the RDB Loader's table, then all of the points in the previous section are still relevant to you.  You will also notice a few other differences:

#### No maximum lengths on VARCHAR columns

The old table created by RDB Loader had maximum lengths on some of the columns, e.g. `app_id VARCHAR(255)`.  The new Streaming Loader creates columns without max lengths, e.g. `app_id VARCHAR`.

#### VARCHAR instead of CHAR

When RDB Loader created the events table, it used a mixture of VARCHAR and CHAR column types for the various different string fields.  For the sake of simplicity, the Streaming Loader uses VARCHAR column types only.  In Snowflake, there is no meaningful difference between the two column types.

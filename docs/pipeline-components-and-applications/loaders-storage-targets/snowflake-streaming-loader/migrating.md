---
title: "Migrating to Snowflake Streaming Loader from RDB loader"
sidebar_label: "Migrating from RDB loader"
sidebar_position: 2
---

This guide is aimed at Snowplow users who were previously using RDB Loader to load events into Snowflake.
We recommend migrating to use the Snowflake Streaming Loader because it is more real-time and it is cheaper to run.

There are two migration strategies you might take:

1. Load into the same table as before.  So you have a single events table, containing old events loaded with RDB Loader and new events loaded by the streaming loader.
2. Load into a fresh new table with the streaming loader

This article explains both strategies

## Load into the same table as before

The streaming loader is fully compatible with the table created and loaded by RDB Loader.  In particular these aspects are exactly the same as before:

- There are 129 columns for the atomic fields, common to all Snowplow events
- Self-describing events are loaded into columns named like `unstruct_event_com_example_button_press_1`
- Self-describing context entities are loaded into columns named like `contexts_com_example_user_1`.
- For the self-describing columns, a new column is created for each major version of the Iglu schema.

Aside from those similarites, you will notice some subtle differences:

#### New `_schema_version` property in context entities

Previously, when loading self-describing contexts into the table, RDB Loader would drop any information about exactly which version of the schema had been used to validate the context.

The streaming loader adds an extra property `_schema_version` to the context, so the versioning information is not lost in the warehouse.

For example, if a tracker sends a self-describing context like this:

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

#### Null values dropped from entities

The streaming loader does not load explicitly null properties from self-describing events or self-describing context entities.  This differs from RDB loader, which would have loaded the explicit nulls.

For example, if a tracker sends a self-describing context like this:

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

Then the value loaded into the `contexts_com_example_my_schema_1` column is this:

```json
{
  "a": 1
}
```

We made this change as a performance optimization when querying data.  The Snowflake docs [explain](https://docs.snowflake.com/en/user-guide/semistructured-considerations) that JSON null values affect how Snowflake extracts nested properties. Snowflake automatically builds indexes on the nested properties of VARIANT columns, but only if those properties do not contain explicit nulls.

#### The `load_tstamp` field is required before migrating

This only affects users migrating from an RDB loader older than version 4.0.0

The Snowflake events table must have a column named `load_tstamp` of type `TIMESTAMP`.  If you have ever used a version of RDB Loader newer than 4.0.0, then it will have already added this column for you.  But if you are migrating from an older version of RDB Loader then you will need to add the column manually:

```sql
ALTER TABLE events ADD COLUMN load_tstamp TIMESTAMP
```

## Load into a fresh new table with the streaming loader

The Snowflake Streaming Loader will automatically create the events table when you run it for the first time. If you are familiar with the RDB Loader's table, then all of the points in the previous section are still relevant to you.  You will also notice a few other differences:

#### No maximum lengths on VARCHAR columns

The old table created by RDB Loader had maximum lengths on some of the columns, e.g. `app_id VARCHAR(255)`.  The new streaming loader creates columns without max lengths, e.g. `app_id VARCHAR`.

#### VARCHAR instead of CHAR

When the old RDB Loader created the events table, it used a mixture of VARCHAR and CHAR column types for the various different string field.  For the sake of simplicity, new streaming loader uses VARCHAR column types only.  In Snowflake there is no meaningful difference between the two column types.


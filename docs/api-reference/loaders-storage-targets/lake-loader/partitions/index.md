---
title: "Partitioning of your lake"
description: "Lake partitioning strategy by load timestamp and event name for optimal query performance with Delta Lake and Iceberg tables in Lake Loader."
sidebar_label: "Partitioning"
sidebar_position: 2
---

A lake created by the Lake Loader has two levels of partitioning:

1. By the date that the event is loaded to the lake. For Iceberg, we use a [partition transform](https://iceberg.apache.org/spec/#partitioning) `date(load_tstamp)`.  For Delta, we create a [generated column](https://delta.io/blog/2023-04-12-delta-lake-generated-columns/) called `date_load_tstamp` defined as `generatedAlwaysAs(CAST(load_tstamp AS DATE))`.
2. By the `event_name` field.

This structure of partitioning works very well with queries that filter on `load_tstamp` and/or `event_name`.  It works especially well with incremental models, which only ever process the most recently loaded events.

:::note Session Timestamp
If you are using Snowplow's DBT packages, then set the `session_timestamp` variable to `load_stamp` to match the table's partitioning.
:::

If you run a query with a clause like `WHERE load_tstamp > ?`, then your query engine can go directly to the partition containing the relevant files.  Even better, because Delta and Iceberg collect file-level statistics, such a query can go directly to the relevant files within the partition, matching exactly the `load_tstamp` of interest.

If you often write queries over a single type of event, e.g. `WHERE event_name = 'add_to_cart'` then the query engine can do a very efficient query over the parquet files for the specific event.

:::note
The Lake Loader has been optimized for writing into a lake with the default partitioning, and the loader will not perform so well with any other partitioning. For these reasons, we strongly advise that you do not change the partitioning structure of your lake.
:::

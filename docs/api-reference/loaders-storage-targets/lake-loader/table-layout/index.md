---
title: "Choose a table layout for your lake"
sidebar_label: "Table layout"
sidebar_position: 2
description: "Compare the Lake Loader's table layouts, partitioned by event_name or app_id or clustered by load_tstamp, and choose the one that suits how you query your events table."
keywords: ["lake partitioning", "liquid clustering", "table layout", "event_name partition", "app_id partition", "load_tstamp"]
date: "2026-11-26"
content_type: concept
---

The table layout decides how the Lake Loader arranges your events table into files: which files a query has to open, how many files the loader writes, and how much work your compaction jobs do. The loader sets the layout when it creates the table, so you choose it before the loader first runs.

Every layout keeps the newest events together, so queries that filter on `load_tstamp`, including Snowplow's incremental data models, read only the files they need. The layouts differ in how they treat queries that also filter on `event_name` or `app_id`. Choose the layout that matches how you query your data. The difference to your total compute is a few percent either way, so it isn't a reason to migrate a table you already have.

## Available layouts

The Lake Loader offers three layouts. Every layout is available on Delta, and the partitioned layouts are also available on Iceberg:

| Layout | Delta | Iceberg | Suits |
| --- | --- | --- | --- |
| Partitioned by `event_name` (default) | Partitioned by `load_tstamp_date` and `event_name` | Partitioned by `day(load_tstamp)` and `event_name` | Models and queries that target specific events |
| Partitioned by `app_id` <AppliesTo feature="lake-loader-table-layout" /> | Partitioned by `load_tstamp_date` and `app_id` | Partitioned by `day(load_tstamp)` and `app_id` | Queries that target one application, when you have only a few `app_id` values |
| Time only <AppliesTo feature="lake-loader-table-layout" /> | Not partitioned, with liquid clustering on `load_tstamp` | Not available | Models that read every event type over a recent time range |

On a partitioned Delta table, `load_tstamp_date` is a generated column, defined as `CAST(load_tstamp AS DATE)`. A time-only Delta table has no `load_tstamp_date` column.

A time-only Delta table collects file statistics on `event_name` and `app_id` as well as on the timestamp columns. Delta can only cluster on a column it has statistics for, so collecting these statistics lets you add either column to the table's clustering keys later. See [Cluster a time-only table by event type](/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/index.md?lake-format=delta#cluster-a-time-only-table-by-event-type).

If you self-host the Lake Loader, choose the layout with the `output.good.partitionColumn` setting: `event_name`, `app_id`, or `null` for time only. See the [configuration reference](/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/index.md).

:::note[Session timestamp]
If you use Snowplow's dbt packages, set the `snowplow__session_timestamp` variable to `load_tstamp`, so that the models' incremental queries filter on the column every layout is arranged by.
:::

## How each layout arranges your files

The Lake Loader commits a batch of events to the lake every few minutes. Every file in a commit has the same `load_tstamp`. The layouts differ in how each commit is split into files, and in what compaction does with those files afterwards.

A partitioned table gets a separate file for every event type in every commit, written into that event type's partition. A time-only table gets roughly one file per CPU core of the loader in every commit, and each file holds a mix of event types. The diagram shows two commits, five minutes apart:

```mermaid
flowchart LR
  subgraph p["Partitioned by event_name"]
    direction TB
    p1["10:00 · page_view"]
    p2["10:00 · link_click"]
    p3["10:00 · refund (tiny)"]
    p4["10:05 · page_view"]
    p5["10:05 · link_click"]
    p6["10:05 · refund (tiny)"]
  end
  subgraph t["Time only"]
    direction TB
    t1["10:00 · mixed event types"]
    t2["10:00 · mixed event types"]
    t3["10:05 · mixed event types"]
    t4["10:05 · mixed event types"]
  end
```

In text, the diagram shows:

1. On the partitioned table, every commit writes one file per event type, so rare events such as `refund` produce a tiny file in every commit.
2. On the time-only table, every commit writes a few larger files, each holding a mix of event types.
3. On both tables, every file covers exactly one point in time, so a query on a recent `load_tstamp` range skips every older file.

This leads to different strengths:

- **Partitioned by `event_name`**: a query that filters on `event_name` goes straight to that event's partition and skips every other event type, on freshly loaded data and after any compaction. The cost is many more files, many of them small. A query that reads every event type opens all of them, which adds a few percent to models such as Snowplow's unified package. Partitioning by `app_id` works the same way for queries that filter on `app_id`.
- **Time only**: a query that reads every event type over a recent time range opens far fewer files. A query that filters on `event_name` can't skip files by event type, so it reads every event in its time range. After compaction, a table clustered on `load_tstamp` alone still mixes event types in every file.

Compaction affects each layout differently. On a partitioned table, compaction merges each event type's small files into larger ones. On a time-only Delta table, `OPTIMIZE` merges files and clusters them by the table's clustering keys. See [Lake maintenance jobs](/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/index.md).

## Choose a layout

Choose by how you query your events table:

- **Partitioned by `event_name`**: choose this if you run models or queries that target specific events, such as Snowplow's ecommerce or media player packages, your own event-specific models, or analysis of particular events. It keeps working whatever compaction you run. It's the default.
- **Partitioned by `app_id`**: choose this if your queries mostly target one application at a time, and you have only a few distinct `app_id` values. Every `app_id` gets its own partition per day, so many `app_id` values produce many small files.
- **Time only**: choose this if your modeling mostly reads every event type, such as Snowplow's unified package on its own. It depends least on compaction, because reads of every event type are efficient even before compaction runs. It's only available on Delta.

## Change a table after it's created

The Lake Loader sets a table's partitioning when it creates the table, and the partitioning can't change afterwards. When the loader starts, it checks that the table's partitioning matches the layout it's configured with. If the table is partitioned differently, or is partitioned when the loader expects a time-only table, or the other way around, the loader stops and reports a setup error. It reports the same error if you create the table yourself, ahead of the loader, with partitioning that doesn't match.

A time-only Delta table's clustering keys are different. The loader sets them when it creates the table, but never checks them afterwards, so you can change them at any time, without stopping the loader or changing its configuration. The next `OPTIMIZE` uses the new keys. For example, adding `event_name` as a second clustering key makes the table efficient for event-specific queries once it's compacted. See [Cluster a time-only table by event type](/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/index.md?lake-format=delta#cluster-a-time-only-table-by-event-type).

For how to compact each layout, see [Lake maintenance jobs](/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/index.md). For every loader setting, see the [configuration reference](/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/index.md).

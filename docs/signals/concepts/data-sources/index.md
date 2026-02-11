---
title: "Data sources"
sidebar_position: 20
sidebar_label: "Data sources"
description: "Learn about real-time stream and batch data sources for calculating Signals attributes."
keywords: ["data sources", "stream", "batch", "external batch", "warehouse"]
date: "2026-02-04"
---

Whether to compute attributes in real-time from the event stream or in batch from the warehouse is an important decision. Broadly, you might use:
* **Stream** for real-time use cases, such as tracking the latest product a user viewed, or the number of page views in a session
* **Batch** sources (warehouse tables) for historical analysis, such as calculating a user's purchase history or average session length

This table summarizes the options for different types of processing:

| Feature                            | Supported in real-time stream                                     | Supported in batch            |
| ---------------------------------- | ----------------------------------------------------------------- | ----------------------------- |
| Real-time calculation              | ✅                                                                 | ❌                             |
| Time windowing operations          | ✅                                                                 | ✅                             |
| Computing user lifetime attributes | ✅ from the point at which the attribute was defined               | ✅                             |
| Reprocessing data                  | ❌ attributes are only calculated from the moment they are defined | ✅                             |
| Non-Snowplow data                  | ❌                                                                 | ✅ using external batch source |  |

## Stream source

When Signals is deployed in your pipeline, the event stream is read by the streaming engine. All tracked events are inspected.

Real-time stream flow:
1. Behavioral data event is received by [Collector](/docs/pipeline/collector/index.md)
2. Event is enriched by [Enrich](/docs/pipeline/enrichments/index.md)
3. The Signals stream engine reads from the events stream
4. The stream engine checks if attributes are defined for the event
5. Are there any attributes to calculate?
   * No: nothing happens, and the process ends
   * Yes: processing continues
6. Signals evaluates and computes the attributes
7. Updated attributes are pushed to the Profiles Store

## Batch source

The batch data source uses dbt to generate and calculate new tables of attributes from your
Snowplow atomic events table. Signals then syncs them to the Profiles Store periodically using the sync engine.

Batch flow:
1. Behavioral data events arrive in the warehouse
2. Signals compares timestamps to check for new rows in the atomic events table
3. Are there any new rows?
   * No: nothing happens
   * Yes: processing continues
4. Signals runs dbt models to update the attribute tables
5. Updated tables are synced to the Profiles Store

## External batch source

Use an external batch source to sync tables of existing, pre-calculated values to the Profiles Store. The external batch tables can be any data. For example, you may want to include transactional data in your Signals use case.

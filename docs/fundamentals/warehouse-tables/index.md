---
title: "Introduction to the atomic events table"
description: A summary of the Snowplow events table and its fields, including custom events and entities
sidebar_label: "Warehouse tables"
sidebar_position: 4
---

All Snowplow events have the same underlying structure and standard fields. All of these fields can be found in the `atomic.events` table, which is a "wide" (many columns) table.

Each line in the atomic events table represents a single event, be that a `page_view`, `add_to_basket`, `play_video`, etc.

Individual fields are stored in their own columns. Check out the [event properties reference](/docs/fundamentals/canonical-event/index.md) for a full list of standard fields. In most warehouses, [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) and [entities](/docs/fundamentals/entities/index.md) are stored as additional columns in the `atomic.events` table.

:::tip Don't mutate the atomic events table
The Snowplow data table is designed to be immutable: the data in each line should not change over time.

Data points that you would expect to change over time e.g. what cohort a particular user belongs to, or how you classify a particular visitor, can be derived from Snowplow data. Our recommendation is that you define and calculate these derived fields at analysis time, store them in a separate table, and join to the `atomic.events` table when performing any analysis.
:::

Learn about querying Snowplow data [here](/docs/destinations/warehouses-lakes/querying-data/index.md).

## Redshift table structure

In Redshift, unlike other warehouses, [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) and [entities](/docs/fundamentals/entities/index.md) are stored in their own dedicated tables.

These additional tables can be joined back to the core `atomic.events` table, by joining on the `root_id` field in the self-describing event or entity table with the `event_id` in the `atomic.events` table, and the `root_tstamp` and `collector_tstamp` field in the respective tables.

You can still query the data as if it were in a single wide table. This is because:
- The joins from the additional tables to the core `atomic.events` table are one-to-one
- The field joined on is the distribution key for both tables, so queries are as fast as if the data were in a single table

## Schemas in the warehouse

To understand how self-describing events and entities are translated into warehouse columns, check out this [reference page](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md).

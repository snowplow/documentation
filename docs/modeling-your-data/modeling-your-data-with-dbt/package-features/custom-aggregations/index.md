---
title: "Custom Aggregations"
description: "Details on custom aggregations in our packages"
sidebar_position: 60
---

While [passthrough fields](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/passthrough-fields/index.md) enable you to add fields from the event itself into derived tables, you may at times also wish to do aggregations on the identifier for that table, e.g. session identifier, to provide more information in your derived tables without having to make a full [custom model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md). This is where Custom Aggregations come in; they allow you to calculate aggregations directly as part of the derived table logic, without having to build your own models.

## Availability

| Package | Minimum Required Version |
| ------- | ------------------------ |
| Unified | 0.3.0                    |

## Usage

To use a the custom aggregation, you need to set the relevant variable in your root `dbt_project.yml` file; e.g `snowplow__session_aggregations` (see your package [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for a full list of aggregation variables).

These variables are lists of objects that define your aggregations; they have keys of the `type` of aggregations you wish to do, the `field` to aggregate over, and the `alias` to give your aggregation in the derived table.

The `field` can be any valid column sql, including `case when` statements or making use of other sql functions. For example, to count the number of `purchase` events over a session you would have:

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__view_aggregations: [{'type': 'sum', 'field': "case when event_name = 'purchase' then 1 else 0 end", 'alias': 'num_purchase_events'}]
```
The aggregation always runs on the [events this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#events-this-run) table so all events (with a session identifier) and columns are available for you to use.

Note that how to extract and use field from your entity or self-describing event columns will depend on your warehouse (see our [querying guide](/docs/destinations/warehouses-lakes/querying-data/index.md#entities) for more information), and you are unable to use dbt macros in this variable.

### Supported Aggregations
Currently we support the following aggregations:

| Aggregation    | `type` value |
| -------------- | ------------ |
| Count          | `count`      |
| Sum            | `sum`        |
| Minimum        | `min`        |
| Maximum        | `max`        |
| Average        | `avg`        |
| Count Distinct | `countd`     |

## Usage Notes

:::warning

It is unlikely, although not impossible, that when using the SQL approach you may need to provide a table alias to avoid ambiguous references, in this case please see the model sql file for the specific alias used for the `snowplow_unified_base_events_this_run` table in each case.

:::

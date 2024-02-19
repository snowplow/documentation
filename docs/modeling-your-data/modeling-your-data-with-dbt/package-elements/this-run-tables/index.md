---
title: "This Run Tables"
description: "Details about the this run table approach use in our packages."
sidebar_position: 10
---

## Events This Run
As described in the [incremental sessionization logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-elements/incremental-processing/index.md), the first thing we do in any given run is identify what events need to be processed as part of that run. These events are [deduplicated](/docs/modeling-your-data/modeling-your-data-with-dbt/package-elements/deduplication/index.md), have relevant [entities and SDEs](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/index.md) extracted and attached, and the appropriate [identifiers](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/customer-identifiers/index.md) are calculated.

This table of events is then used for all further processing in the package, we refer to this table as `events this run`.

| Package | Events This Run Name |
| unified | `snowplow_unified_events_this_run` |
| ecommerce |  |
| media |  |
| normalize |  |
| attribution |  |

:::tip

Unified also contains a `snowplow_unified_base_events_this_run` 

:::

## Base Sessions This Run

## Other This Run Tables

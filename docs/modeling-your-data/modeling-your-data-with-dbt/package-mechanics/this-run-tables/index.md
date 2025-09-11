---
title: "This run tables"
description: "Understand this-run tables in dbt packages for incremental behavioral data processing."
schema: "TechArticle"
keywords: ["This Run", "DBT Tables", "Run Tables", "DBT Mechanics", "Incremental Processing", "DBT Internals"]
sidebar_position: 40
---

Our packages make use of a series of `this run` tables, named such because they are dropped and recreated each `dbt run` to only contain relevant information that that run. These tables allow for efficient re-use of information throughout a single run, and also allow you to debug any issues should a run fail.

## Events this run
As described in the [incremental sessionization logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md), the first thing we do in any given run is identify what events need to be processed as part of that run. These events are [deduplicated](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/deduplication/index.md), have relevant [entities and SDEs](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/index.md) extracted and attached, and the appropriate [identifiers](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-identifiers/index.md) are calculated.

This table of events is then used for all further processing in the package, we refer to this table as `events this run`. This is the table to use in the case of building most [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) that require the event level data.

In all cases where this table exists, it is in the `models/base/scratch/` directory within the package.

| Package     | Events This Run Name                              |
| ----------- | ------------------------------------------------- |
| unified     | `snowplow_unified_events_this_run`                |
| ecommerce   | `snowplow_ecommerce_base_events_this_run`         |
| media       | `snowplow_media_player_base_events_this_run`      |
| normalize   | `snowplow_normalize_base_events_this_run`         |
| attribution | None, this package does not build from raw events |

:::tip

Unified also contains a `snowplow_unified_base_events_this_run`, however this builds into `snowplow_unified_events_this_run` so we recommend you use the more complete table.

:::

## Base sessions this run
The sessions this run table is built before the events this run table, and contains a list of all all the sessions that are being processed in the current run. It is a modified sub-set of the [sessions lifecycle manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/index.md) with only the sessions within the run limits, and with the end timestamp capped to the upper limit of the run (in case of historic re-processing).

In all packages that contain this table, it named of the form `snowplow_<package_name>_base_sessions_this_run` and is located in the `models/base/scratch` directory within the package.

There should be no need to directly interact with this table but may be useful debugging any errors.

## Other this run tables
Our packages are built in a way that makes it easy to make small alterations and additions to the derived models. Most derived models, such as `sessions`, or `views` will have a corresponding this run table. The actual incremental derived model itself is just a `select *` from this table (with a date field added for Databricks). This becomes useful in [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) and is also helpful to run tests on just the incremental data or to identify any issues. We recommend using the output of these where possible, but not directly overwriting them as this may put you out of sync with any updates we release. See the [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) docs for more information about how best to use these tables.

The usual folder structure, although this can vary a bit by package is that these this run tables tend to sit at either `models/<module>/scratch/snowplow_<package_name>_<module>_this_run` or `models/<module>/scratch/<warehouse>/snowplow_<package_name>_<module>_this_run` when there are different versions of the model per warehouse.

---
title: "Identities Quickstart"
sidebar_label: "Identities"
sidebar_position: 70
description: "Quick start guide for the Snowplow Identities dbt package to transform identity entities and merge events into resolved identity tables."
keywords: ["identities quickstart", "identities setup", "dbt identities installation"]
date: "2026-03-23"
---

This guide walks you through setting up the [Snowplow Identities dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-identities-data-model/index.md).

## Requirements

- dbt Core 1.10.6 or later, below 2.0.0
- Snowflake, BigQuery, or Databricks warehouse
- The [Snowplow Identities service](/docs/identities/index.md) must be enabled and generating identity entities and merge events in your atomic schema

For Databricks, use `dbt-databricks` with a Databricks SQL warehouse or Runtime 12.2 LTS or later. The source events must contain identity entities as typed arrays of structs and merge events as typed structs, as produced by the Snowplow Databricks loader. The package does not support standalone Spark.

## Installation

Add the package from [GitHub](https://github.com/snowplow-incubator/dbt-snowplow-identities) to your `packages.yml`:

```yaml title="packages.yml"
packages:
  - git: "https://github.com/snowplow-incubator/dbt-snowplow-identities.git"
    revision: "0.2.0"
```

If you use 0.1.0 or previously installed from `main`, follow the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/index.md) before upgrading.

Then run:

```bash
dbt deps
```

## Configure the package

The steps below walk through each variable you need to set in your `dbt_project.yml` to get the package running. Check out the [configuration reference](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/identities/index.mdx) for more details.

### 1. Accept the license

The package is licensed under the [Snowplow Personal and Academic License (SPAL)](/personal-and-academic-license-1.0/). You must accept the license before the package will run. Add the following to your `dbt_project.yml`:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__license_accepted: true
```

### 2. Override the dispatch order

To take advantage of the optimized upserts that the Snowplow packages offer, ensure that certain macros are called from `snowplow_utils` before `dbt-core`. Add the following to the top level of your `dbt_project.yml`:

```yaml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

### 3. Set the start date

Set `snowplow__start_date` to the date from which you want to begin processing identity data:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__start_date: 'yyyy-mm-dd'
```

### 4. Configure your identifiers

The `snowplow__identifiers` variable controls which event fields are extracted as identifiers and how they appear in the output tables. Each entry has a `reference` (the column name in your events table) and an `alias` (the name used in the output). By default, `domain_userid` and `user_id` are included:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__identifiers:
      - reference: domain_userid
        alias: domain_userid
      - reference: user_id
        alias: user_id
```

This list should reflect the identifiers you have [configured in the Identities service](/docs/identities/configuration/index.md) via Console. You can also include additional identifiers from your events that you want available in the output tables, even if they aren't configured in Console for identity resolution.

### 5. Check source data

The package reads from your atomic events table. By default, it assumes the `atomic` schema in your `target.database`. To override this, add the following to your `dbt_project.yml`:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
```

On Databricks, `snowplow__database` is ignored. Set the source catalog with `snowplow__databricks_catalog` (default: `hive_metastore`) and the source schema with `snowplow__atomic_schema`:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__databricks_catalog: catalog_with_snowplow_events
    snowplow__atomic_schema: schema_with_snowplow_events
```

Configure the destination catalog and schema in your dbt Databricks profile. If your source table is not named `events`, set `snowplow__events_table`.

### 6. Filter your data set *(optional)*

This step is optional. To restrict processing to specific app IDs, set `snowplow__app_id`:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__app_id: ['my_app_1', 'my_app_2']
```

Identity-service merge events use a separate filter, `snowplow__identities_app_id`,
which defaults to `['snowplow-identities']`. Set it to the actual service app ID if different;
`snowplow__app_id` filters your application identity events only.

### 7. Hash identifiers *(optional)*

This step is optional. If your identifiers contain PII, set `snowplow__hash_identifiers` to `true`. This applies a SHA-256 hash to all `id_value` entries in the `snowplow_identities_identifier_mapping` output table:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__hash_identifiers: true
```

### 8. Run the package

Run the package with this command:

```bash
dbt run --select package:snowplow_identities
```

Run this package before any other Snowplow dbt packages, so that downstream models can reference the resolved identities.

## Full refresh and backfill

Version 0.2.0 tracks progress from each model's `load_tstamp`; it has no progress manifest.
The old `snowplow__allow_refresh` and `snowplow__dev_target_name` variables no longer apply.
A full refresh rebuilds package outputs from `snowplow__start_date`, so verify source
retention and back up existing outputs first.

```bash
dbt run --full-refresh --select package:snowplow_identities
```

The first build processes the configured backfill window. Run again without `--full-refresh`
to continue. Empty periods advance to the first eligible day. Before switching consumers,
finish the backfill and run:

```bash
dbt test --select package:snowplow_identities
```

The [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/index.md)
explains the required first full refresh for 0.1.0 installations, removed history tables,
source-retention requirements and rollback.

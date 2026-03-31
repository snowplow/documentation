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

- dbt 1.10.6 or later
- Snowflake or BigQuery warehouse
- The [Snowplow Identities service](/docs/identities/index.md) must be enabled and generating identity entities and merge events in your atomic schema

## Installation

Add the package to your `packages.yml`:

```yaml title="packages.yml"
packages:
  - package: snowplow/snowplow_identities
    version: [">=0.1.0", "<0.2.0"]
```

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

### 6. Filter your data set *(optional)*

This step is optional. To restrict processing to specific app IDs, set `snowplow__app_id`:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__app_id: ['my_app_1', 'my_app_2']
```

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
dbt run --select snowplow_identities
```

Run this package before any other Snowplow dbt packages, so that downstream models can reference the resolved identities.

## Full refresh

By default, running `dbt run --full-refresh` won't drop the incremental manifest, as this would reset all incremental processing. To allow a full reset, set `snowplow__allow_refresh` to `true` before running:

```yaml title="dbt_project.yml"
vars:
  snowplow_identities:
    snowplow__allow_refresh: true
```

On development targets, the manifest is always dropped on full refresh without needing this flag. Development targets are identified by the `snowplow__dev_target_name` variable, which you can set to match your development target name if it's not the default `dev`.

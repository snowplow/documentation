---
title: "Snowplow Identities dbt package"
sidebar_label: "Identities"
sidebar_position: 70
description: "Transform raw identity entities and merge events into derived tables for identity resolution, identifier mapping, and audit."
keywords: ["identities dbt", "identity resolution", "snowplow_id", "identity mapping", "dbt identities"]
date: "2026-03-23"
---

The Snowplow Identities dbt package transforms the raw [identity entities and merge events](/docs/identities/concepts/index.md#data-types) produced by the [Snowplow Identities service](/docs/identities/index.md) into a set of derived tables for identity resolution, identifier lookup, and audit.

The package uses a simplified, timestamp-based incremental strategy rather than the session-based incremental logic used by other Snowplow dbt packages. This means the standard [package mechanics](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/index.md), [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md), and [dbt operations](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) guidance does not apply to this package.

It supports Snowflake and BigQuery.

:::note Source code
The package source code is available in the [snowplow/dbt-snowplow-identities](https://github.com/snowplow/dbt-snowplow-identities) repository.
:::

For the full output model reference, including column definitions and example queries, see the [Identities data models page](/docs/identities/data-models/index.md).

## Output models

The package produces six output models:

| Model | Description |
| ----- | ----------- |
| `snowplow_identities_id_changes` | Full history of all Snowplow ID cluster changes, including merges and new ID creation |
| `snowplow_identities_snowplow_id_mapping` | Maps any merged `snowplow_id` to its current `active_snowplow_id` |
| `snowplow_identities_id_mapping_scd` | SCD type 2 table capturing how the canonical identity mapping changes over time |
| `snowplow_identities_identifier_mapping` | All external identifiers linked to each `active_snowplow_id`, in a normalized `id_type` / `id_value` format |
| `snowplow_identities_new_identities` | One row per `snowplow_id` with first and last observed activity, including configured identifier values |
| `snowplow_identities_merge_events` | Raw history of every `identity_merge` event, including the full merge hierarchy |

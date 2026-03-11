---
title: "Snowplow Identities dbt package"
sidebar_label: "Data models"
sidebar_position: 3
description: "The Snowplow Identities dbt package provides incremental models for identity resolution, mapping, and audit."
keywords: ["identities", "dbt", "identity resolution", "data model"]
date: "2026-03-05"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Snowplow Identities dbt package transforms the raw [identity entities and merge events](/docs/identities/concepts/index.md#identities-data-structures) in your warehouse into a set of derived tables for identity resolution, identifier lookup, and audit. Run this package before any other Snowplow dbt packages so that downstream models can reference the resolved identities.

The package processes data incrementally, only handling new events on each run. It supports Snowflake and BigQuery.

:::note Source code
The package source code is available in the [snowplow/dbt-snowplow-identities](https://github.com/snowplow/dbt-snowplow-identities) repository.
:::

## Key fields

The Identities models use these field names consistently:

| Field | Description |
| ----- | ----------- |
| `snowplow_id` | The Snowplow ID enriched onto the event by the Identities service in real time. Represents the identity at the time the event occurred. It may later be merged into a different ID. |
| `active_snowplow_id` | The current, unified identifier that represents a cluster of identities. When identities merge over time, this field always points to the surviving parent ID in the cluster. One `active_snowplow_id` maps to many `snowplow_id` values. |
| `previous_snowplow_id` | Used in the ID changes table to denote the `snowplow_id` that was merged into another ID. |

## Output models

The package produces four output models.

### snowplow_identities_id_changes

A fact table containing a complete history of all changes to Snowplow ID clusters, including both merges and new ID creation. Use this table for auditing the full lifecycle of identity changes.

| Column | Description |
| ------ | ----------- |
| `id_change_key` | Surrogate primary key (hash of `snowplow_id` + `previous_snowplow_id`). |
| `snowplow_id` | The Snowplow ID after this change. |
| `previous_snowplow_id` | The ID that was merged. `NULL` for new ID creation. |
| `effective_at` | Event timestamp (`derived_tstamp` for creates, `merged_at` for merges). |
| `changed_at` | Processing timestamp (when dbt materialized this record). |
| `change_type` | Either `created` or `merged`. |
| `first_seen_event_id` | The first event that triggered this change. |
| `first_seen_app_id` | The `app_id` where this change was first observed. |

### snowplow_identities_snowplow_id_mapping

A mapping between any previous `snowplow_id` and its current `active_snowplow_id`. The model automatically resolves chains of merges so you always get the most current unified ID. Only merged `snowplow_id` values appear in this table — unmerged IDs are their own `active_snowplow_id` by definition.

| Column | Description |
| ------ | ----------- |
| `active_snowplow_id` | The current, canonical Snowplow ID. |
| `snowplow_id` | A merged Snowplow ID currently represented by the `active_snowplow_id`. |
| `merged_at` | Timestamp of when this mapping was last modified. |
| `model_tstamp` | Timestamp of the dbt run that produced this record. |

To look up the `active_snowplow_id` for records in another table, use a left join with a `COALESCE` fallback:

```sql
select
    s.*,
    coalesce(m.active_snowplow_id, s.snowplow_id) as active_snowplow_id
from some_other_model s
left join snowplow_identities_snowplow_id_mapping m
    on s.snowplow_id = m.snowplow_id
```

The `COALESCE` handles the case where a `snowplow_id` has not been merged — it is still its own `active_snowplow_id`.

### snowplow_identities_id_mapping_scd

A type 2 slowly changing dimension (SCD) table that captures how the canonical Snowplow ID mapping changes over time. This is useful for audit purposes and reporting that requires the state of the identity graph at a specific point in time.

| Column | Description |
| ------ | ----------- |
| `active_snowplow_id` | The canonical Snowplow ID for this time period. |
| `snowplow_id` | A Snowplow ID represented by the `active_snowplow_id` (including the active one itself). |
| `effective_at` | Timestamp from which this record is valid. |
| `superseded_at` | Timestamp at which this record was superseded. `NULL` for the current record. |
| `is_current` | Boolean flag — `true` when `superseded_at` is `NULL`. |

To query the state of the identity graph at a specific point in time:

```sql
select *
from snowplow_identities_id_mapping_scd
where effective_at <= '2026-01-15'
  and (superseded_at > '2026-01-15' or superseded_at is null)
```

### snowplow_identities_identifier_mapping

Contains all external identifiers linked to an `active_snowplow_id`. The list of identifier types is [configurable](/docs/identities/configuration/index.md). Identifiers are stored in a normalized format with `id_type` and `id_value` columns rather than pivoted into separate columns per type.

Use this table to look up addressable identifiers (such as email) that can be activated in downstream systems.

| Column | Description |
| ------ | ----------- |
| `active_snowplow_id` | The current, canonical Snowplow ID. |
| `id_type` | The type of identifier (e.g., `email`, `user_id`, `domain_userid`). |
| `id_value` | The actual identifier value, or its SHA-256 hash if [hashing is enabled](/docs/identities/configuration/index.md). |
| `first_seen_event_id` | The first event that contributed this identifier. |
| `first_app_id` | The `app_id` of the event where this identifier was first observed. |
| `last_app_id` | The `app_id` of the event where this identifier was most recently observed. |
| `first_seen_at` | Timestamp of the event where this identifier was first observed. |
| `last_seen_at` | Timestamp of the event where this identifier was last observed. |
| `uuid` | Surrogate key. |

## Integration with Unified models

The Identities dbt package is independent of the existing Unified dbt models. This allows tables across all Snowplow dbt packages — unified, ecommerce, media, and others — to reference identity data.

When the Identities package is enabled, the Unified models add two new columns to session and user tables:

| Column | Description |
| ------ | ----------- |
| `snowplow_id` | The `snowplow_id` from the event or session. For sessions, this is the latest `snowplow_id` observed in that session. |
| `active_snowplow_id` | Looked up from `snowplow_identities_snowplow_id_mapping` during materialization. |

The existing `stitched_user_id` column changes from `COALESCE(user_id, user_identifier)` to `COALESCE(active_snowplow_id, user_id, user_identifier)`, easing migration for customers already using identity stitching. The `user_id` and `user_identifier` columns remain unchanged.

## Warehouse support

The Identities dbt package supports **Snowflake** and **BigQuery**. If your warehouse is not currently supported, please reach out to Snowplow Support.

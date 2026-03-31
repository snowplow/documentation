---
title: "Snowplow Identities dbt package"
sidebar_label: "Identities"
sidebar_position: 70
description: "Transform raw identity entities and merge events into derived tables for identity resolution, identifier mapping, and audit."
keywords: ["identities dbt", "identity resolution", "snowplow_id", "identity mapping", "dbt identities"]
date: "2026-03-23"
---

import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc', 'addon']}
  helpContent="Identities is a paid addon for Snowplow CDI."
/>

**The package source code can be found in the [snowplow/dbt-snowplow-identities](https://github.com/snowplow/dbt-snowplow-identities) repository.**

The Snowplow Identities dbt package transforms the raw [identity entities and merge events](/docs/identities/concepts/index.md#data-types) produced by [Identities](/docs/identities/index.md) into a set of derived tables for identity resolution, identifier lookup, and audit.

The package supports Snowflake and BigQuery.

Check out the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/index.md) and [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/identities/index.mdx) pages to get started.

:::note Simple incremental strategy
The package uses a simplified, timestamp-based incremental strategy rather than the session-based incremental logic used by other Snowplow dbt packages.

This means that the standard guidance around [package mechanics](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/index.md), [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md), and [dbt operations](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) doesn't apply to this package.
:::

## Key fields

The Identities models use these field names consistently:

| Field                  | Description                                                                                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `snowplow_id`          | The Snowplow ID enriched onto the event by the Identities service in real time. Represents the identity at the time the event occurred. It may later be merged into a different ID.                                                       |
| `active_snowplow_id`   | The current, unified identifier that represents a cluster of identities. When identities merge over time, this field always points to the surviving parent ID in the cluster. One `active_snowplow_id` maps to many `snowplow_id` values. |
| `previous_snowplow_id` | Used in the ID changes table to denote the `snowplow_id` that was merged into another ID.                                                                                                                                                 |

## Output models

The package produces six output models.

### `snowplow_identities_id_changes`

A fact table containing a complete history of all changes to Snowplow ID clusters, including both merges and new ID creation. Use this table for auditing the full lifecycle of identity changes.

| Column                 | Description                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `id_change_key`        | Surrogate primary key (hash of `snowplow_id` + `previous_snowplow_id` + `effective_at`) |
| `snowplow_id`          | The Snowplow ID after this change                                                       |
| `previous_snowplow_id` | The ID that was merged; `NULL` for new ID creation                                      |
| `effective_at`         | Event timestamp; `derived_tstamp` for creates, `merged_at` for merges                   |
| `changed_at`           | Processing timestamp, recording when dbt materialized this record                       |
| `change_type`          | Either `created` or `merged`                                                            |
| `first_seen_event_id`  | The first event that triggered this change                                              |
| `first_seen_app_id`    | The `app_id` where this change was first observed                                       |

### `snowplow_identities_snowplow_id_mapping`

A mapping between any previous `snowplow_id` and its current `active_snowplow_id`. The model automatically resolves chains of merges, so you always get the most current unified ID. Only merged `snowplow_id` values appear in this table — unmerged IDs are their own `active_snowplow_id` by definition.

| Column               | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| `active_snowplow_id` | The current, canonical Snowplow ID                                     |
| `snowplow_id`        | A merged Snowplow ID currently represented by the `active_snowplow_id` |
| `merged_at`          | Timestamp of when this mapping was last modified                       |
| `model_tstamp`       | Timestamp of the dbt run that produced this record                     |

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

### `snowplow_identities_id_mapping_scd`

A slowly changing dimension (SCD) type 2 table that captures how the canonical Snowplow ID mapping changes over time. This is useful for audit purposes, and reporting that requires the state of the identity graph at a specific point in time.

| Column               | Description                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `active_snowplow_id` | The canonical Snowplow ID for this time period.                                          |
| `snowplow_id`        | A Snowplow ID represented by the `active_snowplow_id` (including the active one itself). |
| `effective_at`       | Timestamp from which this record is valid.                                               |
| `superseded_at`      | Timestamp at which this record was superseded. `NULL` for the current record.            |
| `is_current`         | Boolean flag; `true` when `superseded_at` is `NULL`.                                     |

To query the state of the identity graph at a specific point in time:

```sql
select *
from snowplow_identities_id_mapping_scd
where effective_at <= '2026-01-15'
  and (superseded_at > '2026-01-15' or superseded_at is null)
```

### `snowplow_identities_identifier_mapping`

Contains all external identifiers linked to an `active_snowplow_id`. The list of identifier types is [configurable](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/index.md#4-configure-your-identifiers) and should reflect the identifiers you have configured in Console, plus any additional identifiers you want available in the output tables. Identifiers are stored in a normalized format with `id_type` and `id_value` columns rather than pivoted into separate columns per type.

Use this table to look up addressable identifiers, such as email, that can be activated in downstream systems.

| Column                | Description                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `active_snowplow_id`  | The current, canonical Snowplow ID                                                                                |
| `id_type`             | The type of identifier e.g. `email`, `user_id`, `domain_userid`                                                   |
| `id_value`            | The actual identifier value, or its SHA-256 hash if [hashing is enabled](/docs/identities/configuration/index.md) |
| `first_seen_event_id` | The first event that contributed this identifier                                                                  |
| `first_app_id`        | The `app_id` of the event where this identifier was first observed                                                |
| `last_app_id`         | The `app_id` of the event where this identifier was most recently observed                                        |
| `first_seen_at`       | Timestamp of the event where this identifier was first observed                                                   |
| `last_seen_at`        | Timestamp of the event where this identifier was last observed                                                    |
| `uuid`                | Surrogate key                                                                                                     |

### `snowplow_identities_new_identities`

One row per `snowplow_id`, recording the first and last observed activity for that identity. The [`snowplow__identifiers`](/docs/identities/configuration/index.md) variable determines which identifier columns appear in this table.

| Column                 | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `snowplow_id`          | The Snowplow ID; unique key for this table                               |
| `created_at`           | Timestamp when this identity was first created, from the identity entity |
| `first_seen_event_id`  | The first event associated with this identity                            |
| `first_app_id`         | The `app_id` where this identity was first observed                      |
| `last_app_id`          | The `app_id` where this identity was most recently observed              |
| `first_derived_tstamp` | `derived_tstamp` of the first event for this identity                    |
| `last_derived_tstamp`  | `derived_tstamp` of the most recent event for this identity              |
| *(identifier columns)* | One column per configured identifier (e.g., `domain_userid`, `user_id`)  |

### `snowplow_identities_merge_events`

One row per identity merge event. Each row records the surviving (`active`) Snowplow ID and the full hierarchy of IDs that were merged into it. Use this table to audit the raw merge operations as they occurred.

| Column               | Description                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `merge_event_id`     | The `event_id` of the `identity_merge` event — unique key for this table                                                |
| `active_snowplow_id` | The surviving Snowplow ID after this merge                                                                              |
| `collector_tstamp`   | Timestamp when the merge event was collected                                                                            |
| `derived_tstamp`     | Timestamp when the merge event occurred                                                                                 |
| `merged`             | Array containing the full merge hierarchy (all IDs merged into `active_snowplow_id`)                                    |
| `merges`             | Array of objects describing each individual merge operation, with `snowplow_id`, `merged_at`, and `triggering_event_id` |

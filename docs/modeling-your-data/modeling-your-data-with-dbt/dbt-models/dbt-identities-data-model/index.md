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

**The package source code can be found in the [snowplow-incubator/dbt-snowplow-identities](https://github.com/snowplow-incubator/dbt-snowplow-identities/) repository.**

The Snowplow Identities dbt package transforms the raw [identity entities and merge events](/docs/identities/concepts/index.md#data-types) produced by [Identities](/docs/identities/index.md) into a set of derived tables for current identity resolution and identifier lookup, with a retained merge-event log.

The package supports Snowflake, BigQuery, and Databricks. Databricks support is available from version 0.1.0.

Check out the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/index.md), [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/index.md), and [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/identities/index.mdx) pages to get started.

:::note[Simple incremental strategy]
The package uses a simplified, timestamp-based incremental strategy rather than the session-based incremental logic used by other Snowplow dbt packages.

This means that the standard guidance around [package mechanics](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/index.md), [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md), and [dbt operations](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) doesn't apply to this package.
:::

:::warning[Breaking changes in 0.2.0]

This is a breaking upgrade from 0.1.0. It removes the `id_changes` and `id_mapping_scd`
outputs and renames `new_identities` to `identities`. Follow the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/index.md)
before changing existing projects. Retain the 0.1.0 history tables if consumers need
historical point-in-time state; current mappings cannot reconstruct that history exactly.
:::

## Key fields

The Identities models use these field names consistently:

| Field | Meaning |
| --- | --- |
| `snowplow_id` | The identity attached to an event when it occurred; it may later merge. |
| `active_snowplow_id` | The surviving root after processing the available merge events. |
| `load_tstamp` | Warehouse arrival time used for incremental progress. Backdated reloads beyond the lookback need explicit reprocessing. |

## Public models

The package produces the following output models for downstream queries. Databricks tables also include `load_tstamp_date`, a date derived from `load_tstamp` for physical partitioning.

### `snowplow_identities_snowplow_id_mapping`

One row per merged child, pointing directly to its current root. Unmerged IDs are absent;
use a left join and `coalesce` to preserve them:

```sql
select s.*, coalesce(m.active_snowplow_id, s.snowplow_id) as active_snowplow_id
from some_other_model s
left join snowplow_identities_snowplow_id_mapping m
  on s.snowplow_id = m.snowplow_id
```

| Column | Description |
| --- | --- |
| `snowplow_id` | Merged child identity. |
| `active_snowplow_id` | Current surviving root. |
| `merged_at` | Child merge time from the cumulative payload. |
| `merge_event_id` | Merge event contributing the resolved mapping. |
| `triggering_event_id` | Event that triggered the child's merge. |
| `load_tstamp` | Latest warehouse arrival contributing the resolved mapping. |
| `model_tstamp` | Time this mapping row was modeled. |

`merged_at` comes from the cumulative payload and can remain the original child merge
time when its root changes. `load_tstamp` records the newest arrival contributing the
mapping, including a later root change. These are not a history of every root transition.

### `snowplow_identities_identifier_mapping`

A view containing one row per `(active_snowplow_id, id_type, id_value)`. It resolves immutable
identifier rows against the current root mapping at query time. Identifier types are
lowercase; the `uuid` is derived from the root, type, and value.

| Column | Description |
| --- | --- |
| `uuid` | Key derived from the resolved owner, identifier type, and value. |
| `active_snowplow_id` | Current owner of the identifier. |
| `id_type` | Lowercase identifier type. |
| `id_value` | Identifier value, or normalized SHA-256 hash when hashing is enabled. |
| `first_seen_at` | Earliest observed event time for this owner and identifier. |
| `last_seen_at` | Latest observed event time for this owner and identifier. |
| `first_seen_event_id` | First contributing event. |
| `first_app_id` | Application at the start of the observed range. |
| `last_app_id` | Application at the end of the observed range. |
| `mapping_state` | `single` for one owner; `multiple` for owners the heuristic can rank; `unranked` for missing creation dates or an unresolved tie. |
| `is_preferred` | True for a single owner. For multiple owners, selection requires the opt-in heuristic and an unambiguous winner. |

`snowplow__merge_limit_collapse` retains all owners in 0.2.0. When enabled, `is_preferred`
selects the owner with the latest sighting, breaking a tie by the oldest creation time.
Only enable it when the identity service has no configured unique identifiers. The same
identifier reappearing after TTL expiry retains its old and new ownership rows. Filtering
`is_preferred` can return no row when a choice cannot safely be made.

### `snowplow_identities_identities`

One row per identity. Configured identifier values are in the identifier mapping, rather than separate columns here.

| Column | Description |
| --- | --- |
| `snowplow_id` | Identity attached to the source events. |
| `created_at` | Creation time supplied by the identity entity. |
| `first_seen_event_id` | Earliest observed event for this identity. |
| `first_app_id` | Application on the earliest observed event. |
| `last_app_id` | Application on the latest observed event. |
| `first_derived_tstamp` | Earliest observed derived event timestamp. |
| `last_derived_tstamp` | Latest observed derived event timestamp. |
| `load_tstamp` | Latest warehouse arrival observed for this identity. |

### `snowplow_identities_merge_events`

One row per merge event. The log retains the raw merge history used by the mapping.

| Column | Description |
| --- | --- |
| `merge_event_id` | Unique merge event ID. |
| `active_snowplow_id` | Surviving identity reported by the merge event. |
| `collector_tstamp` | Collector timestamp of the merge event. |
| `derived_tstamp` | Derived timestamp of the merge event. |
| `load_tstamp` | Warehouse arrival timestamp of the merge event. |
| `merged` | Cumulative child merge payloads. |
| `merges` | Cumulative merge event IDs. |

## Internal models and operation

`snowplow_identities_stg_identity_events` holds events with the identity entity in the scratch schema.
`snowplow_identities_identifier_mapping_base` holds immutable event-time identifier rows;
consumers should normally query the resolved view.

The atomic readers advance across gaps, and downstream models follow their upstream
watermarks. Delayed merge events resolve through stored parents, and children follow a
root that merges again. Run the package's tests to verify unique keys and flat root mappings.

The gap lookup adds source reads when a normal forward window is empty, and the view
resolves owners at read time. Measure warehouse usage and downstream query performance
on representative data before a production cutover; no general performance improvement
is guaranteed.

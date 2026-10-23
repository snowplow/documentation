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

## Version 0.2.0

This is a breaking upgrade from 0.1.0. It removes the `id_changes` and `id_mapping_scd`
outputs and renames `new_identities` to `identities`. Follow the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/index.md)
before changing existing projects. Retain the 0.1.0 history tables if consumers need
historical point-in-time state; current mappings cannot reconstruct that history exactly.

## Key fields

| Field | Meaning |
| --- | --- |
| `snowplow_id` | The identity attached to an event when it occurred; it may later merge. |
| `active_snowplow_id` | The surviving root after processing the available merge events. |
| `load_tstamp` | Warehouse arrival time used for incremental progress. Backdated reloads beyond the lookback need explicit reprocessing. |

## Public models

### `snowplow_identities_snowplow_id_mapping`

One row per merged child, pointing directly to its current root. Unmerged IDs are absent;
use a left join and `coalesce` to preserve them:

```sql
select s.*, coalesce(m.active_snowplow_id, s.snowplow_id) as active_snowplow_id
from some_other_model s
left join snowplow_identities_snowplow_id_mapping m
  on s.snowplow_id = m.snowplow_id
```

Columns: `snowplow_id`, `active_snowplow_id`, `merged_at`, `merge_event_id`,
`triggering_event_id`, `load_tstamp`, `model_tstamp`.

`merged_at` comes from the cumulative payload and can remain the original child merge
time when its root changes. `load_tstamp` records the newest arrival contributing the
mapping, including a later root change. These are not a history of every root transition.

### `snowplow_identities_identifier_mapping`

A view containing one row per `(active_snowplow_id, id_type, id_value)`. It resolves immutable
identifier rows against the current root mapping at query time. Identifier types are
lowercase; the `uuid` is derived from the root, type and value.

| Columns | Meaning |
| --- | --- |
| `uuid`, `active_snowplow_id`, `id_type`, `id_value` | Resolved identifier key, owner, type and value (or normalized SHA-256 hash when enabled). |
| `first_seen_at`, `last_seen_at`, `first_seen_event_id` | Observed event-time range and first contributing event. |
| `first_app_id`, `last_app_id` | Applications at the ends of that observed range. |
| `mapping_state` | `single` for one owner; `multiple` for owners the heuristic can rank; `unranked` for missing creation dates or an unresolved tie. |
| `is_preferred` | True for a single owner. For multiple owners, selection requires the opt-in heuristic and an unambiguous winner. |

`snowplow__merge_limit_collapse` retains all owners in 0.2.0. When enabled, `is_preferred`
selects the owner with the latest sighting, breaking a tie by the oldest creation time.
Only enable it when the identity service has no configured unique identifiers. The same
identifier reappearing after TTL expiry retains its old and new ownership rows. Filtering
`is_preferred` can return no row when a choice cannot safely be made.

### `snowplow_identities_identities`

One row per identity with `snowplow_id`, `created_at`, `first_seen_event_id`,
`first_app_id`, `last_app_id`, `first_derived_tstamp`, `last_derived_tstamp` and `load_tstamp`.
Configured identifier values are in the identifier mapping, not separate columns here.

### `snowplow_identities_merge_events`

One row per merge event, with `merge_event_id`, `active_snowplow_id`, `collector_tstamp`,
`derived_tstamp`, `load_tstamp`, `merged` (the cumulative child payloads) and `merges`
(the cumulative merge-event IDs). The log retains the raw merge history used by the mapping.

## Internal models and operation

`snowplow_identities_stg_identity_events` holds identity-context events in the scratch schema.
`snowplow_identities_identifier_mapping_base` holds immutable event-time identifier rows;
consumers should normally query the resolved view.

The atomic readers advance across gaps, and downstream models follow their upstream
watermarks. Delayed merge events resolve through stored parents, and children follow a
root that merges again. Run the package's tests to verify unique keys and flat root mappings.

The gap lookup adds source reads when a normal forward window is empty, and the view
resolves owners at read time. Measure warehouse usage and downstream query performance
on representative data before a production cutover; no general performance improvement
is guaranteed.

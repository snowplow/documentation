---
title: "Snowplow Identities dbt package"
sidebar_label: "Identities"
sidebar_position: 70
description: "Transform raw identity entities and merge events into derived tables for identity resolution, identifier mapping, and audit."
keywords: ["identities dbt", "identity resolution", "snowplow_id", "identity mapping", "dbt identities"]
date: "2026-03-23"
content_type: reference
---


<Availability
  available={['cloud', 'pmc', 'addon']}
  note="Identities is a paid addon for Snowplow CDI."
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
Version 0.2.0 is a breaking upgrade from 0.1.0. Follow the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/index.md) before upgrading existing projects.
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

The package also builds two internal models. `snowplow_identities_stg_identity_events`, in the scratch schema, holds events with the identity entity. `snowplow_identities_identifier_mapping_base` holds the unresolved, event-time identifier rows behind the `identifier_mapping` view. Query the view instead of this table.

Each model tracks its own progress using the latest `load_tstamp` in its table. The following sections describe how the models handle gaps in the data, merges, and reloaded data. Some of this behavior adds warehouse cost, and the `identifier_mapping` view resolves owners each time you query it. Before a production rollout, [benchmark these costs](#benchmark-warehouse-costs) on your data.

### Process periods without data

When no new data arrives within the normal processing window, the models that read `atomic.events` skip ahead to the next day that has matching events. They process up to that day, not all remaining history at once. This also works on the initial build and when a table is empty.

Downstream models follow their upstream tables. The identities and identifier models follow the staged identity events, and the child-to-root mapping follows the merge log, so a period with merges but no new identity events still gets processed. Each model keeps its own watermark and lookback, so a model that failed catches up on the next run.

Skipping ahead adds a query on `atomic.events` whenever the normal window is empty, which increases warehouse usage during a sparse historical backfill. `snowplow__backfill_limit_days` limits the number of days with data that each run processes, not the bytes it scans.

### Resolve merges

The child-to-root mapping handles merges in the following ways:

- A delayed merge event is resolved against the stored mapping before its new links are applied
- When a root merges into another identity, its stored children move to the new root, even if the identity service's cumulative payload no longer lists them
- Reprocessing a batch that hasn't changed doesn't rewrite any mapping rows

This behavior relies on merges from the identity service being cumulative and free of cycles. The package's `snowplow_id_mapping_no_chains` and `identifier_mapping_no_stale_roots` tests check that every child maps directly to a current root, so keep them enabled.

Because the model reads the existing mapping to resolve delayed merges and move children, an incremental run can scan the whole stored graph even when the new batch is small.

### Handle pruned merge payloads

The mapping can keep an intermediate parent in one case. If a child has been pruned from the cumulative payload, the model follows only one extra parent to find its root. For example, a stored `A -> B` mapping stays chained if `B -> C` and `C -> D` arrive in the same processing window, after both `A` and `B` have been pruned from the payload for `D`. Pruning happens through TTL expiry, erasure, or the `max_merges` limit.

The `snowplow_id_mapping_no_chains` test detects this case. If it fails, don't switch consumers to the affected outputs, and keep the previous outputs and source history while you investigate. A larger backfill window doesn't recover links that are missing from the payloads.

### Reprocess backdated data

Incremental processing depends on `load_tstamp` recording when each row arrived in the warehouse. If you reload rows with a `load_tstamp` older than `snowplow__lookback_days`, the models won't pick them up. Increase the lookback or rebuild the affected period. Also set `snowplow__partition_buffer_days` to cover the actual gap between your partition column and `load_tstamp`.

### Benchmark warehouse costs

The package tests check correctness, not performance at production scale. Before a production rollout, benchmark the package on a representative copy of your data.

Measure a full read of `snowplow_identities_identifier_mapping` and the queries your consumers run. Compare the results with the cost of [materializing the view as a table](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/index.md#resolve-identifier-mappings-through-the-view) as often as you need it. Record the elapsed time, bytes scanned, shuffle or spill, warehouse size, graph size, and whether results came from cache.

Also measure an incremental `snowplow_identities_snowplow_id_mapping` run that includes merges, and a repeat run with no new data. Include periods with no data, large merge groups, and shared identifiers. As described in [Resolve merges](#resolve-merges) and [Process periods without data](#process-periods-without-data), even a small batch can scan the whole stored mapping, and periods with no data add queries on `atomic.events`.

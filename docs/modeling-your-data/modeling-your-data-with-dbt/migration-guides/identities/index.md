---
title: "Migration guide for Identities"
sidebar_label: "Identities"
sidebar_position: 70
description: "Safely upgrade the Snowplow Identities dbt package, including the breaking 0.2.0 migration."
keywords: ["identities migration", "dbt identities upgrade", "Databricks identities"]
date: "2026-10-23"
---

## Upgrading to 0.2.0

This release removes two output tables, renames a third, and rebuilds
`snowplow_identities_identifier_mapping` as a view. The view keeps its name and resolved-identifier grain, but adds
`mapping_state` and `is_preferred`, normalizes `id_type` to lowercase and changes the
opt-in merge-limit behaviour. Review downstream filters and explicit column lists.

### What changed

| Table | Change | Action needed |
| --- | --- | --- |
| `snowplow_identities_snowplow_id_mapping` | Same child-to-root grain; delayed merges now preserve current roots. Gains `merge_event_id`, `triggering_event_id` and `load_tstamp`; now partitioned on `load_tstamp` rather than `merged_at` | Rebuild with the package-scoped full refresh below |
| `snowplow_identities_merge_events` | Same grain and values. Gains `load_tstamp`; now partitioned on `load_tstamp` rather than `derived_tstamp` | Rebuild with the package-scoped full refresh below |
| `snowplow_identities_identifier_mapping` | Now a **view** over immutable rows, with lowercase `id_type` and new `mapping_state` / `is_preferred` columns. The collapse option selects a preferred owner without deleting other owners. | Update case-sensitive filters; filter `is_preferred` only when the heuristic is appropriate |
| `snowplow_identities_new_identities` | Renamed to `snowplow_identities_identities`; per-identifier columns removed | Update references; see [Rebuilding the wide identity row](#rebuilding-the-wide-identity-row) |
| `snowplow_identities_id_changes` | **Removed** | See [Rebuilding id_changes](#rebuilding-id_changes) |
| `snowplow_identities_id_mapping_scd` | **Removed** | See [Rebuilding id_mapping_scd](#rebuilding-id_mapping_scd) |

New models:

- `snowplow_identities_identifier_mapping_base` (`derived`). The table the view resolves at
  read time. It holds unresolved, event-time rows, so query the view instead.
- `snowplow_identities_identities` (`derived`). The renamed `new_identities`.
- `snowplow_identities_stg_identity_events` (`scratch`). Identity context events read from
  `atomic.events`, replacing the old base layer.

Every derived table also gains a `load_tstamp` column, which is how each model now tracks
its own progress. See [Each model now tracks its own progress](#each-model-now-tracks-its-own-progress).

### Each model now tracks its own progress

The shared manifest table and the hooks that maintained it are gone. Each model asks its
own table for the newest `load_tstamp` it holds and processes forward from there, so a
failed run leaves that model slightly behind and it catches up on the next one. This
deletes the manifest, three supporting models, the whole `_this_run` scratch layer, and
the manifest-maintenance hooks. 15 models become 5 plus a view. A read-only startup
check rejects an upgrade that is missing the required full refresh.

Config that no longer exists: `snowplow__allow_refresh`, `snowplow__dev_target_name`,
and the `models_to_remove` var (all belonged to the manifest). A `--full-refresh` now
simply rebuilds from `snowplow__start_date`, with no manifest to guard.

Config that is new:

| Var | Default | What it does |
| --- | --- | --- |
| `snowplow__lookback_days` | 1 | Days of overlap re-scanned each run for late-arriving data. Also the run-twice idempotency window. |
| `snowplow__partition_tstamp` | `load_tstamp` | The column `atomic.events` is physically partitioned by. Set to `collector_tstamp` if that is your partition key, so staging scans still prune. |
| `snowplow__partition_tstamp_type` | `timestamp` | `timestamp` or `date`, matching the above column's type. |
| `snowplow__partition_buffer_days` | 2 | Extra days on the prune predicate to absorb collector-to-load lag. |

### Rebuild the package on the first run

The existing `snowplow_id_mapping` and `merge_events` tables gain `load_tstamp` and
change their partition key. Appending columns alone would leave old rows with null
watermarks and would not repartition the tables. `identifier_mapping` also changes
from a table to a view. In particular, BigQuery rejects that conversion during a
normal run; it requires a full refresh or a manual drop.

Use a package-scoped full refresh for the initial upgrade so dbt handles both
repartitioning and table-to-view conversion. This rebuilds the package's outputs
from `atomic.events`. Historical completeness therefore requires all necessary
identity and merge events to be available from `snowplow__start_date`. Check source
retention and back up the 0.1.0 tables first. If history has expired, retain the old
tables and establish a migration plan before upgrading; missing events cannot be
reconstructed by the new models.

The removed tables and renamed `new_identities` are left behind until you choose
to drop them after validation.

### Upgrade steps

1. **Bump the package version** in your `packages.yml`.

2. **Back up the existing outputs and confirm source retention**, per
   [Rebuild the package on the first run](#rebuild-the-package-on-the-first-run).

3. **Run one full refresh, then finish the backfill incrementally.** The first run
   rebuilds from `snowplow__start_date`. Set a backfill window that covers the required
   history where practical, for example:

   ```bash
   dbt run --full-refresh --select package:snowplow_identities --vars '{snowplow__backfill_limit_days: 400}'
   ```

   If more history remains, run again **without** `--full-refresh` to advance. Repeating
   the full-refresh flag restarts from the beginning. Empty periods are skipped to the
   first eligible day, so the start date may precede the first identity event.

   ```bash
   dbt run --select package:snowplow_identities --vars '{snowplow__backfill_limit_days: 400}'
   ```

   Incremental runs log their resolved processing bounds, so you can watch progress:

   ```
   Snowplow: snowplow_identities_identities at watermark 2026-07-14 -- processing load_tstamp from 2026-07-14 to 2026-08-14
   ```

   Until the backfill completes, the tables only cover the period processed so far.
   Historical completeness depends on the retained source events. Validate the backfilled
   outputs against the saved 0.1.0 tables before switching downstream consumers.

4. **Drop the old tables** once you are happy, since dbt no longer manages them:

   ```sql
   -- removed outputs
   drop table if exists <derived_schema>.snowplow_identities_id_changes;
   drop table if exists <derived_schema>.snowplow_identities_id_mapping_scd;
   drop table if exists <derived_schema>.snowplow_identities_new_identities;
   drop table if exists <derived_schema>.snowplow_identities_snowplow_id_mapping_affected;

   -- the retired manifest framework
   drop table if exists <manifest_schema>.snowplow_identities_incremental_manifest;
   drop table if exists <scratch_schema>.snowplow_identities_base_events_this_run;
   drop table if exists <scratch_schema>.snowplow_identities_base_new_event_limits;
   drop table if exists <scratch_schema>.snowplow_identities_merge_events_this_run;
   drop table if exists <scratch_schema>.snowplow_identities_new_identities_this_run;
   drop table if exists <scratch_schema>.snowplow_identities_new_identifiers_this_run;
   drop table if exists <scratch_schema>.snowplow_identities_identifier_mapping_this_run;
   drop table if exists <scratch_schema>.snowplow_identities_snowplow_id_mapping_this_run;
   drop table if exists <scratch_schema>.snowplow_identities_id_changes_this_run;
   ```

   The initial full refresh replaces `identifier_mapping` with the view, so it does
   not need a separate manual drop.

### Sparse streams and delayed merges

Both atomic readers look for the first eligible day after their current watermark.
If a gap extends past the normal window, its upper bound extends through that first
populated day. It does not jump to the newest source timestamp and process all remaining
history at once. The lookup applies the same application and identity-context filters
as the reader. It also works when the existing table is empty or on the initial build.

Derived models extend their windows through their upstream data: identities and identifier
rows follow identity staging; the child-to-root mapping follows the merge log. A merge-only
period therefore does not depend on new identity-context events. Lower bounds retain each
model's own watermark and configured lookback, so a failed downstream model catches up.

A bounded probe checks the normal forward window first. Only when it is empty does
the source-day lookup search eligible timestamps beyond the batch. This adds read work
during a sparse historical backfill; the backfill
setting limits populated days processed, not a guarantee on bytes scanned. Benchmark
warehouse usage on representative data before switching production consumers.

A delayed merge is resolved against the stored child-to-root mapping before applying
new edges. Stored children also follow a root that merges again, including children no
longer present in the service's cumulative payload. Repeating an unchanged batch does
not rewrite the mapping rows. These rules rely on the identity service's cumulative,
acyclic merge semantics; the package's no-chain and stale-root tests remain required.

`load_tstamp` must describe warehouse arrival. Rows inserted with an old `load_tstamp`
outside the configured lookback are not automatically rediscovered. Increase the lookback
or rebuild the affected period after such a backdated reload. Partition-buffer settings
must also cover the actual difference between the partition timestamp and `load_tstamp`.

### Run-window logging

Incremental models log their watermark and resolved processing window. Windows can differ
between identity and merge streams. Initial-build logging reports the requested starting
window; source gaps or an upstream anchor can extend its upper bound.

---

## Why identifier_mapping became a view

Previously, a merge physically rewrote identifier rows to point at the winning
identity, then deleted the leftovers via a post-hook. That approach caused a recurring
class of bug: stale rows after cascading merges, duplicate keys when one identifier was
shared across identities, and a `MERGE` failure when two re-pointed rows collapsed onto one
key.

Now `identifier_mapping_base` stores one row per `(snowplow_id, id_type, id_value)`
under an immutable key that never changes, and the view resolves each row to its
current `active_snowplow_id` on read. Merges are reflected the moment
`snowplow_id_mapping` updates, and nothing upstream is ever rewritten.

Two consequences worth knowing:

- **The view does the resolution work on every query.** If you query it heavily and it
  becomes a bottleneck, materialize it in your own project:

  ```sql
  -- models/my_identifier_mapping.sql
  {{ config(materialized='table') }}
  select * from {{ ref('snowplow_identities_identifier_mapping') }}
  ```

- **An identifier can now belong to more than one identity over its lifetime.** If an
  identifier expires from the identity engine and later reappears under a new identity,
  both rows are kept in `identifier_mapping_base`. Previously the second sighting
  overwrote the first. The view still shows one row per
  `(active_snowplow_id, id_type, id_value)`, so this only surfaces if the two identities
  have not merged, in which case you correctly see two owners.

---

## Rebuilding the wide identity row

`identities` no longer carries `domain_userid`, `user_id`, and friends. Those values
live in `identifier_mapping`, which keeps *every* value an identity has carried rather
than collapsing to one per type. If you want the old wide shape, pivot the mapping back:

```sql
-- models/my_identities_wide.sql
with identifiers as (
    select
        active_snowplow_id,
        max(case when id_type = 'domain_userid' then id_value end) as domain_userid,
        max(case when id_type = 'user_id' then id_value end) as user_id
    from {{ ref('snowplow_identities_identifier_mapping') }}
    group by 1
)

select
    i.*,
    x.domain_userid,
    x.user_id
from {{ ref('snowplow_identities_identities') }} i
left join {{ ref('snowplow_identities_snowplow_id_mapping') }} m
    on i.snowplow_id = m.snowplow_id
left join identifiers x
    on coalesce(m.active_snowplow_id, i.snowplow_id) = x.active_snowplow_id
```

The `max()` matters. Where an identity carries several values of one type it picks one
arbitrarily, which is the lossiness that motivated removing these columns. Join
`identifier_mapping` at the identifier grain instead where you can.

---

## Rebuilding id_changes

The removed history table has no drop-in replacement in 0.2.0. Keep the saved 0.1.0
history if downstream users depend on it. The merge log retains cumulative payloads,
but those payloads preserve a child's original `merged_at` when a group changes root;
they do not reproduce every timestamp and processing decision of the removed model.

For history from the cutover onwards, capture changes to the resolved mapping in a
consumer-owned snapshot or history model. Define whether validity means service event
time or warehouse processing time, and validate late arrivals and cascading merges
against that contract before migrating those consumers.

## Rebuilding id_mapping_scd

Retain the 0.1.0 SCD table for historical point-in-time queries. A new snapshot of current
mapping state can record changes from the cutover onwards, but cannot recover previously
unobserved transitions or reproduce the old SCD history from current mappings alone.
Do not drop these old outputs until their consumers have an independently validated
replacement. If exact historical compatibility is required, remain on 0.1.0 while that
migration is designed.

## Validation and rollback

Prefer rebuilding into a separate output target/schema while keeping the atomic source
configuration unchanged. Finish the backfill and run `dbt test --select package:snowplow_identities`
before switching consumers. Check identity counts, resolved owners, earliest/latest source
coverage, case-sensitive `id_type` filters and the opt-in preferred-owner behaviour. UUIDs
are derived from `id_type`, so normalizing its case can change keys used downstream.

Keep the prior package lockfile and a consistent backup of all 0.1.0 output schemas,
including manifest and history tables. If validation fails, leave consumers on the old
schemas. After an in-place upgrade, rollback requires restoring those backups and pinning
0.1.0 again; changing the package version alone cannot undo the table-to-view conversion
or restore the removed history. Rehearse that restore using your warehouse's backup or
clone mechanism before upgrading in place.

---

## Upgrade to 0.1.0

Version 0.1.0 is the first tagged package release. Earlier installation instructions used the Git `main` branch, so existing projects can have different installed commits. Check your `package-lock.yml` and review the changes between that commit and [0.1.0](https://github.com/snowplow-incubator/dbt-snowplow-identities/releases/tag/0.1.0) before upgrading. Whether you need a full refresh depends on the changes since your installed commit.

The package requires dbt Core 1.10.6 or later, below 2.0.0. Pin the Git revision in `packages.yml`:

```yaml title="packages.yml"
packages:
  - git: "https://github.com/snowplow-incubator/dbt-snowplow-identities.git"
    revision: "0.1.0"
```

Run `dbt deps`, review the updated `package-lock.yml`, and validate the upgrade in your development target before running it in production.

### Configure Databricks for 0.1.0

Use `dbt-databricks` with a Databricks SQL warehouse or Runtime 12.2 LTS or later. Set `snowplow__databricks_catalog` to the source catalog and `snowplow__atomic_schema` to the source schema. The package ignores `snowplow__database` on Databricks.

See the [quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/index.md) for typed source data and destination profile requirements.

### Review optional merge-limit collapse in 0.1.0

The `snowplow__merge_limit_collapse` variable defaults to `false`. Enable it only when no identifier is configured as unique in the Identities service.

When enabled, the package corrects eligible duplicate identifier mappings as each identifier next appears in an incremental batch. A full refresh from `snowplow__start_date` applies the logic to all reprocessed data. See the [configuration reference](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/identities/index.mdx) before enabling it.

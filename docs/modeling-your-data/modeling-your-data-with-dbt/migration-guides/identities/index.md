---
title: "Migration guide for Identities"
sidebar_label: "Identities"
sidebar_position: 70
description: "Upgrade the Snowplow Identities dbt package, including the breaking 0.2.0 migration."
keywords: ["identities migration", "dbt identities upgrade", "Databricks identities"]
date: "2026-11-23"
content_type: how-to
---

Use this guide to upgrade an existing Snowplow Identities dbt project. For a new project, follow the [Identities quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/index.md) instead.

Version 0.2.0 is a breaking release. It removes two output tables, renames a third, and turns `snowplow_identities_identifier_mapping` into a view. The upgrade requires a full refresh of the package, and you'll need to update any downstream models that use the changed tables. To upgrade from an untagged installation to 0.1.0, see [Upgrade to 0.1.0](#upgrade-to-010).

## Plan the 0.2.0 upgrade

Review the changes in 0.2.0 and prepare your warehouse before you change the package version.

### Review the changed outputs

The following table lists the changes to each output and what you need to do about them:

| Table | Change | Action needed |
| --- | --- | --- |
| `snowplow_identities_snowplow_id_mapping` | Same grain: one row per merged child. Adds `merge_event_id`, `triggering_event_id`, and `load_tstamp`. Partitioned on `load_tstamp` instead of `merged_at`. Delayed merges keep the current root | Rebuild with a full refresh |
| `snowplow_identities_merge_events` | Same grain and values. Adds `load_tstamp`. Partitioned on `load_tstamp` instead of `derived_tstamp` | Rebuild with a full refresh |
| `snowplow_identities_identifier_mapping` | A view with the same name and grain. Adds `mapping_state` and `is_preferred`, and `id_type` values are lowercase. The merge-limit collapse option marks a preferred owner instead of deleting the other owners | Update case-sensitive `id_type` filters. Filter on `is_preferred` only if the heuristic suits your data. See [Resolve identifier mappings through the view](#resolve-identifier-mappings-through-the-view) |
| `snowplow_identities_new_identities` | Renamed to `snowplow_identities_identities`. Per-identifier columns removed | Update references. See [Rebuild the wide identity row](#rebuild-the-wide-identity-row) |
| `snowplow_identities_id_changes` | Removed | See [Rebuild `id_changes`](#rebuild-id_changes) |
| `snowplow_identities_id_mapping_scd` | Removed | See [Rebuild `id_mapping_scd`](#rebuild-id_mapping_scd) |

The release also adds two internal models:
* `snowplow_identities_identifier_mapping_base`, in the derived schema, is the table behind the `identifier_mapping` view. It holds unresolved rows, so query the view instead.
* `snowplow_identities_stg_identity_events`, in the scratch schema, holds events with the identity entity read from `atomic.events`, and replaces the old base layer.

### Understand the upgrade check

To prevent a partial upgrade, the package checks for 0.1.0 tables at the start of every `dbt run` or `dbt build` that selects an Identities model. If `snowplow_identities_merge_events` or `snowplow_identities_snowplow_id_mapping` exists without a `load_tstamp` column, the run fails before it changes any tables, unless it meets all of these conditions:

- It uses `--full-refresh`
- It selects every enabled Identities model, for example with `--select package:snowplow_identities`
- No incremental Identities model has `full_refresh: false` in its configuration

After the full refresh, both tables have a `load_tstamp` column and the check passes. Runs that don't select any Identities models skip the check. For the error message, see [Troubleshoot the 0.2.0 upgrade](#troubleshoot-the-020-upgrade).

### Update project variables

Version 0.2.0 drops the incremental manifest. Each model tracks its progress from the latest `load_tstamp` in its own table instead. The `snowplow__allow_refresh`, `snowplow__dev_target_name`, and `models_to_remove` variables configured the manifest, so 0.2.0 removes them. Delete them from your `dbt_project.yml`. Without `snowplow__allow_refresh`, nothing blocks a `--full-refresh` run, which rebuilds the package from `snowplow__start_date`.

The release adds these variables:

| Variable | Default | Description |
| --- | --- | --- |
| `snowplow__identities_app_id` | `['snowplow-identities']` | App IDs of the identity service's merge events. This filter is separate from `snowplow__app_id`, which filters your application events. Set to `[]` to disable it |
| `snowplow__lookback_days` | 1 | Number of days each run re-scans to pick up late-arriving data. Re-running a batch within this window gives the same result. If you reload data with an older `load_tstamp`, see [Reprocess backdated data](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-identities-data-model/index.md#reprocess-backdated-data) |
| `snowplow__partition_tstamp` | `load_tstamp` | The column that partitions `atomic.events`. Set to `collector_tstamp` if your table uses that column, so that staging queries can prune partitions |
| `snowplow__partition_tstamp_type` | `timestamp` | The type of the partition column: `timestamp` or `date` |
| `snowplow__partition_buffer_days` | 2 | Extra days added to the partition filter to cover the delay between collection and loading |

### Prepare for the full refresh

The upgrade needs a full refresh because the `snowplow_identities_snowplow_id_mapping` and `snowplow_identities_merge_events` tables gain a `load_tstamp` column and a new partition key. Adding the column alone would leave existing rows without a value and keep the old partitioning. The full refresh also replaces the `snowplow_identities_identifier_mapping` table with a view.

The full refresh rebuilds every output from `atomic.events`, starting at `snowplow__start_date`. Before you upgrade:

- Check that your warehouse still holds all identity and merge events since `snowplow__start_date`. The new models can't recover events that are no longer there. If some history has expired, keep the 0.1.0 tables and plan the migration before you upgrade
- Back up all 0.1.0 output schemas, including the manifest and history tables
- Keep your current `package-lock.yml`
- If possible, set up a separate dbt target or schema for 0.2.0 that reads from the same `atomic.events` source. Your consumers can then keep using the 0.1.0 outputs until you've validated the new ones
- If you upgrade in place, test restoring your backup with your warehouse's backup or clone feature first. To roll back an in-place upgrade, you'll need to restore the backup and set the revision back to `0.1.0`. Changing the package version alone doesn't turn the view back into a table or restore the removed history tables

## Upgrade to 0.2.0

These steps upgrade the package, rebuild its outputs, and validate them before you switch consumers. Complete the checklist in [Prepare for the full refresh](#prepare-for-the-full-refresh) first.

<Steps>

### Pause scheduled jobs

Pause any scheduled jobs that run Identities models. Until the full refresh is complete, their runs fail the [upgrade check](#understand-the-upgrade-check).

### Update the package version

Set the Git revision to `0.2.0` in `packages.yml`:

```yaml title="packages.yml"
packages:
  - git: "https://github.com/snowplow-incubator/dbt-snowplow-identities.git"
    revision: "0.2.0"
```

Run `dbt deps`, then remove the variables listed in [Update project variables](#update-project-variables) from your `dbt_project.yml`.

### Run the full refresh

Run a full refresh of the whole package. Each run processes up to `snowplow__backfill_limit_days` days of data, which defaults to 30. To process more history per run, increase it:

```bash
dbt run --full-refresh --select package:snowplow_identities --vars '{snowplow__backfill_limit_days: 400}'
```

### Finish the backfill

If more history remains, run the package again without `--full-refresh` until it catches up. Running with `--full-refresh` again starts the backfill over. Days without data are skipped, so `snowplow__start_date` can be earlier than your first identity event.

```bash
dbt run --select package:snowplow_identities --vars '{snowplow__backfill_limit_days: 400}'
```

Each incremental model logs its watermark and processing window, which you can use to follow progress:

```text
Snowplow: snowplow_identities_identities at watermark 2026-07-14 -- processing load_tstamp from 2026-07-14 to 2026-08-14
```

The windows for identity events and merge events can differ. On the initial build, the log shows the requested window, and the actual upper bound can be later. The tables only cover the processed period until the backfill finishes.

### Update downstream models

Update the models and queries that use the changed outputs, as described in [Adapt downstream models](#adapt-downstream-models). Point them at the 0.2.0 outputs in your development or validation environment first.

### Validate the upgrade

When the backfill finishes, run the package tests:

```bash
dbt test --select package:snowplow_identities
```

Then compare the new outputs with your 0.1.0 backup. Check:

- The `snowplow_id_mapping_no_chains` and `identifier_mapping_no_stale_roots` tests pass. A `snowplow_id_mapping_no_chains` failure can come from [pruned merge payloads](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-identities-data-model/index.md#handle-pruned-merge-payloads), which a larger backfill doesn't fix
- Identity counts and resolved owners
- The earliest and latest source data covered
- Filters on `id_type` that depend on case. Keys derived from `id_type` can change because the values are lowercase in 0.2.0
- The preferred-owner behavior, if you enabled `snowplow__merge_limit_collapse`
- Warehouse costs for your workload. See [Benchmark warehouse costs](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-identities-data-model/index.md#benchmark-warehouse-costs)

If validation fails, keep your consumers on the 0.1.0 outputs and investigate before you continue. Once validation passes, switch your consumers to the 0.2.0 outputs and resume the scheduled jobs.

</Steps>

After your consumers have moved to the 0.2.0 outputs, drop the old tables. dbt doesn't manage them anymore:

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

You don't need to drop `snowplow_identities_identifier_mapping`. The full refresh already replaced it with the view.

## Adapt downstream models

Review the consumers of each changed output before you switch them to 0.2.0. This section describes the replacements and their limitations.

### Resolve identifier mappings through the view

The `snowplow_identities_identifier_mapping` view resolves each identifier to its current `active_snowplow_id` when you query it, so merges show up as soon as `snowplow_identities_snowplow_id_mapping` updates. The rows behind the view are never rewritten.

Because the view resolves owners on every query, frequent queries can be slow. If that's a problem, materialize the view as a table in your own project:

```sql
-- models/my_identifier_mapping.sql
{{ config(materialized='table') }}
select * from {{ ref('snowplow_identities_identifier_mapping') }}
```

The table only reflects new merges after each rebuild, while the view always shows the current state. Choose based on how often you query the data and how fresh it needs to be.

An identifier can belong to more than one identity over time. If an identifier expires in the identity service and later reappears under a different identity, 0.2.0 keeps both owners, while 0.1.0 replaced the first with the second. The view returns one row per `(active_snowplow_id, id_type, id_value)`, so you only see two owners if the two identities haven't merged.

### Rebuild the wide identity row

The `snowplow_identities_identities` table doesn't have the `domain_userid`, `user_id`, or other identifier columns that `snowplow_identities_new_identities` had. These values are in `snowplow_identities_identifier_mapping`, which keeps every value an identity has had, not just one per type. To get the previous wide format, pivot the mapping:

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

If an identity has several values of the same type, `max()` picks one of them, so this query loses data in the same way the old columns did. Where you can, join `snowplow_identities_identifier_mapping` at the identifier level instead.

### Rebuild `id_changes`

Version 0.2.0 has no replacement for `snowplow_identities_id_changes`. If your consumers depend on it, keep the 0.1.0 table. The merge log stores the cumulative payloads, but these keep a child's original `merged_at` when its group changes root, so you can't reproduce the old table's timestamps from them.

To record changes from the upgrade onward, build a snapshot or history model in your own project on top of the resolved mapping. Decide whether its validity periods use event time from the identity service or processing time in the warehouse. Test it with late-arriving data and cascading merges before you migrate consumers.

### Rebuild `id_mapping_scd`

Keep the 0.1.0 `snowplow_identities_id_mapping_scd` table for historical point-in-time queries. A snapshot of the current mapping records changes from the upgrade onward, but it can't recover earlier history. Keep the old tables until their consumers have a validated replacement. If you need exact compatibility with the old history, stay on 0.1.0 until you've designed that migration.

## Troubleshoot the 0.2.0 upgrade

The following error comes from the [upgrade check](#understand-the-upgrade-check):

```text
Upgrading snowplow_identities from 0.1.0 requires a package-scoped --full-refresh. Back up existing outputs and verify retained atomic history first, then run `dbt run --full-refresh --select package:snowplow_identities`. Include every enabled package model and remove any full_refresh: false override. See MIGRATION.md.
```

The run selected an Identities model while 0.1.0 tables still exist, without meeting the full-refresh conditions. Complete [Prepare for the full refresh](#prepare-for-the-full-refresh), then run the full refresh with `--select package:snowplow_identities`. If an incremental Identities model sets `full_refresh: false` in your `dbt_project.yml`, remove that setting first. The `MIGRATION.md` file that the message mentions is in the package repository and covers the same procedure as this guide.

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

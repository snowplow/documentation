---
title: "Migration guide for Agent Analytics"
sidebar_label: "Agent Analytics"
sidebar_position: 80
description: "Upgrade an existing Snowflake Agent Analytics base table to scalar fields while retaining its event history and incremental state."
keywords: ["agent analytics migration", "Snowflake", "dbt package upgrade"]
date: "2026-10-29"
---

Use this guide when upgrading to Agent Analytics 0.2.0 from a Snowflake installation that stores raw entity columns in `base_events`. Version 0.2.0 stores 19 scalar columns, including `utm_source`, `utm_medium`, and `load_tstamp_date`. You can derive these columns from the existing table without replaying atomic events or resetting incremental processing. New installations need no migration.

## Choose an upgrade path

The in-place migration below applies only to Snowflake tables that still contain `contexts_com_snowplowanalytics_snowplow_utm_referrer_1` and the existing scalar fields used by the package. It preserves the resolved agent identity, bot classification, and source channel. The UTM expressions match the package's first-entity extraction, and `load_tstamp_date` is derived from `load_tstamp`.

Review the changes between your installed Git revision in `package-lock.yml` and the revision you are upgrading to. This migration addresses the scalar `base_events` schema change; it does not apply other historical changes to your data. Test it in a development copy first.

For BigQuery or Databricks, or if the existing Snowflake table no longer contains the required source fields, follow [Rebuild the package](#rebuild-the-package). If the atomic source no longer retains the required history, preserve your current tables and plan a recovery before using that option.

## Pause runs and back up the table

Pause scheduled Agent Analytics runs and downstream jobs, and wait for active writes to finish. Keep them paused through validation. Record the installed package revision, target, variables, and the current values in `incremental_manifest` and `int_agent_source_lookup`.

Replace `ANALYTICS.AGENT_ANALYTICS` in every statement below with the database and schema that contain your package's output tables. Check your project's custom schema and alias configuration rather than assuming the default names. Use the same Snowflake role and session settings as your dbt connection, including `TIMEZONE`, so the date conversion matches future runs.

Inspect the table definition and grants before replacing it:

```sql
select get_ddl('TABLE', 'ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS');
show grants on table ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS;
```

Create a clone with a unique name for this migration. Do not use `CREATE OR REPLACE` for the backup: an existing backup must not be overwritten.

```sql
create transient table ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS_BACKUP_20261029_120000
clone ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS;
```

The examples use `TRANSIENT`, the dbt Snowflake adapter's default table type. If your table is permanent, omit `TRANSIENT` from both the backup and replacement statements. Preserve any custom table properties, policies, tags, or clustering configuration from the original definition. [`COPY GRANTS`](https://docs.snowflake.com/en/sql-reference/sql/create-table) retains explicit privileges on the replaced table, except ownership; it does not preserve every table property. Use the table-owning role for the replacement, and verify the grants afterward.

Replacing the table makes dependent Snowflake streams stale, including streams on views over the table. If you use these streams, plan how to recreate them and resume their consumers before replacing the table.

## Replace the base table

Pin `revision: "0.2.0"` in the Git package entry in your `packages.yml`, then run `dbt deps`. Do not run the package models yet. The following statement reads the existing table and replaces it with the 19-column schema. It retains all rows and derives the new scalar fields from the stored entities. It does not read the atomic events table.

```sql
create or replace transient table ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS
copy grants as
select
    event_id,
    event_fingerprint,
    app_id,
    collector_tstamp,
    derived_tstamp,
    load_tstamp,
    to_date(load_tstamp) as load_tstamp_date,
    domain_sessionid,
    page_urlhost,
    page_urlpath,
    refr_source,
    refr_medium,
    contexts_com_snowplowanalytics_snowplow_utm_referrer_1[0]:source::varchar as utm_source,
    contexts_com_snowplowanalytics_snowplow_utm_referrer_1[0]:medium::varchar as utm_medium,
    is_bot,
    raw_source_channel,
    agent_name,
    agent_operator,
    agent_purpose
from ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS;
```

Retain `incremental_manifest`, `int_agent_source_lookup`, the daily tables, and the summary tables. Do not reset the manifest, remove models from it, or run `--full-refresh` as part of this migration.

## Validate and resume incremental runs

Compare the row counts before and after the migration. Both counts must match, and each table should retain one row per `event_id`.

```sql
select 'backup' as table_version,
       count(*) as row_count,
       count(distinct event_id) as distinct_event_ids
from ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS_BACKUP_20261029_120000
union all
select 'migrated', count(*), count(distinct event_id)
from ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS;
```

Check that no event IDs were lost or added and that the new fields match the original entities and timestamp. Every result below must be zero. Missing UTM entities legitimately produce `NULL`; the comparison preserves that behavior.

```sql
select
    coalesce(count_if(m.event_id is null), 0) as missing_migrated_events,
    coalesce(count_if(b.event_id is null), 0) as unexpected_migrated_events,
    coalesce(count_if(m.utm_source is distinct from
        b.contexts_com_snowplowanalytics_snowplow_utm_referrer_1[0]:source::varchar), 0)
        as utm_source_mismatches,
    coalesce(count_if(m.utm_medium is distinct from
        b.contexts_com_snowplowanalytics_snowplow_utm_referrer_1[0]:medium::varchar), 0)
        as utm_medium_mismatches,
    coalesce(count_if(m.load_tstamp_date is distinct from to_date(b.load_tstamp)), 0)
        as load_date_mismatches
from ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS_BACKUP_20261029_120000 b
full outer join ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS m
    on m.event_id = b.event_id;
```

Inspect the schema and grants. Confirm the 19 projected columns are present, `utm_source` and `utm_medium` are strings, and `load_tstamp_date` is a date. Verify that the manifest and source lookup still match the values recorded before migration.

```sql
describe table ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS;
show grants on table ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS;
```

If validation fails, restore the backup while jobs are still paused, restore the original package revision, and investigate before running dbt. Use the original table type and reapply any custom table properties:

```sql
create or replace transient table ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS
clone ANALYTICS.AGENT_ANALYTICS.BASE_EVENTS_BACKUP_20261029_120000
copy grants;
```

After validation passes, run the updated package normally, without `--full-refresh`:

```bash
dbt run --select snowplow_agent_analytics
dbt test --select snowplow_agent_analytics
```

Check the outputs and the manifest's progress, then resume scheduled runs and downstream jobs. Retain the backup until you have validated the upgrade. Once incremental writes resume, restoring only this backup would discard those new rows while leaving the advanced manifest; any later rollback must restore a consistent set of package tables and incremental state.

## Rebuild the package

A coordinated full refresh is the alternative when you cannot migrate the existing table. Back up the package outputs and confirm that the atomic source retains all events from `snowplow__start_date` before rebuilding. A full refresh cannot recover events that have expired from the source.

Follow the [full-refresh instructions](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/agent-analytics/index.md#full-refresh) to rebuild the whole package and repeat incremental runs until the manifest catches up. Do not refresh `base_events` alone while retaining an old manifest or source lookup.

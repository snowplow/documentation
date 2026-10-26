---
title: "Configure the Agent Analytics data model"
sidebar_label: "Agent Analytics"
description: "Configure the Snowplow Agent Analytics dbt package for AI agent traffic and AI referral analysis."
keywords: ["Agent Analytics configuration", "dbt agent analytics package", "configure agent analytics", "configure dbt", "variables"]
sidebar_position: 40
date: "2026-09-28"
---

This page lists the variables you can set to configure the Snowplow Agent Analytics dbt package. The package sets each variable to a recommended default. To override a value, add it to your `dbt_project.yml`:

```yaml title="dbt_project.yml"
vars:
  snowplow_agent_analytics:
    cdn_app_ids: ['my_cdn']
```

## Warehouse and source data

These variables tell the package where to find your events, and which events to read.

| Variable                  | Default           | Description                                                                                                                                                  |
| ------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `snowplow__database`      | `target.database` | Database that contains your atomic events table                                                                                                              |
| `snowplow__atomic_schema` | `atomic`          | Schema that contains your atomic events table                                                                                                                |
| `snowplow__events_table`  | `events`          | Name of your atomic events table                                                                                                                             |
| `cdn_app_ids`             | `['cdn']`         | `app_id` values that identify [CDN tracker](/docs/sources/cdn-trackers/index.md) events                                                                                                             |
| `client_app_ids`          | `[]`              | `app_id` values to restrict client-side page views to. An empty list includes every `app_id`. Set it if your pipeline also receives events from other properties. |

## Operation and logic

These variables control incremental processing and the snapshots in the summary tables.

| Variable                           | Default      | Description                                                                                                                                                                                                                         |
| ---------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `snowplow__start_date`             | `2024-01-01` | Date to start processing events from on the first run or a full refresh                                                                                                                                                            |
| `snowplow__backfill_limit_days`    | `30`         | Maximum number of days of events to process in each run during a backfill                                                                                                                                                           |
| `snowplow__allow_refresh`          | `false`      | Whether `--full-refresh` drops the incremental manifest, `base_events`, and `int_agent_source_lookup` on non-development targets                                                                                                    |
| `snowplow__dev_target_name`        | `dev`        | Target name of your development environment, as defined in your `profiles.yml`. On this target, a full refresh always drops the manifest.                                                                                          |
| `dbt_start_date`                   | `2024-01-01` | Earliest event date to include in the daily tables                                                                                                                                                                                  |
| `late_data_window_days`            | `3`          | Minimum number of trailing days the daily tables rebuild in each run. The window extends automatically to cover the oldest event date in the current batch, so backfills also reach the daily tables.                              |
| `summary_snapshot_mode`            | `weekly`     | How often `page_summary` and `operator_summary` take a snapshot: `latest` keeps only the current date, `weekly` keeps one snapshot per Monday, and `daily` keeps one snapshot per day                                                 |
| `summary_snapshot_retention_weeks` | `26`         | Number of weeks of snapshots to keep in the summary tables                                                                                                                                                                          |
| `snowplow__as_of_date`             | Not set      | Fixes the snapshot date for the summary tables, in `YYYY-MM-DD` format, overriding `summary_snapshot_mode`. Set it when you backfill or replay data, so the 7, 30, and 90 day windows end on the date you rebuild.                      |

## Indicators and semantic layer

These variables control the thresholds for page indicators, and whether the package builds the Snowflake semantic view.

| Variable                           | Default | Description                                                                                                                                                                                                                                    |
| ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orphan_agent_hits_threshold`      | `10`    | Minimum agent hits in the last 30 days for `page_summary` to flag a page with `is_orphaned_agent_interest`                                                                                                                                     |
| `orphan_human_pageviews_threshold` | `5`     | Human page views in the last 30 days below which `page_summary` can flag a page with `is_orphaned_agent_interest`                                                                                                                             |
| `enable_semantic_views`            | `false` | Whether to build the `dim_date`, `dim_page`, and `dim_operator` tables and the Snowflake semantic view. Requires the `Snowflake-Labs/dbt_semantic_view` package. See the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/agent-analytics/index.md#enable-the-semantic-view-optional). |

## Seeds

The package uses seeds to correct agent identity and attribute referrals. To change a seed, disable the package seed in your `dbt_project.yml` and add a seed with the same name and columns to your own project.

| Seed                          | Columns                                                     | Description                                                                                                                                                                                  |
| ----------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `operator_referral_sources`   | `operator`, `source_value`, `medium_value`                  | Maps operators to the referrer `source` and `medium` values of their products. Matching is case-insensitive, and an empty `medium_value` matches any medium.                                 |
| `operators_without_referrals` | `operator`                                                  | Operators that run crawlers but have no product that refers human sessions. The `assert_no_orphan_operators` test doesn't warn about these operators.                                              |
| `agent_ua_overrides`          | `ua_pattern`, `agent_name`, `agent_operator`, `agent_purpose` | Corrects the identity of crawlers whose user agent imitates a browser. `ua_pattern` is matched against `useragent` with `ILIKE`. When several patterns match, the longest one wins.       |
| `agent_name_ignore_list`      | `agent_name`                                                | Agent names too generic to identify an agent, such as `Chrome`. Compared case-sensitively.                                                                                                  |

Operator names in the seeds must match the `operator` values from the [agent classification enrichment](/docs/pipeline/enrichments/available-enrichments/agent-classification-enrichment/index.md) exactly. Keep `ua_pattern` values specific to a crawler: a broad pattern such as `%chrome%` renames real browser traffic.

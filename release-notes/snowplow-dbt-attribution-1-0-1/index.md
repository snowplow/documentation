---
title: "Snowplow dbt Attribution 1.0.1"
sidebar_label: "dbt Attribution 1.0.1"
description: "Reduce unnecessary incremental scans and preserve conversion-path boundary days, with configurable handling of late-arriving conversions."
keywords: ["dbt attribution", "late conversions", "conversion paths", "1.0.1"]
date: "2026-11-23"
category:
  - "Release notes"
components:
  - "Data models"
---

Attribution 1.0.1 reduces unnecessary source reads in `snowplow_attribution_paths_to_conversion` by anchoring incremental windows on the conversion timestamp. It also preserves touchpoints from the full first day of the path lookback, including across daylight-saving changes on Spark. Corrected paths can change attribution values when the affected conversions are reprocessed.

## Configure late-arriving conversions

Each incremental run looks back `snowplow__days_late_allowed` days plus one from the latest processed conversion. The default of `3` gives a 96-hour window. Spark and Databricks select the whole dates covered by that window.

If you customized the variable under `snowplow_unified`, set the same value under `snowplow_attribution`. For a custom conversions source, match its maximum delivery delay. Attribution 1.0.1 ignores `snowplow__lookback_window_hours`.

User-mapping changes and late path events affect existing conversions only when those conversions fall within the reprocessing window. The incremental source check fails if the latest source conversion is older than the latest conversion in the model.

## Upgrade

Continue with normal incremental runs after upgrading. To correct older conversion paths outside the replay window, verify that the source tables retain the required history and back up your outputs before rebuilding.

The package persists relation documentation for derived tables and column documentation on Snowflake, BigQuery, and Redshift. It skips column comments on Spark and Databricks to avoid adapter errors.

See the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/attribution/#upgrading-to-101), [configuration reference](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/attribution/), and [GitHub release](https://github.com/snowplow/dbt-snowplow-attribution/releases/tag/1.0.1).

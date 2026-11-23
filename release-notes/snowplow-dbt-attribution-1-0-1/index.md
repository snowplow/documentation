---
title: "Snowplow dbt Attribution 1.0.1"
description: "Reduce unnecessary incremental scans and preserve conversion-path boundary days, with configurable handling of late-arriving conversions."
date: "2026-11-23"
category:
  - "Release notes"
components:
  - "Data models"
---

Attribution 1.0.1 reduces unnecessary source reads in `snowplow_attribution_paths_to_conversion` by anchoring incremental windows on the conversion timestamp. It also preserves touchpoints from the full first day of the path lookback, including across daylight-saving changes on Spark. Corrected paths can change attribution values when the affected conversions are reprocessed.

## Configure late-arriving conversions

The new `snowplow__days_late_allowed` variable defaults to `3`. Each run re-reads conversions from this value plus one day before the latest processed conversion, or 96 hours by default. Spark and Databricks select whole dates within that window.

If you customized the variable under `snowplow_unified`, set the same value under `snowplow_attribution`. For a custom conversions source, match its maximum delivery delay. `snowplow__lookback_window_hours` no longer controls this window.

User-mapping changes and late path events affect existing conversions only when those conversions fall within the reprocessing window. The source check now fails whenever the conversions source is behind the model.

## Upgrade

No full refresh is required to continue incremental runs. To correct older conversion paths outside the new window, first verify that the source tables retain the required history and back up your outputs before rebuilding.

The package now persists relation documentation for derived tables. Column documentation remains disabled on Spark and Databricks while their column-comment DDL failures are unresolved.

See the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/attribution/#upgrading-to-101), [configuration reference](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/attribution/), and [GitHub release](https://github.com/snowplow/dbt-snowplow-attribution/releases/tag/1.0.1).

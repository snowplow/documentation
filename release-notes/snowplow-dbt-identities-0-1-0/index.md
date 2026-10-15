---
title: "Snowplow dbt Identities 0.1.0 released"
sidebar_label: "dbt Identities 0.1.0"
description: "Snowplow Identities dbt package 0.1.0 adds Databricks support and a versioned installation for identity models."
keywords: ["dbt identities", "Databricks", "identity resolution", "0.1.0"]
date: "2026-10-14"
category:
  - "Release notes"
components:
  - "Data models"
  - "Identities"
---

[Snowplow Identities 0.1.0](https://github.com/snowplow-incubator/dbt-snowplow-identities/releases/tag/0.1.0) adds Databricks support alongside Snowflake and BigQuery. This is the first tagged release of the dbt package, which was previously installed from its Git `main` branch.

## Databricks support

You can build incremental identity mappings, identifier mappings, identity-change history, and slowly changing dimensions on Databricks. The package supports identifier hashing and uses Delta tables with date partitions for incremental outputs.

Use `dbt-databricks` with a Databricks SQL warehouse or Runtime 12.2 LTS or later. Your source events must contain typed identity entities and merge events. See the [Identities quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/) for configuration instructions.

## Upgrade

The package requires dbt Core 1.10.6 or later, below 2.0.0. Pin `revision: "0.1.0"` in your Git package definition and run `dbt deps`.

If you previously installed from `main`, follow the [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/identities/) to review your installed revision and the optional merge-limit collapse setting. The setting defaults to `false` and must only be enabled when no identifier is configured as unique in the Identities service.

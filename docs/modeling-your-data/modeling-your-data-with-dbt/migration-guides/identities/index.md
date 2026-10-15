---
title: "Migration guide for Identities"
sidebar_label: "Identities"
sidebar_position: 70
description: "Pin the Snowplow Identities dbt package to version 0.1.0 and configure Databricks sources."
keywords: ["identities migration", "dbt identities upgrade", "Databricks identities"]
date: "2026-10-15"
---

Use this guide when upgrading an existing Snowplow Identities dbt project. For a new project, follow the [Identities quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/index.md).

## Upgrade to 0.1.0

Version 0.1.0 is the first tagged package release. Earlier installation instructions used the Git `main` branch, so existing projects can have different installed commits. Check your `package-lock.yml` and review the changes between that commit and [0.1.0](https://github.com/snowplow-incubator/dbt-snowplow-identities/releases/tag/0.1.0) before upgrading. A full refresh requirement depends on the changes since your installed commit.

The package requires dbt Core 1.10.6 or later, below 2.0.0. Pin the Git revision in `packages.yml`:

```yaml title="packages.yml"
packages:
  - git: "https://github.com/snowplow-incubator/dbt-snowplow-identities.git"
    revision: "0.1.0"
```

Run `dbt deps`, review the updated `package-lock.yml`, and validate the upgrade in your development target before running it in production.

## Configure Databricks

Use `dbt-databricks` with a Databricks SQL warehouse or Runtime 12.2 LTS or later. Set `snowplow__databricks_catalog` to the source catalog and `snowplow__atomic_schema` to the source schema. The package ignores `snowplow__database` on Databricks.

See the [quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/identities/index.md) for typed source data and destination profile requirements.

## Review optional merge-limit collapse

The `snowplow__merge_limit_collapse` variable defaults to `false`. Enable it only when no identifier is configured as unique in the Identities service.

When enabled, eligible duplicate identifier mappings are corrected as each identifier next appears in an incremental batch. A full refresh from `snowplow__start_date` applies the logic to all reprocessed data. See the [configuration reference](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/identities/index.mdx) before enabling it.

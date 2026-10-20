---
title: "Agent Analytics validates warehouse and license configuration"
sidebar_label: "Agent Analytics configuration checks"
description: "Configure license acceptance before running the Agent Analytics dbt package. Unsupported warehouses return a clear configuration error."
keywords: ["Agent Analytics", "dbt", "Snowflake", "license configuration"]
date: "2026-10-19"
category:
  - "Release notes"
components:
  - "Data models"
platforms:
  - "Snowflake"
---

The Snowplow Agent Analytics dbt package now checks license acceptance and warehouse support before running its models. It continues to support Snowflake only.

When you update your Git installation, set `snowplow__license_accepted: true` in the `snowplow_agent_analytics` vars of your `dbt_project.yml` to confirm that you accept the [Snowplow Personal and Academic License](/personal-and-academic-license-1.0/) or have a commercial agreement with Snowplow. This follows the configuration used by the other Snowplow dbt packages.

These checks do not change model output or require a full refresh of existing models. The updated [quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/agent-analytics/) also includes `--full-refresh` when loading the package's reference seeds.

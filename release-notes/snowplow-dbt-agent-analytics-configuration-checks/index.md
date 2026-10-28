---
title: "Agent Analytics adds BigQuery and Databricks support"
sidebar_label: "Agent Analytics warehouse support"
description: "Run the Agent Analytics dbt package on BigQuery and Databricks, with the same agent and referral metrics as Snowflake."
keywords: ["Agent Analytics", "dbt", "BigQuery", "Databricks", "Snowflake"]
date: "2026-10-22"
category:
  - "Release notes"
components:
  - "Data models"
platforms:
  - "Snowflake"
  - "BigQuery"
  - "Databricks"
---

The Snowplow Agent Analytics dbt package adds BigQuery and Databricks support alongside Snowflake. The new adapters use the same agent attribution rules, daily aggregates, and summary metrics. Snowflake semantic views remain available only on Snowflake.

Databricks requires `dbt-databricks` 1.11 or later and a SQL warehouse or Runtime 12.2 LTS or later.

The package also checks license acceptance and warehouse support before running its models.

When you update your Git installation, set `snowplow__license_accepted: true` in the `snowplow_agent_analytics` vars of your `dbt_project.yml` to confirm that you accept the [Snowplow Personal and Academic License](/personal-and-academic-license-1.0/) or have a commercial agreement with Snowplow. This follows the configuration used by the other Snowplow dbt packages.

The durable base table stores only required scalar fields, including UTM attribution. BigQuery and Databricks use date partitions for incremental target filtering. If you have run an earlier revision that stored raw entity columns, follow the coordinated rebuild instructions in the [quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/agent-analytics/#full-refresh) before upgrading. Back up your outputs and confirm that the source retains the history you need before rebuilding.

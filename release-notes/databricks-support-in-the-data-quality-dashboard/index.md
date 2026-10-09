---
title: "Databricks support in the data quality dashboard"
description: "The data quality dashboard now supports Databricks, so you can inspect failed events loaded through the Iceberg REST catalog alongside Snowflake and BigQuery."
date: "2026-10-13"
category:
  - "Release notes"
components:
  - "Console"
  - "Monitoring"
platforms:
  - "Databricks"
---
The data quality dashboard now supports Databricks. If you load failed events into Databricks through the [Iceberg REST catalog](/docs/destinations/warehouses-lakes/iceberg/), you can inspect them in Console in the same way as failed events in Snowflake or BigQuery.

The data quality dashboard supports Databricks workspaces hosted on AWS.

With this release, you can:

* Enable the data quality dashboard when you add a Databricks Iceberg REST failed events loader, or on an existing one
* Browse failed events, their root causes, and sample rows directly from your Databricks failed events schema
* See Databricks-specific error codes and remediation steps in the dashboard when the connection is missing permissions or a query times out

To learn more, see [Monitor failed events](/docs/monitoring/).

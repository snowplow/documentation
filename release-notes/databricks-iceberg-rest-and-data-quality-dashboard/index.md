---
title: "Load to Databricks through the Iceberg REST catalog, and monitor failed events in the data quality dashboard"
description: "On AWS, the Lake Loader can now write Iceberg tables to Databricks Unity Catalog, and the data quality dashboard can query failed events loaded this way."
date: "2026-10-15"
category:
  - "Release notes"
components:
  - "Destinations"
  - "Monitoring"
platforms:
  - "AWS"
  - "Databricks"
---

AWS pipelines can now load events into Databricks as Iceberg tables, and you can inspect failed events loaded this way in the data quality dashboard. Both features require your pipeline and your Databricks workspace to be hosted on AWS.

## Load to Databricks through the Iceberg REST catalog

The [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/) can now use Databricks Unity Catalog as its Iceberg REST catalog. The loader writes Iceberg tables to a Unity Catalog external location and registers them in the catalog, so you can query them from Databricks. Failed events are supported.

This adds a third way to load AWS pipelines into Databricks, alongside the RDB Loader and the Databricks Streaming Loader. You can set it up in Console, using a Databricks service principal for authentication.

The REST catalog integration has now been tested with Snowflake Open Catalog (Apache Polaris), Snowflake Horizon Catalog, and Databricks Unity Catalog.

## Monitor Databricks failed events in the data quality dashboard

The [data quality dashboard](/docs/monitoring/) now supports Databricks, alongside Snowflake and BigQuery. If you load failed events through the Iceberg REST catalog, you can browse them, see their root causes, and inspect sample rows in Console without the failed event data leaving your infrastructure. The dashboard doesn't support failed events loaded by the Databricks Streaming Loader.

The dashboard queries your failed events through a Databricks SQL warehouse, using the service principal of your Databricks connection. If the connection is missing permissions or a query times out, the dashboard shows Databricks-specific errors with steps to fix them.

To learn more, see:

* [Databricks](/docs/destinations/warehouses-lakes/databricks/)
* [Iceberg](/docs/destinations/warehouses-lakes/iceberg/)
* [Set up the dashboard for Databricks](/docs/monitoring/#set-up-the-dashboard-for-databricks)

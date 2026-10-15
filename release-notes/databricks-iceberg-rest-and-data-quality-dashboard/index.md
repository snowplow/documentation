---
title: "Load to Databricks through the Iceberg REST catalog, and monitor failed events in the data quality dashboard"
description: "On AWS, the Lake Loader can now write Iceberg tables to Databricks Unity Catalog through the Iceberg REST catalog, and the data quality dashboard can query failed events loaded this way."
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

AWS pipelines can now load events into Databricks as Iceberg tables, using Databricks Unity Catalog as the Iceberg REST catalog for the [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/). Failed events are supported.

If you load failed events this way, you can also inspect them in the [data quality dashboard](/docs/monitoring/), in the same way as for Snowflake and BigQuery. The dashboard doesn't support failed events loaded by the Databricks Streaming Loader.

Both features require your pipeline and your Databricks workspace to be hosted on AWS.

## Links

* [Databricks](/docs/destinations/warehouses-lakes/databricks/)
* [Iceberg](/docs/destinations/warehouses-lakes/iceberg/)
* [Set up the dashboard for Databricks](/docs/monitoring/#set-up-the-dashboard-for-databricks)

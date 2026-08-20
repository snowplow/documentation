---
title: "[BigQuery] New column for YAUAA enrichment data"
description: "We have rolled out a new version of Enrich, which includes an update of the YAUAA (Yet Another User Agent Analyzer) enrichment."
date: "2025-03-28"
update_type:
  - "Maintenance notification"
components:
  - "Pipeline components"
  - "Destinations"
platforms:
  - "BigQuery"
---
> **This notice is only applicable to customers using BigQuery Loader version 1 or BigQuery Loader version 2 in compatibility mode.**

We have rolled out a new version of Enrich, which includes an update of the YAUAA (Yet Another User Agent Analyzer) enrichment. This is a significant update that improves detection of various user agents (browsers, robots) and adds new values for existing fields, as well as a new field (`webviewAppNameVersion`).

This is important for BigQuery users in particular, because **there is a new schema version for the YAUAA enrichment**, which means the data will now go into the `..._1_0_5` column, rather than `..._1_0_4`.

If you are using Snowplow dbt models, such as the Unified model, then the data will be automatically taken from the newer column.

**If you are using a custom model, please make sure that it’s using the new column.**

In the future, BigQuery Loader version 2, once rolled out to all customers, can be configured to only create one single column per each major version of a schema. So changes to YAUAA or other enrichments would not result in extra columns being added.

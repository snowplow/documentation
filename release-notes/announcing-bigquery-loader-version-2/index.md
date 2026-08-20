---
title: "Announcing BigQuery Loader version 2"
description: "We are pleased to announce BigQuery Loader version 2."
date: "2025-02-27"
update_type:
  - "Release notes"
components:
  - "Destinations"
  - "Monitoring"
platforms:
  - "GCP"
  - "BigQuery"
---
We are pleased to announce BigQuery Loader version 2.

## What’s new?

### Cloud support

The new loader can run on AWS or GCP, while the old loader only ran on GCP. In particular, this means BigQuery is now available as a destination in Snowplow CDI Cloud.

### Lower infrastructure cost

The new loader uses the BigQuery Storage Write API instead of the older Streaming Inserts API. This makes it cheaper to run, because the Streaming Inserts API was not free ($0.01 per 200 MB, or roughly $1 per 4M events). You can verify how much you would save by looking at your BigQuery bill under “Streaming Inserts”.

For a high-level overview of the loading process, see [Understanding the loading process](/docs/destinations/warehouses-lakes/bigquery/) in our documentation.

### Better schema evolution

All Snowplow loaders automatically manage columns in the warehouse or lake to match your event schemas (data structures). When you create a new version of your schema, it’s often necessary to create a new column, so that the old and the new data formats can coexist.

The new loader only creates new columns for each _major_ schema version. The old loader would create a new column for _each_ schema version. The new behavior keeps the atomic events table more compact and easier to query or write data models for. Plus, it reduces the chances of hitting the 10k column limit in BigQuery.

> Note that to ease migration, the loader can be used in a compatibility mode which mimics the previous behavior for all schemas or a subset of schemas. The [migration guide](/docs/api-reference/loaders-storage-targets/bigquery-loader/upgrade-guides/2-0-0-upgrade-guide/#events-table-format) explains how this mode works and potential challenges with switching to the new format.

For more details on the mapping between Snowplow data and BigQuery tables, see [How schema definitions translate to the warehouse](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/?warehouse=bigquery) in our documentation.

## Support in Snowplow CDI

### Current BigQuery users

**All Snowplow CDI customers currently running BigQuery Loader version 1 will be automatically migrated to version 2 in the following weeks.** We will post a separate [maintenance notification](/release-notes/) with more details. (Make sure to click “Follow” on that page.) Note that the loader will be deployed in full compatibility mode, so nothing about your data in BigQuery will change.

### New deployments

If you are a Snowplow CDI customer not using the old BigQuery loader but would like to set up the new one, you can now do so using a self-served flow. Head to [Destinations](https://console.snowplowanalytics.com/destinations) and select “BigQuery (Loader v2)” in the “Available” tab. You will need to provide authentication details, as well as a BigQuery dataset (in your own GCP project, rather than the Snowplow project).

### Failed events in BigQuery

Finally, you can set up the new loader as a destination for your failed events. See our [previous announcement](/docs/monitoring/exploring-failed-events/) for more details. You do not need to wait for your primary BigQuery loader to be migrated to version 2. Note that the failed events will need to be loaded to a different BigQuery dataset.

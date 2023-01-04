---
title: "Google Cloud Storage"
date: "2020-03-02"
sidebar_position: 10
---

Snowplow supports streaming data (either raw or enriched data) from [Pub/Sub](https://cloud.google.com/pubsub/) into [Google Cloud Storage (GCS)](https://cloud.google.com/storage/) with the [Google Cloud Storage Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/google-cloud-storage-loader/index.md). 

We recommend streaming the "failed events" Pub/Sub topic (containing data that failed to be processed successfully) to GCS. From there, you may wish to load them into your destination of choice to [query the failed events](/docs/managing-data-quality/failed-events/failed-events-in-athena-and-bigquery/index.md) to understand why they were not successfully processed and recover them using [Snowplow Event Recovery](https://github.com/snowplow-incubator/snowplow-event-recovery).

You may also wish to stream the "good events" Pub/Sub topic to serve as a backup in case there is an issue downstream (e.g. while loading the data into BigQuery).  

If you need to load events from GCS into another destination, you'll need to follow the directions for your favored destination on loading data from GCS. 

Decide which Pub/Sub topics you'd like to load into GCS, and then set up the [Google Cloud Storage Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/google-cloud-storage-loader/index.md).
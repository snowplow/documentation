---
title: "Setup Google Cloud Storage (GCS) Destination"
date: "2020-03-02"
sidebar_position: 60
---

Snowplow supports streaming data (either raw or enriched data) from Pub/Sub into Google Cloud Storage (GCS). This can be a useful backup: it means that if there's an issue with the pipeline downstream (e.g. loading the data into BigQuery), there is the possibility of reloading the data from a GCS backup.

In addition, we recommend streaming the "failed events" Pub/Sub topic (containing data that fails to be processed successfully) to GCS, where it is possible to query the failed events to understand why they were not successfully processed and recover them using [Snowplow Event Recovery](https://github.com/snowplow-incubator/snowplow-event-recovery).

To stream data from any of the Snowplow Pub/Sub topics (i.e. raw or enriched) to GCS, you need to use the [Google Cloud Storage Loader](https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader).

Cloud Storage Loader is a [Dataflow](https://cloud.google.com/dataflow) job which dumps event from an input [PubSub](https://cloud.google.com/pubsub/) subscription into a [Cloud Storage](https://cloud.google.com/storage/) bucket.

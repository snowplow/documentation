---
title: "BigQuery"
date: "2020-03-02"
sidebar_position: 0
---

Snowplow supports streaming data into BigQuery in near real-time.

In order to do this, you need to setup the [BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md). This loads enriched events from the enriched Pub/Sub topic, and streams them into BigQuery.

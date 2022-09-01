---
title: "Setup the collector (GCP)"
date: "2020-02-27"
sidebar_position: 0
---

On a GCP pipeline, the Snowplow Stream Collector receives events sent over HTTP(S), and writes them a raw Pub/Sub topic. From there, the data is picked up and processed by the Snowplow validation and enrichment job.

The main [collector documentation](/docs/pipeline-components-and-applications/stream-collector/index.md) describes the core concepts of how the collector works, and the configuration options when running it.

In this guide for GCP we are going to:

1. Setup the Pub/Sub topics required: A good topic for data that is successfully processed by the collector, and a bad one in case any data is not successfully processed.
2. Setup and run the collector application as a single instance VM (e.g. for a development environment)
3. Setup and run the collector as an autoscaling group of instances behind a load balancer (recommended for production)

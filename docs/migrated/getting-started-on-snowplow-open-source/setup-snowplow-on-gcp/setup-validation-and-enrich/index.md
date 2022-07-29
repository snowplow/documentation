---
title: "Setup Validation and Enrich (GCP)"
date: "2020-02-27"
sidebar_position: 30
---

On GCP we provide two options to run enrichments: **Beam Enrich**, running on top of Google Dataflow and **Enrich PubSub**, running as a standalone JVM application.

Both applications consume the raw data from the raw Pub/Sub topic (outputted by the collector). Validate the data (against schemas stored in [Iglu Central](https://github.com/snowplow/iglu-central/) or the user's own schema registry(ies), enrich the data using one or more enrichments and then write the processed data out to the enriched Pub/Sub topic, from where it can be e.g. loaded into BigQuery.

## Choose Enrich PubSub or Beam Enrich

Both options provide same functionality but with different performance/management trade-offs. Beam has to be deployed as a Dataflow job and provides good performance and auto scaling for very big volumes of data. In some cases though we don't need this high throughput and Dataflow is an expensive and opaque service. In these cases you can use Enrich PubSub which is much cheaper for low volume pipelines and easier to manage in absence of scalability (although it also can be scaled using Kubernetes or similar orchestration tool)

## Run Enrich

The [Enrich applications reference](/docs/migrated/pipeline-components-and-applications/enrichment-components/) has instructions for setting up and running [Enrich PubSub](/docs/migrated/pipeline-components-and-applications/enrichment-components/enrich-pubsub/) or [Beam Enrich](/docs/migrated/pipeline-components-and-applications/enrichment-components/beam-enrich/)

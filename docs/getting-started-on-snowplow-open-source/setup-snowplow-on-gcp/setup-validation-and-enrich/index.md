---
title: "Setup Validation and Enrich (GCP)"
date: "2020-02-27"
sidebar_position: 30
---

On GCP we provide two options to run enrichments: **Beam Enrich**, running on top of Google Dataflow and **Enrich PubSub**, running as a standalone JVM application.

Both applications consume the raw data from the raw Pub/Sub topic (outputted by the collector). Validate the data (against schemas stored in [Iglu Central](https://github.com/snowplow/iglu-central/) or the user's own schema registry(ies), enrich the data using one or more enrichments and then write the processed data out to the enriched Pub/Sub topic, from where it can be e.g. loaded into BigQuery.

## Run Enrich

The [Enrich applications reference](/docs/pipeline-components-and-applications/enrichment-components/index.md) has instructions for setting up and running [Enrich PubSub](/docs/pipeline-components-and-applications/enrichment-components/enrich/index.md).

---
title: "Setup Validation and Enrich (GCP)"
date: "2022-11-06"
sidebar_position: 30
---

On GCP we provide **Enrich PubSub**, running as a standalone JVM application.

It consumes the raw data from the raw Pub/Sub topic (outputted by the collector). Validate the data (against schemas stored in [Iglu Central](https://github.com/snowplow/iglu-central/) or the user's own schema registry(ies), enrich the data using one or more enrichments and then write the processed data out to the enriched Pub/Sub topic, from where it can be e.g. loaded into BigQuery.

## Run Enrich

[Enrich PubSub](/docs/enriching-your-data/enrichment-components/enrich-pubsub/index.md) has instructions for setting up and running it.

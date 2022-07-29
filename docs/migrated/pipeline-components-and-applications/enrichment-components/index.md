---
title: "Enrichment"
date: "2020-11-09"
sidebar_position: 50
---

This is the technical documentation for enrichment. If you are not familiar yet with this step of the pipeline, please refer to [this page](/docs/migrated/enriching-your-data/what-is-enrichment/).

Here is the list of the enrichment assets:

## [enrich-kinesis](/docs/migrated/pipeline-components-and-applications/enrichment-components/enrich-pubsub/) (AWS)

Standalone JVM application that reads collector payloads events from a Kinesis stream and outputs back to Kinesis.

## [enrich-pubsub](/docs/migrated/pipeline-components-and-applications/enrichment-components/enrich-pubsub/) (GCP)

Standalone JVM application that reads collector payloads from a PubSub subscription and outputs back to PubSub.

## [Stream Enrich](/docs/migrated/pipeline-components-and-applications/enrichment-components/stream-enrich/) (AWS)

Standalone JVM application that reads collector payloads from a Kinesis stream and outputs back to Kinesis.

In some future this app will get deprecated in favor of `enrich-kinesis`.

## [Beam Enrich](/docs/migrated/pipeline-components-and-applications/enrichment-components/beam-enrich/) (GCP)

[Dataflow](https://cloud.google.com/dataflow/) job that reads collector payloads from a PubSub subscription and outputs back to PubSub.

It is now deprecated, in favor of `enrich-pubsub`.

[](https://github.com/snowplow/snowplow/wiki/_Footer/_edit)

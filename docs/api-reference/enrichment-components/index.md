---
title: "Enrich"
description: "Technical documentation for Snowplow enrichment components including Kinesis, PubSub, Kafka, and NSQ applications for processing collector payloads."
date: "2020-11-09"
sidebar_position: 50
---

This is the technical documentation for the enrichment step. If you are not familiar yet with this step of the pipeline, please refer to [this page](/docs/pipeline/enrichments/index.md).

Here is the list of the enrichment assets:

## [enrich-kinesis](/docs/api-reference/enrichment-components/enrich-kinesis/index.md) (AWS)

Standalone JVM application that reads collector payloads events from a Kinesis stream and outputs back to Kinesis.

## [enrich-pubsub](/docs/api-reference/enrichment-components/enrich-pubsub/index.md) (GCP)

Standalone JVM application that reads collector payloads from a PubSub subscription and outputs back to PubSub.

## [enrich-kafka](/docs/api-reference/enrichment-components/enrich-kafka/index.md) (Azure)

Standalone JVM application that reads collector payloads from a Kafka topic and outputs back to Kafka.

## [enrich-nsq](/docs/api-reference/enrichment-components/enrich-nsq/index.md) (cloud agnostic)

Standalone JVM application that reads collector payloads from NSQ and outputs back to NSQ.

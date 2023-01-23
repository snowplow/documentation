---
title: "Enrich applications"
date: "2020-11-09"
sidebar_position: 30
---

This is the technical documentation for the enrichment step. If you are not familiar yet with this step of the pipeline, please refer to [this page](/docs/enriching-your-data/what-is-enrichment/index.md).

Here is the list of the enrichment assets:

## [enrich-kinesis](/docs/enriching-your-data/enrichment-components/enrich-kinesis/index.md) (AWS)

Standalone JVM application that reads collector payloads events from a Kinesis stream and outputs back to Kinesis.

## [enrich-pubsub](/docs/enriching-your-data/enrichment-components/enrich-pubsub/index.md) (GCP)

Standalone JVM application that reads collector payloads from a PubSub subscription and outputs back to PubSub.

## [enrich-kafka](/docs/enriching-your-data/enrichment-components/enrich-kafka/index.md) (cloud agnostic)

Standalone JVM application that reads collector payloads from a Kafka topic and outputs back to Kafka.

## [enrich-rabbitmq-experimental](/docs/enriching-your-data/enrichment-components/enrich-rabbitmq/index.md) (cloud agnostic)

Standalone JVM application that reads collector payloads from a RabbitMQ subscription and outputs back to RabbitMQ.

## [stream-enrich-kafka](/docs/enriching-your-data/enrichment-components/stream-enrich/index.md) (cloud agnostic)

Standalone JVM application that reads collector payloads from a Kafka topic and outputs back to Kafka.

:::caution

In the near future, this app will get deprecated in favor of `enrich-kafka`.

:::

## [stream-enrich-kinesis](/docs/enriching-your-data/enrichment-components/stream-enrich/index.md) (AWS)

Standalone JVM application that reads collector payloads from a Kinesis stream and outputs back to Kinesis.

:::caution

In the near future, this app will get deprecated in favor of `enrich-kinesis`.

:::


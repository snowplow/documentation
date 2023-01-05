---
title: "Native Integrations"
date: "2021-11-24"
sidebar_position: 0
---

Snowplow offers a variety of native integrations which directly consume the real time stream (Kinesis/PubSub) of your Snowplow pipeline. These integrations are listed below.

## ElasticSearch (AWS only)

The Elasticsearch loader reads enriched data from the enriched Kinesis stream and streams it into Elasticsearch in near real-time.

* For Open Source, see the Elasticsearch Loader [documentation](/docs/destinations/forwarding-events/elasticsearch/index.md).
* For Snowplow BDP, you can [request setup](https://console.snowplowanalytics.com/destinations/catalog) through the Console.

## Azure Event Hubs

Event Hubs is a fully managed, real-time data ingestion service that’s simple, trusted and scalable. Snowplow can forward enriched data to Event Hubs from Kinesis or PubSub, depending on whether your pipeline is in AWS or GCP.

* For Open Source, see [Snowbridge](/docs/pipeline-components-and-applications/snowbridge/index.md).
* For Snowplow BDP, you can [request setup](https://console.snowplowanalytics.com/destinations/catalog) through the Console.

## Apache Kafka

Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. Snowplow can forward enriched data to Kafka from Kinesis or PubSub, depending on whether your pipeline is in AWS or GCP.

* For Open Source, see [Snowbridge](/docs/pipeline-components-and-applications/snowbridge/index.md).
* For Snowplow BDP, you can [request setup](https://console.snowplowanalytics.com/destinations/catalog) through the Console.

---
title: "Native Integrations"
date: "2021-11-24"
sidebar_position: 0
---

Snowplow is primarily built for Data Warehouse destinations and supports Redshift, Snowflake and BigQuery via the [Snowplow Loaders](/docs/migrated/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/). There is also support for S3 and GCS loading, plus the ability to consume directly from Kinesis or PubSub.

Snowplow also offers a variety of native integrations which directly consume the real time stream (Kinesis/PubSub) of your Snowplow pipeline. These integrations are listed below.

## ElasticSearch (AWS only)

The Elasticsearch loader reads enriched data from the enriched Kinesis stream and streams it into Elasticsearch in near real-time.

| Open Source | Snowplow BDP |
| --- | --- |
| ✔️ | ✔️ |
| [Documentation](/docs/migrated/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/elastic/) | [Request Setup](https://console.snowplowanalytics.com/destinations/catalog) |

## Indicative (AWS only)

The Indicative relay reads Snowplow enriched events from a Kinesis Stream and transfers them to Indicative.

| Open Source | Snowplow BDP |
| --- | --- |
| ✔️ | ✔️ |
| [Documentation](/docs/migrated/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/indicative/) | [Request Setup](https://console.snowplowanalytics.com/destinations/catalog) |

## Azure Event Hubs

Event Hubs is a fully managed, real-time data ingestion service that’s simple, trusted and scalable. Snowplow BDP can relay transformed and enriched JSON into Event Hubs.

| Open Source | Snowplow BDP |
| --- | --- |
| ❌ | ✔️ |
|  | [Request Setup](https://console.snowplowanalytics.com/destinations/catalog) |

## Apache Kafka

Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. Snowplow BDP can relay transformed and enriched JSON into Apache Kafka.

Kafka Relaying of Enriched JSON is available to Snowplow BDP customers. Open Source users can get Kafka support for Enriched events by running their Snowplow pipelines on Apache Kafka.

| Open Source | Snowplow BDP |
| --- | --- |
| ❗(Partial) | ✔️ |
| [Collector Setup](/docs/migrated/pipeline-components-and-applications/stream-collector/setup/) | [Request Setup](https://console.snowplowanalytics.com/destinations/catalog) |

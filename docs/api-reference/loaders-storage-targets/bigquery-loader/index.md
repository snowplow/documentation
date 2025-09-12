---
title: "BigQuery Loader"
description: "Load behavioral event data into Google BigQuery for large-scale analytics and data warehousing."
schema: "TechArticle"
keywords: ["BigQuery Loader", "Google BigQuery", "Data Warehouse", "BigQuery Integration", "Cloud Warehouse", "GCP Loader"]
sidebar_label: "BigQuery Loader"
sidebar_position: 2
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import LoaderDiagram from '@site/docs/api-reference/loaders-storage-targets/bigquery-loader/_diagram.md';
import DeployOverview from '@site/docs/api-reference/loaders-storage-targets/bigquery-loader/_deploy-overview.md';
```

The BigQuery Streaming Loader is an application that loads Snowplow events to BigQuery.

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="aws" label="AWS" default>
    <LoaderDiagram stream="Kinesis" cloud="AWS"/>
    <DeployOverview cloud="AWS" stream="kinesis"/>
  </TabItem>
  <TabItem value="gcp" label="GCP">
    <LoaderDiagram stream="Pub/Sub" cloud="GCP"/>
    <DeployOverview cloud="GCP" stream="pubsub"/>
  </TabItem>
  <TabItem value="azure" label="Azure">
    <LoaderDiagram stream="Kafka" cloud="Azure"/>
    <DeployOverview cloud="Azure" stream="kafka"/>
  </TabItem>
</Tabs>

:::tip Schemas in BigQuery

For more information on how events are stored in BigQuery, check the [mapping between Snowplow schemas and the corresponding BigQuery column types](/docs/destinations/warehouses-lakes/schemas-in-warehouse/index.md?warehouse=bigquery).

:::

## Configuring the loader

The loader config file is in HOCON format, and it allows configuring many different properties of how the loader runs.

The simplest possible config file just needs a description of your pipeline inputs and outputs:

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

```json reference
https://github.com/snowplow-incubator/snowplow-bigquery-loader/blob/master/config/config.kinesis.minimal.hocon
```

  </TabItem>
  <TabItem value="gcp" label="GCP">

```json reference
https://github.com/snowplow-incubator/snowplow-bigquery-loader/blob/master/config/config.pubsub.minimal.hocon
```

  </TabItem>
  <TabItem value="azure" label="Azure">

```json reference
https://github.com/snowplow-incubator/snowplow-bigquery-loader/blob/master/config/config.azure.minimal.hocon
```

  </TabItem>
</Tabs>

See the [configuration reference](/docs/api-reference/loaders-storage-targets/bigquery-loader/configuration-reference/index.md) for all possible configuration parameters.

### Iglu

The BigQuery Loader requires an [Iglu resolver file](/docs/api-reference/iglu/iglu-resolver/index.md) which describes the Iglu repositories that host your schemas.  This should be the same Iglu configuration file that you used in the Enrichment process.

## Metrics

The BigQuery Loader can be configured to send the following custom metrics to a [StatsD](https://www.datadoghq.com/statsd-monitoring/) receiver:

| Metric                      | Definition |
|-----------------------------|------------|
| `events_good`               | A count of events that are successfully written to BigQuery. |
| `events_bad`                | A count of failed events that could not be loaded, and were instead sent to the bad output stream. |
| `latency_millis`            | The time in milliseconds from when events are written to the source stream of events (i.e. by Enrich) until when they are read by the loader. |
| `e2e_latency_millis`        | The end-to-end latency of the snowplow pipeline. The time in milliseconds from when an event was received by the collector, until it is written into BigQuery. |

See the `monitoring.metrics.statsd` options in the [configuration reference](/docs/api-reference/loaders-storage-targets/bigquery-loader/configuration-reference/index.md) for how to configure the StatsD receiver.

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="BigQuery Loader" since="2.0.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```

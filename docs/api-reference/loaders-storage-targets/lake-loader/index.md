---
title: "Lake Loader"
description: "Load behavioral event data into data lakes for flexible analytics and large-scale data processing."
schema: "TechArticle"
keywords: ["Lake Loader", "Data Lake", "Big Data Storage", "Lake Storage", "Analytics Lake", "Data Lake Loader"]
sidebar_position: 3
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import DeployOverview from '@site/docs/api-reference/loaders-storage-targets/lake-loader/_deploy_overview.md';
import LakeLoaderDiagram from '@site/docs/api-reference/loaders-storage-targets/lake-loader/_diagram.md';
```

The Lake Loader is an application that loads Snowplow events to a cloud storage bucket using Open Table Formats.

:::info Open Table Formats

The Lake Loader supports the two major Open Table Formats: [Delta](https://delta.io/) and [Iceberg](https://iceberg.apache.org/).

For Iceberg tables, the loader supports [AWS Glue](https://docs.aws.amazon.com/glue/) as catalog.

:::

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="aws" label="AWS" default>
    <LakeLoaderDiagram stream="Kinesis" bucket="S3" cloud="AWS"/>
    <DeployOverview cloud="AWS"/>
  </TabItem>
  <TabItem value="gcp" label="GCP">
    <LakeLoaderDiagram stream="Pub/Sub" bucket="GCS" cloud="GCP"/>
    <DeployOverview cloud="GCP"/>
  </TabItem>
  <TabItem value="azure" label="Azure">
    <LakeLoaderDiagram stream="Kafka" bucket="ADLS Gen 2" cloud="Azure"/>
    <DeployOverview cloud="Azure"/>
  </TabItem>
</Tabs>

## Configuring the loader

The loader config file is in HOCON format, and it allows configuring many different properties of how the loader runs.

The simplest possible config file just needs a description of your pipeline inputs and outputs:

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

```json reference
https://github.com/snowplow-incubator/snowplow-lake-loader/blob/main/config/config.aws.minimal.hocon
```

  </TabItem>
  <TabItem value="gcp" label="GCP">

```json reference
https://github.com/snowplow-incubator/snowplow-lake-loader/blob/main/config/config.gcp.minimal.hocon
```

  </TabItem>
  <TabItem value="azure" label="Azure">

```json reference
https://github.com/snowplow-incubator/snowplow-lake-loader/blob/main/config/config.azure.minimal.hocon
```

  </TabItem>
</Tabs>

See the [configuration reference](/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/index.md) for all possible configuration parameters.

### Windowing

"Windowing" is an important config setting, which controls how often the Lake Loader commits a batch of events to the data lake. If you adjust this config setting, you should be aware that data lake queries are most efficient when the size of the parquet files in the lake are relatively large.

- If you set this to a **low** value, the loader will write events to the lake more frequently, reducing latency. However, the output parquet files will be smaller, which will make querying the data less efficient.
- Conversely, if you set this to a **high** value, the loader will generate bigger output parquet files, which are efficient for queries — at the cost of events arriving to the lake with more delay.

The default setting is `5 minutes`.  For moderate to high volumes, this value strikes a nice balance between the need for large output parquet files and the need for reasonably low latency data.

```
{
  "windowing": "5 minutes"
}
```

If you tune this setting correctly, then your lake can support efficient analytic queries without the need to run an `OPTIMIZE` job on the files.

### Iglu

The Lake Loader requires an [Iglu resolver file](/docs/api-reference/iglu/iglu-resolver/index.md) which describes the Iglu repositories that host your schemas.  This should be the same Iglu configuration file that you used in the Enrichment process.

### Metrics

The Lake Loader can be configured to send the following custom metrics to a [StatsD](https://www.datadoghq.com/statsd-monitoring/) receiver:

| Metric                      | Definition |
|-----------------------------|------------|
| `events_committed`          | A count of events that are successfully written and committed to the lake.  Because the loader works in timed windows of several minutes, this metric has a "spiky" value, which is often zero and then periodically spikes up to larger values. |
| `events_received`           | A count of events received by the loader.  Unlike `events_committed` this is a smooth varying metric, because the loader is constantly receiving events throughout a timed window. |
| `events_bad`                | A count of failed events that could not be loaded, and were instead sent to the bad output stream. |
| `latency_millis`            | The time in milliseconds from when events are written to the source stream of events (i.e. by Enrich) until when they are read by the loader. |
| `processing_latency_millis` | For each window of events, the time in milliseconds from when the first event is read from the stream, until all events are written and committed to the lake. |
| `e2e_latency_millis`        | The end-to-end latency of the snowplow pipeline. For each window of events, the time in milliseconds from when the first event was received by the collector, until all events are written and committed to the lake. |

See the `monitoring.metrics.statsd` options in the [configuration reference](/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/index.md) for how to configure the StatsD receiver.


```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Lake Loader" since="0.1.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```

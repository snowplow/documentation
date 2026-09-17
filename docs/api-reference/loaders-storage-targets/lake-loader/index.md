---
title: "Open Table Format Lake Loader"
sidebar_label: "Lake Loader"
sidebar_position: 3
description: "Load Snowplow events to data lakes using Delta or Iceberg table formats on S3, GCS, or Azure ADLS Gen2."
keywords: ["lake loader", "delta lake", "iceberg", "open table formats", "data lake"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DeployOverview from '@site/docs/api-reference/loaders-storage-targets/lake-loader/_deploy_overview.md';
import LakeLoaderDiagram from '@site/docs/api-reference/loaders-storage-targets/lake-loader/_diagram.md';
```

The Lake Loader is an application that loads Snowplow events to a cloud storage bucket using Open Table Formats.

:::info[Open Table Formats]

The Lake Loader supports the two major Open Table Formats: [Delta](https://delta.io/) and [Iceberg](https://iceberg.apache.org/).

For Iceberg tables, the loader supports [AWS Glue](https://docs.aws.amazon.com/glue/) and [Iceberg REST](https://iceberg.apache.org/rest-catalog-spec/) as catalogs. The REST catalog integration has been tested with Snowflake Open Catalog.

:::

<Tabs groupId="cloud" queryString>
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

## Monitoring the loader

The Lake Loader reports metrics covering event counts, latency, the state of the table after each commit, and the disk and memory used by its internal Spark instance. It can send them to StatsD, to Prometheus, or to both.

See [Monitoring the Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/monitoring/index.md) for the full list of metrics and for how to configure each protocol.

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Lake Loader" since="0.1.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```

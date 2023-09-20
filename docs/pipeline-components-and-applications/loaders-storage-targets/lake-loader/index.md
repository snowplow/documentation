---
title: "Lake Loader"
sidebar_position: 3
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import CodeBlock from '@theme/CodeBlock';
import DeployOverview from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_deploy_overview.md';
import LakeLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_diagram.md';
```

## Overview

The Lake Loader is an application that loads Snowplow events to a cloud storage bucket using Open Table Formats.

:::info Open Table Formats

Currently the lake loader supports [Delta format](https://delta.io/) only. Future releases will add support for [Iceberg](https://iceberg.apache.org/) and [Hudi](https://hudi.apache.org/) formats.

:::

<Tabs groupId="cloud" queryString>
  <TabItem value="gcp" label="GCP" default>
    <LakeLoaderDiagram stream="Pub/Sub" bucket="GCS" cloud="GCP"/>
    <DeployOverview cloud="GCP"/>
  </TabItem>
  <TabItem value="aws" label="Azure">
    <LakeLoaderDiagram stream="Kafka" bucket="ADLS Gen 2" cloud="Azure"/>
    <DeployOverview cloud="Azure"/>
  </TabItem>
</Tabs>

## Configure the loader

The loader config file is in HOCON format, and it allows configuring many different properties of how the loader runs.

The simplest possible config file just needs a description of your pipeline inputs and outputs:

<Tabs groupId="cloud" queryString>
  <TabItem value="gcp" label="GCP" default>

<!-- TODO: this file should get renamed to config.gcp.minimal.hocon -->

```json reference
https://github.com/snowplow-incubator/snowplow-lake-loader/blob/main/config/config.pubsub.minimal.hocon
```


  </TabItem>
  <TabItem value="aws" label="Azure">

```json reference
https://github.com/snowplow-incubator/snowplow-lake-loader/blob/main/config/config.azure.minimal.hocon
```

  </TabItem>
</Tabs>

See the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/index.md) for all possible configuration parameters.

### Windowing

"Windowing" is an important config setting, which controls how often the lake loader commits a batch of events to the data lake. If you adjust this config setting, you should be aware that data lake queries are most efficient when the size of the parquet files in the lake are relatively large.

- If you set this to a **low** value, the loader will write events to the lake more frequently, reducing latency. However, the output parquet files will be smaller, which will make querying the data less efficient.
- If you set this to a **high** value, then you generate bigger output parquet files which are efficient for queries, but it adds a delay to events entering your lake.

The default setting is `5 minutes`.  Above a certain event volume,  this default setting strikes a nice balance between the need for large output parquet files and the need for reasonably low latency data.

```
{
  "windowing": "5 minutes"
}
```

If you tune this setting correctly, then your lake can support efficient analytic queries without the need to run an `OPTIMIZE` job on the files.

### Iglu

The lake loader requires an [Iglu resolver file](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) which describes the Iglu repositories that host your schemas.  This should be the same Iglu configuration file that you used in the Enrichment process.


```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Lake Loader" since="0.1.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```

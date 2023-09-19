---
title: "Lake Loader"
sidebar_position: 3
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import CodeBlock from '@theme/CodeBlock';
import DeployOverview from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_deploy_overview.md';
import LakeLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_diagram.md';
import GCPConfiguration from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_gcp_configuration.md';
import AzureConfiguration from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_azure_configuration.md';
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
  <TabItem value="aws" label="Azure" default>
    <LakeLoaderDiagram stream="Kafka" bucket="ADLS Gen 2" cloud="Azure"/>
    <DeployOverview cloud="Azure"/>
  </TabItem>
</Tabs>

## Configure the loader

The loader config file is in HOCON format, and it allows configuring many different properties of how the loader runs.

The simplest possible config file just needs a description of your pipeline inputs and outputs:

<Tabs groupId="cloud" queryString>
  <TabItem value="gcp" label="GCP" default>
    <GCPConfiguration/>
  </TabItem>
  <TabItem value="aws" label="Azure" default>
    <AzureConfiguration/>
  </TabItem>
</Tabs>

### Windowing

"Windowing" is an important config setting, which controls how often the lake loader commits a batch of events to the data lake.

- If you set this to a **low** value, then you write events to the lake more frequently, but the output file size might be smaller than ideal.
- If you set this to a **high** value, then you generate big output parquet files which are efficient for queries, but it adds a delay to events entering your lake.

The default setting is `5 minutes` which is a nice balance between the need for large output parquet files and the need for reasonably low latency data.

<CodeBlock>{`{
    "windowing": "5 minutes"
}`}</CodeBlock>

If you tune this setting correctly, then your lake can support efficient analytic queries without the need to run a `OPTIMIZE` job on the files.

### Iglu

The lake loader requires a [Iglu resolver file](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) which describes the Iglu repositories that host your schemas.  This should be the same Iglu configuration file that you used in the Enrichment process.


```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Lake Loader" since="0.1.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```

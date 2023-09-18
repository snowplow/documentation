---
title: "Lake Loader (Delta)"
sidebar_position: 3
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import LakeLoaderOverview from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_overview.md';
import CodeBlock from '@theme/CodeBlock';
```

## Overview

The Lake Loader is an application that loads Snowplow events to a cloud storage bucket using Open Table Formats.

:::info Open Table Formats

Currently the lake loader supports [Delta format](https://delta.io/) only. Future releases will add support for [Iceberg](https://iceberg.apache.org/) and [Hudi](https://hudi.apache.org/) formats.

:::

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="gcp" label="GCP" default>
    <LakeLoaderOverview stream="Pub/Sub" bucket="GCS" cloud="GCP"/>
  </TabItem>
  <TabItem value="aws" label="Azure" default>
    <LakeLoaderOverview stream="Kafka" bucket="ADLS Gen 2" cloud="Azure"/>
  </TabItem>
</Tabs>

## Configure the loader

The loader config file is in HOCON format, and it allows configuring many different properties of how the loader runs.

The simplest possible config file just needs a description of your pipeline inputs and outputs:

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="gcp" label="GCP" default>
        <p>Minimal config file</p>
        <CodeBlock language="json">{`\
"input": {
  "subscription": "projects/myproject/subscriptions/snowplow-enriched"
}
"output" {
  "good": {
    "location": "gs://my-bucket/events"
  }
  "bad": {
    "topic": "projects/myproject/topics/snowplow-bad"
  }
}`}</CodeBlock>
  </TabItem>
  <TabItem value="aws" label="Azure" default>
        <p>Minimal config file</p>
        <CodeBlock language="json">{`\
"input": {
  "topicName": "snowplow-enriched"
  "bootstrapServers": "localhost:9092"
}
"output": {
  "good": {
    "location": "abfs://snowplow@example.dfs.core.windows.net/events"
  }
  "bad": {
    "topicName": "snowplow-bad"
    "bootstrapServers": "localhost:9092"
  }
}`}</CodeBlock>
  </TabItem>
</Tabs>

For details on all possible configuration settings, see the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/index.md)

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Lake Loader" since="0.1.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```

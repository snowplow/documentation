---
title: "Snowflake Streaming Loader"
sidebar_label: "🆕 Snowflake Streaming Loader"
sidebar_position: 0
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import LoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/_diagram.md';
import DeployOverview from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/_deploy-overview.md';
import StreamingVsRDB from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/_snowflake-streaming-vs-rdb.md';
```

## Overview

The Snowflake Streaming Loader is an application that loads Snowplow events to Snowflake using the [Snowpipe Streaming API](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-streaming-overview).

<StreamingVsRDB/>

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

## Configuring the loader

The loader config file is in HOCON format, and it allows configuring many different properties of how the loader runs.

The simplest possible config file just needs a description of your pipeline inputs and outputs:

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

```json reference
https://github.com/snowplow-incubator/snowflake-loader/blob/main/config/config.kinesis.minimal.hocon
```

  </TabItem>
  <TabItem value="gcp" label="GCP">

```json reference
https://github.com/snowplow-incubator/snowflake-loader/blob/main/config/config.pubsub.minimal.hocon
```

  </TabItem>
  <TabItem value="azure" label="Azure">

```json reference
https://github.com/snowplow-incubator/snowflake-loader/blob/main/config/config.azure.minimal.hocon
```

  </TabItem>
</Tabs>

See the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/configuration-reference/index.md) for all possible configuration parameters.



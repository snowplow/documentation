---
title: "BigQuery Loader"
sidebar_label: "BigQuery Loader"
sidebar_position: 2 
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import LoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/_diagram.md';
import DeployOverview from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/_deploy-overview.md';
```

## Overview

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
For more information on how events are stored in BigQuery, check the [mapping between Snowplow schemas and the corresponding BigQuery column types](/docs/storing-querying/schemas-in-warehouse/index.md?warehouse=bigquery).
:::

## Configuring the loader

The loader config file is in HOCON format, and it allows configuring many different properties of how the loader runs.

The simplest possible config file just needs a description of your pipeline inputs and outputs:

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

```json reference
https://github.com/snowplow-incubator/snowplow-bigquery-loader/blob/v2/config/config.kinesis.minimal.hocon
```

  </TabItem>
  <TabItem value="gcp" label="GCP">

```json reference
https://github.com/snowplow-incubator/snowplow-bigquery-loader/blob/v2/config/config.pubsub.minimal.hocon
```

  </TabItem>
  <TabItem value="azure" label="Azure">

```json reference
https://github.com/snowplow-incubator/snowplow-bigquery-loader/blob/v2/config/config.azure.minimal.hocon
```

  </TabItem>
</Tabs>

See the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/configuration-reference/index.md) for all possible configuration parameters.

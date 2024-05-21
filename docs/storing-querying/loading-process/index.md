---
title: "Understanding the data loading process"
sidebar_label: "How loading works"
sidebar_position: 2
description: "A high level view of how Snowplow data is loaded into Redshift, BigQuery, Snowflake and Databricks"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import RDBLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/_cross-cloud-diagram.md';
import BigQueryLoaderDiagramV1 from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/previous-versions/bigquery-loader-1.x/_diagram.md';
import BigQueryLoaderDiagramV2 from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/_cross-cloud-diagram.md';
import LakeLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/_cross-cloud-diagram.md';
import SnowflakeStreamingLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/_cross-cloud-diagram.md';
```

The data loading process is engineered for large volumes of data. In addition, for each data warehouse, our loader applications ensure the best representation of Snowplow events. That includes [automatically adjusting the database types](/docs/storing-querying/schemas-in-warehouse/) for [self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md) according to their [schemas](/docs/understanding-your-pipeline/schemas/index.md).

<Tabs groupId="warehouse" queryString lazy>
  <TabItem value="redshift" label="Redshift" default>

We load data into Redshift using the [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md).

<RDBLoaderDiagram shredding="true" format="TSV" warehouse="Redshift"/>

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

We load data into BigQuery using the [BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md).

   <Tabs groupId="bigquery-loader-version" queryString lazy>
        <TabItem value="v2" label="Version 2.x" default>
            <BigQueryLoaderDiagramV2/>
        </TabItem>
        <TabItem value="v1" label="Version 1.x">
            <BigQueryLoaderDiagramV1/>
        </TabItem>
     </Tabs>
  </TabItem>
  <TabItem value="databricks" label="Databricks">

We load data into Databricks using the [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md).

<RDBLoaderDiagram format="Parquet" warehouse="Databricks"/>

  </TabItem>
  <TabItem value="databricks-lake" label="Databricks (via lake)">

We load data into Databricks using the [Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md).

<LakeLoaderDiagram warehouse="Databricks"/>

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

We load data into Snowflake using the [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md).

<RDBLoaderDiagram format="JSON" warehouse="Snowflake"/>

  </TabItem>
  <TabItem value="snowflake-streaming" label="Snowflake (Streaming)">

We load data into Snowflake using the [Snowflake Streaming Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/index.md).

<SnowflakeStreamingLoaderDiagram/>

  </TabItem>
  <TabItem value="synapse" label="Synapse Analytics">

We load data into Synapse Analytics using the [Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md).

<LakeLoaderDiagram warehouse="Synapse Analytics"/>

  </TabItem>
</Tabs>

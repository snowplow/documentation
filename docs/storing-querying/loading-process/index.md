---
title: "Understanding the data loading process"
sidebar_label: "How loading works"
sidebar_position: 2
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import RDBLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/_diagram.md';
import RDBLoaderCrossCloudDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/_cross-cloud-diagram.md';
import BigQueryLoaderDiagram from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/_diagram.md';
```

The data loading process is engineered for large volumes of data. In addition, for each data warehouse, our loader applications ensure the best representation of Snowplow events. That includes [automatically adjusting the database types](/docs/storing-querying/schemas-in-warehouse/) for [self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md) according to their [schemas](/docs/understanding-your-pipeline/schemas/index.md).

<Tabs groupId="warehouse" queryString lazy>
  <TabItem value="redshift" label="Redshift" default>

We load data into Redshift using the [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md).

<RDBLoaderDiagram batch="true" shredding="true" stream="Kinesis" bucket="S3" queue="SQS" format="JSON" warehouse="Redshift"/>

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

We load data into BigQuery using the [BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md).

<BigQueryLoaderDiagram/>

  </TabItem>
  <TabItem value="databricks" label="Databricks">

We load data into Databricks using the [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md).

<RDBLoaderCrossCloudDiagram format="Parquet" warehouse="Databricks"/>

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

We load data into Snowflake using the [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md).

<RDBLoaderCrossCloudDiagram format="JSON" warehouse="Snowflake"/>

  </TabItem>
</Tabs>

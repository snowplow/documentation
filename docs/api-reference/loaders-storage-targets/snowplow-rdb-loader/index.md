---
title: "RDB Loader (Redshift, Databricks)"
sidebar_position: 1
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CrossCloudDiagram from '@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/_cross-cloud-diagram.md';
import StreamingVsRDB from '@site/docs/api-reference/loaders-storage-targets/_snowflake-streaming-vs-rdb.md';
```

We use the name RDB Loader (from "relational database") for a set of applications that can be used to load Snowplow events into a data warehouse. Use these tools if you want to load into **Redshift** (including Redshift serverless), **Databricks**, or **Snowflake** (the latter not recommended). For other destinations, see [here](/docs/api-reference/loaders-storage-targets/index.md).

<Tabs groupId="warehouse" queryString lazy>
  <TabItem value="redshift" label="Redshift" default>
    <CrossCloudDiagram format="TSV" warehouse="Redshift"/>
  </TabItem>
  <TabItem value="databricks" label="Databricks">
    <CrossCloudDiagram format="Parquet" warehouse="Databricks"/>
  </TabItem>
  <TabItem value="snowflake" label="Snowflake">
    <StreamingVsRDB/>
    <CrossCloudDiagram format="JSON" warehouse="Snowflake"/>
  </TabItem>
</Tabs>

:::tip Schemas in Redshift, Snowflake and Databricks

For more information on how events are stored in the warehouse, check the [mapping between Snowplow schemas and the corresponding warehouse column types](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md).

:::

To run RDB Loader, you will need to run one instance of the Transformer and one instance of the Loader.

## How to pick a transformer

The transformer app currently comes in two flavours: a Spark job that processes data in batches, and a long-running streaming app.

The process of transforming the data is not dependent on the storage target. Which one is best for your use case depends on three factors:

- cloud provider you want to use (AWS, GCP or Azure)
- your expected data volume
- how much importance you place on deduplicating the data before loading it into the data warehouse.

### Based on cloud provider

If you want to run the transformer on AWS, you can use Spark transformer (`snowplow-transformer-batch`) or Transformer Kinesis (`snowplow-transformer-kinesis`).

If you want to run the transformer on GCP, you can use Transformer Pubsub (`snowplow-transformer-pubsub`).

If you want to run the transformer on Azure, you can use Transformer Kafka (`snowplow-transformer-kafka`).

### Based on expected data volume

The Spark transformer (`snowplow-transformer-batch`) is the best choice for big volumes, as the work can be split across multiple workers. However, the need to run it on EMR creates some overhead that is not justified for low-volume pipelines.

The stream transformer (`snowplow-transformer-kinesis`, `snowplow-transformer-pubsub` and `snowplow-transformer-kafka`) is a much leaner alternative and suggested for use with low volumes that can be comfortably processed on a single node. However, multiple stream transformers can be run parallel therefore it is possible to process big data volume with stream transformer too.

To make the best choice, consider:

- What is the underlying infrastructure? For example, a single-node stream transformer will perform differently based on the resources it is given by the machine it runs on.
- What is the frequency for processing data? For example, even in a low-volume pipeline, if you only run the transform job once a day, the accumulated data might be enough to justify the use of Spark.

### Based on the importance of deduplication

The transformer is also in charge of [deduplicating](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/deduplication/index.md) the data. Currently, only the Spark transformer can do that.

If duplicates are not a concern, or if you are happy to deal with them after the data has been loaded in the warehouse, then pick a transformer based on your expected volume (see above). Otherwise, use the Spark transformer.

## How to pick a loader based on the destination

There are different loader applications depending on the storage target. Currently, RDB Loader supports Redshift (AWS only), Snowflake and Databricks.

For loading into **Redshift** (including Redshift serverless), use the `snowplow-rdb-loader-redshift` artifact.

For loading into **Snowflake**, use the `snowplow-rdb-loader-snowflake` artifact.

For loading into **Databricks**, use the `snowplow-rdb-loader-databricks` artifact.

## How `transformer` and `loader` interface with other Snowplow components and each other

The applications communicate through messages.

The transformer consumes enriched tsv-formatted Snowplow events from S3 (AWS) or stream (AWS, GCP and Azure). It writes its output to blob storage (S3, GCS or Azure Blob Storage). Once it's finished processing a batch of data, it issues a message with details about the run.

The loader consumes a stream of these messages and uses them to determine what data needs to be loaded. It issues the necessary SQL commands to the storage target.

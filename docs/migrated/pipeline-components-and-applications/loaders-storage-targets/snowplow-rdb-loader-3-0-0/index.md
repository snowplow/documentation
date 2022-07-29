---
title: "RDB Loader"
date: "2022-04-04"
sidebar_position: 10
---

We use the name RDB Loader (from "relational database") for a set of applications that can be used to load Snowplow events into a data warehouse. Use these tools if you want to load into **Redshift**, **Snowflake** or **Databricks**. For other destinations, see [here](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/).

Loading [enriched](/docs/migrated/pipeline-components-and-applications/enrichment-components/) Snowplow data is a two-step process which consists of:

- transforming the enriched tsv-formatted data into a format that can be readily loaded into a target (previously known as 'shredding');
- loading the transformed data.

Each step is handled by a dedicated application: `transformer` or `loader`. To load Snowplow data with RDB Loader, you'll need to run one of each.

## How to pick a transformer

The transformer app currently comes in two flavours: a Spark job that processes data in batches, and a long-running streaming app.

The process of transforming the data is not dependent on the storage target. Which one is best for your use case depends on two factors:

- your expected data volume
- how much importance you place on deduplicating the data before loading it into the data warehouse.

### Based on expected data volume

The Spark transformer (`snowplow-transformer-batch`) is the best choice for big volumes, as the work can be split across multiple workers. However, the need to run it on EMR creates some overhead that is not justified for low-volume pipelines.

The stream transformer (`snowplow-transformer-kinesis`) is a much leaner alternative and suggested for use with low volumes that can be comfortably processed on a single node. Keep in mind that in a multi-node setup you might run into race conditions between the different workers.

To make the best choice, consider:

- What is the underlying infrastructure? For example, a single-node stream transformer will perform differently based on the resources it is given by the machine it runs on.
- What is the frequency for processing data? For example, even in a low-volume pipeline, if you only run the transform job once a day, the accumulated data might be enough to justify the use of Spark.

### Based on the importance of deduplication

The transformer is also in charge of [deduplicating](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/deduplication) the data. Currently, only the Spark transformer can do that.

If duplicates are not a concern, or if you are happy to deal with them after the data has been loaded in the warehouse, then pick a transformer based on your expected volume (see above). Otherwise, use the Spark transformer.

## How to pick a loader based on the destination

There are different loader applications depending on the storage target. Currently, RDB Loader supports Redshift, Snowflake and Databricks.

For loading into **Redshift**, use the `snowplow-rdb-loader-redshift` artefact.

For loading into **Snowflake**, use the `snowplow-rdb-loader-snowflake` artefact.

For loading into **Databricks**, use the `snowplow-rdb-loader-databricks` artefact.

## How `transformer` and `loader` interface with other Snowplow components and each other

The applications communicate through messages.

The transformer consumes enriched tsv-formatted Snowplow events from S3 or stream. It writes its output to S3. Once it's finished processing a batch of data, it issues a message with details about the run.

The loader consumes a stream of these messages and uses them to determine what data needs to be loaded. It issues the necessary SQL commands to the storage target.

![](https://docs.snowplowanalytics.com/wp-content/uploads/2022/04/shredder_loader_interface.png?w=1024)

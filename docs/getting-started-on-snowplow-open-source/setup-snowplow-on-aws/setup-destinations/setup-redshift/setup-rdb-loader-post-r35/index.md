---
title: "RDB Loader 1.0.0"
date: "2021-01-28"
sidebar_position: -10
---

## 1. Overview

Enriched events are loaded from S3 to Redshift by the RDB loader, which is in fact made of 2 applications:

- Shredder: Spark batch job reading enriched events from S3 and writing shredded data to S3. Needs to be orchestrated by an external app (e.g. [dataflow-runner](/docs/pipeline-components-and-applications/dataflow-runner/index.md)). When shredder is done, it writes a message to SQS with the details about shredded data on S3. Each execution writes one message to SQS.
- Loader: long-running app that consumes details about shredded data from SQS and inserts into Redshift

Upstream of the RDB loader, [S3 loader](/docs/destinations/warehouses-and-lakes/s3/index.md) must be setup to write enriched events from Kinesis to S3. It's important to **not** partition when doing so ([these parameters](https://github.com/snowplow/snowplow-s3-loader/blob/1.0.0/examples/config.hocon.sample#L92-L97) must not be set).

## 2. Architecture

![](images/architecture.png)

1. Enriched files copied from _enriched/_ to _archive/enriched/_ with S3DistCp on EMR.
2. Shredder is run as an EMR step. It reads the directory from step 1. 
    Step 1 and 2 are orchestrated by Dataflow Runner (or any other orchestration tool).  
    Shredder is stateless. It knows which data to shred by comparing directories in _archive/enriched/_ and _shredded/_.
3. Shredder writes shredded data to S3.
4. When the writing is done, it sends the metadata about shredding data to SQS with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.storage/shredding_complete/jsonschema/1-0-0).
5. Loader in a long-running app running app (e.g. on ECS fargate) that consumes messages from SQS.
6. When it receives a message sent by shredder, it knows where shredded data to load is located on S3.
7. Loader loads data into Redshift. It uses a manifest table to prevent from double-logging and for better logging.

## 3. Setup

Steps to get RDB loader up and running:

1. [Configure Transformer (formerly Shredder) and loader](/docs/destinations/warehouses-and-lakes/rdb/index.md)
2. Create SQS FIFO queue. Content-based deduplication needs to be enabled.
3. Configure [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/setup/index.md) with the schemas  
    **IMPORTANT**: do not forget to add `/api` at the end of the uri in the resolver configuration for the loader
4. Create `atomic.events` table. Instructions can be found on [this page](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/setup-redshift/launch-a-redshift-cluster/setup-the-snowplow-database-and-events-table/index.md)
5. Run RDB Loader as long-running process with access to message queue:  
    `docker run snowplow/snowplow-rdb-loader:1.0.0 --config config.hocon.base64 --iglu-config resolver.json.base64`
6. [Schedule EMR jobs with S3DistCp and Shredder](/docs/destinations/warehouses-and-lakes/rdb/transforming-enriched-data/spark-transformer/index.md)

## 4. Shredder stateless algorithm

Shredder is stateless and infers automatically which data need to get shredded and which data were not successfully shredded in past runs, by comparing the content of enriched and shredded folders on S3.

How does this work ?

Inside _archive/enriched/,_ folders are organized by run ids, e.g.

![](images/ls.png)

When shredder starts, it lists the content of _archive/enriched_/.

It then lists the content of _shredded/_ and compares.

If all enriched events in _archive/enriched/_ have already been successfully shredded, then each folder in _archive/_ must exist in _shredded/_ with the same name and inside each of them, a file _shredded_complete.json_ must exist. The content of this file is a SDJ with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.storage/shredding_complete/jsonschema/1-0-0) and is exactly what is sent to SQS for the loader.

When a folder exists in _archive/enriched/_ but not in _shredded/_, it means that the folder needs to get shredded.

If a folder exists in both _archive/_ and _shredded/_ but there is no _shredded_complete.json_ in _shredded/_, it means that shredded has failed for this folder in a past run. In this case shredder [logs an error](https://github.com/snowplow/snowplow-rdb-loader/blob/1.0.0/modules/shredder/src/main/scala/com/snowplowanalytics/snowplow/rdbloader/shredder/batch/ShredJob.scala#L224).

**IMPORTANT**: when rolling out to this version, the existing state needs to get "sealed", by creating _shredded_complete.json_ file (can be empty) inside each folder in _shredded/_.

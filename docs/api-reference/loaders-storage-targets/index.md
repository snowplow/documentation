---
title: "Warehouse and lake data loaders"
sidebar_label: "Warehouse and lake loaders"
date: "2020-11-24"
sidebar_position: 60
description: "Load Snowplow enriched events into data warehouses and lakes including BigQuery, Redshift, Snowflake, Databricks, and S3."
keywords: ["snowplow loaders", "data warehouse", "data lake", "bigquery", "redshift", "snowflake"]
---

Snowplow provides loader applications for several different warehouses and lakes, across different clouds.

Choose a loader based on your use case and data needs. This table summarizes the available loaders:

| Loader                                                                                                          | Target                          | Supported clouds | Description                                                                                                  |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------ |
| [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md)   | Snowflake                       | AWS, GCP, Azure  | Loads events to Snowflake with sub-minute latency using Snowpipe Streaming.                                  |
| [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)                          | Redshift, Databricks, Snowflake | AWS, GCP, Azure  | Batch loader with transformation and deduplication using Spark or stream transformers. Redshift is AWS only. |
| [BigQuery Streaming Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md)               | BigQuery                        | AWS, GCP, Azure  | Streams events to BigQuery with real-time loading and schema evolution.                                      |
| [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                                 | S3, GCS, Azure ADLS Gen2        | AWS, GCP, Azure  | Loads events to data lakes using Delta or Iceberg table formats.                                             |
| [Databricks Streaming Loader](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md) | Databricks                      | AWS, GCP, Azure  | Loads events to Databricks with low latency using Lakeflow Declarative Pipelines and Unity Catalog volumes.  |
| [S3 Loader](/docs/api-reference/loaders-storage-targets/s3-loader/index.md)                                     | S3                              | AWS              | Archives events from Kinesis to S3 in LZO or Gzip format.                                                    |
| [Google Cloud Storage Loader](/docs/api-reference/loaders-storage-targets/google-cloud-storage-loader/index.md) | GCS                             | GCP              | Archives events from Pub/Sub to GCS buckets using Dataflow.                                                  |
| [Postgres Loader](/docs/api-reference/loaders-storage-targets/snowplow-postgres-loader/index.md)                | PostgreSQL                      | AWS, GCP         | Loads enriched events into PostgreSQL for development and testing. Not recommended for production.           |
| [Elasticsearch Loader](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md)                      | Elasticsearch, OpenSearch       | AWS              | Loads enriched and failed events from Kinesis or NSQ streams into Elasticsearch or OpenSearch clusters.      |

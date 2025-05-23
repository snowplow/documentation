---
title: "Storing and querying data"
sidebar_position: 1
sidebar_label: "Warehouses and lakes"
description: "An overview of the available options for storing Snowplow data in data warehouses and lakes"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Data warehouses and data lakes are primary destinations for Snowplow data. For other options, see the [destinations overview](/docs/fundamentals/destinations/index.md) page.

## Data warehouse loaders

:::note Cloud

The cloud selection is for where your Snowplow pipeline runs. The warehouse itself can be deployed in any cloud.

:::

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

| Destination                                    | Type                                         | Loader application                                                                                            | Status                             |
| ---------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Redshift<br/>_(including Redshift serverless)_ | Batching (recommended)<br/>or micro-batching | [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)                        | Production-ready                   |
| BigQuery                                       | Streaming                                    | [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md)                       | Production-ready                   |
| Snowflake                                      | Batching (recommended)<br/>or micro-batching | [Snowplow RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)               | Production-ready                   |
| Snowflake                                      | Streaming                                    | [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) | Early release                      |
| Databricks                                     | Batching (recommended)<br/>or micro-batching | [Snowplow RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)               | Production-ready                   |
| Postgres                                       | Streaming                                    | [Postgres Loader](/docs/api-reference/loaders-storage-targets/snowplow-postgres-loader/index.md)              | Not recommended for production use |

  </TabItem>
  <TabItem value="gcp" label="GCP">

| Destination | Type           | Loader application                                                                                            | Status                             |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| BigQuery    | Streaming      | [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md)                       | Production-ready                   |
| Snowflake   | Micro-batching | [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)                        | Production-ready                   |
| Snowflake   | Streaming      | [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) | Early release                      |
| Databricks  | Micro-batching | [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)                        | Production-ready                   |
| Postgres    | Streaming      | [Postgres Loader](/docs/api-reference/loaders-storage-targets/snowplow-postgres-loader/index.md)              | Not recommended for production use |

  </TabItem>
    <TabItem value="azure" label="Azure">

| Destination       | Type                                                         | Loader application                                                                                            | Status           |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------- |
| BigQuery          | Streaming                                                    | [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md)                       | Production-ready |
| Snowflake         | Micro-batching                                               | [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)                        | Early release    |
| Snowflake         | Streaming                                                    | [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) | Early release    |
| Databricks        | Micro-batching<br/>_(via a [data lake](#data-lake-loaders))_ | [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                               | Early release    |
| Synapse Analytics | Micro-batching<br/>_(via a [data lake](#data-lake-loaders))_ | [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                               | Early release    |

  </TabItem>
</Tabs>

## Data lake loaders

All lake loaders are micro-batching.

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

| Lake | Format   | Compatibility    | Loader application                                                              | Status                                                                                                                                                                                                                                         |
| ---- | -------- | ---------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S3   | Delta    | Athena           | [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) | Early release                                                                                                                                                                                                                                  |
| S3   | Iceberg  | Athena, Redshift | [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) | Early release                                                                                                                                                                                                                                  |
| S3   | TSV/JSON | Athena           | [S3 Loader](/docs/api-reference/loaders-storage-targets/s3-loader/index.md)     | Only recommended for use with [RDB Batch Transformer](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/spark-transformer/index.md) or for [failed events](/docs/fundamentals/failed-events/index.md) |

  </TabItem>
  <TabItem value="gcp" label="GCP">

| Lake | Format | Compatibility | Loader application                                                                             | Status                                                                          |
| ---- | ------ | ------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| GCS  | Delta  | Databricks    | [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                | Early release                                                                   |
| GCS  | JSON   | BigQuery      | [GCS Loader](/docs/api-reference/loaders-storage-targets/google-cloud-storage-loader/index.md) | Only recommended for [failed events](/docs/fundamentals/failed-events/index.md) |

  </TabItem>
    <TabItem value="azure" label="Azure">

| Lake      | Format | Compatibility                         | Loader application                                                              | Status        |
| --------- | ------ | ------------------------------------- | ------------------------------------------------------------------------------- | ------------- |
| ADLS Gen2 | Delta  | Synapse Analytics, Fabric, Databricks | [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) | Early release |

  </TabItem>
</Tabs>

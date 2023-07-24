---
title: "Storage options"
sidebar_position: 1
description: "An overview of the available options for storing Snowplow data in data warehouses and lakes"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Data warehouses and data lakes are primary destinations for Snowplow data. For other options, see the [destinations overview](/docs/understanding-your-pipeline/destinations/index.md) page.

### Data warehouse loaders

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

| Destination | Type | Loader application | Status |
| --- | --- | --- |
| Redshift<br/>_(including Redshift serverless)_ | Batching (recommended)<br/>or micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Production-ready |
| Snowflake | Batching (recommended)<br/>or micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Production-ready |
| Databricks | Batching (recommended)<br/>or micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Production-ready |
| Postgres | Streaming | [Postgres Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md) | Not recommended for production use |

  </TabItem>
  <TabItem value="gcp" label="GCP">

| Destination | Type | Loader application | Status |
| --- | --- | --- |
| BigQuery | Streaming | [BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md) | Production-ready |
| Snowflake | Micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Production-ready |
| Databricks | Micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Early release |
| Postgres | Streaming | [Postgres Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md) | Not recommended for production use |

  </TabItem>
</Tabs>

:::note
Our warehouse loaders pick up the data from [Enrich Kinesis](/docs/pipeline-components-and-applications/enrichment-components/enrich-kinesis/index.md) on AWS, [Enrich Pubsub](/docs/pipeline-components-and-applications/enrichment-components/enrich-pubsub/index.md) on GCP and [Enrich Kafka](/docs/pipeline-components-and-applications/enrichment-components/enrich-kafka/index.md) on Azure. Both [Stream Collector](/docs/pipeline-components-and-applications/stream-collector/index.md) and [Enrich](/docs/pipeline-components-and-applications/enrichment-components/index.md) allow you to use a streaming technology other than Kinesis, Pub/Sub and Kafka, but if you go that route, you will need to define your own process to load your enriched data into the warehouse.
:::

### Data lake loaders

There is support for loading into cloud storage or data lakes via the [S3 Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/s3-loader/index.md) for AWS or the [Google Cloud Storage Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/google-cloud-storage-loader/index.md) for GCP.

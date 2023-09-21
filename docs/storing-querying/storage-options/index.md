---
title: "Storage options"
sidebar_position: 1
description: "An overview of the available options for storing Snowplow data in data warehouses and lakes"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AzureExperimental from "@site/docs/reusable/azure-experimental/_index.md";
```

Data warehouses and data lakes are primary destinations for Snowplow data. For other options, see the [destinations overview](/docs/understanding-your-pipeline/destinations/index.md) page.

## Data warehouse loaders

:::note Cloud

The cloud selection is for where your Snowplow pipeline runs. The warehouse itself can be deployed in any cloud.

:::

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

| Destination | Type | Loader application | Status |
| --- | --- | --- | --- |
| Redshift<br/>_(including Redshift serverless)_ | Batching (recommended)<br/>or micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Production-ready |
| Snowflake | Batching (recommended)<br/>or micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Production-ready |
| Databricks | Batching (recommended)<br/>or micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Production-ready |
| Postgres | Streaming | [Postgres Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md) | Not recommended for production use |

  </TabItem>
  <TabItem value="gcp" label="GCP">

| Destination | Type | Loader application | Status |
| --- | --- | --- | --- |
| BigQuery | Streaming | [BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md) | Production-ready |
| Snowflake | Micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Production-ready |
| Databricks | Micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Early release |
| Postgres | Streaming | [Postgres Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md) | Not recommended for production use |

  </TabItem>
    <TabItem value="azure" label="Azure 🧪">

<AzureExperimental/>

| Destination | Type | Loader application | Status |
| --- | --- | --- | --- |
| Snowflake | Micro-batching | [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | Early release |
| Databricks | Micro-batching<br/>_(via a [data lake](#data-lake-loaders))_ | [Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) | Early release |
| Synapse Analytics | Micro-batching<br/>_(via a [data lake](#data-lake-loaders))_ | [Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) | Early release |

  </TabItem>
</Tabs>

## Data lake loaders

All lake loaders are micro-batching.

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

| Lake | Format | Compatibility | Loader application | Status |
| --- | --- | --- | --- | --- |
| S3 | TSV/JSON | Amazon Athena | [S3 Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/s3-loader/index.md) | Only recommended for use with [RDB Batch Transformer](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/spark-transformer/index.md) or for [failed events](/docs/understanding-your-pipeline/failed-events/index.md) |

  </TabItem>
  <TabItem value="gcp" label="GCP">

| Lake | Format | Compatibility | Loader application | Status |
| --- | --- | --- | --- | --- |
| GCS | Delta | Databricks | [Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) | Early release |
| GCS | JSON | BigQuery | [GCS Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/google-cloud-storage-loader/index.md) | Only recommended for [failed events](/docs/understanding-your-pipeline/failed-events/index.md) |

  </TabItem>
    <TabItem value="azure" label="Azure 🧪">

<AzureExperimental/>

| Lake | Format | Compatibility | Loader application | Status |
| --- | --- | --- | --- | --- |
| ADLS Gen2 | Delta | Synapse Analytics, Fabric, Databricks | [Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) | Early release |

  </TabItem>
</Tabs>

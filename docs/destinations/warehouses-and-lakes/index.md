---
title: "Data warehouses and lakes"
sidebar_position: 2
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

To store your enriched Snowplow data, you will need to determine which loader to set-up to ensure your enriched data reaches your data warehouse or lake. 

### Selecting a loader for your data warehouse
<Tabs groupId="destination">
  <TabItem value="aws" label="AWS" default>

| Destination | Loader | Status |
| --- | --- | --- |
| Redshift | [Snowplow RDB Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md) | Production-ready |
| Snowflake | [Snowplow RDB Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md) | Production-ready |
| Databricks | [Snowplow RDB Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md) | Production-ready |
| Postgres | [Postgres Loader](/docs/destinations/warehouses-and-lakes/postgres/index.md) | Early release |

  </TabItem>
  <TabItem value="gcp" label="GCP">

| Destination | Loader | Status |
| --- | --- | --- |
| Snowflake | [Snowplow RDB Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md) | Production-ready |
| BigQuery | [BigQuery Loader](/docs/destinations/warehouses-and-lakes/bigquery/index.md) | Production-ready |
| Postgres | [Postgres Loader](/docs/destinations/warehouses-and-lakes/postgres/index.md) | Early release |

  </TabItem>
</Tabs>

:::note
Our warehouse loaders pick up the data from [Enrich Kinesis](/docs/pipeline-components-and-applications/enrichment-components/enrich-kinesis/index.md) on AWS and [Enrich Pubsub](/docs/pipeline-components-and-applications/enrichment-components/enrich-pubsub/index.md) on GCP. Both [Stream Collector](/docs/pipeline-components-and-applications/stream-collector/index.md) and [Enrich](/docs/pipeline-components-and-applications/enrichment-components/index.md) allow you to use a streaming technology other than Kinesis and Pub/Sub, but if you go that route, you will need to define your own process to load your enriched data into the warehouse.
:::

### Selecting a loader for your data lake 

There is support for loading into cloud storage or data lakes via the [S3 Loader](/docs/destinations/warehouses-and-lakes/s3/index.md) for AWS or the [Google Cloud Storage Loader](/docs/destinations/warehouses-and-lakes/google-cloud-storage/index.md) for GCP.

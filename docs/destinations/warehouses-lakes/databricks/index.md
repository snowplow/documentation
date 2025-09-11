---
title: "Databricks"
sidebar_position: 20
description: "Send Snowplow data to Databricks for analytics and data processing"
---

```mdx-code-block
import SetupInstructions from '../_setup-instructions.mdx';
import HowLoadingWorks from '../_how-loading-works.mdx';
import SingleTableFormat from '../_single-table-format.mdx';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info Cloud availability

The Databricks integration is available for Snowplow pipelines running on **AWS**, **Azure** and **GCP**.

:::

Databricks is a unified analytics platform that combines data engineering, data science, and machine learning. The Snowplow Databricks integration allows you to load enriched event data directly into your Databricks environment for analytics and downstream processing.

Depending on the cloud provider for your Snowplow pipeline, there are different options for this integration:

| Integration | AWS | Azure | GCP |
| ----------- |:---:|:-----:|:---:|
| Direct, batch-based ([RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)) | :white_check_mark: | :x: | :x: |
| Via Delta Lake ([Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)) | :x:* | :white_check_mark: | :white_check_mark: |
| _Early release:_ Streaming / Lakeflow ([Streaming Loader](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md)) | :white_check_mark: | :white_check_mark: | :white_check_mark: |

_*Delta+Databricks combination is currently not supported for AWS pipelines. The loader uses DynamoDB tables for mutually exclusive writes to S3, a feature of Delta. Databricks, however, does not support this (as of September 2025). This means that it’s not possible to alter the data via Databricks (e.g. to run `OPTIMIZE` or to delete PII)._

## What you will need

Connecting to a destination always involves configuring cloud resources and granting permissions. It's a good idea to make sure you have sufficient priviliges before you begin the setup process.

:::tip

The list below is just a heads up. The Snowplow Console will guide you through the exact steps to set up the integration.

:::

Keep in mind that you will need a few things.

<Tabs groupId="databricks-integration" queryString lazy>
<TabItem value="rdb-loader" label="Batch-based (AWS)" default>

* Provide a Databricks cluster along with its URL
* Specify the catalog name (if using Unity catalog) and schema name
* Create an access token with the following permissions:
  * `USE CATALOG` on the catalog
  * `USE SCHEMA` and `CREATE TABLE` on the schema
  * `CAN USE` on the SQL warehouse

</TabItem>
<TabItem value="lake-loader" label="Via Delta Lake (Azure, GCP)" default>

See [Delta Lake](../delta/index.md).

</TabItem>
<TabItem value="streaming-loader" label="Streaming" default>

* Create an S3 or GCS bucket or ADLS storage container, located in the same cloud and region as your Databricks instance
* Create a storage credential to allow Databricks to access the bucket or container
* Create an external location and a volume within Databricks pointing to the above
* Provide a Databricks SQL warehouse URL, Unity catalog name and schema name
* Create a service principal and grant the following permissions:
  * `USE CATALOG` on the catalog
  * `USE SCHEMA` and `CREATE TABLE` on the schema
  * `READ VOLUME` and `WRITE VOLUME` on the volume
  * `CAN USE` on the SQL warehouse (for testing the connection and monitoring, e.g. as part of the [Data Quality Dashboard](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md#data-quality-dashboard))

Note that Lakeflow features require a Premium Databricks account. You might also need Databricks metastore admin privileges for some of the steps.

</TabItem>
</Tabs>

## Getting started

You can add a Databricks destination through the Snowplow Console.

<Tabs groupId="databricks-integration" queryString lazy>
<TabItem value="rdb-loader" label="Batch-based (AWS)" default>

(For self-hosted customers, please refer to the [Loader API reference](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) instead.)

<SetupInstructions destinationName="Databricks" connectionType="Databricks" />

</TabItem>
<TabItem value="lake-loader" label="Via Delta Lake (Azure, GCP)" default>

Follow the instructions for [Delta Lake](../delta/index.md#getting-started).

Then create an external table in Databricks pointing to the Delta Lake location.

</TabItem>
<TabItem value="streaming-loader" label="Streaming" default>

(For self-hosted customers, please refer to the [Loader API reference](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md) instead.)

<SetupInstructions destinationName="Databricks" connectionType="Databricks Streaming" />

</TabItem>
</Tabs>

## How loading works

<HowLoadingWorks/>

<Tabs groupId="databricks-integration" queryString lazy>
<TabItem value="rdb-loader" label="Batch-based (AWS)" default>

For more details on the loading flow, see the [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) reference page, where you will find additional information and diagrams.

</TabItem>
<TabItem value="lake-loader" label="Via Delta Lake (Azure, GCP)" default>

For more details on the loading flow, see the [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) reference page, where you will find additional information and diagrams.

</TabItem>
<TabItem value="streaming-loader" label="Streaming" default>

For more details on the loading flow, see the [Databricks Streaming Loader](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md) reference page, where you will find additional information and diagrams.

</TabItem>
</Tabs>


## Snowplow data format in Databricks

<SingleTableFormat eventType={<code>STRUCT</code>} entitiesType={<><code>ARRAY</code> of <code>STRUCT</code></>}/>

:::tip

Check this [guide on querying](/docs/destinations/warehouses-lakes/querying-data/index.md?warehouse=databricks) Snowplow data.

:::

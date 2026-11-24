---
title: "Load Snowplow data to BigQuery"
sidebar_label: "BigQuery"
sidebar_position: 30
description: "Send Snowplow data to BigQuery for analytics and data warehousing with automatic table creation, schema evolution, and cross-batch deduplication."
keywords: ["BigQuery", "Google Cloud", "data warehouse", "streaming loader", "batch loader", "BigLake", "Iceberg"]
content_type: integration
---

```mdx-code-block
import SetupInstructions from '../_setup-instructions.mdx';
import HowLoadingWorks from '../_how-loading-works.mdx';
import SingleTableFormat from '../_single-table-format.mdx';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

<IntegrationBadges id="bigquery" />

:::info[Cloud availability]

The BigQuery integration is available for Snowplow pipelines running on **AWS** and **GCP**.

:::

The Snowplow BigQuery integration allows you to load enriched event data (as well as [failed events](/docs/fundamentals/failed-events/index.md)) into BigQuery for analytics, data modeling, and more.

Depending on the cloud provider for your Snowplow pipeline, there are different options for this integration:

| Integration                                                                                                          |        AWS         |         GCP         | Failed events support |
| -------------------------------------------------------------------------------------------------------------------- | :----------------: | :-----------------: | :-------------------: |
| Direct, streaming ([BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md))          | :white_check_mark: | :white_check_mark:  |  :white_check_mark:   |
| Via Iceberg and BigLake metastore ([Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)) |        :x:¹        | :white_check_mark:  |  :white_check_mark:   |

_¹ Iceberg+BigLake combination is currently supported for GCP pipelines only._

## What you will need

Connecting to a destination always involves configuring cloud resources and granting permissions. It's a good idea to make sure you have sufficient priviliges before you begin the setup process.

:::tip

The list below is just a heads up. The Snowplow Console will guide you through the exact steps to set up the integration.

:::

Keep in mind that you will need to be able to do a few things.

<Tabs groupId="bigquery-integration" queryString>
<TabItem value="bigquery-loader" label="Direct (AWS, GCP)" default>

* Provide your Google Cloud Project ID and region
* Allow-list Snowplow IP addresses
* Specify the desired dataset name
* Create a service account with the `roles/bigquery.dataEditor` permission (more permissions will be required for loading failed events and setting up [Data Quality Dashboard](/docs/monitoring/index.md#data-quality-dashboard))

</TabItem>
<TabItem value="lake-loader-iceberg" label="Via Iceberg (GCP)">

See [Iceberg](../iceberg/index.md?catalog=rest-biglake).

</TabItem>
</Tabs>

## Getting started

<Tabs groupId="bigquery-integration" queryString>
<TabItem value="bigquery-loader" label="Direct (AWS, GCP)" default>

You can add a BigQuery destination through the Snowplow Console. (For self-hosted customers, please refer to the [Loader API reference](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md) instead.)

<SetupInstructions destinationName="BigQuery" connectionType="BigQuery" />

</TabItem>
<TabItem value="lake-loader-iceberg" label="Via Iceberg (GCP)">

Follow the instructions for [Iceberg](../iceberg/index.md#getting-started), using BigLake metastore as the REST catalog.

</TabItem>
</Tabs>

## How loading works

<HowLoadingWorks/>

<Tabs groupId="bigquery-integration" queryString>
<TabItem value="bigquery-loader" label="Direct (AWS, GCP)" default>

For more details on the loading flow, see the [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md) reference page, where you will find additional information and diagrams.

</TabItem>
<TabItem value="lake-loader-iceberg" label="Via Iceberg (GCP)">

For more details on the loading flow, see the [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) reference page, where you will find additional information and diagrams.

</TabItem>
</Tabs>

## Snowplow data format in BigQuery

<SingleTableFormat eventType={<code>RECORD</code>} entitiesType={<code>REPEATED RECORD</code>}/>

:::tip

Check this [guide on querying](/docs/destinations/warehouses-lakes/querying-data/index.md?warehouse=bigquery) Snowplow data.

:::

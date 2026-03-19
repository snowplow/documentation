---
title: "Load Snowplow data to BigQuery"
sidebar_label: "BigQuery"
sidebar_position: 30
description: "Send Snowplow data to BigQuery for analytics and data warehousing with automatic table creation, schema evolution, and cross-batch deduplication."
keywords: ["BigQuery", "Google Cloud", "data warehouse", "streaming loader", "batch loader"]
---

```mdx-code-block
import SetupInstructions from '../_setup-instructions.mdx';
import HowLoadingWorks from '../_how-loading-works.mdx';
import SingleTableFormat from '../_single-table-format.mdx';
```

:::info Cloud availability

The BigQuery integration is available for Snowplow pipelines running on **AWS** and **GCP**.

:::

The Snowplow BigQuery integration allows you to load enriched event data (as well as [failed events](/docs/fundamentals/failed-events/index.md)) directly into your BigQuery datasets for analytics, data modeling, and more.

## What you will need

Connecting to a destination always involves configuring cloud resources and granting permissions. It's a good idea to make sure you have sufficient priviliges before you begin the setup process.

:::tip

The list below is just a heads up. The Snowplow Console will guide you through the exact steps to set up the integration.

:::

Keep in mind that you will need to be able to:

* Provide your Google Cloud Project ID and region
* Allow-list Snowplow IP addresses
* Specify the desired dataset name
* Create a service account with the `roles/bigquery.dataEditor` permission (more permissions will be required for loading failed events and setting up [Data Quality Dashboard](/docs/monitoring/index.md#data-quality-dashboard))

## Getting started

You can add a BigQuery destination through the Snowplow Console. (For self-hosted customers, please refer to the [Loader API reference](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md) instead.)

<SetupInstructions destinationName="BigQuery" connectionType="BigQuery" />

## How loading works

<HowLoadingWorks/>

:::tip

For more details on the loading flow, see the [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md) reference page, where you will find additional information and diagrams.

:::

## Snowplow data format in BigQuery

<SingleTableFormat eventType={<code>RECORD</code>} entitiesType={<code>REPEATED RECORD</code>}/>

:::tip

Check this [guide on querying](/docs/destinations/warehouses-lakes/querying-data/index.md?warehouse=bigquery) Snowplow data.

:::

---
title: "Load Snowplow data to Apache Iceberg"
sidebar_label: "Iceberg"
sidebar_position: 60
description: "Send Snowplow data to Apache Iceberg data lakes for analytics and data processing with open table format, schema evolution, and cross-engine compatibility."
keywords: ["Iceberg", "Apache Iceberg", "data lake", "open table format", "lake loader"]
---

```mdx-code-block
import SetupInstructions from '../_setup-instructions.mdx';
import HowLoadingWorks from '../_how-loading-works.mdx';
import SingleTableFormat from '../_single-table-format.mdx';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info Cloud availability

The Iceberg integration is available for Snowplow pipelines running on **AWS** and **GCP** only.

:::

Apache Iceberg is an open table format for data lake architectures. The Snowplow Iceberg integration allows you to load enriched event data (as well as [failed events](/docs/fundamentals/failed-events/index.md)) into Iceberg tables in your data lake for analytics, data modeling, and more.

Iceberg data can be consumed using various tools and products, for example:
* Amazon Athena
* Amazon Redshift Spectrum
* Apache Spark or Amazon EMR
* Snowflake
* ClickHouse

We currently support the following catalogs:
| Catalog | AWS | GCP |
| ------- | --- | --- |
| Glue | :white_check_mark: | :x: |
| REST¹ | :white_check_mark: | :white_check_mark: |

_¹The REST catalog has only been tested with the Snowflake Open Catalog implementation._

## What you will need

Connecting to a destination always involves configuring cloud resources and granting permissions. It's a good idea to make sure you have sufficient priviliges before you begin the setup process.

:::tip

The list below is just a heads up. The Snowplow Console will guide you through the exact steps to set up the integration.

:::

Keep in mind that you will need to be able to:

<Tabs groupId="catalog" queryString lazy>
  <TabItem value="rest" label="REST" default>
    * Specify your Snowflake Open Catalog account id and region, as well as namespace
    * Create a service connection to the catalog and provide the client id and client secret
  </TabItem>
  <TabItem value="glue" label="AWS Glue">
    * Specify your AWS account ID
    * Provide an S3 bucket and an AWS Glue database
    * Create an IAM role with the following permissions:
      * For the S3 bucket:
        * `s3:ListBucket`
        * `s3:GetObject`
        * `s3:PutObject`
        * `s3:DeleteObject`
      * For the Glue database:
        * `glue:CreateTable`
        * `glue:GetTable`
        * `glue:UpdateTable`
    * Schedule a regular job to optimize the lake
  </TabItem>
</Tabs>

## Getting started

You can add an Iceberg destination through the Snowplow Console. (For self-hosted customers, please refer to the [Loader API reference](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) instead.)

<SetupInstructions destinationName="Iceberg" connectionType="Iceberg" />

For AWS Glue, we recommend scheduling regular [lake maintenance jobs](/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/index.md?lake-format=iceberg) to ensure the best long-term performance.

## How loading works

<HowLoadingWorks/>

For more details on the loading flow, see the [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) reference page, where you will find additional information and diagrams.

## Snowplow data format in Iceberg

<SingleTableFormat eventType={<code>STRUCT</code>} entitiesType={<><code>ARRAY</code> of <code>STRUCT</code></>}/>

:::tip

Check this [guide on querying](/docs/destinations/warehouses-lakes/querying-data/index.md?warehouse=databricks) Snowplow data. (You will need a query engine such as Spark SQL or Snowflake to query Iceberg tables.)

:::

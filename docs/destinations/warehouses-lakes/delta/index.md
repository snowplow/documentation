---
title: "Delta Lake"
sidebar_position: 70
description: "Send Snowplow data to Delta Lake for analytics and data processing"
---

```mdx-code-block
import SetupInstructions from '../_setup-instructions.mdx';
import HowLoadingWorks from '../_how-loading-works.mdx';
import SingleTableFormat from '../_single-table-format.mdx';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::info Cloud availability

The Delta Lake integration is available for Snowplow pipelines running on **AWS**, **Azure** and **GCP**.

:::

Delta Lake is an open-source storage framework that enables building a Lakehouse architecture. The Snowplow Delta integration allows you to load enriched event data (as well as [failed events](/docs/fundamentals/failed-events/index.md)) into Delta tables in your data lake for analytics, machine learning, and downstream processing.

Data in Delta Lake can be consumed using various tools and products, for example:

* Amazon Athena
* Databricks*
* Microsoft Synapse Analytics
* Microsoft Fabric

_*Delta+Databricks combination is currently not supported for AWS pipelines. The loader uses DynamoDB tables for mutually exclusive writes to S3, a feature of Delta. Databricks, however, does not support this (as of September 2025). This means that it’s not possible to alter the data via Databricks (e.g. to run `OPTIMIZE` or to delete PII)._

## Prerequisites

To set up a Delta Lake destination, keep in mind that you will need to:

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="aws" label="AWS" default>

* Provide an S3 bucket
* Create a DynamoDB table (required for file locking)
* Create an IAM role with the following permissions:
  * For the S3 bucket:
    * `s3:ListBucket`
    * `s3:GetObject`
    * `s3:PutObject`
    * `s3:DeleteObject`
    * `s3:ListBucketMultipartUploads`
    * `s3:AbortMultipartUpload`
  * For the DynamoDB table:
    * `dynamodb:DescribeTable`
    * `dynamodb:Query`
    * `dynamodb:Scan`
    * `dynamodb:GetItem`
    * `dynamodb:PutItem`
    * `dynamodb:UpdateItem`
    * `dynamodb:DeleteItem`


  </TabItem>
  <TabItem value="gcp" label="GCP">

* Provide a GCS bucket
* Create a service account with the `roles/storage.objectUser` role on the bucket
* Create and provide a service account key


  </TabItem>
  <TabItem value="azure" label="Azure">

* Provide an ADLS storage container
* Create a new App Registration with the `Storage Blob Data Contributor` permission
* Provide the registration tenant ID, client ID and client secret


  </TabItem>
</Tabs>

:::tip

Before going through the instructions below, make sure you have sufficient access to create these resources and to provide the details.

:::

## Getting started

You can add a Delta Lake destination through the Snowplow Console. (For self-hosted customers, please refer to the [Loader API reference](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) instead.)

<SetupInstructions destinationName="Delta" connectionType="Delta" />

## How loading works

<HowLoadingWorks/>

For more details on the loading flow, see the [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) reference page, where you will find additional information and diagrams.

## Snowplow data format in Delta Lake

<SingleTableFormat eventType={<code>STRUCT</code>} entitiesType={<><code>ARRAY</code> of <code>STRUCT</code></>}/>

:::tip

Check this [guide on querying](/docs/destinations/warehouses-lakes/querying-data/index.md?warehouse=databricks) Snowplow data. (You will need a query engine such as Spark SQL or Databricks to query Delta tables.)

:::

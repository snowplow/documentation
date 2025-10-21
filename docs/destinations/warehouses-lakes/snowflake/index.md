---
title: "Snowflake"
sidebar_position: 10
description: "Send Snowplow data to Snowflake for analytics and data warehousing"
---

```mdx-code-block
import SetupInstructions from '../_setup-instructions.mdx';
import HowLoadingWorks from '../_how-loading-works.mdx';
import SingleTableFormat from '../_single-table-format.mdx';
```

:::info Cloud availability

The Snowflake integration is available for Snowplow pipelines running on **AWS**, **Azure** and **GCP**.

:::

The Snowplow Snowflake integration allows you to load enriched event data (as well as [failed events](/docs/fundamentals/failed-events/index.md)) directly into your Snowflake warehouse for analytics, data modeling, and more.

## What you will need

Connecting to a destination always involves configuring cloud resources and granting permissions. It's a good idea to make sure you have sufficient priviliges before you begin the setup process.

:::tip

The list below is just a heads up. The Snowplow Console will guide you through the exact steps to set up the integration.

:::

Keep in mind that you will need to be able to:

* Provide your Snowflake account locator URL, cloud provider and region
* Allow-list Snowplow IP addresses
* Generate a key pair for key-based authentication
* Specify the desired database and schema names, as well as a warehouse name
* Create a role with the following permissions:
  * `USAGE`, `OPERATE` on warehouse (for testing the connection and monitoring, e.g. as part of the [Data Quality Dashboard](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md#data-quality-dashboard))
  * `USAGE` on database
  * `ALL` privileges on the target schema

## Getting started

You can add a Snowflake destination through the Snowplow Console. (For self-hosted customers, please refer to the [Loader API reference](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) instead.)

<SetupInstructions destinationName="Snowflake" connectionType="Snowflake" />

## How loading works

<HowLoadingWorks/>

For more details on the loading flow, see the [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) reference page, where you will find additional information and diagrams.

## Snowplow data format in Snowflake

<SingleTableFormat eventType={<>a <code>VARIANT</code> object</>} entitiesType={<>a <code>VARIANT</code> array</>}/>

:::tip

Check this [guide on querying](/docs/destinations/warehouses-lakes/querying-data/index.md?warehouse=snowflake) Snowplow data.

:::

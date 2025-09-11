---
title: "Destinations"
sidebar_position: 6
description: "Overview of Snowplow destination options for streaming behavioral data to warehouses, lakes, and real-time applications."
schema: "TechArticle"
keywords: ["Data Destinations", "Event Storage", "Warehouse Loading", "Data Export", "Pipeline Output", "Analytics Storage"]
---

![](images/usecasearch.png)

We can summarize our philosophy with regards to data destinations like so:

- Businesses can get the most value out of their data when they build a deep understanding of their customers **in one place**, such as your Data Warehouse (this allows you to avoid silos and build the deepest possible understanding by combining datasets).
- Businesses should hold their customers’ privacy close to their hearts. It is something that is hard won and easily lost, so only the data that needs to be shared with third parties, should be.

Here you will find an overview of what’s available.

## Data warehouses and lakes

Snowplow is primarily built for data warehouse and lake destinations and supports Redshift, BigQuery, Snowflake, Databricks and Synapse Analytics, as well as S3, GCS and ADLS / OneLake, via the [various loaders](/docs/destinations/warehouses-lakes/index.md).

## Additional destinations

Snowplow supports sending your data to additional destinations through a variety of different options and tools.

### [No Processing Required (Event Forwarding)](/docs/destinations/forwarding-events/index.md)

This is the route to take if you want to forward individual events to downstream destinations, ideal for use cases where platforms can make use of event data, such as "evented" marketing platforms.

Snowplow recommends using **Google Tag Manager Server Side** to forward events to other platforms. This can be used in [two configurations](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md), either before or after the Snowplow pipeline, using the official Snowplow Client and Tags.

### [Processing Required (Reverse ETL)](/docs/destinations/reverse-etl/index.md)

This option should be used to forwarding segments or other aggregated data to downstream destinations. Snowplow partners with one vendor to offer this capability, [Census](https://www.getcensus.com/), however there are a variety of other vendors which offer alternative solutions in the [Modern Data Stack](https://snowplowanalytics.com/blog/2021/05/12/modern-data-stack/).

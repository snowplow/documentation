---
title: "Supporting additional destinations"
date: "2021-11-23"
sidebar_position: 100
---

Snowplow supports sending your data to additional destinations through a variety of different options and tools.

There are two core principles of Snowplow to keep in mind when considering whether to send data to additional destinations:

- Businesses can get the most value out of their data when they build a deep understanding of their customers in one place, such as your Data Warehouse (this allows you to avoid silos and build the deepest possible understanding by combining datasets).
- Businesses should hold their customers’ privacy close to their hearts, it is something that is hard won and easily lost, so only the data that needs to be shared with third parties, should be.

## Types of Use Case

### [No Processing Required (Event Forwarding)](/docs/migrated/forwarding-events-to-destinations/forwarding-events/)

This is the route to take if you want to forwarding individual events to downstream destinations, ideal for use cases where platforms can make use of event data, such as "evented" marketing platforms.

Snowplow recommends using **Google Tag Manager Server Side** to forward events to other platforms. This can be used in two configurations, either before or after the Snowplow pipeline, using the official Snowplow Client and Tags.

### [Processing Required (Reverse ETL)](/docs/migrated/forwarding-events-to-destinations/reverse-etl/)

This option should be used to forwarding segments or other aggregated data to downstream destinations. Often referred to as Reverse ETL. Snowplow partners with two vendors to offer this capability, [Census](https://www.getcensus.com/) and [Hightouch](https://hightouch.io/), however there are a variety of other vendors which offer alternative solutions in the [Modern Data Stack](https://snowplowanalytics.com/blog/2021/05/12/modern-data-stack/).

![](images/usecasearch.png)

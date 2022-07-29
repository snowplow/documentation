---
title: "What is data modeling?"
date: "2020-10-30"
sidebar_position: 0
---

At Snowplow, we define data modeling as the process of using business logic to aggregate or otherwise transform event level data. It is the last step in the Snowplow pipeline, and occurs in the data warehouse.

The Snowplow atomic data acts as an immutable log of all the actions that occurred across your digital products. The data model takes that data and transforms it into a set of derived tables optimized for analysis.

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/11/image.png?w=1024)

It is at the data modeling stage that you add your business logic to your Snowplow data; for example, how you define your marketing channels, what counts as a conversion, or how you segment your customers. As this logic is separate from the data you collect, you are able to update the logic and rerun it over your entire set of raw, immutable data to produce new derived data if you change your mind at a later stage. Not only can you add business logic to the data during modeling, you can also aggregate the same data into different tables based on the use cases the different teams in your organisation have. Therefore, data modeling is a crucial step towards deriving insights from your data.

To learn more about Snowplow's approach to data modeling, check out our [4-part data modeling mini series](https://snowplowanalytics.com/events/data-modeling-mini-series/).

---
title: "Snowplow Micro"
sidebar_position: 2
description: "Lightweight testing tool for validating behavioral event tracking and schema compliance during development."
schema: "TechArticle"
keywords: ["Snowplow Micro", "Local Testing", "Development Tool", "Testing Environment", "Micro Pipeline", "Testing Framework"]
---


[Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro) is a lightweight version of the Snowplow pipeline. It’s great for:
* Getting familiar with Snowplow
* Debugging and testing, including [automated testing](/docs/data-product-studio/data-quality/snowplow-micro/automated-testing/index.md)

![Snowplow Micro UI](./images/overview.png)

Just like a real Snowplow pipeline, Micro receives, validates and enriches events sent by your [tracking code](/docs/sources/trackers/index.md).

Unlike a real pipeline, Micro is missing a few features:
* It does not store the events in a data warehouse or database, although a [UI](/docs/data-product-studio/data-quality/snowplow-micro/ui/index.md) and an [API](/docs/api-reference/snowplow-micro/api/index.md) are available to look at the data
* It’s not meant for production traffic

Follow [these instructions](/docs/data-product-studio/data-quality/snowplow-micro/basic-usage/index.md) to get started in minutes.

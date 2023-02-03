---
title: "What is Snowplow Micro?"
sidebar_position: 0
description: "Snowplow Micro is a lightweight version of the Snowplow pipeline that’s great for getting familiar with Snowplow, debugging and testing."
hide_table_of_contents: true
---

[Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro) is a lightweight version of the Snowplow pipeline. It’s great for:
* Getting familiar with Snowplow
* Debugging and testing, including [automated testing](/docs/managing-data-quality/testing-and-qa-workflows/set-up-automated-testing-with-snowplow-micro/index.md)

Just like a real Snowplow pipeline, Micro receives and validates events sent by your [tracking code](/docs/collecting-data/collecting-from-own-applications/index.md).

Unlike a real pipeline, Micro is missing a few features:
* It does not run [enrichments](/docs/enriching-your-data/index.md) (yet).
* It does not store the events in a data warehouse or database (yet), although [an API is available](/docs/pipeline-components-and-applications/snowplow-micro/api/index.md) to look at the data.
* It’s not meant for production traffic.

Follow [these instructions](/docs/getting-started-with-micro/basic-usage/index.md) to get started in minutes.

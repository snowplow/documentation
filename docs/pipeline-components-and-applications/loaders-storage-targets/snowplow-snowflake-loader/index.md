---
title: "Snowflake Loader"
date: "2020-04-25"
sidebar_position: 200
---

:::caution

Snowplow Snowflake Loader is a _deprecated_ application for loading Snowplow events into Snowflake. 

It has been replaced by [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md). Please see this [blog post](https://snowplow.io/blog/snowplows-rdb-loader-or-snowflakes-snowpipe/) for further information, and use [Snowplow RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) to load your events into Snowflake instead.

:::


The Snowflake Loader consists of two independent applications:

- Snowplow Snowflake Transformer - Spark job responsible for transformning enriched events into Snowflake-compatible format
- Snowplow Snowflake Loader - CLI application responsible for loading Snowplow-compatible enriched events into Snowflake DB

Both applications communicate through DynamoDB table, called "processing manifest" and used to maintain pipeline state. Both applications use same self-describing JSON configuration file of [schema](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-3) `com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-3`, which contain both transformer- and loader-specific properties.

The Snowflake loader is publicly available since version 0.3.1.

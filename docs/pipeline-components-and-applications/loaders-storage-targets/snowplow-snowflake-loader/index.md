---
title: "Snowflake Loader"
date: "2020-04-25"
sidebar_position: 200
---

The Snowflake Loader consists of two independent applications:

- Snowplow Snowflake Transformer - Spark job responsible for transformning enriched events into Snowflake-compatible format
- Snowplow Snowflake Loader - CLI application responsible for loading Snowplow-compatible enriched events into Snowflake DB

Both applications communicate through DynamoDB table, called "processing manifest" and used to maintain pipeline state. Both applications use same self-describing JSON configuration file of [schema](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-3) `com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-3`, which contain both transformer- and loader-specific properties.

The Snowflake loader is publicly available since version 0.3.1.

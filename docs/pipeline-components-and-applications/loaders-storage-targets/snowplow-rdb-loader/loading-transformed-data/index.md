---
title: "Loading transformed data"
date: "2022-04-05"
sidebar_position: 20
---

_For a high-level overview of the RDB Loader architecture, of which the loader is a part, see [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md)._

The loader applications are specialised to a specific storage target. Each one performs 3 key tasks:

- Consume messages from SQS / SNS / Pubsub to discover information about transformed data: where it is stored and what it looks like.
- Use the information from the message to determine if any changes to the target table(s) are required, eg to add a column for a new event field. If required, submit the appropriate SQL statement for execution by the storage target.
- Prepare and submit for execution the appropriate SQL `COPY` statement.

For loading into **Redshift**, use the [Redshift loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/redshift-loader/index.md). This loads [shredded data](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#shredded-data) into multiple Redshift tables.

For loading into **Snowflake**, use the [Snowflake loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/snowflake-loader/index.md). This loads [wide row JSON format data](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#wide-row-format) into a single Snowflake table. 

For loading into **Databricks**, use the [Databricks loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/databricks-loader/index.md). This loads [wide row Parquet format data](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#wide-row-format) into a single Databricks table.

:::note

AWS is fully supported for both Snowflake and Databricks. GCP is supported for Snowflake (since 5.0.0).

:::

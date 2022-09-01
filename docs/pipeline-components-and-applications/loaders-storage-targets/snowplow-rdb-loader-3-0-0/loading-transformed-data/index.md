---
title: "Loading transformed data"
date: "2022-04-05"
sidebar_position: 20
---

_For a high-level overview of the RDB Loader architecture, of which the loader is a part, see [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/index.md)._

The loader applications are specialised to a specific storage target. Each one performs 3 key tasks:

- Consume messages from SQS / SNS to discover information about transformed data: where it is stored and what it looks like.
- Use the information from the message to determine if any changes to the target table(s) are required, eg to add a column for a new event field. If required, submit the appropriate SQL statement for execution by the storage target.
- Prepare and submit for execution the appropriate SQL `COPY` statement.

For loading into **Redshift**, use the [Redshift loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/loading-transformed-data/redshift-loader/index.md). This loads [shredded data](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/transforming-enriched-data/index.md#shredded-data) into multiple Redshift tables.

For loading into **Snowflake**, use the [Snowflake loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/loading-transformed-data/snowflake-loader/index.md). This loads [wide row JSON format data](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/transforming-enriched-data/index.md#wide-row-format) into a single Snowflake table. (This is not to be confused with [Snowplow Snowflake Loader](https://github.com/snowplow-incubator/snowplow-snowflake-loader), which is a completely separate application, not part of the RDB Loader architecture. In the long run, `snowplow-snowflake-loader` will be phased out in favour of RDB Loader.)

For loading into **Databricks**, use the [Databricks loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/loading-transformed-data/databricks-loader/index.md). This loads [wide row Parquet format data](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/transforming-enriched-data/index.md#wide-row-format) into a single Databricks table.

:::tip Streaming Loader or RDB Loader?

Both [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) and [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) can load data into Snowflake.

Snowflake Streaming Loader is newer and has two advantages:
* Much lower latency — you can get data in Snowflake in seconds, as opposed to minutes with RDB Loader
* Much lower cost — unlike with RDB Loader, there is no need for EMR and extensive Snowflake compute to load batch files

We recommend the Streaming Loader over the RDB Loader. If you already use RDB Loader, see the [migration guide](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/migrating.md) for more information.

:::

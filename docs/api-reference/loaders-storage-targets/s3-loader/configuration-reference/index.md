---
title: "S3 loader configuration reference"
date: "2021-10-04"
sidebar_position: 50
---

## License

S3 Loader is released under the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.1/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

To accept the terms of license and run S3 Loader, configure the `license.accept` option, like this:

```hcl
license {
  accept = true
}
```

This is a complete list of the options that can be configured in the S3 loader HOCON config file. The [example configs in github](https://github.com/snowplow/snowplow-s3-loader/tree/master/config) show how to prepare an input file.


| parameter | description |
|-----------|-------------|
| `purpose`                       | Required. Use RAW to sink data exactly as-is. Use `ENRICHED_EVENTS` to also enable event latency metrics. Use `SELF_DESCRIBING` to enable partitioning self-describing data by its schema |
| `input.appName`                 | Required. Kinesis Client Lib app name (corresponds to DynamoDB table name) |
| `input.streamName`              | Required. Name of the kinesis stream from which to read |
| `input.position`                | Required. Use `TRIM_HORIZON` to start streaming at the last untrimmed record in the shard, which is the oldest data record in the shard. Or use `LATEST` to start streaming just after the most recent record in the shard |
| `input.customEndpoint`          | Optional. Override the default endpoint for kinesis client api calls |
| `input.maxRecords`              | Required. How many records the client should pull from kinesis each time |
| `output.s3.path`                | Required. Full path to output data, e.g. s3://acme-snowplow-output/raw/ |
| `output.s3.partitionFormat`     | Optional. Added in version 2.1.0. Configures how files are partitioned into S3 directories.When loading raw files, you might choose to partition by `date={yy}-{mm}-{dd}`. When loading self describing jsons, you might choose to partition by `{vendor}.{name}/model={model}/date={yy}-{mm}-{dd}`. Valid substitutions are `{vendor}`, `{name}`, `{format}`, `{model}` for self-describing jsons; and `{yy}`, `{mm}`, `{dd}`, `{hh}` for year, month, day and hour. Defaults to `{vendor}.{schema}` when loading self-describing JSONs, or blank (no partitioning) when loading raw or enriched events |
| `output.s3.filenamePrefix`      | Optional. Adds a prefix to output |
| `output.s3.compression`         | Required. Either LZO or GZIP |
| `output.s3.maxTimeout`          | Required. Maximum Timeout that the application is allowed to fail for, e.g. in case of S3 outage |
| `output.s3.customEndpoint`      | Optional. Override the default endpoint for s3 client api calls |
| `region`                        | Optional. When used with the `output.s3.customEndpoint` option, this sets the region of the bucket. Also sets the region of the dynamoDB table. Defaults to the current region |
| `output.bad.streamName`         | Required. Name of a kinesis stream to output failures |
| `buffer.byteLimit`              | Required. Maximum bytes to read from kinesis before flushing a file to S3 |
| `buffer.recordLimit`            | Required. Maximum records to read from kinesis before flushing a file to S3 |
| `buffer.timeLimit`              | Required. Maximum time to wait in milliseconds between writing files to S3 |
| `monitoring.snowplow.collector` | Optional. E.g. `https://snplow.acme.com`. URI of a snowplow collector. Used for monitoring application lifecycle and failure events |
| `monitoring.snowplow.appId`     | Required only if the collector uri is also configured. Sets the appId field of the snowplow events |
| `monitoring.sentry.dsn`         | Optional, for tracking uncaught run time exceptions |
| `monitoring.metrics.cloudwatch` | Optional boolean, with default true. This is used to disable sending metrics to cloudwatch |
| `monitoring.metrics.hostname`   | Optional, for sending loading metrics (latency and event counts) to a `statsd` server |
| `monitoring.metrics.port`       | Optional, port of the statsd server |
| `monitoring.metrics.tags`       | E.g.`{ "key1": "value1", "key2": "value2" }`. Tags are used to annotate the statsd metric with any contextual information |
| `monitoring.metrics.prefix`     | Optional, default `snoplow.s3loader`. Configures the prefix of statsd metric names |

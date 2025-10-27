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
| `input.streamName`                                                | Required. Name of the kinesis stream from which to read |
| `input.appName`                                                   | Optional. Default: `snowplow-s3-loader`. Kinesis Client Lib app name (corresponds to DynamoDB table name) |
| `input.initialPosition.type` (since 3.0.0)                        | Optional. Default: `TRIM_HORIZON`. Set the initial position to consume the Kinesis stream. Possible values: `LATEST` (most recent data), `TRIM_HORIZON` (oldest available data), `AT_TIMESTAMP` (start from the record at or after the specified timestamp) |
| `input.initialPosition.timestamp` (since 3.0.0)                   | Required for `AT_TIMESTAMP`. E.g. `2020-07-17T10:00:00Z` |
| `input.retrievalMode.type` (since 3.0.0)                          | Optional. Default: `Polling`. Set the mode for retrieving records. Possible values: `Polling` or `FanOut` |
| `input.retrievalMode.maxRecords` (since 3.0.0)                    | Required for `Polling`. Default: `1000`. Maximum size of a batch returned by a call to `getRecords`. Records are checkpointed after a batch has been fully processed, thus the smaller `maxRecords`, the more often records can be checkpointed into DynamoDb, but possibly reducing the throughput |
| `input.workerIdentifier` (since 3.0.0)                            | Optional. Default: host name. Name of this KCL worker used in the DynamoDB lease table |
| `input.leaseDuration` (since 3.0.0)                               | Optional. Default: `10 seconds`. Duration of shard leases. KCL workers must periodically refresh leases in the DynamoDB table before this duration expires |
| `input.maxLeasesToStealAtOneTimeFactor` (since 3.0.0)             | Optional. Default: `2.0`. Controls how to pick the max number of leases to steal at one time. E.g. If there are 4 available processors, and `maxLeasesToStealAtOneTimeFactor = 2.0`, then allow the KCL to steal up to 8 leases. Allows bigger instances to more quickly acquire the shard-leases they need to combat latency |
| `input.checkpointThrottledBackoffPolicy.minBackoff` (since 3.0.0)	| Optional. Default: `100 millis`. Minimum backoff before retrying when DynamoDB provisioned throughput exceeded |
| `input.checkpointThrottledBackoffPolicy.maxBackoff` (since 3.0.0)	| Optional. Default: `1 second`. Maximum backoff before retrying when DynamoDB provisioned throughput limit exceeded |
| `input.debounceCheckpoints` (since 3.0.0)                         | Optional. Default: `10 seconds`. How frequently to checkpoint our progress to the DynamoDB table. By increasing this value, we can decrease the write-throughput requirements of the DynamoDB table |
| `input.customEndpoint`                                            | Optional. Override the default endpoint for kinesis client api calls |
| `output.good.path`                                                | Required. Full path to output data, e.g. `s3://acme-snowplow-output/` |
| `output.good.partitionFormat` (since 2.1.0)                       | Optional. Configures how files are partitioned into S3 directories. When loading self describing jsons, you might choose to partition by `{vendor}.{name}/model={model}/date={yy}-{mm}-{dd}`. Valid substitutions are `{vendor}`, `{name}`, `{format}`, `{model}` for self-describing jsons; and `{yy}`, `{mm}`, `{dd}`, `{hh}` for year, month, day and hour. Defaults to `{vendor}.{schema}` when loading self-describing JSONs or blank when loading enriched events |
| `output.good.filenamePrefix`                                      | Optional. Add a prefix to files |
| `output.good.compression`                                         | Optional. Has to be `GZIP` (default) |
| `output.bad.streamName`                                           | Required. Name of a kinesis stream to output failures |
| `output.bad.throttledBackoffPolicy.minBackoff` (since 3.0.0)	    | Optional. Default: `100 milliseconds`. Minimum backoff before retrying when writing fails with exceeded kinesis write throughput |
| `output.bad.throttledBackoffPolicy.maxBackoff` (since 3.0.0)	    | Optional. Default: `1 second`. Maximum backoff before retrying when writing fails with exceeded kinesis write throughput |
| `output.bad.recordLimit` (since 3.0.0)                            | Optional. Default: `500`. Maximum allowed to records we are allowed to send to Kinesis in 1 PutRecords request |
| `output.bad.byteLimit` (since 3.0.0)                              | Optional. Default: `5242880`. Maximum allowed to bytes we are allowed to send to Kinesis in 1 PutRecords request |
| `purpose`                                                         | Required. `ENRICHED_EVENTS` for enriched events or `SELF_DESCRIBING` for self-describing data |
| `batching.maxBytes` (since 3.0.0)                                 | Optional. Default: `67108864`. After this amount of compressed bytes have been added to the buffer it gets written to a file (unless `maxDelay` is reached before) |
| `batching.maxDelay` (since 3.0.0)                                 | Optional. Default: `2 minutes`. After this delay has elapsed the buffer gets written to a file (unless `maxBytes` is reached before) |
| `cpuParallelismFactor` (since 3.0.0)                              | Optional. Default: `1`. Controls how the app splits the workload into concurrent batches which can be run in parallel, e.g. if there are 4 available processors and `cpuParallelismFactor = 0.75` then we process 3 batches concurrently. Adjusting this value can cause the app to use more or less of the available CPU |
| `uploadParallelismFactor` (since 3.0.0)                           | Optional. Default: `2`. Controls number of upload jobs that can be run in parallel, e.g. if there are 4 available processors and `sinkParallelismFraction = 2` then we run 8 upload job concurrently. Adjusting this value can cause the app to use more or less of the available CPU |
| `initialBufferSize` (since 3.0.0)                                 | Optional. Default: none. Overrides the initial size of the byte buffer that holds the compressed events in-memory before they get written to a file. If not set, the initial size is picked dynamically based on other configuration options. The default is known to work well. Increasing this value is a way to reduce in-memory copying, but comes at the cost of increased memory usage |
| `monitoring.sentry.dsn`                                           | Optional. For tracking uncaught run time exceptions |
| `monitoring.metrics.statsd.hostname`                              | Optional. For sending loading metrics (latency and event counts) to a `statsd` server |
| `monitoring.metrics.statsd.port`                                  | Optional. Port of the statsd server |
| `monitoring.metrics.statsd.tags`                                  | E.g.`{ "key1": "value1", "key2": "value2" }`. Tags are used to annotate the statsd metric with any contextual information |
| `monitoring.metrics.statsd.prefix`                                | Optional. Default `snoplow.s3loader`. Configures the prefix of statsd metric names |
| `monitoring.healthProbe.port` (since 3.0.0)                       | Optional. Default: `8080`. Port of the HTTP server that returns OK only if the app is healthy |
| `monitoring.healthProbe.unhealthyLatency` (since 3.0.0)           | Optional. Default: `2 minutes`. Health probe becomes unhealthy if any received event is still not fully processed before this cutoff time |
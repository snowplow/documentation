---
title: "S3 Loader monitoring"
sidebar_label: "S3 Loader monitoring"
date: "2021-10-04"
sidebar_position: 30
description: "Monitor S3 Loader with StatsD metrics, Sentry error tracking, and Snowplow event tracking for application health and failures."
keywords: ["s3 loader monitoring", "statsd metrics", "sentry alerts", "loader health", "application monitoring"]
---

The S3 loader has several types of monitoring built in, to help the pipeline operator: Statsd metrics, Sentry alerts, and Snowplow tracking.

## Statsd

[Statsd](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

When processing enriched events, the S3 loader can emit metrics to a statsd daemon describing every S3 file it writes. Here is a string representation of the metrics it sends:

```text
snowplow.s3loader.count:42|c|#tag1:value1
snowplow.s3loader.latency_collector_to_load:123|g|#tag1:value1
snowplow.s3loader.latency_millis:56|g|#tag1:value1
snowplow.s3loader.e2e_latency_millis:123|g|#tag1:value1
```

- `count`: total number of events that got written to S3.
- `latency_collector_to_load`: time difference between reaching the collector and getting loaded to S3 (only for enriched events). Will get deprecated eventually in favor of `e2e_latency_millis`.
- `latency_millis`: delay between the input record getting written to the stream and S3 loader starting to process it.
- `e2e_latency_millis`: same as `latency_collector_to_load`, which will get deprecated eventually and replaced with this metric.

Statsd monitoring is configured by setting the `monitoring.metrics.statsd` section in [the hocon file](/docs/api-reference/loaders-storage-targets/s3-loader/configuration-reference/index.md):

```json
"monitoring": {
  "metrics": {
    "hostname": "localhost"
    "port": 8125
    "tags": {
      "tag1": "value1"
      "tag2": "value2"
    }
    "prefix": "snowplow.s3loader"
  }
}
```
## Health probe

Starting with `3.0.0` version S3 loader gets a health probe, configured via the `monitoring.healthProbe` section (see the configuration reference).

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. The S3 loader can send an error report to sentry whenever something unexpected happens. The reasons for the error can then be explored in the sentry server’s UI.

Common reasons might be failure to read or write from Kinesis, or failure to write to S3.

Sentry monitoring is configured by setting the `monitoring.sentry.dsn` key in [the hocon file](/docs/api-reference/loaders-storage-targets/s3-loader/configuration-reference/index.md) with the url of your sentry server:

```json
"monitoring": {
  "dsn": "http://sentry.acme.com"
}
```

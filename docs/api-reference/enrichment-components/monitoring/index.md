---
title: "Monitoring Enrich"
sidebar_label: "Monitoring"
date: "2021-10-04"
sidebar_position: 60
---

Enrich app has monitoring built in, to help the pipeline operator.

## Statsd

[Statsd](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

Enrich can periodically emit event-based metrics to a statsd daemon. Here is a string representation of the metrics it sends:

```text
snowplow.enrich.raw:42|c|#tag1:value1
snowplow.enrich.good:30|c|#tag1:value1
snowplow.enrich.failed:10|c|#tag1:value1
snowplow.enrich.bad:12|c|#tag1:value1
snowplow.enrich.e2e_latency_millis:123.4|g|#tag1:value1
snowplow.enrich.latency_millis:123.4|g|#tag1:value1
snowplow.enrich.invalid_enriched:0|c|#tag1:value1
```

- `raw`: total number of raw collector payloads received.
- `good`: total number of good events successfully enriched.
- `failed`(`incomplete` before version *6.0.0*): total number of failed events due to schema violations or enrichment failures (if feature is enabled).
- `bad`: total number of failed events, e.g. due to schema violations, invalid collector payload, or an enrichment failure.
- `e2e_latency_millis`(`latency` before version *6.0.0*): time difference between the collector timestamp and time the event is emitted to the output stream
- `latency_millis` (since *6.0.0*): delay between the input record getting written to the stream and Enrich starting to process it
- `invalid_enriched`: number of enriched events that were not valid against [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) schema

Note, the count metrics (`raw`, `good`, `bad` and `invalid_enriched`) refer to the updated count since the previous metric was emitted. A collector payload can carry multiple events, so it is possible for `good` to be larger than `raw`.

The latency metrics (`e2e_latency_millis` and `latency_millis`) refer to the maximum latency of all events since the previous metric was emitted.

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
    "prefix": "snowplow.enrich."
    "period": "10 seconds"
  }
}
```

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. Enrich can send an error report to sentry whenever something unexpected happens when trying to enrich an event. The reasons for the error can then be explored in the sentry server’s UI.

Sentry monitoring is configured by setting the `monitoring.sentry.dsn` key in [the hocon file](/docs/api-reference/loaders-storage-targets/s3-loader/configuration-reference/index.md) with the url of your sentry server:

```json
"monitoring": {
  "dsn": "http://sentry.acme.com"
}
```

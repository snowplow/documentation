---
title: "Monitoring"
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
snowplow.enrich.bad:12|c|#tag1:value1
snowplow.enrich.latency:123.4|g|#tag1:value1
snowplow.enrich.invalid_enriched:0|c|#tag1:value1
```

- `raw`: total number of raw collector payloads received.
- `good`: total number of good events successfully enriched.
- `bad`: total number of failed events, e.g. due to schema violations, invalid collector payload, or an enrichment failure.
- `latency`: time difference between the collector timestamp and time the event is emitted to the output stream
- `invalid_enriched`: number of enriched events that were not valid against [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) schema

Note, the count metrics (`raw`, `good`, `bad` and `invalid_enriched`) refer to the updated count since the previous metric was emitted. A collector payload can carry multiple events, so it is possible for `good` to be larger than `raw`.

Statsd monitoring is configured by setting the `monitoring.metrics.statsd` section in [the hocon file](/docs/destinations/warehouses-and-lakes/s3/configuration-reference/index.md):

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

## stdout

Above metrics can also be printed in the logs (with log level `info`).

To do that, this section needs to appear in the configuration file:

```json
"monitoring": {
  "metrics": {
    "stdout": {
      "period": "1 minute"
      "prefix": "snowplow.enrich."
    }
  }
}
```

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. Enrich can send an error report to sentry whenever something unexpected happens when trying to enrich an event. The reasons for the error can then be explored in the sentry server’s UI.

Sentry monitoring is configured by setting the `monitoring.sentry.dsn` key in [the hocon file](/docs/destinations/warehouses-and-lakes/s3/configuration-reference/index.md) with the url of your sentry server:

```json
"monitoring": {
  "dsn": "http://sentry.acme.com"
}
```

## Cloudwatch (for enrich-kinesis)

It's possible to send KCL and KPL metrics to Cloudwatch by adding this section to the config file:

```json
"monitoring": {
  "cloudwatch": true
}
```

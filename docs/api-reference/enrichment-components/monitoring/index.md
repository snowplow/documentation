---
title: "Monitoring in Enrich applications"
sidebar_label: "Monitoring"
date: "2021-10-04"
sidebar_position: 60
description: "Monitor Snowplow Enrich applications with StatsD or Prometheus metrics for event counts and latency, plus Sentry error reporting."
keywords: ["enrich monitoring", "statsd", "prometheus", "enrichment metrics"]
---

Enrich has monitoring built in, to help the pipeline operator.

## Metrics

Enrich tracks the following metrics:

- `raw`: total number of raw collector payloads received.
- `good`: total number of events successfully enriched.
- `good_bytes`: total byte size of successfully enriched events, measured after serialization to TSV format.
- `failed` (`incomplete` before version 6.0.0): the number of failed events produced due to [common failures](/docs/fundamentals/failed-events/index.md#common-failures), e.g. schema violations or enrichment failures.
- `bad`: total number of all types of failed events, e.g. due to schema violations, invalid collector payloads, or enrichment failures.
- `dropped`: total number of events explicitly dropped by calling `event.drop()` in a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md#discard-events).
- `e2e_latency` (`latency` before version 6.0.0): time difference between the collector timestamp and when the event is emitted to the output stream.
- `latency` (since version 6.0.0): delay between an input record being written to the stream and Enrich starting to process it.
- `invalid_enriched`: number of enriched events that were not valid against the [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) schema.

The count metrics (`raw`, `good`, `good_bytes`, `bad`, `failed`, `dropped`, and `invalid_enriched`) refer to the count since the previous measurement. A collector payload can carry multiple events, so it is possible for `good` to be larger than `raw`.

The latency metric names carry no unit, because each protocol adds its own suffix: StatsD reports milliseconds and Prometheus reports seconds. For example, StatsD reports `latency` as `latency_millis`, and Prometheus reports it as `latency_seconds`.

In StatsD, the latency metrics refer to the maximum latency across all events since the previous measurement.

You can report these metrics using StatsD or Prometheus (or both).

## StatsD

[StatsD](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

Enrich can periodically push its metrics to a StatsD daemon. For example, a single emission looks like:

```text
snowplow.enrich.raw:42|c|#tag1:value1
snowplow.enrich.good:30|c|#tag1:value1
snowplow.enrich.good_bytes:30000|c|#tag1:value1
snowplow.enrich.failed:10|c|#tag1:value1
snowplow.enrich.bad:12|c|#tag1:value1
snowplow.enrich.dropped:0|c|#tag1:value1
snowplow.enrich.e2e_latency_millis:123.4|g|#tag1:value1
snowplow.enrich.latency_millis:123.4|g|#tag1:value1
snowplow.enrich.invalid_enriched:0|c|#tag1:value1
```

StatsD is configured under `monitoring.metrics.statsd` in your configuration file:

```json
"monitoring": {
  "metrics": {
    "statsd": {
      "hostname": "localhost"
      "port": 8125
      "tags": {
        "tag1": "value1"
        "tag2": "value2"
      }
      "prefix": "snowplow.enrich"
      "period": "1 minute"
    }
  }
}
```

## Prometheus

[Prometheus](https://prometheus.io/) is an open-source monitoring system that scrapes metrics from an HTTP endpoint exposed by the application. Enrich exposes its metrics at `/metrics` on the health probe port (default `8000`), in the standard Prometheus text format.

Prometheus is configured under `monitoring.metrics.prometheus` in your configuration file:

```json
"monitoring": {
  "metrics": {
    "prometheus": {
      "tags": {
        "tag1": "value1"
        "tag2": "value2"
      }
    }
  }
}
```

The `tags` map adds common labels to all metrics. Point your Prometheus scrape config at `http://<host>:<port>/metrics`, where `<port>` is the health probe port (default `8000`, configured via `monitoring.healthProbe.port`).

Unlike StatsD, Prometheus metrics carry no name prefix. Enrich exposes each metric under the series name that Prometheus naming conventions imply:

| Metric             | Prometheus series                                                                                                   |
|--------------------|---------------------------------------------------------------------------------------------------------------------|
| `raw`              | `raw_total`                                                                                                         |
| `good`             | `good_total`                                                                                                        |
| `good_bytes`       | `good_bytes_total`                                                                                                  |
| `failed`           | `failed_total`                                                                                                      |
| `bad`              | `bad_total`                                                                                                         |
| `dropped`          | `dropped_total`                                                                                                     |
| `invalid_enriched` | `invalid_enriched_total`                                                                                            |
| `latency`          | `latency_seconds`, and a `latency_observations_total` counter that counts how often Enrich records it               |
| `e2e_latency`      | `e2e_latency_seconds_bucket`, `e2e_latency_seconds_count`, `e2e_latency_seconds_sum`, and `e2e_latency_seconds_max` |

`latency` is a gauge, reporting how far behind the input stream Enrich is. It reads the highest latency seen over roughly the last three minutes, or the current latency if that is higher. With Kinesis and Pub/Sub, `latency_observations_total` stops increasing when Enrich stops receiving records from its source, so `rate(latency_observations_total[5m])` dropping to zero signals a stalled source. With Kafka and NSQ, the counter keeps increasing either way, so it does not detect a stalled source.

`e2e_latency` publishes histogram buckets, so you can compute quantiles over it with `histogram_quantile`. The buckets range from 0.1 to 100 seconds. Latencies above 100 seconds fall into the `+Inf` bucket. Quantiles computed from that bucket report a capped value rather than the true latency.

:::note[Prometheus series renamed in 6.14.0]

Before version 6.14.0, Enrich exposed the Prometheus latency series as `latency_millis_seconds_*` and `e2e_latency_millis_seconds_*`, even though the values were in seconds. Enrich also didn't send the stream latency to Prometheus. If a query or alert uses the old names, rewrite it with the series above. StatsD names are unchanged.

:::

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. Enrich can send an error report to Sentry whenever something unexpected happens when trying to enrich an event. The reasons for the error can then be explored in the Sentry server's UI.

Sentry is configured by setting the `monitoring.sentry.dsn` key in your configuration file with the URL of your Sentry server:

```json
"monitoring": {
  "sentry": {
    "dsn": "http://sentry.acme.com"
  }
}
```

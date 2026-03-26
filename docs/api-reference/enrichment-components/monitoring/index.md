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
- `failed` (`incomplete` before version 6.0.0): the number of failed events produced due to [common failures](/docs/fundamentals/failed-events/index.md#common-failures), e.g. schema violations or enrichment failures.
- `bad`: total number of all types of failed events, e.g. due to schema violations, invalid collector payloads, or enrichment failures.
- `dropped`: total number of events explicitly dropped by calling `event.drop()` in a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/writing/index.md#discarding-the-event).
- `e2e_latency_millis` (`latency` before version 6.0.0): time difference between the collector timestamp and when the event is emitted to the output stream.
- `latency_millis` (since version 6.0.0): delay between an input record being written to the stream and Enrich starting to process it.
- `invalid_enriched`: number of enriched events that were not valid against the [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) schema.

The count metrics (`raw`, `good`, `bad`, `failed`, `dropped`, and `invalid_enriched`) refer to the count since the previous measurement. A collector payload can carry multiple events, so it is possible for `good` to be larger than `raw`.

The latency metrics (`e2e_latency_millis` and `latency_millis`) refer to the maximum latency across all events since the previous measurement.

You can report these metrics using StatsD or Prometheus (or both).

## StatsD

[StatsD](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

Enrich can periodically push its metrics to a StatsD daemon. For example, a single emission looks like:

```text
snowplow.enrich.raw:42|c|#tag1:value1
snowplow.enrich.good:30|c|#tag1:value1
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

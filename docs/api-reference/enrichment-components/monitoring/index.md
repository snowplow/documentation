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

- `raw`: a count of raw collector payloads received. A collector payload can carry multiple events, so `good` can be larger than `raw`.
- `good`: a count of events successfully enriched
- `good_bytes`: the total byte size of successfully enriched events, measured after serialization to TSV format
- `failed` (`incomplete` before version 6.0.0): a count of failed events produced due to [common failures](/docs/fundamentals/failed-events/index.md#common-failures), e.g. schema violations or enrichment failures
- `bad`: a count of all types of failed events, e.g. due to schema violations, invalid collector payloads, or enrichment failures
- `dropped`: a count of events explicitly dropped by calling `event.drop()` in a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md#discard-events)
- `invalid_enriched`: a count of enriched events that were not valid against the [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) schema
- `latency` (since version 6.0.0): the delay between input records being written to the source stream and Enrich starting to process them
- `e2e_latency` (`latency` before version 6.0.0): the end-to-end latency of the Snowplow pipeline up to Enrich. For each batch of events, the time from the first event being received by the Collector until the batch is written to the output stream.

The two duration metrics carry no unit in their name, because the unit depends on the protocol: StatsD carries milliseconds and Prometheus carries seconds, and each adds its own suffix. So `latency` is reported as `latency_millis` to StatsD and as `latency_seconds` to Prometheus.

You can report these metrics using StatsD or Prometheus, or both.

## StatsD

[StatsD](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

Enrich can periodically push its metrics to a StatsD daemon. A single report looks like:

```text
snowplow.enrich.raw:42|c|#tag1:value1
snowplow.enrich.good:30|c|#tag1:value1
snowplow.enrich.good_bytes:30000|c|#tag1:value1
snowplow.enrich.failed:10|c|#tag1:value1
snowplow.enrich.bad:12|c|#tag1:value1
snowplow.enrich.dropped:0|c|#tag1:value1
snowplow.enrich.invalid_enriched:0|c|#tag1:value1
snowplow.enrich.latency_millis:1234|g|#tag1:value1
snowplow.enrich.e2e_latency_millis:2345|g|#tag1:value1
```

The count metrics refer to the count since the previous report, and are reported on every cycle, emitting a zero when Enrich has been quiet, so those series are continuous. The duration metrics report the maximum latency since the previous report, and are suppressed when nothing has been recorded, so gaps in those series are normal: a report carries no `e2e_latency_millis` if Enrich emitted no events during that period.

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

[Prometheus](https://prometheus.io/) is an open-source monitoring system that scrapes metrics from an HTTP endpoint exposed by the application. Enrich always exposes its metrics at `/metrics` on the health probe port, in the standard Prometheus text format, so there is no setting to turn Prometheus on. Point your Prometheus scrape config at `http://<host>:<port>/metrics`, where `<port>` is the health probe port, which defaults to `8000` and is configured with `monitoring.healthProbe.port`.

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

The `tags` map is the only Prometheus setting, and it adds common labels to every metric. Unlike StatsD, Prometheus metrics carry no name prefix, and each metric is exposed under the series that Prometheus naming conventions imply:

| Metric             | Prometheus series                                                                                                   |
|--------------------|---------------------------------------------------------------------------------------------------------------------|
| `raw`              | `raw_total`                                                                                                         |
| `good`             | `good_total`                                                                                                        |
| `good_bytes`       | `good_bytes_total`                                                                                                  |
| `failed`           | `failed_total`                                                                                                      |
| `bad`              | `bad_total`                                                                                                         |
| `dropped`          | `dropped_total`                                                                                                     |
| `invalid_enriched` | `invalid_enriched_total`                                                                                            |
| `latency`          | `latency_seconds`, and a `latency_observations_total` counter of how often it has been recorded                     |
| `e2e_latency`      | `e2e_latency_seconds_bucket`, `e2e_latency_seconds_count`, `e2e_latency_seconds_sum`, and `e2e_latency_seconds_max` |

`latency` is a gauge rather than a histogram, because it describes how far behind the stream Enrich is, which is a property of the application as a whole. `e2e_latency` is recorded once per batch, when the batch is written, so it has a distribution worth summarizing and is published as a histogram instead.

`e2e_latency` therefore publishes histogram buckets, so you can compute quantiles over it with `histogram_quantile`. The bucket range runs from 0.1 seconds up to 100 seconds. Anything above the top of that range falls into the `+Inf` bucket, where quantiles saturate and read back as a flat, plausible-looking value.

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

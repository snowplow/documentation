---
title: "Monitoring the Elasticsearch Loader"
sidebar_label: "Monitoring"
sidebar_position: 30
description: "Monitor the Elasticsearch Loader with StatsD or Prometheus metrics for event counts and latency, plus Sentry error reporting."
keywords: ["elasticsearch loader monitoring", "statsd", "prometheus", "loader metrics", "latency alerting"]
date: "2026-11-25"
content_type: reference
---

The Elasticsearch Loader has monitoring built in, to help the pipeline operator.

## Metrics

The Elasticsearch Loader tracks the following metrics:

- `events_good`: a count of events successfully written to Elasticsearch
- `events_bad`: a count of failed events that could not be loaded, and were sent to the bad output stream instead
- `es_index_limit_error`: a count of events that Elasticsearch rejected because they would exceed a limit of the index, such as the limit on the total number of fields. These events are also counted in `events_bad`.
- `latency`: the delay between events being written to the source Kinesis stream and the loader reading them
- `e2e_latency`: the end-to-end latency of the Snowplow pipeline. For each batch of events, the time from the earliest event in the batch being received by the Collector until the batch is written to Elasticsearch. The loader only records this metric when `purpose` is `ENRICHED_EVENTS`, because other types of data carry no Collector timestamp.
- `elasticsearch_latency`: the time taken by a single bulk request to Elasticsearch. The loader records it only for requests that complete without a transient error, so a request that is retried is recorded once, for the attempt that succeeds.

The three duration metrics carry no unit in their name, because the unit depends on the protocol: StatsD carries milliseconds and Prometheus carries seconds, and each adds its own suffix. So `latency` is reported as `latency_millis` to StatsD and as `latency_seconds` to Prometheus.

You can report these metrics using StatsD or Prometheus, or both.

## StatsD

[StatsD](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

The Elasticsearch Loader can periodically push its metrics to a StatsD daemon. A single report looks like:

```text
snowplow.elasticsearch.loader.events_good:5000|c|#tag1:value1
snowplow.elasticsearch.loader.events_bad:2|c|#tag1:value1
snowplow.elasticsearch.loader.es_index_limit_error:0|c|#tag1:value1
snowplow.elasticsearch.loader.latency_millis:1234|g|#tag1:value1
snowplow.elasticsearch.loader.e2e_latency_millis:4567|g|#tag1:value1
snowplow.elasticsearch.loader.elasticsearch_latency_millis:250|g|#tag1:value1
```

The count metrics refer to the count since the previous report, and are reported on every cycle, emitting a zero when the loader has been quiet, so those series are continuous. The duration metrics report the maximum latency since the previous report, and are suppressed when nothing has been recorded, so gaps in those series are normal: a report carries no `e2e_latency_millis` if the loader wrote no events during that period.

StatsD is configured under `monitoring.metrics.statsd` in your configuration file:

```hocon
monitoring: {
  metrics: {
    statsd: {
      hostname: localhost
      port: 8125
      tags: {
        tag1: value1
        tag2: value2
      }
      prefix: snowplow.elasticsearch.loader
      period: 1 minute
    }
  }
}
```

## Prometheus

[Prometheus](https://prometheus.io/) is an open-source monitoring system that scrapes metrics from an HTTP endpoint exposed by the application. The Elasticsearch Loader always exposes its metrics at `/metrics` on the health probe port, in the standard Prometheus text format, so there is no setting to turn Prometheus on. Point your Prometheus scrape config at `http://<host>:<port>/metrics`, where `<port>` is the health probe port, which defaults to `8000` and is configured with `monitoring.healthProbe.port`.

Prometheus is configured under `monitoring.metrics.prometheus` in your configuration file:

```hocon
monitoring: {
  metrics: {
    prometheus: {
      tags: {
        tag1: value1
        tag2: value2
      }
    }
  }
}
```

The `tags` map is the only Prometheus setting, and it adds common labels to every metric. Unlike StatsD, Prometheus metrics carry no name prefix, and each metric is exposed under the series that Prometheus naming conventions imply:

| Metric                  | Prometheus series                                                                                                                           |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `events_good`           | `events_good_total`                                                                                                                         |
| `events_bad`            | `events_bad_total`                                                                                                                          |
| `es_index_limit_error`  | `es_index_limit_error_total`                                                                                                                |
| `latency`               | `latency_seconds`, and a `latency_observations_total` counter of how often it has been recorded                                             |
| `e2e_latency`           | `e2e_latency_seconds_bucket`, `e2e_latency_seconds_count`, `e2e_latency_seconds_sum`, and `e2e_latency_seconds_max`                         |
| `elasticsearch_latency` | `elasticsearch_latency_seconds_bucket`, `elasticsearch_latency_seconds_count`, `elasticsearch_latency_seconds_sum`, and `elasticsearch_latency_seconds_max` |

`latency` is a gauge rather than a histogram, because it describes how far behind the stream the loader is, which is a property of the loader as a whole. The other two are recorded once per batch or per bulk request, so they have a distribution worth summarizing and are published as histograms instead.

`e2e_latency` and `elasticsearch_latency` therefore publish histogram buckets, so you can compute quantiles over them with `histogram_quantile`. The bucket range runs from 0.1 seconds up to 100 seconds. Anything above the top of that range falls into the `+Inf` bucket, where quantiles saturate and read back as a flat, plausible-looking value.

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. The Elasticsearch Loader can send an error report to Sentry whenever something unexpected happens, such as a failure to read from Kinesis or to write to Elasticsearch. The reasons for the error can then be explored in the Sentry server's UI.

Sentry is configured by setting the `monitoring.sentry.dsn` key in your configuration file with the URL of your Sentry server:

```hocon
monitoring: {
  sentry: {
    dsn: "http://sentry.acme.com"
  }
}
```

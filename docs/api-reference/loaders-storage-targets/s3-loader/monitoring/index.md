---
title: "Monitoring the S3 Loader"
sidebar_label: "Monitoring"
date: "2021-10-04"
sidebar_position: 30
description: "Monitor the S3 Loader with StatsD or Prometheus metrics for event counts and latency, plus Sentry error reporting."
keywords: ["s3 loader monitoring", "statsd", "prometheus", "loader metrics", "latency alerting"]
content_type: reference
---

The S3 Loader has monitoring built in, to help the pipeline operator.

## Metrics

The S3 Loader tracks the following metrics:

- `count`: a count of events written to S3
- `latency`: the delay between records being written to the source Kinesis stream and the loader reading them
- `e2e_latency`: the end-to-end latency of the Snowplow pipeline. For each batch of events, the time from the earliest event in the batch being received by the Collector until the batch is written to S3. The loader only records this metric when `purpose` is `ENRICHED_EVENTS`, because self-describing data carries no Collector timestamp.
- `latency_collector_to_load` (deprecated): the same measurement as `e2e_latency`, in whole seconds. It exists for backward compatibility, so use `e2e_latency` instead.

The two duration metrics, `latency` and `e2e_latency`, carry no unit in their name, because the unit depends on the protocol: StatsD carries milliseconds and Prometheus carries seconds, and each adds its own suffix. So `latency` is reported as `latency_millis` to StatsD and as `latency_seconds` to Prometheus.

You can report these metrics using StatsD or Prometheus, or both.

## StatsD

[StatsD](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

The S3 Loader can periodically push its metrics to a StatsD daemon. A single report looks like:

```text
snowplow.s3loader.count:5000|c|#tag1:value1
snowplow.s3loader.latency_millis:1234|g|#tag1:value1
snowplow.s3loader.e2e_latency_millis:150000|g|#tag1:value1
snowplow.s3loader.latency_collector_to_load:150|g|#tag1:value1
```

The count metric refers to the count since the previous report, and is reported on every cycle, emitting a zero when the loader has been quiet, so that series is continuous. The duration metrics report the maximum latency since the previous report. The duration metrics and `latency_collector_to_load` are suppressed when nothing has been recorded since the last report, so gaps in those series are normal: a report carries no `e2e_latency_millis` if the loader wrote no files during that period.

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
      prefix: snowplow.s3loader
      period: 1 minute
    }
  }
}
```

## Prometheus

[Prometheus](https://prometheus.io/) is an open-source monitoring system that scrapes metrics from an HTTP endpoint exposed by the application. The S3 Loader always exposes its metrics at `/metrics` on the health probe port, in the standard Prometheus text format, so there is no setting to turn Prometheus on. Point your Prometheus scrape config at `http://<host>:<port>/metrics`, where `<port>` is the health probe port, which defaults to `8000` and is configured with `monitoring.healthProbe.port`.

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

| Metric                      | Prometheus series                                                                                                   |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------|
| `count`                     | `count_total`                                                                                                       |
| `latency`                   | `latency_seconds`, and a `latency_observations_total` counter of how often it has been recorded                     |
| `e2e_latency`               | `e2e_latency_seconds_bucket`, `e2e_latency_seconds_count`, `e2e_latency_seconds_sum`, and `e2e_latency_seconds_max` |
| `latency_collector_to_load` | `latency_collector_to_load`                                                                                         |

`latency` is a gauge rather than a histogram, because it describes how far behind the stream the loader is, which is a property of the loader as a whole. `e2e_latency` is recorded once per batch, when the batch is written to S3, so it has a distribution worth summarizing and is published as a histogram instead.

`e2e_latency` therefore publishes histogram buckets, so you can compute quantiles over it with `histogram_quantile`. The bucket range is derived from your `batching.maxDelay` setting, from a tenth of it up to a hundred times it: with the default of 2 minutes, that is 12 seconds to 200 minutes. Anything above the top of that range falls into the `+Inf` bucket, where quantiles saturate and read back as a flat, plausible-looking value, so expect the useful range of this histogram to move if you change `batching.maxDelay` substantially.

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. The S3 Loader can send an error report to Sentry whenever something unexpected happens, such as a failure to read from Kinesis or to write to S3. The reasons for the error can then be explored in the Sentry server's UI.

Sentry is configured by setting the `monitoring.sentry.dsn` key in your configuration file with the URL of your Sentry server:

```hocon
monitoring: {
  sentry: {
    dsn: "http://sentry.acme.com"
  }
}
```

---
title: "Monitoring the Lake Loader"
sidebar_label: "Monitoring"
sidebar_position: 4
description: "Monitor the Lake Loader with StatsD or Prometheus metrics for event counts, latency, table state, and Spark resource usage, plus Sentry error reporting."
keywords: ["lake loader monitoring", "statsd", "prometheus", "loader metrics", "latency alerting"]
date: "2026-09-17"
---

The Lake Loader has monitoring built in, to help the pipeline operator.

## Metrics

The Lake Loader tracks the following metrics:

- `events_received`: a count of events received by the loader. Unlike `events_committed`, this varies smoothly, because the loader receives events continuously throughout a window.
- `events_bad`: a count of failed events that could not be loaded, and were sent to the bad output stream instead
- `events_committed`: a count of events successfully written and committed to the lake. Because the loader works in timed windows of several minutes, this metric is spiky: it is often zero and then periodically jumps to a larger value.
- `latency`: the delay between events being written to the source stream of events, by Enrich, and the loader reading them
- `processing_latency`: for each window of events, the time from the first event being read from the stream until every event in the window is written and committed to the lake
- `e2e_latency`: the end-to-end latency of the Snowplow pipeline. For each window of events, the time from the first event being received by the Collector until every event in the window is written and committed to the lake.
- `table_data_files_total`: the number of data files in the table after a commit. Use it to monitor table growth and whether your [compaction strategy](/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/index.md) is keeping up.
- `table_snapshots_retained`: the number of snapshots retained in the table metadata. Use it to monitor snapshot accumulation and whether your [snapshot expiration policy](/docs/api-reference/loaders-storage-targets/lake-loader/maintenance/index.md) is keeping up.

The three duration metrics carry no unit in their name, because the unit depends on the protocol: StatsD carries milliseconds and Prometheus carries seconds, and each adds its own suffix. So `latency` is reported as `latency_millis` to StatsD and as `latency_seconds` to Prometheus.

You can report these metrics using StatsD or Prometheus, or both. A further set of metrics describing the loader's internal Spark instance is available to Prometheus only, since 0.14.0.

## StatsD

[StatsD](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

The Lake Loader can periodically push its metrics to a StatsD daemon. A report that lands on a window commit looks like:

```text
snowplow.lakeloader.events_received:5000|c|#tag1:value1
snowplow.lakeloader.events_bad:2|c|#tag1:value1
snowplow.lakeloader.events_committed:4998|c|#tag1:value1
snowplow.lakeloader.latency_millis:1234|g|#tag1:value1
snowplow.lakeloader.processing_latency_millis:312000|g|#tag1:value1
snowplow.lakeloader.e2e_latency_millis:345000|g|#tag1:value1
snowplow.lakeloader.table_data_files_total:2048|g|#tag1:value1
snowplow.lakeloader.table_snapshots_retained:120|g|#tag1:value1
```

The count metrics are reported on every cycle, emitting a zero when the loader has been quiet, so those series are continuous. The gauges and the duration metrics are suppressed when nothing has been recorded since the last report, so gaps in those series are normal: a report that lands mid-window carries no `e2e_latency_millis`, because no window committed during that period.

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
      "prefix": "snowplow.lakeloader"
      "period": "1 minute"
    }
  }
}
```

## Prometheus

[Prometheus](https://prometheus.io/) is an open-source monitoring system that scrapes metrics from an HTTP endpoint exposed by the application. The Lake Loader always exposes its metrics at `/metrics` on the health probe port, in the standard Prometheus text format, so there is no setting to turn Prometheus on. Point your Prometheus scrape config at `http://<host>:<port>/metrics`, where `<port>` is the health probe port, which defaults to `8000` and is configured with `monitoring.healthProbe.port`.

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

| Metric                     | Prometheus series                                                                                                                               |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `events_received`          | `events_received_total`                                                                                                                         |
| `events_bad`               | `events_bad_total`                                                                                                                              |
| `events_committed`         | `events_committed_total`                                                                                                                        |
| `latency`                  | `latency_seconds`, and a `latency_observations_total` counter of how often it has been recorded                                                 |
| `processing_latency`       | `processing_latency_seconds_bucket`, `processing_latency_seconds_count`, `processing_latency_seconds_sum`, and `processing_latency_seconds_max` |
| `e2e_latency`              | `e2e_latency_seconds_bucket`, `e2e_latency_seconds_count`, `e2e_latency_seconds_sum`, and `e2e_latency_seconds_max`                             |
| `table_data_files_total`   | `table_data_files_total`                                                                                                                        |
| `table_snapshots_retained` | `table_snapshots_retained`                                                                                                                      |

`latency` is a gauge rather than a histogram, because it describes how far behind the stream the loader is, which is a property of the loader as a whole. The other two are recorded once per window, when the window commits, so they have a distribution worth summarizing and are published as histograms instead.

`processing_latency` and `e2e_latency` therefore publish histogram buckets, so you can compute quantiles over them with `histogram_quantile`. The bucket range is derived from your `windowing` setting, from a tenth of it up to a hundred times it. Anything above the top of that range falls into the `+Inf` bucket, where quantiles saturate and read back as a flat, plausible-looking value, so expect the useful range of these histograms to move if you change `windowing` substantially.

### Monitor Spark's disk and memory use

The loader runs an internal Spark instance, which stages each window in memory and on local disk before committing it to the lake. Since 0.14.0, four gauges report what that instance is holding. They are Prometheus-only: they do not appear in StatsD.

| Metric                       | Definition                                                                                                                                              |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `spark_disk_bytes`           | The total size of the files Spark is holding on its local scratch directory. This is the figure to compare against the storage available to the loader. |
| `spark_shuffle_disk_bytes`   | The shuffle files written for the open windows. An upper bound, because Spark rounds each block size up.                                                |
| `spark_storage_memory_bytes` | Staged batches held in memory, measured at the point in each window where occupancy peaks.                                                              |
| `spark_storage_disk_bytes`   | Staged batches that Spark has written out to local disk, measured at the same point.                                                                    |

The last three are not a breakdown of the first. A staged batch that Spark wrote to disk is counted by both `spark_storage_disk_bytes` and `spark_disk_bytes`, whereas shuffle files are not held as storage blocks and so reach `spark_disk_bytes` without appearing in either storage gauge. Treat `spark_disk_bytes` as the number to alarm on, and the others as the breakdown that explains where it came from.

The two storage gauges hold a peak rather than tracking current use, and a window that staged nothing takes no measurement at all. On an idle pipeline they therefore keep their last reading, rather than dropping to zero.

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. The Lake Loader can send an error report to Sentry whenever something unexpected happens while loading events. The reasons for the error can then be explored in the Sentry server's UI.

Sentry is configured by setting the `monitoring.sentry.dsn` key in your configuration file with the URL of your Sentry server:

```json
"monitoring": {
  "sentry": {
    "dsn": "http://sentry.acme.com"
  }
}
```

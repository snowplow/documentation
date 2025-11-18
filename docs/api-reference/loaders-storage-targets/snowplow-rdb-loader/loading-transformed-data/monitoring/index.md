---
title: "Monitoring Transformed Data Loading (RDB Loader)"
date: "2022-04-05"
sidebar_position: 400
---

The loader app has several types of monitoring built in to help the pipeline operator: folder monitoring, warehouse health checks, StatsD metrics, Sentry alerts, and Snowplow tracking.

For all monitoring configuration options, see the [configuration reference](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/rdb-loader-configuration-reference/index.md).

## Webhook alerts

The loader can send `POST` requests via HTTP webhook to a configurable URL whenever there is an issue which needs investigation by the pipeline operator. The webhook payload conforms to the [`alert`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.monitoring.batch/alert/jsonschema/1-0-0) schema on Iglu Central.

You can configure where the webhook is sent by setting the `monitoring.webhook` section in the `config.hocon` file.

The webhook monitoring can be used for folder monitoring and warehouse health checks.

### Folder monitoring

A webhook alert is sent whenever the loader identifies inconsistencies between the transformed output in S3 and the data in the warehouse. The algorithm is as follows:

- Check if all folders on S3 have a `shredding_complete.json` file (the legacy name is kept for backwards compatibility, but this applies to wide row format data as well). A missing file suggests the transformer failed to complete writing the transformed data, and so manual intervention is required to remove the folder from S3 and rerun.
- Check if all folders on S3 created within a specific time range are listed in the warehouse manifest table. This table is maintained by the loader and contains information about loads. If a folder is missing from the manifest table, it suggests the loader has previously tried and failed to load it. Manual intervention is required to resend the `shredding_complete.json` message via SQS / SNS to trigger reloading of the folder.

Folder monitoring is configured by setting the `monitoring.folders` section in the `config.hocon` file.

### Warehouse health check

The loader can send an alert if the warehouse does not respond to a periodic `SELECT 1` statement. For each failed health check, a `POST` request is sent via the webhook.

The health check is configured by setting the `monitoring.healthCheck` section in the `config.hocon` file.

## StatsD and stdout

[StatsD](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

The loader can emit metrics to a StatsD daemon describing every batch it processes. Here is a string representation of the metrics it sends:

```text
snowplow.rdbloader.count_good:42|c|#tag1:value1
snowplow.rdbloader.count_bad:2|c|#tag1:value1
snowplow.rdbloader.latency_collector_to_load_min:123.4|g|#tag1:value1
snowplow.rdbloader.latency_collector_to_load_max:234.5|g|#tag1:value1
snowplow.rdbloader.latency_transformer_start_to_load:66.6|g|#tag1:value1
snowplow.rdbloader.latency_transformer_end_to_load:44.4|g|#tag1:value1
```

These are the meanings of the individual metrics:

- `count_good`: the total number of good events in the batch that was loaded
- `count_bad`: the total number of bad events in the batch that was loaded (available since version 5.4.0)
- `latency_collector_to_load_min`: for the most recent event in the batch, this is the time difference between reaching the collector and getting loaded to the warehouse
- `latency_collector_to_load_min`: for the oldest event in the batch, this is the time difference between reaching the collector and getting loaded to the warehouse
- `latency_transformer_start_to_load`: time difference between the transformer starting on this batch and the loader completing loading to the warehouse
- `latency_transformer_end_to_load`: time difference between the transformer completing this batch and the loader completing loading it into the warehouse.

StatsD monitoring is configured by setting the `monitoring.metrics.statsd` section in the `config.hocon` file.

You can expose these metrics in `stdout` for easier debugging by setting the `monitoring.metrics.stdout` section in the `config.hocon` file.

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. The loader and transformer can both send an error report to sentry whenever something unexpected happens. The reasons for the error can then be explored in the Sentry server’s UI.

Common reasons might be lost connection to the database, or an HTTP error fetching a schema from an Iglu server.

Sentry monitoring is configured by setting the `monitoring.sentry.dsn` section in the `config.hocon` file.

## Snowplow tracking

The loader can emit a Snowplow event to a collector when the application crashes with an unexpected error. The event conforms to the [`load_failed`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.monitoring.batch/load_failed/jsonschema/1-0-0) schema on Iglu Central.

Snowplow tracking is configured by setting the `monitoring.snowplow` section in the `config.hocon` file.

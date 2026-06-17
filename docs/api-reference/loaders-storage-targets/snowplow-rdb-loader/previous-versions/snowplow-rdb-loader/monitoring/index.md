---
title: "RDB loader 2.x monitoring and alerting"
sidebar_label: "RDB loader monitoring"
date: "2021-09-29"
sidebar_position: 350
description: "Monitor RDB Loader 2.x with webhooks, folder monitoring, health checks, StatsD metrics, and Sentry alerts for warehouse loading."
keywords: ["rdb loader monitoring", "webhook alerts", "health checks", "statsd rdb", "loader observability"]
---

The RDB loader has several types of monitoring built in, to help the pipeline operator: folder monitoring, warehouse health checks, Statsd metrics, Sentry alerts, and Snowplow tracking.

## Webhook alerts

The RDB loader can `POST` an http webhook to a configurable uri whenever there is an issue which needs investigation by the pipeline operator. The webhook payload conforms to [the alert json schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.monitoring.batch/alert/jsonschema/1-0-0) in Iglu Central.

```json
{
  "application": "1.2.0",
  "folder": "s3://mybucket/shredded/run=2021-09-10-13-41-27",
  "severity": "WARNING",
  "message": "Unloaded batch",
  "tags": {
    "tag1": "value1",
  }
}
```

You can configure where the webhook is sent by setting the `monitoring.webhook` section in [the hocon file](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/configuration-reference/index.md):

```json
"monitoring": {
  "webhook": {
    "endpoint": "http://example.com/receiver"
    "tags": {
      "tag1": "value1"
    }
  }
}
```

## Folder monitoring

A webhook alert is sent when the RDB loader identifies inconsistencies between the shredded output in S3 and the data in the warehouse:

1. Checks if all folders in S3 have a `shredding_complete.json` file inside. A missing json file suggests the shredder failed to complete this step, and so manual intervention is needed to remove the folder in S3.
2. Checks all folders in S3 are listed in the warehouse manifest table. If a folder is missing from the table, it suggests the loader has previously tried and failed to load the batch. Manual intervention is needed to resend the `shredding_complete.json` message via SQS to trigger re-loading the folder.

Folder monitoring is configured by setting the `monitoring.folders` section in [the hocon file](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/configuration-reference/index.md):

```json
"monitoring": {
  "folders": {
    "staging": "s3://mybucket/loader/logs"
    "period": "1 hour"
  }
}
```

## Warehouse Health Check

_Added in version 2.1.0._ The RDB loader can send an alert if the warehouse does not respond to a periodic `SELECT 1` statement. For each failed health check, a webhook is `POST`ed to a configurable url. The webhook payload conforms to [the alert json schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.monitoring.batch/alert/jsonschema/1-0-0) in Iglu Central.

The health check is configured by setting the `monitoring.healthCheck` section in [the hocon file](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/configuration-reference/index.md):

```json
"monitoring": {
  "healthCheck": {
    "frequency": "20 minutes"
    "timeout": "15 seconds"
  }
}
```

## Statsd

[Statsd](https://github.com/statsd/statsd) is a daemon that aggregates and summarizes application metrics. It receives metrics sent by the application over UDP, and then periodically flushes the aggregated metrics to a [pluggable storage backend](https://github.com/statsd/statsd/blob/master/docs/backend.md).

The RDB loader can emit metrics to a statsd daemon describing every batch it processes. Here is a string representation of the metrics it sends:

```text
snowplow.rdbloader.count_good:42|c|#tag1:value1snowplow.rdbloader.latency_collector_to_load_min:123.4|g|#tag1:value1snowplow.rdbloader.latency_collector_to_load_max:234.5|g|#tag1:value1snowplow.rdbloader.latency_shredder_start_to_load:66.6|g|#tag1:value1snowplow.rdbloader.latency_shredder_end_to_load:44.4|g|#tag1:value1
```

- `count_good`: the total number of good events in the batch that was loaded.
- `latency_collector_to_load_min`: for the most recent event in the batch, this is the time difference between reaching the collector and getting loaded to the warehouse.
- `latency_collector_to_load_min`: for the oldest event in the batch, this is the time difference between reaching the collector and getting loaded to the warehouse.
- `latency_shredder_start_to_load`: time difference between the shredder starting on this batch and the loader completing loading to the warehouse.
- `latency_shredder_end_to_load`: time difference between the shredder completing this batch and the loader completing loading the the warehouse.

Statsd monitoring is configured by setting the `monitoring.metrics.statsd` section in [the hocon file](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/configuration-reference/index.md):

```json
"monitoring": {
  "metrics": {
    "hostname": "localhost"
    "port": 8125
    "tags": {
      "tag1": "value1"
      "tag2": "value2"
    }
    "prefix": "snowplow.rdbloader"
  }
}
```

## Sentry

[Sentry](https://docs.sentry.io/) is a popular error monitoring service, which helps developers diagnose and fix problems in an application. The RDB loader and shredder both can send an error report to sentry whenever something unexpected happens. The reasons for the error can then be explored in the sentry server’s UI.

Common reasons might be lost connection to the database, or an http error fetching a schema from an Iglu server.

Sentry monitoring is configured by setting the `monitoring.sentry.dsn` key in [the hocon file](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/configuration-reference/index.md) with the url of your sentry server:

```json
"monitoring": {
  "dsn": "http://sentry.acme.com"
}
```

## Snowplow Tracking

The loader can emit a Snowplow event to a collector when the application crashes with an unexpected error. The event is a [load_failed event](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.monitoring.batch/load_failed/jsonschema/1-0-0).

Snowplow monitoring is configured by setting the `monitoring.snowplow` section in [the hocon file](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/configuration-reference/index.md):

```json
"monitoring": {
  "appId": "redshift-loader"
  "collector": "collector.acme.com"
}
```

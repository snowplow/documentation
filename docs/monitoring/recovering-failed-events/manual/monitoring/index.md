---
title: "Monitoring"
date: "2020-08-26"
sidebar_position: 40
---

When running a recovery job in your production pipeline, you'll likely find it useful to keep an eye on it's progress.

In order to verify the process is running properly there are several locations in your **infrastructure** that can be monitored, depending on your runtime environment. These are: datasinks (for recovery job processed output): `failedOutput` (S3/GCS bucket), `unrecoverableOutput` (S3/GCS bucket), `output` (Kinesis/PubSub streams) and job runners (tracking job status and processing in real-time).

Beyond monitoring infrastructure, each job exposes “business” processing metrics that summarise failed, unrecoverable and recovered bad rows that have been processed.

### Amazon EMR

On EMR recovery job exposes run summary using a [built-in reporting library delivering](https://spark.apache.org/docs/latest/monitoring.html) count summaries for:

- `event-recovery.driver.summary.Recovered`
- `event-recovery.driver.summary.Failed`
- `event-recovery.driver.summary.Unrecoverable`

The metrics can be accessed trough variety of ways (sinks) and can be configured upon cluster creation parameters.

To enable desired sink set EMR’s `spark-metrics` classification parameters following [possible values](https://github.com/apache/spark/blob/master/conf/metrics.properties.template) using EMR’s classifiers.

To expose metrics over http accessible at `http://${SPARK_HOST}:4040/metrics/json`:

```json
  {
    "classification": "spark-metrics",
    "properties": {
        "spark.metrics.namespace": "event-revovery",
        "*.sink.servlet.class": "org.apache.spark.metrics.sink.MetricsServlet",
        "*.sink.servlet.period": "1",
        "*.sink.servlet.unit": "seconds",
        "*.sink.servlet.path": "/metrics/json",
        "master.sink.servlet.path": "/metrics/master/json",
        "applications.sink.servlet.path": "metrics/applications/json",
        "*.source.metrics.class": "org.apache.spark.metrics.source.Metrics"

    }
```

To push metrics to output logs to console appender:

```json
  {
    "classification": "spark-metrics",
    "properties": {
        "spark.metrics.namespace": "$name",
        "*.sink.console.class": "org.apache.spark.metrics.sink.ConsoleSink",
        "*.source.metrics.class": "org.apache.spark.metrics.source.Metrics"

    }
```

For more sinks see [Spark documentation on monitoring](https://spark.apache.org/docs/latest/monitoring.html).

### Google Dataflow

On Google Dataflow recovery job exposes realtime run metrics using a dataflow’s native functions. The metrics are:

- `recovered`
- `failed`
- `unrecoverable`

The metrics can be accessed through the web UI directly in Dataflow.

---
title: "Run event recovery 0.7.x and earlier on AWS"
sidebar_label: "Previous versions"
sidebar_position: 90
description: "Reference for running the event recovery Spark job and the 0.7.x Flink job on Amazon EMR. Both are unsupported."
keywords: ["event recovery 0.7", "Spark event recovery", "legacy event recovery", "previous versions"]
date: "2026-11-09"
sidebar_custom_props:
  outdated: true
---

This page describes how to run event recovery on AWS with version 0.7.2 and earlier, using either the Spark job or the Flink job. It's kept for reference. Neither setup is supported.

Upgrade to the current [Flink job](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md). See the [0.8.0 upgrade guide](/docs/monitoring/recovering-failed-events/manual/upgrade-guides/0-8-0-upgrade-guide/index.md).

Version 0.7.2 is the last release that includes the Spark job. The Spark job was deprecated in 0.6.0 because its Kinesis integration isn't as reliable as the Flink job's.

## Run the Spark job

The Spark job reads failed events from S3, and writes the recovered events to Kinesis and the failed and unrecoverable events to S3. It runs on a transient EMR cluster, using [dataflow-runner](https://github.com/snowplow/dataflow-runner) and the [0.7.2 Spark templates](https://github.com/snowplow-incubator/snowplow-event-recovery/tree/0.7.2/.dataflow-runner) `spark-cluster.json.tmpl` and `spark-playbook.json.tmpl`.

Download both templates and run:

```bash
dataflow-runner run-transient \
  --emr-playbook spark-playbook.json.tmpl \
  --emr-config spark-cluster.json.tmpl \
  --vars bucket,$BUCKET_INPUT,region,$AWS_REGION,subnet,$AWS_SUBNET,role,$AWS_IAM_ROLE,keypair,$AWS_KEYPAIR,client,$JOB_OWNER,version,$RECOVERY_VERSION,config,$RECOVERY_CONFIG,resolver,$IGLU_RESOLVER,output,$KINESIS_OUTPUT,inputdir,$BUCKET_INPUT_DIRECTORY
```

Where:

- `BUCKET_INPUT`: the S3 bucket that holds the failed events to recover.
- `BUCKET_INPUT_DIRECTORY`: the directory in `BUCKET_INPUT` to read failed events from.
- `AWS_REGION`: the region to run the cluster in, for example `eu-central-1`.
- `AWS_SUBNET`: the subnet to run the cluster in.
- `AWS_IAM_ROLE`: the IAM role for the cluster nodes.
- `AWS_KEYPAIR`: the EC2 key pair for the cluster nodes.
- `JOB_OWNER`: a tag that marks the owner of the job.
- `RECOVERY_VERSION`: the application version, for example `0.7.2`.
- `RECOVERY_CONFIG`: the Base64-encoded recovery configuration, as described in [Configuration](/docs/monitoring/recovering-failed-events/manual/configuration/index.md).
- `IGLU_RESOLVER`: the Base64-encoded Iglu resolver configuration, as described in [Run event recovery jobs](/docs/monitoring/recovering-failed-events/manual/running/index.md#encode-configuration).
- `KINESIS_OUTPUT`: the Kinesis stream to write recovered events to.

The playbook copies the job jar from `s3://<bucket>/3-enrich/snowplow-event-recovery/`. Copy `snowplow-event-recovery-spark-0.7.2.jar` there from the Snowplow hosted assets bucket for your region, or from the [0.7.2 GitHub release](https://github.com/snowplow-incubator/snowplow-event-recovery/releases/tag/0.7.2).

## Monitor the Spark job

The Spark job reports summary counts through Spark's [metrics system](https://spark.apache.org/docs/latest/monitoring.html):

- `event-recovery.driver.summary.Recovered`
- `event-recovery.driver.summary.Failed`
- `event-recovery.driver.summary.Unrecoverable`

To choose where the metrics go, set the `spark-metrics` classification in the EMR cluster configuration, using the properties in Spark's [metrics template](https://github.com/apache/spark/blob/master/conf/metrics.properties.template).

For example, to expose the metrics over HTTP at `http://${SPARK_HOST}:4040/metrics/json`:

```json
{
  "classification": "spark-metrics",
  "properties": {
    "spark.metrics.namespace": "event-recovery",
    "*.sink.servlet.class": "org.apache.spark.metrics.sink.MetricsServlet",
    "*.sink.servlet.period": "1",
    "*.sink.servlet.unit": "seconds",
    "*.sink.servlet.path": "/metrics/json",
    "master.sink.servlet.path": "/metrics/master/json",
    "applications.sink.servlet.path": "metrics/applications/json",
    "*.source.metrics.class": "org.apache.spark.metrics.source.Metrics"
  }
}
```

To print the metrics to the console log:

```json
{
  "classification": "spark-metrics",
  "properties": {
    "spark.metrics.namespace": "$name",
    "*.sink.console.class": "org.apache.spark.metrics.sink.ConsoleSink",
    "*.source.metrics.class": "org.apache.spark.metrics.source.Metrics"
  }
}
```

## Run the Flink job (0.7.x)

The 0.7.x Flink job runs on EMR 6.9 with Flink 1.15, using [dataflow-runner](https://github.com/snowplow/dataflow-runner) and the [0.7.2 Flink templates](https://github.com/snowplow-incubator/snowplow-event-recovery/tree/0.7.2/.dataflow-runner) `flink-cluster.json.tmpl` and `flink-playbook.json.tmpl`.

Download both templates and run:

```bash
dataflow-runner run-transient \
  --emr-playbook flink-playbook.json.tmpl \
  --emr-config flink-cluster.json.tmpl \
  --vars bucket,$BUCKET_INPUT,region,$AWS_REGION,subnet,$AWS_SUBNET,role,$AWS_IAM_ROLE,keypair,$AWS_KEYPAIR,client,$JOB_OWNER,version,$RECOVERY_VERSION,config,$RECOVERY_CONFIG,resolver,$IGLU_RESOLVER,output,$KINESIS_OUTPUT,inputdir,$BUCKET_INPUT_DIRECTORY,interval,$INTERVAL
```

The variables are the same as for the Spark job, plus `INTERVAL`, the checkpointing interval. Start with 10 minutes and tune it to your job.

The cluster template runs a bootstrap action from `s3://<bucket>/3-enrich/snowplow-event-recovery/snowplow-event-recovery-flink-<version>-bootstrap.sh`, and the playbook copies the job jar from the same directory. Copy both there before you run the job. The bootstrap action installs the Flink S3 file system plugin and a CloudWatch agent.

The CloudWatch agent publishes the job's metrics to the `snowplow/event-recovery` namespace, including:

- `taskmanager_container_XXXX_XXX__Process_0_events_recovered`: the number of recovered events.
- `taskmanager_container_XXXX_XXX__Process_0_events_failed`: the number of failed recovery attempts.
- `taskmanager_container_XXXX_XXX__Process_0_events_unrecoverable`: the number of unrecoverable events.
- `taskmanager_container_XXXX_XXX__Process_0_numRecordsIn`: the total number of events read.

Flink's `numRecordsOut` metric for the Kinesis sink doesn't reflect the number of records written to the stream.

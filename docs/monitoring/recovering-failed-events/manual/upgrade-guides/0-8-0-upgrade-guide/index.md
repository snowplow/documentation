---
title: "Event recovery 0.8.0 upgrade guide"
sidebar_label: "0.8.0 upgrade guide"
sidebar_position: -80
description: "Upgrade Snowplow Event Recovery to 0.8.0, covering the removal of the Spark job, the new EMR 7.13 setup for the Flink job, IAM permissions, and monitoring changes."
keywords: ["event recovery 0.8.0", "upgrade guide", "Spark to Flink migration", "EMR 7.13"]
date: "2026-11-09"
---

Version 0.8.0 makes the Flink job the only way to recover [failed events](/docs/fundamentals/failed-events/index.md) on AWS, and moves it to a current EMR release. This guide covers what you need to change if you run recoveries with the Spark job, or with the Flink job from version 0.7.x or earlier.

Recovery configurations don't change. Configurations that work with 0.7.x work with 0.8.0.

## Breaking changes

Version 0.8.0 changes how you run recoveries on AWS, and changes the license.

### New license

Since version 0.8.0, Snowplow Event Recovery uses the [Snowplow Limited Use License](/limited-use-license-1.1/) ([FAQ](/docs/licensing/limited-use-license-faq/index.md)).

### Spark job removed

The Spark job was deprecated in 0.6.0, and 0.8.0 removes it. Version 0.7.2 is the last release that includes it. To run recoveries on AWS, use the [Flink job](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md). See [Migrate from the Spark job](#migrate-from-the-spark-job).

### New EMR release for the Flink job

The Flink job runs on Flink 1.20, and needs EMR 7.13 with Java 11. The cluster configuration from 0.7.x doesn't work with 0.8.0. See [Update your EMR configuration](#update-your-emr-configuration).

### CloudWatch metrics removed

The 0.7.x bootstrap action installed a CloudWatch agent that published the job's metrics to the `snowplow/event-recovery` namespace. Version 0.8.0 has no bootstrap action, so these metrics are no longer published. Any dashboards or alarms based on them stop receiving data. See [Monitoring](/docs/monitoring/recovering-failed-events/manual/monitoring/index.md#monitor-the-flink-job-on-aws) for the summary and metrics that 0.8.0 provides.

### Checkpointing no longer used

The 0.7.x templates turned on checkpointing with the `interval` variable. Checkpointing is not supported in 0.8.0, and the templates no longer use it. If a run fails, run it again from the start. See [Understand delivery and reruns](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md#understand-delivery-and-reruns).

## Migrate from the Spark job

Use the [0.8.0 dataflow-runner templates](https://github.com/snowplow-incubator/snowplow-event-recovery/tree/0.8.0/.dataflow-runner) `flink-cluster.json.tmpl` and `flink-playbook.json.tmpl` in place of `spark-cluster.json.tmpl` and `spark-playbook.json.tmpl`. The templates take the same variables as the Spark templates, plus `assetsBucket`. See [Run the job on EMR](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md#run-the-job-on-emr) for the full command.

If you run the job with your own command line, rather than the templates, the Flink job accepts the Spark job's argument names `--failedOutput`, `--unrecoverableOutput`, `--batchSize`, and `--directoryOutput`. You need to replace `spark-submit` with `flink run -m yarn-cluster -sae`, and run it on a cluster that meets the [cluster requirements](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md#cluster-requirements).

Update any monitoring that relies on the Spark job's `event-recovery.driver.summary` metrics. See [Monitoring](/docs/monitoring/recovering-failed-events/manual/monitoring/index.md#monitor-the-flink-job-on-aws) for what the Flink job reports.

## Update your EMR configuration

If you run the Flink job with the dataflow-runner templates, download the [0.8.0 templates](https://github.com/snowplow-incubator/snowplow-event-recovery/tree/0.8.0/.dataflow-runner) and make these changes to your `run-transient` command:

- Add the `assetsBucket` variable, set to the Snowplow hosted assets bucket for your region, for example `snowplow-hosted-assets-eu-central-1`. In 0.7.x, the playbook copied the jar from your own `bucket`.
- Remove the `interval` variable
- Set `version` to `0.8.0`

If you maintain your own cluster configuration, compare it with the templates. The main differences from 0.7.x are:

| Setting | 0.7.x | 0.8.0 |
|---|---|---|
| EMR release | `6.9.0` | `7.13.0` |
| Instance types | `m4.large` | `m5.xlarge` |
| Java | `/usr/lib/jvm/java-11-amazon-corretto.x86_64`, set in `hadoop-env` and by the bootstrap action | `/usr/lib/jvm/jre-11`, set in `hadoop-env` and in `env.java.home`, `containerized.master.env.JAVA_HOME`, and `containerized.taskmanager.env.JAVA_HOME` in `flink-conf` |
| Bootstrap action | Installs the S3 file system plugin and the CloudWatch agent | None |
| `flink run` options | `-m yarn-cluster` | `-m yarn-cluster -sae` |
| `client.heartbeat.timeout` | Not set | `3650d` |
| Checkpointing | `--checkpoint-interval` and `--checkpoint-dir` | Not used |
| StatsD metrics reporter | Configured in `flink-conf` | Not configured |

:::warning[Remove the bootstrap action]
If you keep the 0.7.x bootstrap action on EMR 7.13, the cluster fails to start. EMR 7.13's Flink already includes the S3 file system plugin that the bootstrap action installed, and a second copy stops the JobManager with `Delegation token provider with service name s3-hadoop has multiple implementations`.
:::

The [cluster requirements](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md#cluster-requirements) explain why each of these settings is needed.

## Check permissions and inputs

Whether you're migrating from the Spark job or upgrading the Flink job, check these two things before your first 0.8.0 run.

### Check IAM permissions

The Flink job needs `kinesis:PutRecords` on the output stream. If your cluster uses `EMR_EC2_DefaultRole`, it doesn't have this permission, and the job retries indefinitely without making progress. See [Grant permissions](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md#grant-permissions) for the full list.

### Check input paths

The Flink job doesn't expand globs in `--input`. If your input path ends with `*`, replace it with the directory, for example `s3a://bucket/path/` instead of `s3a://bucket/path/*`. The job reads directories recursively.

## Other changes

These changes don't need any action for most users:

- Command line tool: the `run` command needs Java 21 or later. The `--enrichments` option only accepts enrichments that don't need external resources, and fails with an error for any others. The `validate` command reads the file passed to `--resolver`.
- Beam job: the Docker image runs on Java 11. The job's arguments haven't changed.
- File output for the Flink job: the Flink job can write recovered events to files with `--directory-output`, as the Spark job could with `--directoryOutput`. See [Test a configuration with a dry run](/docs/monitoring/recovering-failed-events/manual/running/flink/index.md#test-a-configuration-with-a-dry-run).

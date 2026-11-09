---
title: "Run event recovery on AWS with Flink"
date: "2020-04-14"
sidebar_position: 10
sidebar_label: "AWS - Flink"
description: "Run the event recovery Flink job on Amazon EMR to recover failed events from S3 into a Kinesis stream."
keywords: ["Flink event recovery", "EMR Flink recovery", "AWS event recovery", "Kinesis recovery"]
---

The Flink job reads [failed events](/docs/fundamentals/failed-events/index.md) from S3, applies your recovery configuration, and writes the recovered events to a Kinesis stream. Events that the configuration can't fix are written back to S3, split into failed and unrecoverable.

Use the Flink job for pipelines running on AWS. For pipelines on GCP, use the [Beam job](/docs/monitoring/recovering-failed-events/manual/running/gcp-beam/index.md).

This page describes version 0.8.0. If you're upgrading from an earlier version, or from the Spark job, read the [0.8.0 upgrade guide](/docs/monitoring/recovering-failed-events/manual/upgrade-guides/0-8-0-upgrade-guide/index.md) first.

## Run the job on EMR

The job runs as a step on a transient EMR cluster. The simplest way to start one is with [dataflow-runner](https://github.com/snowplow/dataflow-runner), using the [reference templates](https://github.com/snowplow-incubator/snowplow-event-recovery/tree/0.8.0/.dataflow-runner) `flink-cluster.json.tmpl` and `flink-playbook.json.tmpl`.

Download both templates and run:

```bash
dataflow-runner run-transient \
  --emr-config flink-cluster.json.tmpl \
  --emr-playbook flink-playbook.json.tmpl \
  --vars bucket,$BUCKET,inputdir,$INPUT_DIRECTORY,assetsBucket,$ASSETS_BUCKET,version,0.8.0,region,$AWS_REGION,subnet,$AWS_SUBNET,role,$AWS_IAM_ROLE,keypair,$AWS_KEYPAIR,client,$JOB_OWNER,output,$KINESIS_OUTPUT,config,$RECOVERY_CONFIG,resolver,$IGLU_RESOLVER
```

Where:

- `BUCKET`: the S3 bucket that holds the failed events to recover. The job also writes its failed and unrecoverable outputs and the EMR logs to this bucket, under `failed/`, `unrecoverable/`, and `logs/`.
- `INPUT_DIRECTORY`: the path in `BUCKET` to read failed events from, starting with `/`, for example `/partitioned/enrichment_failures/`
- `ASSETS_BUCKET`: the Snowplow hosted assets bucket that holds the job jar. Use `snowplow-hosted-assets` in `eu-west-1`, or `snowplow-hosted-assets-<region>` in other regions, for example `snowplow-hosted-assets-eu-central-1`.
- `AWS_REGION`: the region to run the cluster in, for example `eu-central-1`
- `AWS_SUBNET`: the subnet to run the cluster in
- `AWS_IAM_ROLE`: the EC2 instance profile for the cluster nodes. See [Grant permissions](#grant-permissions) for what it needs.
- `AWS_KEYPAIR`: the EC2 key pair for the cluster nodes
- `JOB_OWNER`: a tag that marks the owner of the job
- `KINESIS_OUTPUT`: the name of the Kinesis stream to write recovered events to. This is usually your pipeline's raw stream.
- `RECOVERY_CONFIG`: the Base64-encoded recovery configuration, as described in [Configuration](/docs/monitoring/recovering-failed-events/manual/configuration/index.md)
- `IGLU_RESOLVER`: the Base64-encoded Iglu resolver configuration, as described in [Run event recovery jobs](/docs/monitoring/recovering-failed-events/manual/running/index.md#encode-configuration)

The playbook copies the jar to the cluster and runs it with:

```bash
flink run -m yarn-cluster -sae /home/hadoop/event-recovery.jar \
  --input s3a://<bucket><inputdir> \
  --output <stream> \
  --failed s3a://<bucket>/failed \
  --unrecoverable s3a://<bucket>/unrecoverable \
  --region <region> \
  --resolver <base64> \
  --config <base64>
```

`-m yarn-cluster` starts a Flink cluster on YARN for this job only, and waits for the job to finish. The EMR step fails when the job fails, and the step's log contains either the run summary or the failure message. `-sae` shuts down that Flink cluster if the `flink run` client stops, for example when you cancel the step, so that the job doesn't keep writing to Kinesis.

### Cluster requirements

The templates set up the cluster as follows. If you build your own cluster configuration, keep these settings:

- EMR release `7.13.0` with the `Flink` application: this release ships Flink 1.20.0, the version the job is built against. EMR 7.9 to 7.12 also ship Flink 1.20.0, but AWS lists a known issue in those releases where step logs may not be uploaded to S3 for steps that run longer than three hours, and the step log contains the job's summary.
- Java 11: EMR 7 runs Flink on Java 17 by default, which can't run the job. Tasks fail with `IllegalArgumentException: too many arguments` in `scala.runtime.LambdaDeserializer`. The templates set `env.java.home`, `containerized.master.env.JAVA_HOME`, and `containerized.taskmanager.env.JAVA_HOME` in `flink-conf`, and `JAVA_HOME` in `hadoop-env`, all to `/usr/lib/jvm/jre-11`.
- No bootstrap action: EMR 7.13's Flink already includes the S3 file system plugin. Installing a second copy stops the JobManager with `Delegation token provider with service name s3-hadoop has multiple implementations`.
- A raised `client.heartbeat.timeout`: on EMR 7.13, the JobManager rejects the heartbeats that `flink run -sae` sends, and cancels any job that runs longer than about four minutes. The templates set `client.heartbeat.timeout` to `3650d` in `flink-conf`.
- Instance types that EMR 7.13 supports: the templates use `m5.xlarge`. EMR 7.13 doesn't support any m4 type, and a cluster on an unsupported type fails to start with "application provisioning timed out". To list the supported types for your region, run `aws emr list-supported-instance-types --release-label emr-7.13.0`.

The templates also set `classloader.check-leaked-classloader` to `false`. This hides a harmless `Trying to access closed classloader` stack trace that the client prints after each run.

## Grant permissions

The cluster's instance profile, `AWS_IAM_ROLE`, needs:

- `kinesis:DescribeStream` and `kinesis:PutRecords` on the output stream
- `kms:GenerateDataKey` on the stream's key, if the stream is encrypted
- S3 list and read access on the input path
- S3 write access on the failed, unrecoverable, and directory output paths

:::warning[The default EMR role can't write to Kinesis]
AWS's managed `AmazonElasticMapReduceforEC2Role` policy, used by `EMR_EC2_DefaultRole`, grants `kinesis:DescribeStream` and the single-record `kinesis:PutRecord`, but not `kinesis:PutRecords`.

Before the run starts, the job checks that it can describe the output stream, and fails immediately if it can't. This check can't tell whether the role is allowed to write to the stream. If `kinesis:PutRecords` or `kms:GenerateDataKey` is missing, the job retries indefinitely and makes no progress. In that case, `numRecordsOutErrors` on the `kinesis: Writer` operator keeps rising, and the task logs show `AccessDeniedException` or `KMSAccessDeniedException`. Stop the run and fix the permissions.
:::

## Configure the job

The job accepts the following arguments:

| Argument | Description |
|---|---|
| `--input` | Required. The S3 path to read failed events from, using the `s3a://` scheme. |
| `--output` | The name of the Kinesis stream to write recovered events to. |
| `--directory-output` | A path to write recovered events to as files, instead of or as well as Kinesis. |
| `--failed` | The path for failed events that the configuration didn't fix. Defaults to `<input>/unrecovered`. |
| `--unrecoverable` | The path for failed events that can never be recovered. Defaults to `<failed>/unrecoverable` if `--failed` is set, otherwise `<input>/unrecoverable`. |
| `--region` | Required. The region of the Kinesis stream. |
| `--resolver` | Required. The Base64-encoded Iglu resolver configuration. |
| `--config` | Required. The Base64-encoded recovery configuration. |
| `--batch-size` | The number of records in each Kinesis `PutRecords` call, between 1 and 500. |
| `--max-buffered` | The number of records the Kinesis sink buffers before applying backpressure. Defaults to 10000. |

You must set `--output`, `--directory-output`, or both.

The job also accepts the argument names used by the former Spark job: `--failedOutput` for `--failed`, `--unrecoverableOutput` for `--unrecoverable`, `--batchSize` for `--batch-size`, and `--directoryOutput` for `--directory-output`. The Beam job uses the first two of these names as well.

### Choose the input

`--input` is a directory or a single file. The job reads a directory recursively, including subdirectories. It skips hidden files, whose names start with `.` or `_`, and it skips its own failed, unrecoverable, and directory outputs. This means that if you run the job again on the same input, it doesn't pick up the failed events from the previous run.

The job doesn't expand globs, so a path such as `s3a://bucket/path/*` doesn't work. Use `s3a://bucket/path/` instead.

### Test a configuration with a dry run

To check what a recovery produces before sending events to your pipeline, use `--directory-output` without `--output`. The job then writes each recovered event as a line of JSON, keyed by the Collector payload's field names, such as `path`, `querystring`, `body`, and `headers`. The files are named `part-<id>-<n>.json`, in one directory per hour: `<directory>/<yyyy-MM-dd--HH>/`. If a run recovers no events, it writes no files.

To test a configuration against a small sample on your own machine, use the [command line tool](/docs/monitoring/recovering-failed-events/manual/testing/index.md) instead.

## Understand delivery and reruns

The job retries records that Kinesis throttles until they're written, and never drops a record. When a run finishes successfully, every recovered event is in the output stream or directory. To track a run while it's in progress, see [Monitoring](/docs/monitoring/recovering-failed-events/manual/monitoring/index.md#monitor-the-flink-job-on-aws).

If a run fails, Flink doesn't restart it. To recover the events, run the job again on the same input. The new run starts from the beginning, so it sends again any events that the failed run had already written to Kinesis. Your pipeline might therefore receive some events twice.

:::note[Checkpointing is not supported]
The job has `--checkpoint-interval` and `--checkpoint-dir` arguments, which turn on Flink checkpointing so that a failed run can be resumed with `flink run -s <checkpoint>`. Don't use them. On EMR 7.13, resuming from some checkpoints fails every time because of [FLINK-25920](https://issues.apache.org/jira/browse/FLINK-25920). A resumed run also sends again the events written after its checkpoint, so it doesn't avoid duplicates.
:::

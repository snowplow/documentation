---
title: "Run event recovery on Flink"
date: "2020-04-14"
sidebar_position: 10
sidebar_label: "Flink"
description: "Deploy event recovery jobs on Apache Flink using EMR with fault tolerance and CloudWatch metrics monitoring."
keywords: ["Flink event recovery", "EMR Flink recovery"]
---

The Flink job reads bad rows from an S3 location and stores the recovered payloads in Kinesis, unrecovered and unrecoverable in other S3 buckets.

#### Building

To build the fat jar, run:

```bash
sbt flink/assembly
```

#### Running

Event recovery jobs are usually ran using our [dataflow-runner](https://github.com/snowplow/dataflow-runner) application. A configuration template for running is [available in the repository](https://github.com/snowplow-incubator/snowplow-event-recovery/blob/master/.dataflow-runner).

To run a transient EMR cluster and execute the job using the templates, download [Flink dataflow-runner templates](https://github.com/snowplow-incubator/snowplow-event-recovery/blob/master/.dataflow-runner) from the repository and run:

```bash
dataflow-runner run-transient \
  --emr-playbook flink-playbook.json.tmpl \
  --emr-config flink-cluster.json.tmpl \
  --vars bucket,$BUCKET_INPUT,region,$AWS_REGION,subnet,$AWS_SUBNET,role,$AWS_IAM_ROLE,keypair,$AWS_KEYPAIR,client,$JOB_OWNER,version,$RECOVERY_VERSION,config,$RECOVERY_CONFIG,resolver,$IGLU_RESOLVER,output,$KINESIS_OUTPUT,inputdir,$BUCKET_INPUT_DIRECTORY,interval,$INTERVAL
  ```
Where:
- `BUCKET_INPUT` - S3 bucket containing bad events to be recovered (eg. geoffs-bad-events)
- `BUCKET_INPUT_DIRECTORY` - directory in the `BUCKET_INPUT` to use as the source for bad events
- `AWS_REGION` - region in which the job is being ran (eg. eu-central-1)
- `AWS_SUBNET` - network subnet to run the job in (eg. subnet-435010347a21886ab)
- `AWS_IAM_ROLE` - AWS IAM role to assume while running the job (eg. geoffs-recovery-role)
- `AWS_KEYPAIR` - AWS EC2 key pair to use for the instances (eg. geoffs-keypair)
- `JOB_OWNER` - tag to use to mark the owner of the job (eg. goeff)
- `RECOVERY_VERSION` - application version (eg. 0.6.0)
- `RECOVERY_CONFIG` - recovery job config as described in [Configuration](../../configuration/index.md)
- `IGLU_RESOLVER` - iglu resolver configuration as described in  [Configuration](../../configuration/index.md)
- `KINESIS_OUTPUT` - Kinesis stream to output recovered events to
- `INTERVAL` - job checkpointing interval (we recommend starting with 10 minutes and tuning to your job's characteristics)


The job uses [checkpointing](https://nightlies.apache.org/flink/flink-docs-release-1.15/docs/dev/datastream/fault-tolerance/checkpointing/) to allow for job restarts. Kinesis connector which is a part of the checkpointing mechanism [guarantees](https://nightlies.apache.org/flink/flink-docs-release-1.15/docs/connectors/datastream/kinesis/#kinesis-sinks-and-fault-tolerance) at-least-once delivery semantics and provides backpressure to the job.

#### Monitoring

EMR Flink Job emits a wide range of metrics through Cloudwatch Agent which is installed during cluster bootstrap using a provided script (see project repo's dataflow-runner directory). Custom metrics include:
- number of unrecoverable events in the run: `taskmanager_container_XXXX_XXX__Process_0_events_unrecoverable`
- number of failed recovery attempts: `taskmanager_container_XXXX_XXX__Process_0_events_failed`
- number of recovered events: `taskmanager_container_XXXX_XXX__Process_0_events_recovered`
- total number of events submitted for processing: `taskmanager_container_XXXX_XXX__Process_0_numRecordsIn`

The metrics are delivered to `snowplow/event-recovery` Cloudwatch namespace.

Given a one-second aggregation in Cloudwatch the diagram should show an always increasing metrics that should balance themselves up to total sum.

:::note
Flink's `numRecordsOut` metric for sinks does not reflect an actual number of records saved in the sink.
:::

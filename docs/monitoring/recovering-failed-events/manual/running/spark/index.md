---
title: "Run event recovery on Spark (legacy)"
date: "2020-04-14"
sidebar_position: 20
sidebar_label: "Spark (legacy)"
description: "Deploy event recovery jobs on Apache Spark using EMR and dataflow-runner."
keywords: ["Spark event recovery", "EMR recovery job"]
---

:::danger
Spark module is now deprecated. Kinesis integration is not as reliable as we'd like. We suggest migrating to [Flink module](../flink/index.md).
:::

The Spark job reads bad rows from an S3 location and stores the recovered payloads in Kinesis, unrecovered and unrecoverable in other S3 buckets.

#### Building

To build the fat jar, run:

```bash
sbt spark/assembly
```

#### Running

Event recovery jobs are usually ran using our [dataflow-runner](https://github.com/snowplow/dataflow-runner) application. A configuration templates for running is [available in the repository](https://github.com/snowplow-incubator/snowplow-event-recovery/blob/master/.dataflow-runner).

To run a transient EMR cluster and execute the job using the templates, download [Spark dataflow-runner templates](https://github.com/snowplow-incubator/snowplow-event-recovery/blob/master/.dataflow-runner) from the repository and run:

```bash
dataflow-runner run-transient \
  --emr-playbook spark-playbook.json.tmpl \
  --emr-config spark-cluster.json.tmpl \
  --vars bucket,$BUCKET_INPUT,region,$AWS_REGION,subnet,$AWS_SUBNET,role,$AWS_IAM_ROLE,keypair,$AWS_KEYPAIR,client,$JOB_OWNER,version,$RECOVERY_VERSION,config,$RECOVERY_CONFIG,resolver,$IGLU_RESOLVER,output,$KINESIS_OUTPUT,inputdir,$BUCKET_INPUT_DIRECTORY
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

---
title: "Spark transformer for batch processing"
sidebar_label: "Spark transformer"
date: "2022-04-04"
sidebar_position: 10
description: "Transform enriched Snowplow data in batches using Spark on EMR with support for deduplication and wide row or shredded output."
keywords: ["spark transformer", "batch transformation", "emr spark", "deduplication", "rdb shredder"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::info

For a high-level overview of the Transform process, see [Transforming enriched data](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md). For guidance on picking the right `transformer` app, see [How to pick a transformer](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md#how-to-pick-a-transformer).

:::

The Spark-based transformer is a batch job designed to be deployed in an EMR cluster and process a bounded data set stored on S3.

In order to run it, you will need:

- the `snowplow-transformer-batch` jar file (from version 3.0.0 this replaces the `snowplow-rdb-shredder` asset)
- configuration files for the jar file
- an EMR cluster specification
- a way to spin up an EMR cluster and submit a job to it.

You can use any suitable tool to periodically submit the transformer job to an EMR cluster. We recommend you use our purpose-built [Dataflow Runner](https://github.com/snowplow/dataflow-runner) tool. All the examples below assume that Dataflow Runner is being used. Refer to the app's [documentation](/docs/api-reference/dataflow-runner/index.md) for more details.

## Downloading the artifact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

It's also available in several S3 buckets that are accessible to an EMR cluster:


<CodeBlock language="text">{
`s3://snowplow-hosted-assets/4-storage/transformer-batch/snowplow-transformer-batch-${versions.rdbLoader}.jar
\n
-- or --
\n
s3://snowplow-hosted-{{ region }}/4-storage/transformer-batch/snowplow-transformer-batch-${versions.rdbLoader}.jar`
}</CodeBlock>

where `region` is one of `us-east-1`, `us-east-2`, `us-west-1`, `us-west-2`, `eu-central-1`, `eu-west-2`, `ca-central-1`, `sa-east-1`, `ap-southeast-1`, `ap-southeast-2`, `ap-northeast-1`, `ap-northeast-2`, or `ap-south-1`. Pick the region of your EMR cluster.

## Configuring the EMR cluster

:::warning

Starting from version `5.5.0`, batch transformer requires to use Java 11 on EMR ([default is Java 8](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/configuring-java8.html)). See the `bootstrapActionConfigs` section in the configuration below.

:::

Here's an example of an EMR cluster config file that can be used with Dataflow Runner:

```json
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-1-0",
  "data": {
    "name": "RDB Transformer",
    "region": "eu-central-1",
    "logUri": "s3://com-acme/logs/",
    "credentials": {
      "accessKeyId": "env",
      "secretAccessKey": "env"
    },
    "roles": {
      "jobflow": "EMR_EC2_DefaultRole",
      "service": "EMR_DefaultRole"
    },
    "ec2": {
      "amiVersion": "6.2.0",
      "keyName": "ec2-key-name",
      "location": {
        "vpc": {
          "subnetId": "subnet-id"
        }
      },
      "instances": {
        "master": {
          "type": "m4.large",
          "ebsConfiguration": {
            "ebsOptimized": true,
            "ebsBlockDeviceConfigs": []
          }
        },
        "core": {
          "type": "r4.xlarge",
          "count": 1
        },
        "task": {
          "type": "m4.large",
          "count": 0,
          "bid": "0.015"
        }
      }
    },
    "tags": [],
    "bootstrapActionConfigs": [
      {
        "name": "Use Java 11",
        "scriptBootstrapAction": {
          "path": "s3://<bucket>/<path>/emr-bootstrap-java-11.sh",
          "args": []
        }
      }
    ],
    "configurations": [
      {
        "classification": "core-site",
        "properties": {
          "Io.file.buffer.size": "65536"
        },
        "configurations": []
      },
      {
        "classification": "yarn-site",
        "properties": {
          "yarn.nodemanager.resource.memory-mb": "57344",
          "yarn.scheduler.maximum-allocation-mb": "57344",
          "yarn.nodemanager.vmem-check-enabled": "false"
        },
        "configurations": []
      },
      {
        "classification": "spark",
        "properties": {
          "maximizeResourceAllocation": "false"
        },
        "configurations": []
      },
      {
        "classification": "spark-defaults",
        "properties": {
          "spark.executor.memory": "7G",
          "spark.driver.memory": "7G",
          "spark.driver.cores": "3",
          "spark.yarn.driver.memoryOverhead": "1024",
          "spark.default.parallelism": "24",
          "spark.executor.cores": "1",
          "spark.executor.instances": "6",
          "spark.yarn.executor.memoryOverhead": "1024",
          "spark.dynamicAllocation.enabled": "false"
        },
        "configurations": []
      }
    ],
    "applications": [
      "Hadoop",
      "Spark"
    ]
  }
}
```

You will need to replace `<bucket>` and `<path>` (in the `bootstrapActionConfigs` section) according to where you placed `emr-bootstrap-java-11.sh`. The content of this file should be as follows:

```bash title="emr-bootstrap-java-11.sh"
#!/bin/bash

set -e

sudo update-alternatives --set java /usr/lib/jvm/java-11-amazon-corretto.x86_64/bin/java

exit 0

```

This is a typical cluster configuration for processing ~1.5GB of uncompressed enriched data.

You need to change the following settings with your own values:

- `region`: the AWS region of your EMR cluster
- `logUri`: the location of an S3 bucket where EMR logs will be written
- `ec2.keyName` (optional): The name of an EC2 key pair that you’ll use to shh into the EMR cluster
- `ec2.location.vpc.subnetId`: your VPN subnet ID.

## Configuring `snowplow-transformer-batch`

The transformer takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

An example of the minimal required config for the Spark transformer can be found [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/aws/transformer.batch.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/aws/transformer.batch.config.reference.hocon). For details about each setting, see the [configuration reference](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/spark-transformer/configuration-reference/index.md).

See [here](/docs/api-reference/iglu/iglu-resolver/index.md) for details on how to prepare the Iglu resolver file.

:::tip

All self-describing schemas for events processed by the transformer **must** be hosted on [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) 0.6.0 or above. [Iglu Central](/docs/api-reference/iglu/iglu-repositories/iglu-central/index.md) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority.

:::

## Running the Spark transformer

To run the transformer on EMR with Dataflow Runner, you need:

- the EMR cluster config (see [Configuring the EMR cluster](#configuring-the-emr-cluster) above)
- a Dataflow Runner playbook (a DAG with steps to be submitted to the EMR cluster).

### Preparing the Dataflow Runner playbook

A typical playbook can look like:

<CodeBlock language="json">{`
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/PlaybookConfig/avro/1-0-1",
  "data": {
    "region": "eu-central-1",
    "credentials": {
      "accessKeyId": "env",
      "secretAccessKey": "env"
    },
    "steps": [
      {
        "type": "CUSTOM_JAR",
        "name": "S3DistCp enriched data archiving",
        "actionOnFailure": "CANCEL_AND_WAIT",
        "jar": "/usr/share/aws/emr/s3-dist-cp/lib/s3-dist-cp.jar",
        "arguments": [
          "--src", "s3://com-acme/enriched/sink/",
          "--dest", "s3://com-acme/enriched/archive/run={{nowWithFormat "2006-01-02-15-04-05"}}/",
          "--s3Endpoint", "s3-eu-central-1.amazonaws.com",
          "--srcPattern", ".*",
          "--outputCodec", "gz",
          "--deleteOnSuccess"
        ]
      },
      {
        "type": "CUSTOM_JAR",
        "name": "RDB Transformer",
        "actionOnFailure": "CANCEL_AND_WAIT",
        "jar": "command-runner.jar",
        "arguments": [
          "spark-submit",
          "--class", "com.snowplowanalytics.snowplow.rdbloader.transformer.batch.Main",
          "--master", "yarn",
          "--deploy-mode", "cluster",
          "s3://snowplow-hosted-assets-eu-central-1/4-storage/transformer-batch/snowplow-transformer-batch-${versions.rdbLoader}.jar",
          "--iglu-config", "{{base64File "/home/snowplow/configs/snowplow/iglu_resolver.json"}}",
          "--config", "{{base64File "/home/snowplow/configs/snowplow/config.hocon"}}"
        ]
      }
    ],
    "tags": []
  }
}
`}</CodeBlock>

This playbook consists of two steps. The first one copies the enriched data to a dedicated directory, from which the transformer will read it. The second step is the transformer Spark job that transforms the data.

You need to change the following settings with your own values:

- `region`: the AWS region of the EMR cluster
- `"--src"`: the bucket in which your enriched data is sunk by Enrich
- `"--dest"`: the bucket in which the data for your enriched data lake lives.

**NOTE:** The `"--src"` and `"--dest"` settings above apply only to the `s3DistCp` step of the playbook. The source and destination buckets for the transformer step are configured via the `config.hocon` file.

### Submitting the job to EMR with Dataflow Runner

Here's an example of putting all of the above together on a transient EMR cluster:

```bash
$ ./dataflow-runner run-transient \
  --emr-config path/to/cluster.conig \
  --emr-playbook path/to/playbook
```

This will spin up the cluster with the above configuration, submit the steps from the playbook, and terminate the cluster once all steps are completed.

For more examples on running EMR jobs with Dataflow Runner, as well as details on cluster configurations and playbooks, see the app's [documentation](/docs/api-reference/dataflow-runner/index.md). It also details how you can submit steps to a persistent EMR cluster.

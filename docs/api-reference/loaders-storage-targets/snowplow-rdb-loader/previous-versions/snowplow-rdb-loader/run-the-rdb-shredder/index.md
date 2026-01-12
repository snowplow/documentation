---
title: "Run the RDB shredder 2.x"
sidebar_label: "Run the RDB shredder"
date: "2021-09-14"
sidebar_position: 40
description: "Run RDB Shredder 2.x on EMR with Dataflow Runner for transforming enriched events into shredded data for Redshift."
keywords: ["run rdb shredder", "emr shredder", "dataflow runner", "shredder execution", "rdb shredder 2.x"]
---

The RDB shredder is published as a jar file attached to the [github release page](https://github.com/snowplow/snowplow-rdb-loader/releases). We also push it to several S3 buckets, from where it is accessible to an EMR cluster:

```text
s3://snowplow-hosted-assets/4-storage/rdb-shredder/snowplow-rdb-shredder-{{ version }}.jar

-- or --

s3://snowplow-hosted-{{ region }}/4-storage/rdb-shredder/snowplow-rdb-shredder-{{ version }}.jar
```

where `region` is one of `us-east-1`, `us-west-1`, `us-west-2`, `sa-east-1`, `eu-central-1`, `ap-southeast-1`, `ap-southeast-2`, `ap-northeast-1`, `ap-south-1`, `us-east-2`, `ca-central-1`, `eu-west-2`, or `ap-northeast-2`.

### Dataflow Runner

You can use any suitable tool to periodically submit the Shredder job to EMR cluster. We recommend to use [Dataflow Runner](/docs/api-reference/dataflow-runner/index.md), here an example of cluster config:

```json
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-1-0",
  "data": {
    "name": "RDB Shredder",
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
            "ebsBlockDeviceConfigs": [

            ]
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
    "tags": [ ],
    "bootstrapActionConfigs": [ ],
    "configurations": [
      {
         "classification":"core-site",
         "properties":{
            "Io.file.buffer.size":"65536"
         },
         "configurations":[
   
         ]
      },
      {
         "classification":"yarn-site",
         "properties":{
            "yarn.nodemanager.resource.memory-mb":"57344",
            "yarn.scheduler.maximum-allocation-mb":"57344",
            "yarn.nodemanager.vmem-check-enabled":"false"
         },
         "configurations":[
   
         ]
      },
      {
         "classification":"spark",
         "properties":{
            "maximizeResourceAllocation":"false"
         },
         "configurations":[
   
         ]
      },
      {
         "classification":"spark-defaults",
         "properties":{
            "spark.executor.memory":"7G",
            "spark.driver.memory":"7G",
            "spark.driver.cores":"3",
            "spark.yarn.driver.memoryOverhead":"1024",
            "spark.default.parallelism":"24",
            "spark.executor.cores":"1",
            "spark.executor.instances":"6",
            "spark.yarn.executor.memoryOverhead":"1024",
            "spark.dynamicAllocation.enabled":"false"
         },
         "configurations":[
   
         ]
      }
   ],
    "applications": [ "Hadoop", "Spark" ]
  }
}
```

This is a typical cluster configuration for processing ~1.5GB of ungzipped enriched data.

You need to change following settings to match your configuration:

- `logUri` - your S3 bucket with logs
- `ec2.keyName` (optional) - EC2 SSH key name if you'll need to log-in to EMR cluster
- `ec2.location.vpc.subnetId` - your VPN subnet id

Here's a typical playbook:

```json
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
        "name": "RDB Shredder",
        "actionOnFailure": "CANCEL_AND_WAIT",
        "jar": "command-runner.jar",
        "arguments": [
            "spark-submit",
            "--class",
            "com.snowplowanalytics.snowplow.rdbloader.shredder.batch.Main",
            "--master", "yarn",
            "--deploy-mode", "cluster",
            "s3://snowplow-hosted-assets-eu-central-1/4-storage/rdb-shredder/snowplow-rdb-shredder-2.0.0.jar",
            "--iglu-config", "{{base64File "/home/snowplow/configs/snowplow/iglu_resolver.json"}}",
            "--config", "{{base64File "/home/snowplow/configs/snowplow/config.hocon"}}"
        ]
      }
    ],
    "tags": [ ]
  }
}
```

Here you'll need to set:

- `region`
- Paths to your enriched data sink (`--src`) and enriched data lake (`--dest`)

See the [configuration reference](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/rdb-shredder-configuration-reference/index.md) for a description of how to prepare the `config.hocon` file..

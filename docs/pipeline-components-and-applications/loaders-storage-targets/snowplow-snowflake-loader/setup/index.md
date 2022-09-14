---
title: "Setup"
date: "2020-04-25"
sidebar_position: 0
---

Snowflake Loader supports 3 authentication options: storage integration, IAM role and IAM credentials.

#### Setting up a storage integration

This section is only for users loading data into Snowflake using `storage integration` auth mechanism.

Snowflake [highly recommend](https://docs.snowflake.com/en/user-guide/data-load-s3-config.html#option-1-configuring-a-snowflake-storage-integration) this option, which avoids the need to supply AWS IAM credentials when creating stages or loading data.

To setup an integration, we recommend following [Snowflake's tutorial](https://docs.snowflake.com/en/user-guide/data-load-s3-config.html#option-1-configuring-a-snowflake-storage-integration) up to [step 6](https://docs.snowflake.com/en/user-guide/data-load-s3-config.html#step-6-create-an-external-stage) so that you

1. create an IAM policy with required permissions
2. create an IAM role using the policy created at step 1
3. create a storage integration at Snowflake
4. update trust policy of the IAM role

Now you can configure your loader where top level `auth` looks like following as an example:

```json
"auth": {
    "integrationName": "SNOWPLOW_S3_INTEGRATION"
}
```

Don't forget to use [1-0-3](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-3) version of configuration schema.

Assuming that loader configuration is updated, you can run loader's setup subcommand to have remaining entities created automatically.

#### Setting up a load role

This section is only for users loading data into Snowflake using `roleArn`/`sessionDuration` auth mechanism. With this mechanism, Snowflake Loader sends `AssumeRole` request to AWS [Security Token Service](http://docs.aws.amazon.com/STS/latest/APIReference/Welcome.html) and it returns temporary credentials (with lifespan equal `sessionDuration` of seconds), which then passed with [COPY INTO](https://docs.snowflake.net/manuals/sql-reference/sql/copy-into-table.html) statement, allowing Snowflake to aunthenticate itself in your account. This is similar to what RDB Loader does for loading Redshift, main difference is that Snowflake Loader authenticates third-party AWS account (belonging to Snowflake Computing) to read data from S3.

First step is to [create necessary AWS IAM entities](https://docs.snowflake.net/manuals/user-guide/data-load-s3-config.html) restricted only to reading data from S3.

Create following IAM Policy, called `SnowflakeLoadPolicy`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:GetAccelerateConfiguration",
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR-SNOWFLAKE-BUCKET/prefix/*"
            ]
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR-SNOWFLAKE-BUCKET"
            ]
        }
    ]
}
```

This policy allows read-only access to your S3 bucket.

Next, you need to create an IAM role that will provide credentials.

1. `IAM -> Roles -> Create role -> AWS service -> EC2`
2. Attach just created `SnowflakeLoadPolicy`
3. `Trust relationships -> Edit Trust relationship`
4. Insert following document (replacing 123456789123 with your account id and EMR_EC2_DefaultRole with your EMR role) and save it:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789123:role/EMR_EC2_DefaultRole"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

1. Now save Role ARN as your `roleArn` in target configuration

#### [](https://github.com/snowplow-incubator/snowplow-snowflake-loader/wiki/Setup-Guide#setting-up-snowflake)

#### Setting up Snowflake

Snowflake Loader provides quick setup action that automatically creates following entities:

- `atomic` database schema
- `atomic.events` table to store enriched events
- [File format](https://docs.snowflake.net/manuals/user-guide/data-load-create-file-format.html) - entity to describe how Snowplow enriched data should be processed
- [External Stage](https://docs.snowflake.net/manuals/user-guide/data-load-create-stage.html#external-locations) in `atomic` schema - reference to S3 path; output of Snowplow Snowflake Transformer. Can optionally contain AWS credentials
- [Virtual Warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html) - computing entity of Snowflake; smallest (X-Small) be default

All above safely can have default settings. Warehouse can be scaled up manually.

(Optional) If you want to use storage integration, you should create it before running setup command. Check the related section of this page to see instructions.

Two things you need to create manually are Snowflake database and DynamoDB table. After database is created, you can run `setup`.

To do this you need to use `setup` CLI action for Snowflake Loader:

```bash
$ wget https://github.com/snowplow-incubator/snowplow-snowflake-loader/releases/download/0.9.0/snowplow-snowflake-loader-0.9.0.jar

$ java -jar snowplow-snowflake-loader-0.9.0.jar \
    setup \
    --config /path/to/config.json \
    --resolver /path/to/resolver.json 

# OR

$ java -jar snowplow-snowflake-loader-0.9.0.jar \
    setup \
    --base64
    --config $(cat /path/to/config.json | base64 -w 0) \
    --resolver $(cat /path/to/resolver.json | base64 -w 0)
```

#### Storing credentials in stage

Apart from using AWS Role and static credentials, it is also possible to save credentials in Snowflake stage.

This can be added manually (if stage already exists). Snowflake Console -> Databases -> YOUR DB -> Stages -> Edit YOUR STAGE Or during `setup` from local machine (if stage doesn't exist). If you add credentials to config, run `setup` - they'll be added to stage and after than can be safely removed from config

#### DynamoDB

To use DynamoDB table as processing manifest you need to create table with partition key `RunId` with string type and fill `manifest` property in configuration with newly created table name.

#### Snowflake

Snowplow data in Snowflake is stored in single fat table called `atomic.events` (schema can be changed, table name cannot).

Initial `atomic.events` DDL for Snowflake can be found in [atomic-def.sql](https://github.com/snowplow-incubator/snowplow-snowflake-loader/blob/master/loader/src/main/resources/sql/atomic-def.sql).

#### Dataflow Runner

Dataflow Runner used to run Snowplow Snowflake Transformer Spark job on EMR cluster. It also can run loader.

EMR Cluster has default configuration. Only `ec2.keyName` and `logUri` must be changed. Everything else is optional. Edit and save below as `cluster.json`:

```json
{
   "schema":"iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-1-0",
   "data":{
      "name":"dataflow-runner - snowflake transformer",
      "logUri":"s3://snowplow-snowflake-test/logs/",
      "region":"us-east-1",
      "credentials":{
         "accessKeyId":"env",
         "secretAccessKey":"env"
      },
      "roles":{
         "jobflow":"EMR_EC2_DefaultRole",
         "service":"EMR_DefaultRole"
      },
      "ec2":{
         "amiVersion":"6.4.0",
         "keyName":"key-name",
         "location":{
            "vpc":{
               "subnetId":null
            }
         },
         "instances":{
            "master":{
               "type":"m2.xlarge"
            },
            "core":{
               "type":"m2.xlarge",
               "count":1
            },
            "task":{
               "type":"m1.medium",
               "count":0,
               "bid":"0.015"
            }
         }
      },
      "tags":[ ],
      "bootstrapActionConfigs":[ ],
      "configurations":[
         {
            "classification":"core-site",
            "properties":{
               "Io.file.buffer.size":"65536"
            }
         },
         {
            "classification":"mapred-site",
            "properties":{
               "Mapreduce.user.classpath.first":"true"
            }
         },
         {
            "classification":"yarn-site",
            "properties":{
               "yarn.resourcemanager.am.max-attempts":"1"
            }
         },
         {
            "classification":"spark",
            "properties":{
               "maximizeResourceAllocation":"true"
            }
         }
      ],
      "applications":[ "Hadoop", "Spark" ]
   }
}
```

Edit and save below as `playbook.json`:

```json
{
   "schema":"iglu:com.snowplowanalytics.dataflowrunner/PlaybookConfig/avro/1-0-1",
   "data":{
      "region":"{{.awsRegion}}",
      "credentials":{
         "accessKeyId":"env",
         "secretAccessKey":"env"
      },
      "steps":[
         {
            "type":"CUSTOM_JAR",
            "name":"Snowflake Transformer",
            "actionOnFailure":"CANCEL_AND_WAIT",
            "jar":"command-runner.jar",
            "arguments":[
               "spark-submit",

               "--deploy-mode",
               "cluster",
               "--class",
               "com.snowplowanalytics.snowflake.transformer.Main",

               "s3://snowplow-hosted-assets/4-storage/snowflake-loader/snowplow-snowflake-transformer-0.9.0.jar",

               "--config",
               "{{base64File "./config.json"}}",
               "--resolver",
               "{{base64File "./resolver.json"}}",
               "--events-manifest",
               "{{base64File "./events_manifest.json"}}"
            ]
         },

         {
            "type":"CUSTOM_JAR",
            "name":"Snowflake Loader",
            "actionOnFailure":"CANCEL_AND_WAIT",
            "jar":"s3://snowplow-hosted-assets/4-storage/snowflake-loader/snowplow-snowflake-loader-0.9.0.jar",
            "arguments":[
               "load",
               "--base64",
               "--config",
               "{{base64File "./config.json"}}",
               "--resolver",
               "{{base64File "./resolver.json"}}"
            ]
         }
      ],
      "tags":[ ]
   }
}
```

Bear in mind that `--events-manifest` option is necessary only if you use [cross-batch deduplication](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-snowflake-loader/cross-batch-deduplication/index.md), you can omit it otherwise.

To run above configuration you can use following command:

```bash
$ dataflow-runner run-transient --emr-config cluster.json --emr-playbook playbook.json
```

This will start both Transformer and Loader on EMR cluster.

Note that loader also can be launched on local machine, with paths specified for `--config` and `--resolver` - you'll have to omit `--base64` for that.

#### Staging enriched data

Snowflake Transformer (and Loader) expects certain structure in `stageUrl`.

```bash
s3://snowplow-data/enriched/archive/
  + run=2020-12-01-16-30-50
  + run=2020-12-01-17-31-02
  + run=2020-12-01-18-30-55
```

If your pipelilne uses EmrEtlRunner, those folders will be created as part of data archivation. However without EmrEtlRunner, you need to create this folder structure yourself before running Snowflake Transformer and Loader. We recommend to create this structure with auxiliary S3DistCp step _before_ transformer (add as first step in `playbook.json`):

```json
        {
            "type": "CUSTOM_JAR",
            "name": "Staging enriched data",
            "actionOnFailure": "CANCEL_AND_WAIT",
            "jar": "/usr/share/aws/emr/s3-dist-cp/lib/s3-dist-cp.jar",
            "arguments": [
                "--src", "s3://snowplow-data/enriched-sink/",
                "--dest", "s3://snowplow-data/enriched/archive/run={{nowWithFormat "2006-01-02-15-04-05"}}/",
                "--srcPattern", ".*\\.gz",
                "--deleteOnSuccess",
                "--s3ServerSideEncryption"
            ]
        },
```

Tranformer then will discover new folders in `s3://snowplow-data/enriched/archive/` and keep the state (processed and loaded directories) in DynamoDB manifest.

---
title: "R35 Upgrade Guide"
date: "2021-01-27"
sidebar_position: 300
---

R35 is a release with major changes in pipeline architecture:

- No dependency on EmrEtlRunner (neither Shredder nor Loader can be lauched using EmrEtlRunner, marking deprecation of EmrEtlRunner)
- Loader is not an EMR step anymore
- Major changes in directory structure
- New dependency on SQS

[Official announcement.](https://discourse.snowplow.io/t/snowplow-rdb-loader-r35-relased/4700)

This is the last release in 0.x branch and breaking changes still might be introduced in 1.0.0 release.

## Assets

Both RDB Shredder and Loader have 0.19.0 version. Both published on S3:

- `s3://snowplow-hosted-assets-eu-central-1/4-storage/rdb-shredder/snowplow-rdb-shredder-0.19.0.jar`

- `s3://snowplow-hosted-assets-eu-central-1/4-storage/rdb-loader/snowplow-rdb-loader-0.19.0.jar`

For RDB Loader however it is recommended to use the docker image, published on DockerHub: `snowplow/snowplow-rdb-loader:0.19.0`

## New architecture

Previous workflow was orchestrated by EmrEtlRunner, along with multiple S3DistCp steps, recovery scenarios and dedicated RDB Loader step. RDB Loader was finding out what data needs to be loaded by scanning S3.

In the new architecture there are two EMR steps:

1. S3DistCp, copying enriched data sunk by [S3 Loader](/docs/destinations/warehouses-and-lakes/s3/index.md), from S3 sink bucket (same as "enriched stream bucket") into _enriched data lake_ (aka shredder input, similar as previously known "enriched archive")
2. RDB Shredder, picking up all _unprocessed_ folders in enriched data lake, shredding data there and writing it into _shredded data lake_ (previously known as "shredded archive")

RDB Loader is a stand-alone long-running app, lauched either on EC2 box or Fargate cluster. The loading gets triggered by an SQS message, sent by Shredder after it finished processing a new batch.

RDB Shredder decides that folder is unprocessed by:

1. Comparing folder names in _enriched data lake_ and in _shredded data lake_. Every folder that is **in** enriched, but **not in** shredded will be considered unprocessed
2. ...except folders that don't have `shredding_complete.json` file in their root. This file is written at the end of the job and indicates that job has completed successfully. Absence of this file means that shred job has been aborted.

If you're upgrading from R34 or earlier it is strictly recommended to pick new paths for enriched and shredded archives in order to avoid double-loading OR make sure that there's a strict 1:1 correspondence between content of enriched and shredded archive.

We recommend to use either [Dataflow Runner](/docs/pipeline-components-and-applications/dataflow-runner/index.md) or boto3 script to launch scheduled S3DistCp and Shredder jobs. Here's an example of a Dataflow Runner playbook:

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
            "--class", "com.snowplowanalytics.snowplow.shredder.Main",
            "--master", "yarn",
            "--deploy-mode", "cluster",
            "s3://snowplow-hosted-assets-eu-central-1/4-storage/rdb-shredder/snowplow-rdb-shredder-0.19.0.jar",
            "--iglu-config", "{{base64File "/home/snowplow/configs/snowplow/iglu_resolver.json"}}",
            "--config", "{{base64File "/home/snowplow/configs/snowplow/config.hocon"}}"
        ]
      }
    ],
    "tags": [ ]
  }
}
```

We recommend to launch RDB Loader as long-running docker image.

## New configuration file

Common configuration file, previously known as `config.yml` and target JSON configuration file, previously known as `redshift.json` have been replaced by a [single HOCON file](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/config.hocon.sample).

Here's an example:

```json
{
  # Human-readable identificator, can be random
  "name": "Acme Redshift",
  # Machine-readable unique identificator, must be UUID
  "id": "123e4567-e89b-12d3-a456-426655440000",

  # Data Lake (S3) region
  "region": "us-east-1",
  # SQS topic name used by Shredder and Loader to communicate
  "messageQueue": "messages.fifo",

  # Shredder-specific configs
  "shredder": {
    # Path to enriched archive (must be populated separately with run=YYYY-MM-DD-hh-mm-ss directories)
    "input": "s3://com-acme/ernched/archive/",
    # Path to shredded output
    "output": "s3://com-acme/shredded/good/",
    # Path to data failed being processed
    "outputBad": "s3://com-acje/shredded/bad/",
    # Shredder output compression, GZIP or NONE
    "compression": "GZIP"
  },

  # Optional. S3 path that holds JSONPaths
  "jsonpaths": "s3://bucket/jsonpaths/",

  # Schema-specific format settings (recommended to leave all three groups empty and use TSV as default)
  # To make it compatible with R34, leave default = TSV and populate json array with things from blacklistTabular
  "formats": {
    # Format used by default (TSV or JSON)
    "default": "TSV",
    # Schemas to be shredded as JSONs, corresponding JSONPath files must be present. Automigrations will be disabled
    "json": [ ],
    # Schemas to be shredded as TSVs, presence of the schema on Iglu Server is necessary. Automigartions enabled
    "tsv": [ ],
    # Schemas that won't be loaded
    "skip": [ ]
  },

  # Warehouse connection details, identical to storage target config 
  "storage": {
    # Database, redshift is the only acceptable option
    "type": "redshift",
    # Redshift hostname
    "host": "redshift.amazon.com",
    # Database name
    "database": "snowplow",
    # Database port
    "port": 5439,
    # AWS Role ARN allowing Redshift to load data from S3
    "roleArn": "arn:aws:iam::123456789012:role/RedshiftLoadRole",
    # DB schema name
    "schema": "atomic",
    # DB user with permissions to load data
    "username": "storage-loader",
    # DB password
    "password": "secret",
    # Custom JDBC configuration
    "jdbc": {"ssl": true},
    # MAXERROR, amount of acceptable loading errors
    "maxError": 10,
    "compRows": 100000
  },

  # Additional steps. analyze, vacuum and transit_load are valid values
  "steps": ["analyze"],

  # Observability and logging opitons
  "monitoring": {
    # Snowplow tracking (optional)
    "snowplow": null,
    # Sentry (optional)
    "sentry": null
  }
}
```

If you need to use cross-batch deduplication - the file format remains the same for DynamoDB config.

CLI arguments also have changed. Both applications now accept only `--iglu-config` with base64-encoded string representing [Iglu Resolver JSON](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) and `--config` with base64-encoded above HOCON. Loader also accepts `--dry-run` flag.

## SQS

SQS serves as message bus between Shredder and Loader. Loader expects to find there self-describing messages with instructions on what to load. The queue must be FIFO.

## Directory structure

There are several major changes in shredder output directory structure:

1. Elements of the paths have changed from Iglu-compatible to shredder-specific, e.g. `format` now can be either `json` or `tsv` (and not `jsonschema` as before) and instead of `version` (that could have been either `1-0-0` or just `1`) it is always just `model`
2. There's no dedicated `atomic-events` folder. It is replaced with unified `vendor=com.snowplowanalytics.snowplow/name=atomic/format=tsv/model=1`
3. There are no `shredded-types` or `shredded-tsv` either, all types are in the root of the folder.

Structure of the typical shredded folder now looks like following:

```text
run=2021-01-27-18-35-00/
   vendor=com.snowplowanalytics.snowplow/
     name=atomic/
       format=tsv/
         model=1/
   vendor=com.snowplowanalytics.snowplow/
     name=ad_click/
       format=json/
         model=1/
   vendor=nj.basjes/
     name=yauaa_context/
       format=tsv/
         model=1/
   shredding_complete.json
   _SUCCESS
```

## Caution

We consider this version a public beta. Although it has been carefully tested in sandbox environments showing signficantly decreased AWS costs on associated infrastructure, it still haven't been used in production.

One known issue in this version is absence of protection against double-loading. If Loader receives the same SQS message multiple time (i.e. sent manually) - the same batch will be loaded multiple times.

We also reserve right to make other breaking API changes in next versions.

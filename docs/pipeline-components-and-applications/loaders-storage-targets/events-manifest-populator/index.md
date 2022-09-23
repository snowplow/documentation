---
title: "Events Manifest Populator"
date: "2020-12-01"
sidebar_position: 2000
---

## Overview

[Event Manifest Populator](https://github.com/snowplow/snowplow/tree/master/5-data-modeling/event-manifest-populator/) is an [Apache Spark](http://spark.apache.org/) job allowing you to backpopulate a Snowplow event manifest in DynamoDB with the metadata of some or all enriched events from your archive in S3.

This one-off job solves the "cold start" problem for identifying cross-batch natural deduplicates in Snowplow's [Relational Database Shredder step](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/event-deduplication/index.md).  
In other words, without running this job you still will be able to deduplicate events across batches, but if Relational Database Shredder encounters duplicate of event that was shredded _before_ you enabled cross-batch deduplication it will land into `shredded/good`.

## Usage

In order to use Event Manifest Populator, you need to have [boto2](http://boto.cloudhackers.com/en/latest/) installed:

```bash
$ pip install boto
```

As next step you need to grab `run.py` file with instructions to run job on AWS EMR.  
You can do it by downloading it directly from Github:

```bash
$ wget https://raw.githubusercontent.com/snowplow/snowplow/master/5-data-modeling/event-manifest-populator/run.py
```

Now you can run Event Manifest Populator with a single command (inside a directory with `run.py`):

```bash
$ python run.py $ENRICHED_ARCHIVE_S3_PATH $STORAGE_CONFIG_PATH $IGLU_RESOLVER_PATH
```

Task has three required arguments:

1. Path to enriched events archive. It can be found in `aws.s3.buckets.enriched.archive` setting in your [config.yml](https://github.com/snowplow/emr-etl-runner/blob/master/config/stream_config.yml.sample).
2. Local path to [Duplicate storage](#dynamodb-duplicate-storage-configuration) configuration JSON.
3. Local path to [Iglu resolver](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) configuration JSON.

Optionally, you can also pass following arguments:

- `--since` to reduce amount of data to be stored in DynamodDB.  
    If this option was passed Manifest Populator will process enriched events only after specified date.  
    Input date supports two formats: `YYYY-MM-dd` and `YYYY-MM-dd-HH-mm-ss`.
- `--log-path` to store EMR job logs on S3. Normally, Manifest Populator does not  
    produce any logs or output, but if some error occured you'll be able to  
    inspect it in EMR logs stored in this path.
- `--profile` to specify AWS profile to create this EMR job.
- `--jar` to specify S3 path to custom JAR

## Duplicate storage configuration JSON

The configuration JSON should conform to the [`amazon_dynamodb_config` JSON Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.storage/amazon_dynamodb_config/jsonschema/1-0-1).

The properties of the schema are:

1. `name`: a descriptive name for this Snowplow storage target
2. `accessKeyId`: AWS Access Key Id
3. `secretAccessKey`: AWS Secret Access Key
4. `awsRegion`: AWS region
5. `dynamodbTable`: DynamoDB table to store information about processed events
6. `purpose`: common for all targets. Amazon DynamoDB supports only `"DUPLICATE_TRACKING"`
7. `id`: (optional) machine-readable config id

**Note** that Event Manifest Populator must be used only with run ids produced with version of snowplow newer than [R73 Cuban Macaw](https://github.com/snowplow/snowplow/releases/tag/r73-cuban-macaw) as format of TSV files has been changed.

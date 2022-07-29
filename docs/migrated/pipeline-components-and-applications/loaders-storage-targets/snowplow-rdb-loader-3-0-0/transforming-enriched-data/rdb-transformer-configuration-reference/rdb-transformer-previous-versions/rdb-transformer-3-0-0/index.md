---
title: "RDB Transformer 3.0.x"
date: "2022-05-27"
sidebar_position: 100
---

An example of the minimal required config for the Spark transformer can be found [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/transformer.batch.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/transformer.batch.config.reference.hocon).

An example of the minimal required config for the stream transformer can be found [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/transformer.kinesis.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/transformer.kinesis.config.reference.hocon).

This is a complete list of the options that can be configured:

## **Spark transformer only**

|  |  |
| --- | --- |
| `input` | Required. S3 URI of the enriched archive. It must be populated separately with `run=YYYY-MM-DD-hh-mm-ss` directories. |
| `runInterval.*` | Specifies interval to process. |
| `runInterval.sinceTimestamp` | Optional. Start processing after this timestamp. |
| `runInterval.sinceAge` | Optional. A duration that specifies the maximum age of folders that should get processed. If `sinceAge` and `sinceTimestamp` are both specified, then the latest value of the two determines the earliest folder that will be processed. |
| `runInterval.until` | Optional. Process until this timestamp. |

## **Stream transformer only**

|  |  |
| --- | --- |
| `input.type` | Optional. The only supported values are `kinesis` and `file`. The default is `kinesis` |
| `input.appName` | Optional. KCL app name. The default is `snowplow-rdb-transformer`. |
| `input.streamName` | Required for `kinesis`. Enriched Kinesis stream name. |
| `input.region` | AWS region of the Kinesis stream. Optional if it can be resolved with [AWS region provider chain](https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/regions/providers/DefaultAwsRegionProviderChain.html). |
| `input.position` | Optional. Kinesis position: `LATEST` or `TRIM_HORIZON`. The default is `LATEST`. |
| `windowing` | Optional. Frequency to emit shredding complete message. The default is `10 minutes`. |

## **Common settings**

|  |  |
| --- | --- |
| `output.path` | Required. S3 URI of the transformed output. |
| `output.compression` | Optional. One of `NONE` or `GZIP`. The default is `GZIP`. |
| `output.region` | AWS region of the S3 bucket. Optional if it can be resolved with [AWS region provider chain](https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/regions/providers/DefaultAwsRegionProviderChain.html). |
| `queue.type` | Required. Type of the message queue. Can be either `sqs` or `sns`. |
| `queue.queueName` | Required if queue type is `sqs`. Name of the SQS queue. |
| `queue.topicArn` | Required if queue type is `sns`. ARN of the SNS topic. |
| `queue.region` | AWS region of the SQS queue or SNS topic. Optional if it can be resolved with [AWS region provider chain](https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/regions/providers/DefaultAwsRegionProviderChain.html). |
| `formats.*` | Schema-specific format settings. |
| `formats.transformationType` | Required. Type of transformation, either `shred` or `widerow`. See [Shredded data](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/transforming-enriched-data/#shredded-data) and [Wide row format](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/transforming-enriched-data/#wide-row-format). |
| `formats.default` | Required. Either `TSV` or `JSON`. Data format produced by default. `TSV` is recommended as it enables table autocreation, but requires an Iglu Server to be available with known schemas (including Snowplow schemas). `JSON` does not require an Iglu Server, but requires Redshift JSONPaths to be configured and does not support table autocreation. |
| `formats.tsv` | Required. List of Iglu URIs, but can be set to empty list `[]` which is the default. If `default` is set to `JSON` this list of schemas will still be shredded into `TSV`. |
| `formats.json` | Required. List of Iglu URIs, but can be set to empty list `[]` which is the default. If `default` is set to `TSV` this list of schemas will still be shredded into `JSON`. |
| `formats.skip` | Required. List of Iglu URIs, but can be set to empty list `[]` which is the default. Schemas for which loading can be skipped. |
| `monitoring.sentry.dsn` | Optional. For tracking runtime exceptions. |
| `validations.*` | Optional. Criteria to validate events against. |
| `validations.minimumTimestamp` | This is currently the only validation criterion. It checks that all timestamps in the event are older than a specific point in time, eg `2021-11-18T11:00:00.00Z`. |
| `featureFlags.*` | Optional. Enable features that are still in beta, or which aim to enable smoother upgrades. |
| `featureFlags.legacyMessageFormat` | This currently the only feature flag. Setting this to `true` allows you to use a new version of the transformer with an older version of the loader. |

## **Deduplication (Spark transformer only)**

The below settings exist for the purposes of benchmarking only and we strongly discourage changing the preset defaults:

|  |  |
| --- | --- |
| `deduplication.synthetic.type` | Can be `NONE` (disable), `BROADCAST` (default) and `JOIN` (different low-level implementations). |
| `deduplication.synthetic.cardinality` | Do not deduplicate pairs with less-or-equal cardinality. The default is 1. |

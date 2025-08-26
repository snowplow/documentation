---
title: "Deduplication"
description: "Event deduplication strategies for Spark transformer including in-batch and cross-batch natural and synthetic deduplication using DynamoDB for duplicate storage."
date: "2022-04-04"
sidebar_position: 30
---

**NOTE:** Deduplication is currently only available in the [Spark transformer](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/spark-transformer/index.md).

Duplicates are a common problem in event pipelines. At the root of it is the fact that we can't guarantee every event has a unique UUID because:

- We have no exactly-once delivery guarantees
- User-side software can send events more than once
- Robots can send events reusing the same event ID

Depending on your use case, you may choose to ignore duplicates, or deal with them once the events are in the data warehouse.

If you are loading into **Redshift** (using [shredded data](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#shredded-data)), we strongly recommend to deduplicate the data upstream of loading. Once duplicates are loaded into separate tables, table joins would create a Cartesian product.

This is less of a concern with [wide row format](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#wide-row-format) loading into **Snowflake**, where it's easier to deduplicate during the data modeling step in the warehouse.

This table shows the available deduplication mechanisms:

| Strategy                            | Batch?      | Same event ID? | Same event fingerprint? | Availability      |
| ----------------------------------- | ----------- | -------------- | ----------------------- | ----------------- |
| In-batch natural deduplication      | In-batch    | Yes            | Yes                     | Spark transformer |
| In-batch synthetic deduplication    | In-batch    | Yes            | No                      | Spark transformer |
| Cross-batch natural deduplication   | Cross-batch | Yes            | Yes                     | Spark transformer |
| Cross-batch synthetic deduplication | Cross-batch | Yes            | No                      | Not supported     |

## In-batch natural deduplication

"Natural duplicates" are events which share the same event ID (`event_id`) and the same event payload (`event_fingerprint`), meaning that they are semantically identical to each other. For a given batch of events being processed, RDB Transformer keeps only the first out of each group of natural duplicates and discards all others.

To enable this functionality, you need to have the [Event Fingerprint Enrichment](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md) enabled in Enrich. This will correctly populate the `event_fingerprint` property. No changes are required in the transformer's own `config.hocon` file.

If the fingerprint enrichment is not enabled, the transformer will assign a random UUID to each event, effectively marking all events as non-duplicates (in the 'natural' sense).

## In-batch synthetic deduplication

"Synthetic duplicates" are events which share the same event ID (`event_id`), but have different event payload (`event_fingerprint`), meaning that they can be either semantically independent events or the same events with slightly different payloads (caused by third-party software). For a given batch of events being processed, RDB Transformer uses the following strategy:

- Collect all the events with identical `event_id` which are left after natural deduplication
- Generate new random `event_id` for each of them
- Create a [`duplicate`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/duplicate/jsonschema/1-0-0) context with the original `event_id` for each event where the duplicated `event_id` was found.

There is no transformer configuration required for this functionality: deduplication is performed automatically. It is optional but highly recommended to use the [Event Fingerprint Enrichment](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md) in Enrich in order to correctly populate the `event_fingerprint` property.

## Cross-batch natural deduplication

The strategies described above deal with duplicates within the same batch of data being processed. But what if events are duplicated across batches?

To apply any of these strategies, we need to store information about previously seen duplicates, so that we can compare events in the current batch against them. We don't need to store the whole event: just the `event_id` and the `event_fingerprint` fields.

We need to store these in a database that allows fast random access, so we chose DynamoDB, a fully managed NoSQL database service.

### How to enable cross-batch natural deduplication

To enable cross-batch natural deduplication, you must provide a third configuration option in the `RDB Transformer` step of the Dataflow Runner playbook, using the `--duplicate-storage-config` flag. Like the other options, this needs to be provided as a base64-encoded string. This config file contains information about the DynamoDB table to be used, as well as credentials for accessing it. For more details on the config file structure, refer to the [Snowplow Events Manifest](https://github.com/snowplow-incubator/snowplow-events-manifest) library and its documentation.

An example step definition can look like this:

```json
{
  "type": "CUSTOM_JAR",
  "name": "RDB Transformer",
  "actionOnFailure": "CANCEL_AND_WAIT",
  "jar": "command-runner.jar",
  "arguments": [
    "spark-submit",
    "--class", "com.snowplowanalytics.snowplow.rdbloader.shredder.batch.Main",
    "--master", "yarn",
    "--deploy-mode", "cluster",
    "s3://snowplow-hosted-assets-eu-central-1/4-storage/transformer-batch/snowplow-transformer-batch-4.1.0.jar",
    "--iglu-config", "{{base64File "/home/snowplow/configs/snowplow/iglu_resolver.json"}}",
    "--config", "{{base64File "/home/snowplow/configs/snowplow/config.hocon"}}",
    "--duplicate-storage-config", "{{base64File "/home/snowplow/configs/snowplow/duplicate-storage-config.json"}}"
  ]
}
```

If this configuration option is not provided, cross-batch natural deduplication will be disabled. In-batch deduplication will still work however.

### Costs and performance implications

Cross-batch deduplication uses DynamoDB as transient storage and therefore has associated AWS costs. The default write capacity is 100 units, which should roughly cost USD50 per month. Note that at this rate your shred job can get throttled by insufficient capacity, even with a very powerful EMR cluster. You can tweak throughput to match your needs but that will inflate the bill.

### How RDB Transformer uses DynamoDB for deduplication

We store duplicate data in a DynamoDB table with the following attributes:

- `eventId`, a String
- `fingerprint`, a String
- `etlTime`, a Date
- `ttl`, a Date.

We can query this table to see if the event that is currently being processed has been seen before based on `event_id` and `event_fingerprint`.

We store the `etl_timestamp` to prevent issues in case of a failed transformer run. If a run fails and is then rerun, we don't want the rerun to consider rows in the DynamoDB table which were written as part of the failed run. Otherwise all events that were processed by the failed run will be rejected as duplicates.

To update the DynamoDB table, RDB Transformer uses so-called 'conditional updates' to perform a check-and-set operation on a per-event basis. The algorithm is as follows:

- Attempt to write the `(event_id, event_fingerprint, etl_timestamp)` triple to DynamoDB but succeed only if the `(event_id, event_fingerprint)` pair cannot be found in the table with an earlier `etl_timestamp` than the current one.
- If the write fails, we have a natural duplicate. We can safely drop it because we know that we have the 'original' of this event already safely in the data warehouse.
- If the write succeeds, we know we have an event which is not a natural duplicate. (It could still be a synthetic duplicate however.)

The transformer performs this check after grouping the batch by `event_id` and `event_fingerprint`. This ensures that all check-and-set requests for a specific `(event_id, event_fingerprint)` pair will come from a single mapper, avoiding race conditions.

To keep the DynamoDB table size in check, we're using the time-to-live feature which provides automatic cleanup after the specified time. For event manifests this time is the ETL timestamp plus 180 days. This is stored in the table's `ttl` attribute.

### Creating the DynamoDB table and IAM policy

If you provide a `duplicate-storage-config` that specifies a DynamoDB table but RDB Transformer can't find it upon launch, it will create it with the default provisioned throughput. That might not be enough for the amount of data you want to process. Creating the table upfront gives you the opportunity to spec it out according to your needs. This step is optional but recommended.

1. The table name can be anything, but it must be unique.
2. The partition key must be called `eventId` and have type String. The sort key must be called `fingerprint` and have type String. You can refer to the the [DynamoDB table definition](#how-rdb-transformer-uses-dynamodb-for-deduplication) above for the full table schema.
3. Uncheck the "Use default settings" checkbox and set "Write capacity units" to 100 (or your desired value).
4. After the table is created, note down its ARN in the "Overview" tab.
5. Create the IAM policy In the AWS console, navigate to IAM and go to "Policies". Select "Create Your Own Policy" and choose a descriptive name. Here's an example Policy Document that you can paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1486765706000",
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DeleteTable",
        "dynamodb:DescribeTable",
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:{{AWS_ACCOUNT_ID}}:table/snowplow-deduplication"
      ]
    }
  ]
}
```

Replace the element in the `Resources` array with the ARN that you noted down in step 4. If you've already created the table, the policy does not require the `dynamodb:CreateTable` and `dynamodb:DeleteTable` permissions.

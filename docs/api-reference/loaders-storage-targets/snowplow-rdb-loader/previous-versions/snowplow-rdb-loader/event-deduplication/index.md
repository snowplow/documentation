---
title: "Event deduplication in RDB Loader 2.x"
sidebar_label: "Event deduplication"
date: "2020-03-05"
sidebar_position: 20
description: "Deduplicate Snowplow events with natural and synthetic strategies for in-batch and cross-batch deduplication in RDB Shredder."
keywords: ["event deduplication", "natural deduplication", "synthetic deduplication", "cross-batch deduplication", "event fingerprint"]
---

Duplicates is a common problem in event pipelines, it has been described and studied [many](http://snowplowanalytics.com/blog/2015/08/19/dealing-with-duplicate-event-ids/) [times](http://snowplowanalytics.com/blog/2016/01/26/snowplow-r76-changeable-hawk-eagle-released/#deduplication). Basically, the problem is that we cannot guarantee that every event has a unique `UUID` because

1. we have no exactly-once delivery guarantees
2. user-side software can send events more than once
3. we have to rely on flawed [algorithms](http://snowplowanalytics.com/blog/2016/01/26/snowplow-r76-changeable-hawk-eagle-released/#deduplication)

There are four strategies planned regarding incorporating deduplication mechanisms in RDB Shredder:

| Strategy                             | Batch?      | Same event ID? | Same event fingerprint? | Availability                                                                                                                         |
| ------------------------------------ | ----------- | -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| In-batch natural de-duplication      | In-batch    | Yes            | Yes                     | [R76 Changeable Hawk-Eagle](http://snowplowanalytics.com/blog/2016/01/26/snowplow-r76-changeable-hawk-eagle-released/#deduplication) |
| In-batch synthetic de-duplication    | In-batch    | Yes            | No                      | [R86 Petra](http://snowplowanalytics.com/blog/2016/12/20/snowplow-r86-petra-released/)                                               |
| Cross-batch natural de-duplication   | Cross-batch | Yes            | Yes                     | [R88 Angkor Wat](http://snowplowanalytics.com/blog/2017/04/27/snowplow-r88-angkor-wat-released/)                                     |
| Cross-batch synthetic de-duplication | Cross-batch | Yes            | No                      | Planned                                                                                                                              |

We will cover these in turn:

#### In-batch natural de-duplication

As of [the R76 Changeable Eagle-Hawk release](http://snowplowanalytics.com/blog/2016/01/26/snowplow-r76-changeable-hawk-eagle-released/#deduplication), RDP de-duplicates "natural duplicates"

- i.e. events which share the same event ID (`event_id`) and the same event payload (based by `event_fingerprint`), meaning that they are semantically identical to each other. For a given ETL run (batch) of events being processed, RDB Shredder keeps only the first out of each group of natural duplicates; all others will be discarded.

To enable this functionality you need to have [the Event Fingerprint Enrichment](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md) enabled in order to correctly populate the `event_fingerprint` property.

#### In-batch synthetic de-duplication

As of [the R86 Petra](http://snowplowanalytics.com/blog/2016/12/20/snowplow-r86-petra-released/), RDP de-duplicates "synthetic duplicates" - i.e. events which share the same event ID (`event_id`), but have different event payload (based on `event_fingerprint`), meaning that they can be either semantically independent events (caused by the flawed algorithms discussed above) or the same events with slightly different payloads (caused by third-party software). For a given ETL run (batch) of events being processed, RDB Shredder uses the following strategy:

1. Collect all the events with identical `event_id` which are left after natural-deduplication
2. Generate new random `event_id` for each of them
3. Create a [`duplicate`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/duplicate/jsonschema/1-0-0) context with the original `event_id` for each event where the duplicated `event_id` was found

There is no configuration required for this functionality - de-duplication is performed automatically in RDB Shredder, but it is highly recommended to use the [Event Fingerprint Enrichment](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md) in order to correctly populate the `event_fingerprint` property.

#### Cross-batch natural de-duplication

With cross-batch natural de-duplication, we have to face a new issue: we need to track events across multiple ETL batches to detect duplicates. We don't need to store the whole event - just the `event_id` and the `event_fingerprint` metadata. We also need to store these in a database that allows fast random access - we chose Amazon DynamoDB, a fully managed NoSQL database service.

Cross-batch natural deduplication implemented in both RDB Shredder and Snowflake Transformer on top [Snowplow Events Manifest](https://github.com/snowplow-incubator/snowplow-events-manifest) Scala library.

##### DynamoDB table design

We store the event metadata in a DynamoDB table with the following attributes:

- `eventId`, a String
- `fingerprint`, a String
- `etlTime`, a Date
- `ttl`, a Date

A lookup into this table will tell us if the event we are looking for has been seen before based on `event_id` and `event_fingerprint`.

We store the `etl_timestamp` to prevent issues in the case of a failed run. If a run fails and is then rerun, we don't want the rerun to consider rows in the DynamoDB table which were written as part of the prior failed run; otherwise all events in the rerun would be rejected as dupes!

**WARNING** Due used algorithm in cross-batch deduplication, we strictly discourage anyone from deleting `enriched/good` folder, as pipeline recovery step after RDB Shred job has started. Reprocessing known `eventId`s and `fingerprint`s will mark events as duplicates and therefore will result in **data loss**.

##### Check-and-set algorithm

It is clear as to when we need to read the event metadata from DynamoDB: during the RDB Shredder process. But when do we write the event metadata for this run back to DynamoDB? Instead of doing all the reads and then doing all the writes, we decided to use DynamoDB's [conditional updates](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.ConditionalUpdate) to perform a check-and-set operation inside RDB Shredder, on a per-event basis.

The algorithm is simple:

- Attempt to write the `event_id-event_fingerprint-etl_timestamp` triple to DynamoDB **but only if** the `event_id-event_fingerprint` pair cannot be found with an earlier `etl_timestamp` than the provided one
- If the write fails, we have a natural duplicate
- If the write succeeds, we know we have an event which is not a natural duplicate (it could still be a synthetic duplicate however)

If we discover a natural duplicate, we delete it. We know that we have an "original" of this event already safely in Redshift (because we have found it in DynamoDB).

In the code, we perform this check after we have grouped the batch by `event_id` and `event_fingerprint`; this ensures that all check-and-set requests to a specific `event_id-event_fingerprint` pair in DynamoDB will come from a single mapper.

##### Enabling

To enable cross-batch natural de-duplication you must provide a DynamoDB table [configuration](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/dynamodb-table/index.md) to EmrEtlRunner and provide [necessary rights](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/dynamodb-table/index.md#2-setting-up-iam-policy) in IAM. If this is not provided, then cross-batch natural de-duplication will be disabled. In-batch de-duplication will still work however.

##### Table cleanup

To make sure the DynamoDB table is not going to be overpopulated we're using [the DynamoDB Time-to-Live](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html) feature, which provides automatic cleanup after the specified time. For event manifests this time is the etl timestamp plus 180 days and stored in the `ttl` attribute.

##### Costs and performance penalty

Cross-batch deduplication uses DynamoDB as transient storage and therefore has associated AWS costs. Default write capacity is 100 units, which means no matter how powerful your EMR cluster is - whole RDB Shredder can be throttled by AWS DynamoDB. The rough cost of the default setup is 50USD per month, however throughput can be [tweaked](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/dynamodb-table/index.md) according to your needs.

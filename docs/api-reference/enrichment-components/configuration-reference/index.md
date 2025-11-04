---
title: "Configuration"
date: "2021-08-14"
sidebar_position: 50
---

## License

Enrich is released under the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.1/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

To accept the terms of license and run Enrich, set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable. Alternatively, you can configure the `license.accept` option, like this:

```json
"license": {
  "accept": true
}
```

## Common parameters

| parameter | description |
|-|-|
| `cpuParallelismFraction` (since *6.0.0*) | Optional. Default: `1`. Controls how the app splits the workload into concurrent batches which can be run in parallel. E.g. If there are 4 available processors, and cpuParallelismFactor = 0.75, then we process 3 batches concurrently. Adjusting this value can cause the app to use more or less of the available CPU. |
| `sinkParallelismFraction` (since *6.0.0*) | Optional. Default: `2`. Controls number of sink job that can be run in parallel. E.g. If there are 4 available processors, and sinkParallelismFraction = 2, then we run 8 sink job concurrently. Adjusting this value can cause the app to use more or less of the available CPU. |
| `assetsUpdatePeriod` | Optional. E.g. `7 days`. Period after which enrich assets (e.g. the maxmind database for the IpLookups enrichment) should be checked for udpates. Assets will never be updated if this key is missing. |
| `monitoring.sentry.dsn` | Optional. E.g. `http://sentry.acme.com`. To track uncaught runtime exceptions in Sentry. |
| `monitoring.sentry.tags.*` | Optional. A map of key/value strings which are passed as tags when reporting exceptions to Sentry. |
| `monitoring.metrics.statsd.hostname` | Optional. E.g. `localhost`. Hostname of the StatsD server to send enrichment metrics (latency and event counts) to. |
| `monitoring.metrics.statsd.port` | Optional. E.g. `8125`. Port of the StatsD server. |
| `monitoring.metrics.statsd.period` | Optional. E.g. `10 seconds`. How frequently to send metrics to StatsD server. |
| `monitoring.metrics.statsd.tags` | Optional. E.g. `{ "env": "prod" }`. Key-value pairs attached to each metric sent to StatsD to provide contextual information. |
| `monitoring.metrics.statsd.prefix` | Optional. Default: `snowplow.enrich`. Pefix of StatsD metric names. |
| `monitoring.healthProbe.port` (since *6.0.0*) | Optional. Default: `8000`. Open a HTTP server that returns OK only if the app is healthy. |
| `monitoring.healthProbe.unhealthyLatency` (since *6.0.0*) | Optional. Default: `2 minutes`. Health probe becomes unhealthy if any received event is still not fully processed before this cutoff time. |
| `telemetry.disable` | Optional. Set to `true` to disable [telemetry](/docs/get-started/self-hosted/telemetry/index.md). |
| `telemetry.userProvidedId` | Optional. See [here](/docs/get-started/self-hosted/telemetry/index.md#how-can-i-help) for more information. |
| `validation.acceptInvalid` (since *6.0.0*) | Optional. Default: `false`. Enrich *3.0.0* introduces the validation of the enriched events against atomic schema before emitting. If set to `false`, a failed event will be emitted instead of the enriched event if validation fails. If set to `true`, invalid enriched events will be emitted, as before. |
| `validation.atomicFieldsLimits` (since *4.0.0*) | Optional. For the defaults, see [here](https://github.com/snowplow/enrich/blob/master/modules/common/src/main/resources/reference.conf). Configuration for custom maximum atomic fields (strings) length. It's a map-like structure with keys being atomic field names and values being their max allowed length. |
| `validation.maxJsonDepth` (since *6.0.0*) | Optional. Default: `40`. Maximum allowed depth for the JSON entities in the events. Event will be sent to bad row stream if it contains JSON entity with a depth that exceeds this value. |
| `validation.exitOnJsCompileError` (since *6.0.0*) | Optional. Default: `true`. If it is set to true, Enrich will exit with error if JS enrichment script is invalid. If it is set to false, Enrich will continue to run if JS enrichment script is invalid but every event will end up as bad row. |
| `decompression.maxBytesInBatch` (since *6.1.0*) | Optional. Default: `10000000` (10MB). Although a compressed message from the Collector is limited to 1MB, it could become several times bigger after decompression. To avoid loading an enormous amount of data into memory, Enrich will decompress the message in portions (batches). This parameter specifies the maximum size of such a batch. As soon as the decompressed batch reaches `maxBytesInBatch`, it is a emitted for further processing, and a new batch is started. |
| `decompression.maxBytesSinglePayload` (since *6.1.0*) | Optional. Default: `10000000` (10 MB). Each compressed Collector message contains a number of payloads, which contain one or more events. While the Collector already enforces some payload size limits, this setting exists as a safety check to prevent Enrich from loading large amounts of data into memory. Specifically, if an individual payload exceeds `maxBytesSinglePayload`, it will result in a [size violation](docs/api-reference/failed-events/index.md#size-violation). |

## enrich-pubsub

A minimal configuration file can be found on the [Github repo](https://github.com/snowplow/enrich/blob/master/config/config.pubsub.minimal.hocon), as well as a [comprehensive one](https://github.com/snowplow/enrich/blob/master/config/config.pubsub.reference.hocon).

| parameter | description |
|-|-|
| `input.subscription` | Required. E.g. `projects/example-project/subscriptions/collectorPayloads`. PubSub subscription identifier for the collector payloads. |
| `input.durationPerAckExtension` | Optional. Default: `15 seconds`. Pubsub ack deadlines are extended for this duration when needed. |
| `input.minRemainingAckDeadline` | Optional. Default: `0.1`. Controls when ack deadlines are re-extended, for a message that is close to exceeding its ack deadline. For example, if `durationPerAckExtension` is `60 seconds` and `minRemainingAckDeadline` is `0.1` then the Source will wait until there is `6 seconds` left of the remining deadline, before re-extending the message deadline. |
| `input.retries.transientErrors.delay` (since *6.2.0*) | Optional. Default: `100 millis`. Backoff delay for follow-up attempts of transient GRPC failures retries. |
| `input.retries.transientErrors.attempts` (since *6.2.0*) | Optional. Default: `10`. Max number of attempts for transient GRPC failures retries. |
| `output.good.topic` | Required. E.g. `projects/example-project/topics/enriched`. Name of the PubSub topic that will receive the enriched events. |
| `output.good.attributes` | Optional. Enriched event fields to add as PubSub message attributes. For example, if this is `[ "app_id" ]` then the enriched event's `app_id` field will be an attribute of the PubSub message, as well as being a field within the enriched event. |
| `output.good.batchSize` | Optional. Default: `100`. Enriched events are sent to pubsub in batches not exceeding this size. |
| `output.good.requestByteThreshold` | Optional. Default: `1000000`. Enriched events are sent to pubsub in batches not exceeding this size number of bytes. |
| `output.good.retries.transientErrors.delay` (since *6.2.0*) | Same as `input.retries.transientErrors.delay` for good events. |
| `output.good.retries.transientErrors.attempts` (since *6.2.0*) | Same as `input.retries.transientErrors.attempts` for good events. |
| `output.failed.topic` | Required. E.g. `projects/example-project/topics/failed`. Name of the PubSub topic that will receive the failed events (same format as the enriched events). |
| `output.failed.batchSize` | Same as `output.good.batchSize` for failed events. |
| `output.failed.requestByteThreshold` | Same as `output.good.requestByteThreshold` for failed events. |
| `output.failed.retries.transientErrors.delay` (since *6.2.0*) | Same as `input.retries.transientErrors.delay` for failed events. |
| `output.failed.retries.transientErrors.attempts` (since *6.2.0*) | Same as `input.retries.transientErrors.attempts` for failed events. |
| `output.bad.topic` | Required. E.g. `projects/example-project/topics/bad`. Name of the PubSub topic that will receive the failed events in the "bad row" format (JSON). |
| `output.bad.batchSize` | Same as `output.good.batchSize` for failed events in the "bad row" format (JSON). |
| `output.bad.requestByteThreshold` | Same as `output.good.requestByteThreshold` for failed events in the "bad row" format (JSON). |
| `output.bad.retries.transientErrors.delay` (since *6.2.0*) | Same as `input.retries.transientErrors.delay` for failed events in the "bad row" format (JSON). |
| `output.bad.retries.transientErrors.attempts` (since *6.2.0*) | Same as `input.retries.transientErrors.attempts` for failed events in the "bad row" format (JSON). |

## enrich-kinesis

A minimal configuration file can be found on the [Github repo](https://github.com/snowplow/enrich/blob/master/config/config.kinesis.minimal.hocon), as well as a [comprehensive one](https://github.com/snowplow/enrich/blob/master/config/config.kinesis.reference.hocon).

| parameter | description |
|-|-|
| `input.appName` | Optional. Default: `snowplow-enrich-kinesis`. Name of the application which the KCL daemon should assume. A DynamoDB table with this name will be created. |
| `input.streamName` | Required. E.g. `raw`. Name of the Kinesis stream with the collector payloads to read from. |
| `input.initialPosition.type` | Optional. Default: `TRIM_HORIZON`. Set the initial position to consume the Kinesis stream. Possible values: `LATEST` (most recent data), `TRIM_HORIZON` (oldest available data), `AT_TIMESTAMP` (start from the record at or after the specified timestamp). |
| `input.initialPosition.timestamp` | Required for `AT_TIMESTAMP`. E.g. `2020-07-17T10:00:00Z`. |
| `input.retrievalMode.type` | Optional. Default: `Polling`. Set the mode for retrieving records. Possible values: `Polling` or `FanOut`. |
| `input.retrievalMode.maxRecords` | Required for `Polling`. Default: `1000`. Maximum size of a batch returned by a call to `getRecords`. Records are checkpointed after a batch has been fully processed, thus the smaller `maxRecords`, the more often records can be checkpointed into DynamoDb, but possibly reducing the throughput. |
| `input.workerIdentifier` (since *6.0.0*) | Required. Name of this KCL worker used in the DynamoDB lease table. |
| `input.leaseDuration` (since *6.0.0*) | Optional. Default: `10 seconds`. Duration of shard leases. KCL workers must periodically refresh leases in the DynamoDB table before this duration expires. |
| `input.maxLeasesToStealAtOneTimeFactor` (since *6.0.0*) | Optional. Default: `2.0`. Controls how to pick the max number of leases to steal at one time. E.g. If there are 4 available processors, and maxLeasesToStealAtOneTimeFactor = 2.0, then allow the KCL to steal up to 8 leases. Allows bigger instances to more quickly acquire the shard-leases they need to combat latency. |
| `input.checkpointThrottledBackoffPolicy.minBackoff` (since *6.0.0*) | Optional. Default: `100 millis`. Minimum backoff before retrying when DynamoDB provisioned throughput exceeded. |
| `input.checkpointThrottledBackoffPolicy.maxBackoff` (since *6.0.0*) | Optional. Default: `1 second`.  Maximum backoff before retrying when DynamoDB provisioned throughput limit exceeded. |
| `input.debounceCheckpoints` (since *6.0.0*) | Optional. Default: `10 seconds`.  How frequently to checkpoint our progress to the DynamoDB table. By increasing this value, we can decrease the write-throughput requirements of the DynamoDB table. |
| `output.good.streamName` | Required. E.g. `enriched`. Name of the Kinesis stream to write to the enriched events. |
| `output.good.partitionKey` | Optional. How the output stream will be partitioned in Kinesis. Events with the same partition key value will go to the same shard. Possible values: `event_id`, `event_fingerprint`, `domain_userid`, `network_userid`, `user_ipaddress`, `domain_sessionid`, `user_fingerprint`. If not specified, the partition key will be a random UUID. |
| `output.good.throttledBackoffPolicy.minBackoff` (since *6.0.0*) | Optional. Default: `100 milliseconds`. Minimum backoff before retrying when writing fails with exceeded kinesis write throughput. |
| `output.good.throttledBackoffPolicy.maxBackoff` (since *6.0.0*) | Optional. Default: `1 second`. Maximum backoff before retrying when writing fails with exceeded kinesis write throughput. |
| `output.good.recordLimit` | Optional. Default: `500`. Maximum allowed to records we are allowed to send to Kinesis in 1 PutRecords request. |
| `output.good.byteLimit` | Optional. Default: `5242880`. Maximum allowed to bytes we are allowed to send to Kinesis in 1 PutRecords request. |
| `output.failed.streamName` | Required. E.g. `failed`. Name of the Kinesis stream that will receive the failed events (same format as the enriched events). |
| `output.failed.throttledBackoffPolicy.minBackoff` (since *6.0.0*) | Same as `output.good.throttledBackoffPolicy.minBackoff` for failed events. |
| `output.failed.throttledBackoffPolicy.maxBackoff` (since *6.0.0*) | Same as `output.good.throttledBackoffPolicy.maxBackoff` for failed events. |
| `output.failed.recordLimit` | Same as `output.good.recordLimit` for failed events. |
| `output.failed.byteLimit` | Same as `output.good.byteLimit` for failed events. |
| `output.bad.streamName` | Required. E.g. `bad`. Name of the Kinesis stream that will receive the failed events in the "bad row" format (JSON). |
| `output.bad.throttledBackoffPolicy.minBackoff` (since *6.0.0*) | Same as `output.good.throttledBackoffPolicy.minBackoff` for failed events in the "bad row" format (JSON). |
| `output.bad.throttledBackoffPolicy.maxBackoff` (since *6.0.0*) | Same as `output.good.throttledBackoffPolicy.maxBackoff` for failed events in the "bad row" format (JSON). |
| `output.bad.recordLimit` | Same as `output.good.recordLimit` for failed events in the "bad row" format (JSON). |
| `output.bad.byteLimit` | Same as `output.good.byteLimit` for failed events in the "bad row" format (JSON). |

## enrich-kafka

A minimal configuration file can be found on the [Github repo](https://github.com/snowplow/enrich/blob/master/config/config.kafka.minimal.hocon), as well as a [comprehensive one](https://github.com/snowplow/enrich/blob/master/config/config.kafka.reference.hocon).

| parameter | description |
|-|-|
| `input.topicName` | Required. Name of the Kafka topic to read collector payloads from. |
| `input.bootstrapServers` | Required. A list of `host:port` pairs to use for establishing the initial connection to the Kafka cluster |
| `input.debounceCommitOffsets` (since *6.0.0*) | Optional. Default: `10 seconds`. How frequently to commit our progress back to kafka. By increasing this value, we decrease the number of requests made to the kafka broker. |
| `input.consumerConf` | Optional. Kafka consumer configuration. See [the docs](https://kafka.apache.org/documentation/#consumerconfigs) for all properties. |
| `output.good.topicName` | Required. Name of the Kafka topic to write to |
| `output.good.bootstrapServers` | Required. A list of host:port pairs to use for establishing the initial connection to the Kafka cluster |
| `output.good.producerConf` | Optional. Kafka producer configuration. See [the docs](https://kafka.apache.org/documentation/#producerconfigs) for all properties |
| `output.good.partitionKey` | Optional. Enriched event field to use as Kafka partition key |
| `output.good.attributes` | Optional. Enriched event fields to add as Kafka record headers |
| `output.failed.topicName` | Optional. Name of the Kafka topic that will receive the failed events (same format as the enriched events) |
| `output.failed.bootstrapServers` | Same as `output.good.bootstrapServers` for failed events. |
| `output.failed.producerConf` | Same as `output.good.producerConf` for failed events. |
| `output.bad.topicName` | Optional. Name of the Kafka topic that will receive the failed events in the “bad row” format (JSON) |
| `output.bad.bootstrapServers` | Same as `output.good.bootstrapServers` for failed events in the "bad row" format (JSON). |
| `output.bad.producerConf` | Same as `output.good.producerConf` for failed events in the "bad row" format (JSON). |
| `blobClients.accounts` (since *6.0.0*) | Optional. Array of Azure Blob Storage accounts to download enrichment assets. |
Example values for the Azure storage accounts :
- `{ "name": "storageAccount1"}`: public account with no auth
- `{ "name": "storageAccount2", "auth": { "type": "default"} }`: private account using default auth chain
- `{ "name": "storageAccount3",  "auth": { "type": "sas", "value": "tokenValue"}}`: private account using SAS token auth

## enrich-nsq

A minimal configuration file can be found on the [Github repo](https://github.com/snowplow/enrich/blob/master/config/config.nsq.minimal.hocon), as well as a [comprehensive one](https://github.com/snowplow/enrich/blob/master/config/config.nsq.reference.hocon).

| parameter | description |
|-|-|
| `input.topic` | Required. Name of the NSQ topic with the collector payloads. |
| `input.lookupHost` | Required. The host name of NSQ lookup application. |
| `input.lookupPort` | Required. The port number of NSQ lookup application. |
| `input.channel` | Optional. Default: `collector-payloads-channel`. Name of the NSQ channel used to retrieve collector payloads. |
| `output.good.topic` | Required. Name of the NSQ topic that will receive the enriched events. |
| `output.good.nsqdHost` | Required. The host name of nsqd application. |
| `output.good.nsqdPort` | Required. The port number of nsqd application. |
| `output.failed.topic` | Required. Name of the NSQ topic that will receive the failed events (same format as the enriched events). |
| `output.failed.nsqdHost` | Required. The host name of nsqd application. |
| `output.failed.nsqdPort` | Required. The port number of nsqd application. |
| `output.bad.topic` | Required. Name of the NSQ topic that will receive the failed events in the "bad row" format (JSON). |
| `output.bad.nsqdHost` | Required. The host name of nsqd application. |
| `output.bad.nsqdPort` | Required. The port number of nsqd application. |
| `blobClients.accounts` (since *6.0.0*) | Optional. Array of Azure Blob Storage accounts to download enrichment assets. |

## Enriched events validation against atomic schema

Enriched events are expected to match [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) schema.
However, until `3.0.0`, it was never checked that the enriched events emitted by enrich were valid.
If an event is not valid against `atomic` schema, a [failed event](/docs/fundamentals/failed-events/index.md) should be emitted instead of the enriched event.
However, this is a breaking change, and we want to give some time to users to adapt, in case today they are working downstream with enriched events that are not valid against `atomic`.
For this reason, this new validation was added as a feature that can be deactivated like that:

```json
"validation": {
  "acceptInvalid": true
}
```

In this case, enriched events that are not valid against `atomic` schema will still be emitted as before, so that Enrich `3.0.0` can be fully backward compatible.
It will be possible to know if the new validation would have had an impact by 2 ways:

1. A new metric `invalid_enriched` has been introduced.
    It reports the number of enriched events that were not valid against `atomic` schema. As the other metrics, it can be seen on stdout and/or StatsD.
2. Each time there is an enriched event invalid against `atomic` schema, a line will be logged with the failed event (add `-Dorg.slf4j.simpleLogger.log.InvalidEnriched=debug` to the `JAVA_OPTS` to see it).

If `acceptInvalid` is set to `false`, a failed event will be emitted instead of the enriched event in case it's not valid against `atomic` schema.

When we'll know that all our customers don't have any invalid enriched events any more, we'll remove the feature flags and it will be impossible to emit invalid enriched events.

Since `4.0.0`, it is possible to configure the lengths of the atomic fields, below is an example:

```hcl
{
  ...
  # Optional. Configuration section for various validation-oriented settings.
  "validation": {
    # Optional. Configuration for custom maximum atomic fields (strings) length.
    # Map-like structure with keys being field names and values being their max allowed length
    "atomicFieldsLimits": {
        "app_id": 5
        "mkt_clickid": 100000
        # ...and any other 'atomic' field with custom limit
    }
  }
}
```

## Enrichments

The list of the enrichments that can be configured can be found on [this page](/docs/pipeline/enrichments/available-enrichments/index.md).

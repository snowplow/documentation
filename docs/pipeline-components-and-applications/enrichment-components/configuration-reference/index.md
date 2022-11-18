---
title: "Configuration"
date: "2021-08-14"
sidebar_position: 50
---

## Common parameters

| parameter | description |
|-|-|
| `concurrency.enrich` | Optional. Default: `256`. Number of events that can get enriched at the same time within a chunk (events are processed by chunks in the app). |
| `concurrency.sink` | Optional. Default for `enrich-pubsub` and `enrich-rabbitmq`: `3`. Default for `enrich-kinesis`: `1`. Number of chunks that can get sunk at the same time. *WARNING* for `enrich-kinesis`: if greater than `1`, records can get checkpointed before they are sunk. |
| `assetsUpdatePeriod` | Optional. E.g. `7 days`. Period after which enrich assets (e.g. the maxmind database for the IpLookups enrichment) should be checked for udpates. Assets will never be updated if this key is missing. |
| `monitoring.sentry.dsn` | Optional. E.g. `http://sentry.acme.com`. To track uncaught runtime exceptions in Sentry. |
| `monitoring.metrics.statsd.hostname` | Optional. E.g. `localhost`. Hostname of the StatsD server to send enrichment metrics (latency and event counts) to. |
| `monitoring.metrics.statsd.port` | Optional. E.g. `8125`. Port of the StatsD server. |
| `monitoring.metrics.statsd.period` | Optional. E.g. `10 seconds`. How frequently to send metrics to StatsD server. |
| `monitoring.metrics.statsd.tags` | Optional. E.g. `{ "env": "prod" }`. Key-value pairs attached to each metric sent to StatsD to provide contextual information. |
| `monitoring.metrics.statsd.prefix` | Optional. Default: `snowplow.enrich`. Pefix of StatsD metric names. |
| `monitoring.metrics.stdout.period` | Optional. E.g. `10 seconds`. If set, metrics will be printed in the logs with this frequency. |
| `monitoring.metrics.stdout.prefix` | Optional. Default: `snowplow.enrich`. Prefix for the metrics appearing in the logs. |
| `telemetry.disable` | Optional. Set to `true` to disable [telemetry](/docs/getting-started-on-snowplow-open-source/telemetry/index.md). |
| `telemetry.userProvidedId` | Optional. See [here](/docs/getting-started-on-snowplow-open-source/telemetry/index.md#how-can-i-help) for more information. |
| `featureFlags.acceptInvalid` | Optional. Default: `false`. Enrich *3.0.0* introduces the validation of the enriched events against atomic schema before emitting. If set to `false`, a bad row will be emitted instead of the enriched event if validation fails. If set to `true`, invalid enriched events will be emitted, as before. |
| `featureFlags.legacyEnrichmentOrder` | Optional. Default: `false`. In early versions of `enrich-kinesis` and `enrich-pubsub` (>= *3.1.5*), the Javascript enrichment incorrectly ran before the currency, weather, and IP Lookups enrichments. Set this flag to true to keep the erroneous behaviour of those previous versions. |

Instead of a message queue, it's also possible to read collector payloads from files on disk. This can be used for instance for testing purposes. In this case the configuration needs to be as below.

| parameter | description |
|-|-|
| `input.type`| Required. Must be `FileSystem`. |
| `input.dir`| Required. E.g. `/input/collectorPayloads/`. Directory containing collector payloads encoded with Thrift. |

Likewise, it's possible to write enriched events, pii events and bad rows to files instead of PubSub or Kinesis.

To write enriched events to files:

| parameter | description |
|------------------------|------------------------------------------------------------------------------------|
| `output.good.type` | Required. Must be `FileSystem`. |
| `output.good.file` | Required. E.g. `/output/enriched`. File where enriched events will be written. |
| `output.good.maxBytes` | Optional. E.g. `1048576`. Maximum size of a file in bytes. Triggers file rotation. |

To write bad rows to files:

| parameter | description |
|-|-|
| `output.bad.type` | Required. Must be `FileSystem`. |
| `output.bad.file` | Required. E.g. `/output/badRows`. File where bad rows will be written. |
| `output.bad.maxBytes` | Optional. E.g. `1048576`. Maximum size of a file in bytes. Triggers file rotation. |

To write pii events to files:

| parameter | description |
|-|-|
| `output.pii.type` | Required. Must be `FileSystem`. |
| `output.pii.file` | Required. E.g. `/output/pii`. File where pii events will be written. |
| `output.pii.maxBytes` | Optional. E.g. `1048576`. Maximum size of a file in bytes. Triggers file rotation. |

## enrich-pubsub

A minimal configuration file can be found on the [Github repo](https://github.com/snowplow/enrich/blob/master/config/config.pubsub.minimal.hocon), as well as a [comprehensive one](https://github.com/snowplow/enrich/blob/master/config/config.pubsub.extended.hocon).

| parameter | description |
|-|-|
| `input.subscription` | Required. E.g. `projects/example-project/subscriptions/collectorPayloads`. PubSub subscription identifier for the collector payloads. |
| `input.parallelPullCount` | Optional. Default: `1`. Number of threads used internally by permutive library to handle incoming messages. These threads do very little "work" apart from writing the message to a concurrent queue. |
| `input.maxQueueSize` | Optional. Default: `3000`. Configures the "max outstanding element count" of PubSub. This is the principal way we control concurrency in the app; it puts an upper bound on the number of events in memory at once. An event counts towards this limit starting from when it received by the permutive library, until we ack it (after publishing to output). The value must be large enough that it does not cause the sink to block whilst it is waiting for a batch to be completed. The first of `maxQueueSize` and `maxRequestBytes` being reached will pause the consumption. |
| `input.maxRequestBytes` | Optional. Default: `50000000` (50MB). Configures the "maximum outstanding request bytes" of PubSub subscriber. It puts an upper bound on the events' bytes that can be hold in memory at once before getting acked. The value must be large enough to not cause the sink to block whilst it is waiting for a batch to be completed. The first of `maxQueueSize` and `maxRequestBytes` being reached will pause the consumption. |
| `input.maxAckExtensionPeriod` | Optional. Default: `1 hour`. Maximum period a message ack deadline can be extended. A zero duration disables auto deadline extension. |
| `output.good.topic` | Required. E.g. `projects/example-project/topics/enriched`. Name of the PubSub topic that will receive the enriched events. |
| `output.good.attributes` | Optional. Enriched event fields to add as PubSub message attributes. For example, if this is `[ "app_id" ]` then the enriched event's `app_id` field will be an attribute of the PubSub message, as well as being a field within the enriched event. |
| `output.good.delayThreshold` | Optional. Default: `200 milliseconds`. Delay threshold to use for batching. After this amount of time has elapsed, before `maxBatchSize` and `maxBatchBytes` have been reached, messages from the buffer will be sent. |
| `output.good.maxBatchSize` | Optional. Default: `1000` (PubSub maximum). Maximum number of messages sent within a batch. When the buffer reaches this number of messages they are sent. |
| `output.good.maxBatchBytes` | Optional. Default: `8000000` (PubSub maximum is 10MB). Maximum number of bytes sent within a batch. When the buffer reaches this size messages are sent. |
| `output.bad.topic` | Required. E.g. `projects/example-project/topics/badrows`. Name of the PubSub topic that will receive the bad rows. |
| `output.bad.delayThreshold` | Same as `output.good.delayThreshold` for bad rows. |
| `output.bad.maxBatchSize` | Same as `output.good.maxBatchSize` for bad rows. |
| `output.bad.maxBatchBytes` | Same as `output.good.maxBatchBytes` for bad rows. |
| `output.pii.topic` | Optional. Example: `projects/test-project/topics/pii`. Should be used in conjunction with the PII pseudonymization enrichment. When configured, enables an extra output topic for writing a `pii_transformation` event. |
| `output.pii.attributes` | Same as `output.good.attributes` for pii events. |
| `output.pii.delayThreshold` | Same as `output.good.delayThreshold` for pii events. |
| `output.pii.maxBatchSize` | Same as `output.good.maxBatchSize` for pii events. |
| `output.pii.maxBatchBytes` | Same as `output.good.maxBatchBytes` for pii events. |

## enrich-kinesis

A minimal configuration file can be found on the [Github repo](https://github.com/snowplow/enrich/blob/master/config/config.kinesis.minimal.hocon), as well as a [comprehensive one](https://github.com/snowplow/enrich/blob/master/config/config.kinesis.extended.hocon).

| parameter | description |
|-|-|
| `input.appName` | Optional. Default: `snowplow-enrich-kinesis`. Name of the application which the KCL daemon should assume. A DynamoDB table with this name will be created. |
| `input.streamName` | Required. E.g. `raw`. Name of the Kinesis stream with the collector payloads to read from. |
| `input.region` | Optional. E.g. `eu-central-1`. Region where the Kinesis stream is located. This field is optional if it can be resolved with AWS region provider chain. It checks places like env variables, system properties, AWS profile file. |
| `input.initialPosition.type` | Optional. Default: `TRIM_HORIZON`. Set the initial position to consume the Kinesis stream. Possible values: `LATEST` (most recent data), `TRIM_HORIZON` (oldest available data), `AT_TIMESTAMP` (start from the record at or after the specified timestamp). |
| `input.initialPosition.timestamp` | Required for `AT_TIMESTAMP`. E.g. `2020-07-17T10:00:00Z`. |
| `input.retrievalMode.type` | Optional. Default: `Polling`. Set the mode for retrieving records. Possible values: `Polling` or `FanOut`. |
| `input.retrievalMode.maxRecords` | Required for `Polling`. Default: `10000`. Maximum size of a batch returned by a call to `getRecords`. Records are checkpointed after a batch has been fully processed, thus the smaller `maxRecords`, the more often records can be checkpointed into DynamoDb, but possibly reducing the throughput. |
| `input.bufferSize` | Optional. Default: `3`. Size of the internal buffer used when reading messages from Kinesis, each buffer holding up to `maxRecords` from above. |
| `input.customEndpoint` | Optional. E.g. `http://localhost:4566`. Endpoint url configuration to override aws kinesis endpoints. Can be used to specify local endpoint when using localstack. |
| `input.dynamodbCustomEndpoint` | Optional. E.g. `http://localhost:4566`. Endpoint url configuration to override aws dyanomdb endpoint for Kinesis checkpoints lease table. Can be used to specify local endpoint when using localstack. |
| `input.cloudwatchCustomEndpoint` | Optional. E.g. `http://localhost:4566`. Endpoint url configuration to override aws cloudwatch endpoint for metrics. Can be used to specify local endpoint when using localstack. |
| `output.good.streamName` | Required. E.g. `enriched`. Name of the Kinesis stream to write to the enriched events. |
| `output.good.region` | Same as input.region for enriched events stream. |
| `output.good.partitionKey` | Optional. How the output stream will be partitioned in Kinesis. Events with the same partition key value will go to the same shard. Possible values: `event_id`, `event_fingerprint`, `domain_userid`, `network_userid`, `user_ipaddress`, `domain_sessionid`, `user_fingerprint`. If not specified, the partition key will be a random UUID. |
| `output.good.backoffPolicy.minBackoff` | Optional. Default: `100 milliseconds`. Minimum backoff before retrying when writing fails with internal errors. |
| `output.good.backoffPolicy.maxBackoff` | Optional. Default: `10 seconds`. Maximum backoff before retrying when writing fails with internal errors. |
| `output.good.backoffPolicy.maxRetries` | Optional. Default: `10`. Maximum number of retries for internal errors. |
| `output.good.throttledBackoffPolicy.minBackoff` (since *3.4.1*) | Optional. Default: `100 milliseconds`. Minimum backoff before retrying when writing fails in case of throughput exceeded. |
| `output.good.throttledBackoffPolicy.maxBackoff` (since *3.4.1*) | Optional. Default: `1 second`. Maximum backoff before retrying when writing fails in case of throughput exceeded. Writing is retried forever. |
| `output.good.recordLimit` | Optional. Default: `500` (maximum allowed). Limits the number of events in a single PutRecords request. Several requests are made in parallel. |
| `output.good.customEndpoint` | Optional. E.g. `http://localhost:4566`. To use a custom Kinesis endpoint. |
| `output.bad.streamName` | Required. E.g. `bad`. Name of the Kinesis stream to write to the bad rows. |
| `output.bad.region` | Same as `output.good.region` for bad rows. |
| `output.bad.backoffPolicy.minBackoff` | Same as `output.good.backoffPolicy.minBackoff` for bad rows. |
| `output.bad.backoffPolicy.maxBackoff` | Same as `output.good.backoffPolicy.maxBackoff` for bad rows. |
| `output.bad.backoffPolicy.maxRetries` | Same as `output.good.backoffPolicy.maxRetries` for bad rows. |
| `output.bad.throttledBackoffPolicy.minBackoff` (since *3.4.1*) | Same as `output.good.throttledBackoffPolicy.minBackoff` for bad rows. |
| `output.bad.throttledBackoffPolicy.maxBackoff` (since *3.4.1*) | Same as `output.good.throttledBackoffPolicy.maxBackoff` for bad rows. |
| `output.bad.recordLimit` | Same as `output.good.recordLimit` for bad rows. |
| `output.bad.customEndpoint` | Same as `output.good.customEndpoint` for pii events. |
| `output.pii.streamName` | Optional. E.g. `pii`. Should be used in conjunction with the PII pseudonymization enrichment. When configured, enables an extra output stream for writing a `pii_transformation` event. |
| `output.pii.region` | Same as `output.good.region` for pii events. |
| `output.pii.partitionKey` | Same as `output.good.partitionKey` for pii events. |
| `output.pii.backoffPolicy.minBackoff` | Same as `output.good.backoffPolicy.minBackoff` for pii events. |
| `output.pii.backoffPolicy.maxBackoff` | Same as `output.good.backoffPolicy.maxBackoff` for pii events. |
| `output.pii.backoffPolicy.maxRetries` | Same as `output.good.backoffPolicy.maxRetries` for pii events. |
| `output.pii.throttledBackoffPolicy.minBackoff` (since *3.4.1*) | Same as `output.good.throttledBackoffPolicy.minBackoff` for pii events. |
| `output.pii.throttledBackoffPolicy.maxBackoff` (since *3.4.1*) | Same as `output.good.throttledBackoffPolicy.maxBackoff` for pii events. |
| `output.pii.recordLimit` | Same as `output.good.recordLimit` for pii events. |
| `output.pii.customEndpoint` | Same as `output.good.customEndpoint` for pii events. |

## enrich-kafka

A minimal configuration file can be found on the [Github repo](https://github.com/snowplow/enrich/blob/master/config/config.kafka.minimal.hocon), as well as a [comprehensive one](https://github.com/snowplow/enrich/blob/master/config/config.kafka.extended.hocon).

| parameter | description |
|-|-|
| `input.topicName` | Required. Name of the Kafka topic to read collector payloads from. |
| `input.bootstrapServers` | Required. A list of `host:port` pairs to use for establishing the initial connection to the Kafka cluster |
| `input.consumerConf` | Optional. Kafka consumer configuration. See [the docs](https://kafka.apache.org/documentation/#consumerconfigs) for all properties. |
| `output.good.topicName` | Required. Name of the Kafka topic to write to |
| `output.good.bootstrapServers` | Required. A list of host:port pairs to use for establishing the initial connection to the Kafka cluster |
| `output.good.producerConf` | Optional. Kafka producer configuration. See [the docs](https://kafka.apache.org/documentation/#producerconfigs) for all properties |
| `output.good.partitionKey` | Optional. Enriched event field to use as Kafka partition key |
| `output.good.headers` | Optional. Enriched event fields to add as Kafka record headers |
| `output.pii.topicName` | Optional. Name of the Kafka topic to write to |
| `output.pii.bootstrapServers` | Optional. A list of host:port pairs to use for establishing the initial connection to the Kafka cluster |
| `output.pii.producerConf` | Optional. Kafka producer configuration. See [the docs](https://kafka.apache.org/documentation/#producerconfigs) for all properties |
| `output.pii.partitionKey` | Optional. Enriched event field to use as Kafka partition key |
| `output.pii.headers` | Optional. Enriched event fields to add as Kafka record headers |
| `output.bad.topicName` | Optional. Name of the Kafka topic to write to |
| `output.bad.bootstrapServers` | Optional. A list of host:port pairs to use for establishing the initial connection to the Kafka cluster |
| `output.bad.producerConf` | Optional. Kafka producer configuration. See [the docs](https://kafka.apache.org/documentation/#producerconfigs) for all properties |

## enrich-rabbitmq-experimental

A minimal configuration file can be found on the [Github repo](https://github.com/snowplow/enrich/blob/master/config/config.rabbitmq.minimal.hocon), as well as a [comprehensive one](https://github.com/snowplow/enrich/blob/master/config/config.rabbitmq.extended.hocon).

| parameter | description |
|-|-|
| `input.queue` | Required. E.g. `raw`. Queue to read collector payloads from. |
| `input.cluster.nodes.host` | Required. E.g. `localhost`. Hostname of RabbitMQ cluster node. |
| `input.cluster.nodes.port` | Required. E.g. `5672`. Port of RabbitMQ cluster node.|
| `input.cluster.username` | Required. E.g. `guest`. Username to connect to the cluster. |
| `input.cluster.password` | Required. E.g. `guest`. Password to connect to the cluster. |
| `input.cluster.virtualHost` | Required. E.g. `"/"`. Virtual host to use when connecting to the cluster. |
| `input.cluster.ssl` | Optional. Default: `false`. Whether to use SSL or not to communicate with the cluster. |
| `input.cluster.connectionTimeout` | Optional. Default: `5`. Timeout for the connection to the cluster (in seconds). |
| `input.cluster.internalQueueSize` | Optional. Default: `1000`. Size of the fs2’s bounded queue used internally to communicate with the AMQP Java driver. |
| `input.cluster.automaticRecovery` | Optional. Default: `true`. Whether the AMQP Java driver should try to recover broken connections. |
| `input.cluster.requestedHeartbeat` | Optional. Default: `100`. Interval to check that the TCP connection to the cluster is still alive. |
| `input.checkpointBackoff.minBackoff` | Optional. Default: `100 ms`.  Minimum period before retrying to checkpoint. |
| `input.checkpointBackoff.maxBackoff` | Optional. Default: `10 seconds`.  Maximum period to retry checkpoint. |
| `input.checkpointBackoff.maxRetries` | Optional. Default: `10`. Maximum number of retries for checkpointing. |
| `output.good.exchange` | Required. E.g. `enriched`. Exchange to send the enriched events to. |
| `output.good.routingKey` | Required. E.g. `routingKey`. Routing key to use when sending the enriched events to the exchange. |
| `output.good.cluster.nodes.host` | Required. E.g. `localhost`. Hostname of RabbitMQ cluster node. |
| `output.good.cluster.nodes.port` | Required. E.g. `5672`. Port of RabbitMQ cluster node.|
| `output.good.cluster.username` | Required. E.g. `guest`. Username to connect to the cluster. |
| `output.good.cluster.password` | Required. E.g. `guest`. Password to connect to the cluster. |
| `output.good.cluster.virtualHost` | Required. E.g. `"/"`. Virtual host to use when connecting to the cluster. |
| `output.good.cluster.ssl` | Optional. Default: `false`. Whether to use SSL or not to communicate with the cluster. |
| `output.good.cluster.connectionTimeout` | Optional. Default: `5`. Timeout for the connection to the cluster (in seconds). |
| `output.good.cluster.internalQueueSize` | Optional. Default: `1000`. Size of the fs2’s bounded queue used internally to communicate with the AMQP Java driver. |
| `output.good.cluster.automaticRecovery` | Optional. Default: `true`. Whether the AMQP Java driver should try to recover broken connections. |
| `output.good.cluster.requestedHeartbeat` | Optional. Default: `100`. Interval to check that the TCP connection to the cluster is still alive. |
| `output.good.backoffPolicy.minBackoff` | Optional. Default: `100 ms`. Minimum period before retrying if writing to RabbitMQ fails. |
| `output.good.backoffPolicy.maxBackoff` | Optional. Default: `10 seconds`. Maximum period before retrying if writing to RabbitMQ fails. |
| `output.good.backoffPolicy.retries` | Optional. Default: `10`. Maximum number of retry if writing to RabbitMQ fails. If `maxRetries` is reached the app crashes. |
| `output.bad.exchange` | Like `output.good.exchange` for bad rows. |
| `output.bad.routingKey` | Like `output.good.routingKey` for bad rows. |
| `output.bad.cluster.nodes.host` | Like `output.good.cluster.nodes.host` for bad rows. |
| `output.bad.cluster.nodes.port` | Like `output.good.cluster.nodes.port` for bad rows. |
| `output.bad.cluster.username` | Like `output.good.cluster.username` for bad rows. |
| `output.bad.cluster.password` | Like `output.good.cluster.password` for bad rows. |
| `output.bad.cluster.virtualHost` | Like `output.good.cluster.virtualHost` for bad rows. |
| `output.bad.cluster.ssl` | Like `output.good.cluster.ssl` for bad rows. |
| `output.bad.cluster.connectionTimeout` | Like `output.good.cluster.connectionTimeout` for bad rows. |
| `output.bad.cluster.internalQueueSize` | Like `output.good.cluster.internalQueueSize` for bad rows. |
| `output.bad.cluster.automaticRecovery` | Like `output.good.cluster.automaticRecovery` for bad rows. |
| `output.bad.cluster.requestedHeartbeat` | Like `output.good.cluster.requestedHeartbeat` for bad rows. |
| `output.bad.backoffPolicy.minBackoff` | Like `output.good.backoffPolicy.minBackoff` for bad rows. |
| `output.bad.backoffPolicy.maxBackoff` | Like `output.good.backoffPolicy.maxBackoff` for bad rows. |
| `output.bad.backoffPolicy.retries` | Like `output.good.backoffPolicy.retries` for bad rows. |
| `output.pii.exchange` | Like `output.good.exchange` for pii events. |
| `output.pii.routingKey` | Like `output.good.routingKey` for pii events. |
| `output.pii.cluster.nodes.host` | Like `output.good.cluster.nodes.host` for pii events. |
| `output.pii.cluster.nodes.port` | Like `output.good.cluster.nodes.port` for pii events. |
| `output.pii.cluster.username` | Like `output.good.cluster.username` for pii events. |
| `output.pii.cluster.password` | Like `output.good.cluster.password` for pii events. |
| `output.pii.cluster.virtualHost` | Like `output.good.cluster.virtualHost` for pii events. |
| `output.pii.cluster.ssl` | Like `output.good.cluster.ssl` for pii events. |
| `output.pii.cluster.connectionTimeout` | Like `output.good.cluster.connectionTimeout` for pii events. |
| `output.pii.cluster.internalQueueSize` | Like `output.good.cluster.internalQueueSize` for pii events. |
| `output.pii.cluster.automaticRecovery` | Like `output.good.cluster.automaticRecovery` for pii events. |
| `output.pii.cluster.requestedHeartbeat` | Like `output.good.cluster.requestedHeartbeat` for pii events. |
| `output.pii.backoffPolicy.minBackoff` | Like `output.good.backoffPolicy.minBackoff` for pii events. |
| `output.pii.backoffPolicy.maxBackoff` | Like `output.good.backoffPolicy.maxBackoff` for pii events. |
| `output.pii.backoffPolicy.retries` | Like `output.good.backoffPolicy.retries` for pii events. |

## Enriched events validation against atomic schema

Enriched events are expected to match [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) schema.
However, until 3.0.0, it was never checked that the enriched events emitted by enrich were valid.
If an event is not valid against `atomic` schema, a bad row should be emitted instead of the enriched event.
However, this is a breaking change, and we want to give some time to users to adapt, in case today they are working downstream with enriched events that are not valid against `atomic`.
For this reason, this new validation was added as a feature that can be deactivated like that:

```json
"featureFlags": {
  "acceptInvalid": true
}
```

In this case, enriched events that are not valid against `atomic` schema will still be emitted as before, so that enrich 3.0.0 can be fully backward compatible.
It will be possible to know if the new validation would have had an impact by 2 ways:

1. A new metric `invalid_enriched` has been introduced.
    It reports the number of enriched events that were not valid against `atomic` schema. As the other metrics, it can be seen on stdout and/or StatsD.
2. Each time there is an enriched event invalid against `atomic` schema, a line will be logged with the bad row (add `-Dorg.slf4j.simpleLogger.log.InvalidEnriched=debug` to the `JAVA_OPTS` to see it).

If `acceptInvalid` is set to `false`, a bad row will be emitted instead of the enriched event in case it's not valid against `atomic` schema.

When we'll know that all our customers don't have any invalid enriched events any more, we'll remove the feature flags and it will be impossible to emit invalid enriched events.

## Enrichments

The list of the enrichments that can be configured can be found on [this page](/docs/enriching-your-data/available-enrichments/index.md).

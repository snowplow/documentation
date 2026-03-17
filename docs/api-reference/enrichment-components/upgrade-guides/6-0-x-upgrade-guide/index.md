---
title: "Enrich 6.0.x upgrade guide"
sidebar_label: "6.0.x upgrade guide"
sidebar_position: 50
description: "Upgrade guide for Snowplow Enrich 6.0.x covering common-streams refactoring, configuration changes, and deprecated features."
keywords: ["enrich 6.0", "common-streams", "configuration migration"]
---

In version 6.0.0, Enrich is refactored to use [common-streams](https://github.com/snowplow-incubator/common-streams) libraries under the hood. [common-streams](https://github.com/snowplow-incubator/common-streams) is the collection of libraries that contains streaming-related constructs commonly used across many Snowplow streaming applications.

[common-streams](https://github.com/snowplow-incubator/common-streams) allows for the adjustment of many different settings. It also provides default values for most of these settings, which are battle-tested. Therefore, we recommend using default values whenever it is possible. You can find more information about defaults in [configuration reference](/docs/api-reference/enrichment-components/configuration-reference/index.md).

Also, we took this opportunity to make a few breaking changes. Here are the changes:

### Config Field Changes

In version 6.0.0, some of the config fields are renamed or moved to a different section. Here are these changes:

* `incomplete` stream config field is renamed to `failed`.

* `acceptInvalid` and `exitOnJsCompileError` fields under `featureFlags` section are moved under the `validation` section.

* `experimental.metadata` section is moved to the root level.

* In enrich-kafka, `output.good.headers` field is renamed to `output.good.attributes`.

* In enrich-kafka, `blobStorage.azureStorage.accounts` section is moved to the `blobClients.accounts`.

* In enrich-kafka, we are now using [static membership](https://cwiki.apache.org/confluence/display/KAFKA/KIP-345%3A+Introduce+static+membership+protocol+to+reduce+consumer+rebalances) for the consumer, to reduce rebalancing in case of pod restart or crash. The default value for `group.instance.id` is set to the host name.

### Feature Deprecations

* Output `pii` stream is removed as in our experience it is not used. There will no longer be an option to write `pii_transformation` events to an extra output stream.

* Remote adapters are removed. This was another feature with little to no usage that allowed Enrich to support custom payloads (which would be sent to a configured URL for translation into the expected format). In practice, most of this can be already achieved with [Iglu Webhooks](/docs/sources/webhooks/iglu-webhook/index.md).

* Reading events from files and writing events to files is no longer supported. This has never been a viable option for production setups.

* In enrich-kinesis, passing enrichment configs to the application via DynamoDB is no longer possible.

* In enrich-kinesis, it is no longer possible to send KCL metrics to Cloudwatch.

## Metrics Changes

Existing metrics will continue to be emitted. Three new metrics are added:

* `failed`: Same value as the `incomplete` metric, for transition. The goal is to remove `incomplete` metric and to be consistent with the naming of streams/topics in configuration

* `e2e_latency_millis`: Same value as the `latency` metric, for transition. The goal is to remove `latency` metric so that the naming is consistent across applications

* `latency_millis`: Delay between the input record getting written to the stream and Enrich starting to process it

Furthermore, the old `latency` metric has changed subtly. Before, it represented the latency of the most recently processed event. Now it refers to the _maximum latency of all events_ since the previous metric was emitted.

---
title: "6.0.x Upgrade Guide"
sidebar_position: 50
---

In version 6.0.0, Enrich is refactored to use [common-streams](https://github.com/snowplow-incubator/common-streams) libraries under the hood. [common-streams](https://github.com/snowplow-incubator/common-streams) is the collection of libraries that contains streaming-related constructs commonly used across many Snowplow streaming applications. 

[common-streams](https://github.com/snowplow-incubator/common-streams) allows for the adjustment of many different settings. It also provides default values for most of these settings, which are battle-tested. Therefore, we recommend using default values whenever it is possible. You can find more information about defaults in [configuration reference](/docs/api-reference/enrichment-components/configuration-reference/index.md).

Also, we took this opportunity to make a few breaking changes. Here are the changes:

### Config Field Changes

In version 6.0.0, some of the config fields are renamed or moved to a different section. Here are these changes:

* `incomplete` stream is renamed to `failed`.

* `acceptInvalid` and `exitOnJsCompileError` fields under `featureFlags` section are moved under the `validation` section.

* `experimental.metadata` section is moved to the root level.

* In enrich-kafka, `output.good.headers` field is renamed to `output.good.attributes`.

* In enrich-kafka, `blobStorage.azureStorage.accounts` section is moved to the `blobClients.accounts`.

### Feature Deprecations

* Output `pii` stream is removed. There will no longer be an option to write `pii_transformation` events to an extra output stream.

* Remote adapters are removed.

* Reading events from files and writing events to files are deprecated.

* In enrich-kinesis, passing enrichment configs to the application via DynamoDB is no longer possible.

* In enrich-kinesis, it is no longer possible to send KCL metrics to Cloudwatch.

* In enrich-kafka, S3 and GCS blob storage integrations are removed.

## New metrics

Existing metrics will continue to be emitted. Three new metrics are added:

* `failed`: Same value as the `incomplete` metric, for transition. The goal is to remove `incomplete` metric and to be consistent with the naming of streams/topics in configuration

* `e2e_latency_millis`: Same value as the `latency` metric, for transition. The goal is to remove `latency` metric so that the naming is consistent across applications

* `latency_millis`: Delay between the input record getting written to the stream and Enrich starting to process it

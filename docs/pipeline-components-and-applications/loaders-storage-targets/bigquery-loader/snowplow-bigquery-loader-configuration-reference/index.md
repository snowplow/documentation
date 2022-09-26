---
title: "Configuration reference"
date: "2021-10-07"
sidebar_position: 0
---

This is a complete list of the options that can be configured in the Snowplow BigQuery Loader HOCON config file. The [example configs in github](https://github.com/snowplow-incubator/snowplow-bigquery-loader/tree/master/config) show how to prepare an input file.

## Required options

| projectId                          | Required. The GCP project in which all required Pub/Sub, BigQuery and GCS resources are hosted, eg my-project.                                       |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| loader.input.subscription          | Required. Enriched events subscription consumed by Loader and StreamLoader, eg enriched-sub.                                                         |
| loader.output.good.datasetId       | Required. Specify the dataset to which the events table belongs, eg snowplow.                                                                        |
| loader.output.good.tableId         | Required. The name of the events table, eg events.                                                                                                   |
| loader.output.bad.topic            | Required. The name of the topic where bad rows will be written, eg bad-topic.                                                                        |
| loader.output.types.topic          | Required. The name of the topic where observed types will be written, eg types-topic.                                                                |
| loader.output.failedInserts.topic  | Required. The name of the topic where failed inserts will be written, eg failed-inserts-topic.                                                       |
| mutator.input.subscription         | Required. A subscription on the loader.output.types.topic, eg types-sub.                                                                             |
| mutator.output.good.*              | Required. Equivalent to loader.output.good.*. Can be specified in detail or as ${loader.output.good}.                                                |
| repeater.input.subscription        | Required. Failed inserts subscription consumed by Repeater. Must be attached to the loader.output.failedInserts.topic, eg failed-inserts-sub.        |
| repeater.output.good.*             | Required. Equivalent to loader.output.good.*. Can be specified in detail or as ${loader.output.good}.                                                |
| repeater.output.deadLetters.bucket | Required. Failed inserts that repeatedly fail to be inserted into BigQuery are stored on GCS in this bucket, eg gs://dead-letter-bucket.             |
| monitoring.*                       | Optional. See below for details.Note: This was a required setting in 1.0.0. Can be left blank, ie {}, to disable this functionality in that version. |

## Monitoring options

| monitoring.statsd.*          | Optional. If set up, metrics will be emitted from StreamLoader and Repeater using the StatsD protocol. |
|------------------------------|--------------------------------------------------------------------------------------------------------|
| monitoring.statsd.hostname   | Optional, eg statsd.acme.gl.                                                                           |
| monitoring.statsd.port       | Optional, eg 1024.                                                                                     |
| monitoring.statsd.tags       | Optional. You can use env vars, eg {"worker": ${HOST}}.                                                |
| monitoring.statsd.period     | Optional, eg 10 sec.                                                                                   |
| monitoring.statsd.prefix     | Optional, eg snowplow.monitoring.                                                                      |
| monitoring.dropwizard.*      | Optional. If set up, metrics will be emitted from Loader using the Dropwizard protocol.                |
| monitoring.dropwizard.period | Optional, eg 10000 ms.                                                                                 |
| monitoring.stdout.*          | Optional. If set up, metrics will be logged to stdout at INFO level.                                   |
| monitoring.sentry            | Optional. If set up, errors will be sent to a Sentry endpoint.                                         |

## Advanced options

The defaults should be good for the overwhelming majority of deployments and hopefully you should never need to change these.

| `loader.loadMode.*`                   | BigQuery supports two loading APIs:- Streaming inserts API- Load jobs APIThis setting configures which one will be used.StreamLoader only supports the Streaming inserts API. Loader supports both but using the Load jobs API has experimental status.                                                                                                       |
|-------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `loader.loadMode.type`                | Defaults to `StreamingInserts`. The only other possible option is FileLoads. |
| `loader.loadMode.retry`               | Defaults to `false`. Specifies if failed inserts should be retried infinitely or sent straight to the&nbsp;failedInserts&nbsp;topic. When set to true, if a row cannot be inserted, it will be re-tried indefinitely, which can throttle the whole load. In that case a restart might be required. This setting is only supported by the Streaming inserts API. |
| `loader.loadMode.frequency`           | Defaults to `null`. Specifies how often the load job should be performed, in seconds. Unlike the near-real-time&nbsp;Streaming inserts&nbsp;API, load jobs are more batch-oriented. This setting is only supported by the Load jobs API. An example value is 60000.                                                                                             |
| `loader.consumerSettings.maxQueueSize`  | Defaults to `3000`. The maximum number of unacked messages that stream loader can hold in memory at once |
| `loader.consumerSettings.parallelPullCount`   | Defaults to `3`. The number of pullers used to pull messages from the input subscription |
| `loader.consumerSettings.maxRequestBytes` | Defaults to `50000000`. The maximum size of unacked messages that stream loader can hold in memory at once |
| `loader.consumerSettings.maxAckExtensionPeriod`   | Defaults to `1 hour`. The maximum period a message ACK deadline will be extended to. |
| `loader.consumerSettings.awaitTerminatePeriod` | Defaults to `10 seconds`. If the underlying PubSub subcriber fails to terminate cleanly, how long do we wait until it's forcibly timed out |
| `loader.sinkSettings.good.*`          | Settings for the good sink value in the StreamLoader code. For more details see here. For recommended number of records in each request, see here. For the HTTP request size limit, see here.   |
| `loader.sinkSettings.bad.*`           | Settings for the bad sink value in the StreamLoader code. For more details see here. |
| `loader.sinkSettings.types.*`         | Settings for the type sink value in the StreamLoader code. For more details see here. |
| `loader.sinkSettings.failedInserts.*` | Settings for the failed insert sink value in the StreamLoader code. For more details see here. |
| `loader.retrySettings.*`              | Retry settings for the BigQuery client. For more details see here. |
| `loader.terminationTimeout`           | Defaults to `1 minute`. Specifies how long to wait before terminating the application after receiving SIGINT. This is meant to allow time for all events in-flight to be processed and acknowledged before exiting. |

## Config parser hints

These settings only exist as hints to the config parsing library we use, so that the configuration can be represented as Scala code. They each only have one possible value and should never be changed.

| loader.input.type                | PubSub                |
|----------------------------------|-----------------------|
| loader.output.good.type          | BigQuery              |
| loader.output.bad.type           | PubSub                |
| loader.output.types.type         | PubSub                |
| loader.output.failedInserts.type | PubSub                |
| loader.retrySettings.type        | BigQueryRetrySettings |
| mutator.input.type               | PubSub                |
| repeater.input.type              | PubSub                |
| repeater.output.deadLetters.type | Gcs                   |

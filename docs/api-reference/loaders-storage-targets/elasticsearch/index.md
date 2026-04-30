---
title: "Elasticsearch Loader"
sidebar_label: "Elasticsearch Loader"
date: "2020-11-25"
sidebar_position: 64
description: "Load Snowplow enriched and bad events from a Kinesis stream into Elasticsearch or OpenSearch clusters."
keywords: ["elasticsearch loader", "opensearch", "kinesis elasticsearch", "event search"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

If you are using [Enrich](/docs/api-reference/enrichment-components/index.md) to write enriched Snowplow events to one stream and bad events to another, you can use the Elasticsearch Loader to read events from a Kinesis stream and write them to [Elasticsearch](http://www.elasticsearch.org/overview/) or [OpenSearch](https://opensearch.org/).

:::note

We only offer this loader on AWS or as part of [Snowplow Mini](/docs/api-reference/snowplow-mini/index.md).

:::

## What the data looks like

There are a few changes compared to the [standard structure of Snowplow data](/docs/fundamentals/canonical-event/index.md).

### Boolean fields reformatted

All boolean fields like `br_features_java` are normally either `"0"` or `"1"`. In Elasticsearch, these values are converted to `false` and `true`.

### New `geo_location` field

The `geo_latitude` and `geo_longitude` fields are combined into a single `geo_location` field of Elasticsearch's ["geo_point" type](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html).

### Self-describing events

Each [self-describing event](/docs/fundamentals/events/index.md#self-describing-events) gets its own field (same [naming rules](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md?warehouse=snowflake#location) as for Snowflake). For example:

```json
{
  "unstruct_com_snowplowanalytics_snowplow_link_click_1": {
    "targetUrl": "http://snowplow.io",
    "elementId": "action",
    "elementClasses": [],
    "elementTarget": ""
  }
}
```

### Entities

Each [entity](/docs/fundamentals/entities/index.md) type attached to the event gets its own field (same [naming rules](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md?warehouse=snowflake#location) as for Snowflake). The field contains an array with the data for all entities of the given type. For example:

```json
{
  "contexts_com_acme_user_1": [
    {
      "name": "Alice"
    }
  ],
  "contexts_com_acme_product_1": [
    {
      "name": "Apple"
    },
    {
      "name": "Orange"
    }
  ]
}
```

## Setup guide

### Configuring Elasticsearch

#### Getting started

First, install and set up Elasticsearch. For more information, see the [installation guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html) for installation information and [Supported versions of OpenSearch and Elasticsearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html#choosing-version) for the latest information of ElasticSearch/OpenSearch supported versions by AWS.

:::note[Supported versions]

The Elasticsearch Loader supports Elasticsearch 6.x, 7.x, 8.x, and 9.x. It also supports OpenSearch 1.x, 2.x, and 3.x.

:::

#### Raising the file limit

Elasticsearch keeps a lot of files open simultaneously, so you will need to increase the maximum number of files a user can have open. To do this:

<CodeBlock language="bash">{
`sudo vim /etc/security/limits.conf
`}</CodeBlock>

Append the following lines to the file:

<CodeBlock language="bash">{
`{{USERNAME}} soft nofile 32000
{{USERNAME}} hard nofile 32000
`}</CodeBlock>

Where `{{USERNAME}}` is the name of the user running Elasticsearch. You will need to logout and restart Elasticsearch before the new file limit takes effect.

To check that this new limit has taken effect you can run the following command from the terminal:

<CodeBlock language="bash">{
`curl localhost:9200/_nodes/process?pretty
`}</CodeBlock>

If the `max_file_descriptors` equals 32000 it is running with the new limit.

#### Defining the mapping

Use the following request to create the mapping with Elasticsearch 7+:

<CodeBlock language="bash">{
`curl -XPUT 'http://localhost:9200/snowplow' -d '{
    "settings": {
        "analysis": {
            "analyzer": {
                "default": {
                    "type": "keyword"
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "geo_location": {
                "type": "geo_point"
            }
        }
    }
}'
`}</CodeBlock>

Note that Elasticsearch 7+ [no longer uses mapping types](https://www.elastic.co/guide/en/elasticsearch/reference/current/removal-of-types.html). If you have an older version, you might need to include mapping types in the above snippet.

This initialization sets the default analyzer to "keyword". This means that string fields will not be split into separate tokens for the purposes of searching. This saves space and ensures that URL fields are handled correctly.

If you want to tokenize specific string fields, you can change the "properties" field in the mapping like this:

<CodeBlock language="bash">{
`curl -XPUT 'http://localhost:9200/snowplow' -d '{
    "settings": {
        "analysis": {
            "analyzer": {
                "default": {
                    "type": "keyword"
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "geo_location": {
                "type": "geo_point"
            },
            "field_to_tokenize": {
                "type": "string",
                "analyzer": "english"
            }
        }
    }
}'
`}</CodeBlock>

### Installing the Elasticsearch Loader

The Elasticsearch Loader is published on Docker Hub:

<CodeBlock language="bash">{
`docker pull snowplow/elasticsearch-loader:${versions.esLoader}
`}</CodeBlock>

The container can be run with the following command:

<CodeBlock language="bash">{
`docker run \\
  -v /path/to/config.hocon:/snowplow/config.hocon \\
  snowplow/elasticsearch-loader:${versions.esLoader} \\
  --config /snowplow/config.hocon
`}</CodeBlock>

### Configure the Elasticsearch Loader

The loader is configured using a HOCON file. You can find a minimal example and a full reference example in the [config directory](https://github.com/snowplow/snowplow-elasticsearch-loader/tree/master/config).

#### License acceptance

The loader requires explicit acceptance of the [Snowplow Limited Use License Agreement](https://docs.snowplow.io/limited-use-license-1.1):

```hocon
"license": {
  "accept": true
}
```

#### Input

The loader reads from a Kinesis stream. The following fields configure the input:

| Name | Description |
| ---- | ----------- |
| `input.streamName` | Required. Name of the Kinesis stream to read from. |
| `input.appName` | Optional. Name used for the KCL DynamoDB lease table. Default: `"snowplow-elasticsearch-loader"`. |
| `input.initialPosition.type` | Optional. Where to start reading the first time the app runs. Options: `"TRIM_HORIZON"` (oldest), `"LATEST"` (newest), or `"AT_TIMESTAMP"`. Default: `"TRIM_HORIZON"`. On subsequent runs, the app always resumes from the last checkpoint. |
| `input.initialPosition.timestamp` | Required when `initialPosition.type` is `"AT_TIMESTAMP"`. Timestamp to start reading from, e.g. `"2023-01-01T00:00:00Z"`. |
| `input.retrievalMode.type` | Optional. How the KCL fetches events. Options: `"Polling"` or `"FanOut"` (Kinesis Enhanced Fan-Out). Default: `"Polling"`. |
| `input.retrievalMode.maxRecords` | Optional. Used when `retrievalMode.type` is `"Polling"`. Maximum number of events per poll request. Default: `750`. |
| `input.retrievalMode.idleTimeBetweenReads` | Optional. Used when `retrievalMode.type` is `"Polling"`. Idle time between `GetRecords` requests. Default: `"1500 millis"`. |
| `input.workerIdentifier` | Optional. Name of this KCL worker in the DynamoDB lease table. Default: `${HOSTNAME}`. |
| `input.leaseDuration` | Optional. Duration of shard leases. Workers must refresh leases in DynamoDB before this expires. Default: `"10 seconds"`. |
| `input.maxLeasesToStealAtOneTimeFactor` | Optional. Controls how many leases can be stolen at once, as a multiple of available processors. Default: `2.0`. |
| `input.checkpointThrottledBackoffPolicy.minBackoff` | Optional. Minimum backoff when DynamoDB provisioned throughput limits are hit. Default: `"100 millis"`. |
| `input.checkpointThrottledBackoffPolicy.maxBackoff` | Optional. Maximum backoff when DynamoDB provisioned throughput limits are hit. Default: `"1 second"`. |
| `input.debounceCheckpoints` | Optional. How often to checkpoint progress to DynamoDB. Default: `"10 seconds"`. |
| `input.maxRetries` | Optional. Maximum number of retries for Kinesis API operations. Default: `10`. |
| `input.apiCallAttemptTimeout` | Optional. Maximum time for a single AWS API call attempt. Default: `"15 seconds"`. |

#### Output: good events

Good events are written to Elasticsearch. The following fields configure the Elasticsearch output:

| Name | Description |
| ---- | ----------- |
| `output.good.url` | Required. URL of the Elasticsearch cluster, including scheme and port. Example: `"http://localhost:9200"`. |
| `output.good.index` | Required. Name of the Elasticsearch index to write events into. |
| `output.good.auth.type` | Required. Authentication method. Options: `"NoAuth"`, `"Basic"`, or `"AWSSigning"`. |
| `output.good.auth.username` | Required when `auth.type` is `"Basic"`. HTTP Basic Auth username. |
| `output.good.auth.password` | Required when `auth.type` is `"Basic"`. HTTP Basic Auth password. |
| `output.good.auth.region` | Required when `auth.type` is `"AWSSigning"`. AWS region of the OpenSearch Service domain. |
| `output.good.auth.serviceSigningName` | Required when `auth.type` is `"AWSSigning"`. AWS service name for SigV4 signing. Use `"es"` for OpenSearch Service or `"aoss"` for OpenSearch Serverless. |
| `output.good.documentType` | Optional. Elasticsearch document type. Only required for Elasticsearch 6.x compatibility. |
| `output.good.sharding.dateFormat` | Optional. Date format to append to the index name for time-partitioned indices, e.g. `"yyyy-MM-dd"`. |
| `output.good.sharding.dateField` | Required when `sharding` is set. Timestamp field to extract the date from for index sharding. Must be one of: `collector_tstamp`, `derived_tstamp`, `dvce_created_tstamp`, `dvce_sent_tstamp`, `etl_tstamp`, `refr_dvce_tstamp`, `true_tstamp`. |
| `output.good.indexTimeout` | Optional. Timeout passed to Elasticsearch for each bulk request. Default: `"1 minute"`. |
| `output.good.additionalBadRowErrorTypes` | Optional. Additional Elasticsearch error types to treat as permanent bad rows instead of retrying. By default, `mapper_parsing_exception` and `document_parsing_exception` are treated as bad rows. |

#### Output: bad rows

Events that cannot be written to Elasticsearch are sent to a Kinesis stream as bad rows:

| Name | Description |
| ---- | ----------- |
| `output.bad.streamName` | Required. Name of the Kinesis stream for bad rows. |
| `output.bad.maxRecordSize` | Optional. Maximum record size in bytes. Records exceeding this are replaced with a `SizeViolation` bad row. Default: `1000000`. |
| `output.bad.throttledBackoffPolicy.minBackoff` | Optional. Minimum backoff when Kinesis write throughput limits are exceeded. Default: `"100 milliseconds"`. |
| `output.bad.throttledBackoffPolicy.maxBackoff` | Optional. Maximum backoff when Kinesis write throughput limits are exceeded. Default: `"1 second"`. |
| `output.bad.recordLimit` | Optional. Maximum number of records per `PutRecords` request. Default: `500`. |
| `output.bad.byteLimit` | Optional. Maximum number of bytes per `PutRecords` request. Default: `5242880`. |
| `output.bad.maxRetries` | Optional. Maximum number of retries for Kinesis write operations. Default: `10`. |

#### Purpose

| Name | Description |
| ---- | ----------- |
| `purpose` | Required. Type of events to process. Options: `"ENRICHED_EVENTS"` for Snowplow enriched events, `"BAD_ROWS"` for Snowplow bad rows, or `"JSON"` for arbitrary JSON. |

#### Batching

The loader accumulates events into batches before sending them to Elasticsearch. A batch is flushed when the first condition is met:

| Name | Description |
| ---- | ----------- |
| `batching.maxBytes` | Optional. Flush after this many source bytes have been accumulated. Default: `10000000`. |
| `batching.maxDelay` | Optional. Flush after this delay has elapsed. Default: `"1 second"`. |

#### Retries

| Name | Description |
| ---- | ----------- |
| `retries.transientErrors.delay` | Optional. Delay between retry attempts for transient Elasticsearch errors. Default: `"1 second"`. |
| `retries.transientErrors.attempts` | Optional. Maximum number of retry attempts before treating the batch as failed. Default: `5`. |

#### Decompression

The loader automatically detects and decompresses zstd- or gzip-compressed Kinesis messages. Uncompressed messages are unaffected.

| Name | Description |
| ---- | ----------- |
| `decompression.maxBytesInBatch` | Optional. Maximum total decompressed bytes per batch. Protects memory when a single compressed message expands into many large records. Default: `5242880`. |
| `decompression.maxBytesSinglePayload` | Optional. Maximum size of a single decompressed record in bytes. Records exceeding this limit are dropped and emitted as bad rows. Default: `10000000`. |

#### Parallelism

| Name | Description |
| ---- | ----------- |
| `cpuParallelismFactor` | Optional. Controls how the app splits the workload into concurrent batches for parsing and transformation, as a multiple of available processors. Default: `1`. |
| `uploadParallelismFactor` | Optional. Controls how many Elasticsearch bulk upload jobs can run in parallel, as a multiple of available processors. Default: `4`. |

#### Monitoring

The loader exposes runtime metrics and health information through several optional integrations:

| Name | Description |
| ---- | ----------- |
| `monitoring.metrics.statsd.hostname` | Optional. Hostname of the StatsD server to send metrics to. |
| `monitoring.metrics.statsd.port` | Optional. Port of the StatsD server. Default: `8125`. |
| `monitoring.metrics.statsd.tags` | Optional. Map of key/value pairs sent along with each metric. |
| `monitoring.metrics.statsd.period` | Optional. How often to report metrics. Default: `"1 minute"`. |
| `monitoring.metrics.statsd.prefix` | Optional. Prefix for metric names. |
| `monitoring.metrics.prometheus.tags` | Optional. Map of key/value pairs used as common labels on all Prometheus metrics. When set, a `/metrics` endpoint is exposed for scraping. |
| `monitoring.sentry.dsn` | Optional. Sentry DSN for reporting unexpected runtime exceptions. |
| `monitoring.sentry.tags` | Optional. Map of key/value pairs included as tags on Sentry events. |
| `monitoring.healthProbe.port` | Optional. Port for the HTTP health probe server. Returns `200 OK` when healthy. |
| `monitoring.healthProbe.unhealthyLatency` | Optional. The health probe becomes unhealthy if any received event has not been fully processed before this cutoff time. Default: `"2 minutes"`. |

#### Telemetry

| Name | Description |
| ---- | ----------- |
| `telemetry.disable` | Optional. Set to `true` to disable telemetry. Default: `false`. |
| `telemetry.userProvidedId` | Optional. Identifier to tie events together across modules and infrastructure. |

## Check document count

To check the number of documents in an Elasticsearch or OpenSearch cluster, use the [Count API](https://docs.opensearch.org/latest/api-reference/search-apis/count/) provided by Elasticsearch/OpenSearch. For example, to get the total number of documents in the cluster, use `GET _count`.

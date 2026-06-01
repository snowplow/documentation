---
title: "Elasticsearch Loader 3.0.x upgrade guide"
sidebar_label: "3.0.x upgrade guide"
sidebar_position: 50
description: "Upgrade guide for Snowplow Elasticsearch Loader 3.0.x covering common-streams refactoring, configuration changes, and removed features."
keywords: ["elasticsearch loader 3.0", "common-streams", "configuration migration", "kinesis"]
date: "2026-04-28"
---

In version 3.0.0, the Elasticsearch Loader is rewritten to use [common-streams](https://github.com/snowplow-incubator/common-streams) libraries under the hood. [common-streams](https://github.com/snowplow-incubator/common-streams) is the collection of libraries that contains streaming-related constructs commonly used across many Snowplow streaming applications.

This is a breaking change: the configuration format has changed significantly. You will need to migrate your configuration file before upgrading.

## Removed features

The following features from 2.x are no longer available in 3.0.0.

### Remove NSQ support

The Elasticsearch Loader no longer supports NSQ as an input or output. Only Kinesis is supported. If you are running the loader with NSQ, you will need to migrate to Kinesis before upgrading.

### Remove CloudWatch metrics

The `monitoring.metrics.cloudWatch` config option is removed. Metrics are now reported via [StatsD](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md#monitoring) or exposed via a [Prometheus `/metrics` endpoint](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md#monitoring).

### Remove Snowplow monitoring

The `monitoring.snowplow` section (collector URI and app ID for self-monitoring events) is removed. There is no replacement.

## Configuration changes

The configuration format has changed significantly. The sections below describe each change and how to migrate.

### Accept the license

A new top-level `license` section is required:

```hocon
"license": {
  "accept": true
}
```

### Configure the input

The `input.type` field is removed. Kinesis is the only supported input and no longer needs to be specified.

`input.initialPosition` changes from a plain string to an object:

```hocon
# Before
"input": {
  "initialPosition": "TRIM_HORIZON"
  "initialTimestamp": "2023-01-01T00:00:00Z"  # only used for AT_TIMESTAMP
}

# After
"input": {
  "initialPosition": {
    "type": "TRIM_HORIZON"
    # "timestamp": "2023-01-01T00:00:00Z"  # only required for AT_TIMESTAMP
  }
}
```

`input.maxRecords` moves into the new `input.retrievalMode` object:

```hocon
# Before
"input": {
  "maxRecords": 10000
}

# After
"input": {
  "retrievalMode": {
    "type": "Polling"
    "maxRecords": 750
  }
}
```

Kinesis Enhanced Fan-Out is now supported by setting `retrievalMode.type` to `"FanOut"`.

The `input.region` field is removed. Region is resolved automatically via the [AWS region provider chain](https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/regions/providers/DefaultAwsRegionProviderChain.html).

The `input.buffer` section is removed. Batching is now controlled by the top-level [`batching`](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md#batching) section.

### Output: good events

The `output.good.type` field is removed. Elasticsearch is the only supported output.

`output.good.client.endpoint`, `output.good.client.port`, and `output.good.client.ssl` are replaced by a single `output.good.url` field that includes the scheme, host, and port:

```hocon
# Before
"output": {
  "good": {
    "client": {
      "endpoint": "localhost"
      "port": 9200
      "ssl": false
    }
  }
}

# After
"output": {
  "good": {
    "url": "http://localhost:9200"
  }
}
```

Authentication is now configured via a unified `output.good.auth` object, replacing the separate `output.good.client.username`/`password` and `output.good.aws.signing`/`region` fields:

```hocon
# Before (HTTP Basic Auth)
"output": {
  "good": {
    "client": {
      "username": "elastic"
      "password": "changeme"
    }
  }
}

# After (HTTP Basic Auth)
"output": {
  "good": {
    "auth": {
      "type": "Basic"
      "username": "elastic"
      "password": "changeme"
    }
  }
}
```

```hocon
# Before (AWS SigV4 signing)
"output": {
  "good": {
    "aws": {
      "signing": true
      "region": "eu-west-1"
    }
  }
}

# After (AWS SigV4 signing)
"output": {
  "good": {
    "auth": {
      "type": "AWSSigning"
      "region": "eu-west-1"
      "serviceSigningName": "es"  # use "aoss" for OpenSearch Serverless
    }
  }
}
```

`output.good.cluster.index` and `output.good.cluster.documentType` are moved up one level:

```hocon
# Before
"output": {
  "good": {
    "cluster": {
      "index": "snowplow"
      "documentType": "_doc"
    }
  }
}

# After
"output": {
  "good": {
    "index": "snowplow"
    # "documentType": "_doc"  # only needed for ES 6.x
  }
}
```

Index sharding fields move from `output.good.client` into a dedicated `output.good.sharding` object:

```hocon
# Before
"output": {
  "good": {
    "client": {
      "shardDateFormat": "yyyy-MM-dd"
      "shardDateField": "derived_tstamp"
    }
  }
}

# After
"output": {
  "good": {
    "sharding": {
      "dateFormat": "yyyy-MM-dd"
      "dateField": "derived_tstamp"
    }
  }
}
```

`output.good.client.maxRetries` is replaced by `retries.transientErrors.attempts` in the top-level [`retries`](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md#retries) section.

`output.good.chunk.byteLimit` and `output.good.chunk.recordLimit` are removed. Batching is now controlled by the top-level [`batching`](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md#batching) section.

### Output: bad rows

`output.bad.type` is removed. Bad rows are always written to Kinesis.

`output.bad.region` is removed. Region is resolved automatically.

### Monitoring

`monitoring.snowplow` and `monitoring.metrics.cloudWatch` are removed. Replace with the new monitoring options:

```hocon
# After
"monitoring": {
  "metrics": {
    "statsd": {
      "hostname": "127.0.0.1"
      "port": 8125
      "period": "1 minute"
      "prefix": "snowplow.elasticsearch.loader"
    }
    # or expose a Prometheus /metrics endpoint:
    # "prometheus": {}
  }
  "healthProbe": {
    "port": 8000
  }
}
```

## New features

Version 3.0.0 introduces the following new capabilities.

### Decompression

The loader now automatically decompresses zstd- and gzip-compressed Kinesis messages. No configuration is required to enable this. See the [`decompression`](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md#decompression) section for optional tuning.

### Sentry integration

Unexpected runtime exceptions can now be reported to Sentry via `monitoring.sentry.dsn`.

## Metrics changes

The following metrics are available in 3.0.x:

| Metric | Description |
| ------ | ----------- |
| `events_good` | Count of events successfully written to Elasticsearch. |
| `events_bad` | Count of events sent to the bad rows stream. |
| `latency_millis` | Delay between the input record being written to Kinesis and the loader starting to process it. |
| `e2e_latency_millis` | End-to-end latency from the input record being written to Kinesis to it being written to Elasticsearch. |
| `elasticsearch_latency_millis` | Time taken for Elasticsearch bulk requests to complete. |

## Supported Elasticsearch and OpenSearch versions

Version 3.0.0 adds support for Elasticsearch 8.x and 9.x, and OpenSearch 3.x. The full supported range is now Elasticsearch 6.x–9.x and OpenSearch 1.x–3.x.

---
title: "Elasticsearch Loader"
date: "2020-11-25"
sidebar_position: 600
---

If you are using [Stream Enrich](/docs/migrated/pipeline-components-and-applications/enrichment-components/stream-enrich/) to write enriched Snowplow events to one stream and bad events to another, you can use the Elasticsearch Loader to read events from either of those streams and write them to [Elasticsearch](http://www.elasticsearch.org/overview/). It works with either Kinesis or NSQ streams.

When loading enriched events, the resulting JSONs are like the [Snowplow Canonical Event model](/docs/migrated/understanding-your-pipeline/canonical-event/) with the following changes:

### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader#boolean-fields-reformatted)Boolean fields reformatted

All boolean fields like `br_features_java` are either `"0"` or `"1"` in the canonical event model. The JSON converts these values to `false` and `true`.

### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader#new-geo_location-field)New `geo_location` field

The `geo_latitude` and `geo_longitude` fields are combined into a single `geo_location` field of Elasticsearch's ["geo\_point" type](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html).

### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader#unstructured-events)Unstructured events

Unstructured events are expanded into full JSONs. For example, the event

```
{
    "schema": "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1",
    "data": {
        "targetUrl": "http://snowplowanalytics.com/analytics/index.html",
        "elementId": "action",
        "elementClasses": [],
        "elementTarget": ""
	}
}
```

would be converted to the field

```
{
    "unstruct_com_snowplowanalytics_snowplow_link_click_1": {
        "targetUrl": "http://snowplowanalytics.com/analytics/index.html",
        "elementId": "action",
        "elementClasses": [],
        "elementTarget": ""
    }
}
```

### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader#custom-contexts)Custom contexts

Each custom context in an array is similarly expanded to a JSON with its own field. For example, the array

```
[
    {
        "schema": "iglu:com.acme/contextOne/jsonschema/1-0-0",
        "data": {
            "key": "value"
        }
    }
    {
        "schema": "iglu:com.acme/contextTwo/jsonschema/3-0-0",
        "data": {
            "name": "second"
        }
    }
]
```

would be converted to

```
{
    "contexts_com_acme_context_one_1": {
        "key": "value"
    },
    "contexts_com_acme_context_two_3": {
        "name": "second"
    }
}
```

## Setup guide

### Configuring Elasticsearch

#### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader-Setup#getting-started)Getting started

First off, install and set up Elasticsearch version 7.x or 6.x. For more information check out the [installation guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html).

#### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader-Setup#raising-the-file-limit)Raising the file limit

Elasticsearch keeps a lot of files open simultaneously so you will need to increase the maximum number of files a user can have open. To do this:

```
sudo vim /etc/security/limits.conf
```

Append the following lines to the file:

```
{{USERNAME}} soft nofile 32000
{{USERNAME}} hard nofile 32000
```

Where {{USERNAME}} is the name of the user running Elasticsearch. You will need to logout and restart Elasticsearch before the new file limit takes effect.

To check that this new limit has taken effect you can run the following command from the terminal:

```
curl localhost:9200/_nodes/process?pretty
```

If the `max_file_descriptors` equals 32000 it is running with the new limit.

#### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader-Setup#defining-the-mapping)Defining the mapping

Use the following request to create the mapping with Elasticsearch 7.x:

```
curl -XPUT 'http://localhost:9200/snowplow' -d '{
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
```

Note that [mapping types are removed](https://www.elastic.co/guide/en/elasticsearch/reference/current/removal-of-types.html) starting from Elasticsearch 7.0.0. If you use any older version, you might need to include mapping type also.

This initialization sets the default analyzer to "keyword". This means that string fields will not be split into separate tokens for the purposes of searching. This saves space and ensures that URL fields are handled correctly.

If you want to tokenize specific string fields, you can change the "properties" field in the mapping like this:

```
curl -XPUT 'http://localhost:9200/snowplow' -d '{
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
```

### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader-Setup#installing-the-elasticsearch-loader)Installing the Elasticsearch Loader

The Elasticsearch Loader is published on Docker Hub:

```
docker pull snowplow/snowplow-elasticsearch-loader:2.0.6
```

The container can be run with the following command:

```
docker run \
  -v /path/to/config.hocon:/snowplow/config.hocon \
  snowplow/snowplow-elasticsearch-loader:2.0.6 \
  --config /snowplow/config.hocon
```

Alternatively you can download and run a [jar file from the github release](https://github.com/snowplow/snowplow-elasticsearch-loader/releases):

```
java -jar snowplow-elasticsearch-loader-2.0.6.jar --config /path/to/config.hocon
```

### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader-Setup#using-the-elasticsearch-loader)Using the Elasticsearch Loader

#### [](https://github.com/snowplow/snowplow/wiki/Elasticsearch-Loader-Setup#configuration)Configuration

The sink is configured using a HOCON file, for which you can find examples [here](https://github.com/snowplow/snowplow-elasticsearch-loader/tree/master/config). These are the fields:

| Name | Description |
| --- | --- |
| purpose | Required. "ENRICHED\_EVENTS" for a stream of successfully enriched events  
"BAD\_ROWS" for a stream of bad events  
"JSON" for writing plain json |
| input.type | Required. Configures where input events will be read from.  
Can be “kinesis”, “stdin” or “nsq” |
| input.streamName | Required when `input.type` is kinesis or nsq. Name of the stream to read from. |
| input.initialPosition | Required when `input.type` is kinesis. Used when `input.type` is Kinesis. Specifies where to start reading from the stream the first time the app is run. "TRIM\_HORIZON" for as far back as possible, "LATEST" for as recent as possibly, "AT\_TIMESTAMP" for after specified timestamp. |
| input.initialTimestamp | Used when `input.type` is kinesis. Required when `input.initialTimestamp` is "AT\_TIMESTAMP". Specifies the timestamp to start read. |
| input.maxRecords | Used when `input.type` is kinesis. Optional. Maximum number of records fetched in a single request. Default value 10000. |
| input.region | Used when `input.type` is kinesis. Optional if it can be resolved with [AWS region provider chain](https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/regions/providers/DefaultAwsRegionProviderChain.html). Region where the Kinesis stream is located. |
| input.customEndpoint | Used when `input.type` is kinesis. Optional. Custom endpoint to override AWS Kinesis endpoints, this can be used to specify local endpoints when using localstack. |
| input.dynamodbCustomEndpoint | Used when `input.type` is kinesis. Optional. Custom endpoint to override AWS DynamoDB endpoints for Kinesis checkpoints lease table, this can be used to specify local endpoints when using Localstack. |
| input.appName | Used when `input.type` is kinesis. Optional. Used by a DynamoDB table to maintain stream state. Default value "snowplow-elasticsearch-loader". |
| input.buffer.byteLimit | Used when `input.type` is kinesis. Optional. The limit of the buffer in terms of bytes. When this value is exceeded, events will be sent to Elasticsearch. Default value 1000000. |
| input.buffer.recordLimit | Used when `input.type` is kinesis. Optional. The limit of the buffer in terms of record count. When this value is exceeded, events will be sent to Elasticsearch. Default value 500. |
| input.buffer.timeLimit | Used when `input.type` is kinesis. Optional. The time limit in milliseconds to wait to send the buffer to Elasticsearch. Default value 500. |
| input.channelName | Required when `input.type` is nsq. Channel name for NSQ source stream. If more than one application reading from the same NSQ topic at the same time, all of them must have unique channel name to be able to get all the data from the same topic. |
| input.nsqlookupdHost | Required when `input.type` is nsq. Host name for nsqlookupd |
| input.nsqlookupdPort | Required when `input.type` is nsq. HTTP port for nsqd. |
| output.good.type | Required. Configure where to write good events. Can be "elasticsearch" or "stdout". |
| output.good.client.endpoint | Required. The Elasticsearch cluster endpoint. |
| output.good.client.port | Optional. The port the Elasticsearch cluster can be accessed on. Default value 9200. |
| output.good.client.username | Optional. HTTP Basic Auth username. Can be removed if not active. |
| output.good.client.password | Optional. HTTP Basic Auth password. Can be removed if not active. |
| output.good.client.shardDateFormat | Optional. Formatting used for sharding good stream, i.e. \_yyyy-MM-dd. Can be removed if not needed. |
| output.good.client.shardDateField | Optional. Timestamp field for sharding good stream. If not specified derived\_tstamp is used. |
| output.good.client.maxRetries | Optional. The maximum number of request attempts before giving up. Default value 6. |
| output.good.client.ssl | Optional. Whether to use ssl or not. Default value false. |
| output.good.aws.signing | Optional. Whether to activate AWS signing or not. It should be activated if AWS OpenSearch service is used. Default value false. |
| output.good.aws.region | Optional. Region where the AWS OpenSearch service is located. |
| output.good.cluster.index | Required. The Elasticsearch index name. |
| output.good.cluster.documentType | Optional. The Elasticsearch index type. Index types are deprecated in ES >=7.x Therefore, it shouldn't be set with ES >=7.x |
| output.good.chunk.byteLimit | Optional. Bulk request to Elasticsearch will be splitted to chunks according given byte limit. Default value 1000000. |
| output.good.chunk.recordLimit | Optional. Bulk request to Elasticsearch will be splitted to chunks according given record limit. Default value 500. |
| output.bad.type | Required. Configure where to write bad rows. Can be "kinesis", "nsq", "stderr" or "none". |
| output.bad.streamName | Required. Stream name for events which are rejected by Elasticsearch. |
| output.bad.region | Used when `output.bad.type` is kinesis. Optional if it can be resolved with [AWS region provider chain](https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/regions/providers/DefaultAwsRegionProviderChain.html). Region where the bad Kinesis stream is located. |
| output.bad.customEndpoint | Used when `output.bad.type` is kinesis. Optional. Custom endpoint to override AWS Kinesis endpoints, this can be used to specify local endpoints when using localstack. |
| output.bad.nsqdHost | Required when `output.bad.type` is nsq. Host name for nsqd. |
| output.bad.nsqdPort | Required when `output.bad.type` is nsq. HTTP port for nsqd. |
| monitoring.snowplow.collector | Optional. Snowplow collector URI for monitoring. Can be removed together with monitoring section. |
| monitoring.snowplow.appId | Optional. The app id used in decorating the events sent for monitoring. Can be removed together with monitoring section. |
| monitoring.metrics.cloudWatch | Optional. Whether to enable Cloudwatch metrics or not. Default value true. |

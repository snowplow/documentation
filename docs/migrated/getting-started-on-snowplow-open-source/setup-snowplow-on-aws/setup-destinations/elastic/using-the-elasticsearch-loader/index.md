---
title: "Using the Elasticsearch Loader"
date: "2020-02-26"
sidebar_position: 30
---

### Configuration

The sink is configured using a HOCON file, for which you can find an example [here](https://raw.githubusercontent.com/snowplow/snowplow-elasticsearch-loader/master/examples/config.hocon.sample). These are the fields:

- `source`: Change this to "kinesis", "stdin" or "nsq".
- `sink.good`: Where to write good events. "elasticsearch" or "stdout".
- `sink.bad`: Where to write error JSONs for bad events. "kinesis", "stderr" or "nsq" (or "none" to ignore bad events).
- `enabled`: "good" if the input stream contains successfully enriched events; "bad" if it contains bad rows; "plain-json" if it contains plain JSON.
- `aws.accessKey` and `aws.secretKey`: Change these to your AWS credentials. You can alternatively leave them as "default", in which case the [DefaultAWSCredentialsProviderChain](http://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html) will be used.
- `kinesis.initialPosition`: Where to start reading from the stream the first time the app is run. "TRIM\_HORIZON" for as far back as possible, "LATEST" for as recent as possibly, "AT\_TIMESTAMP" for after specified timestamp.
- `kinesis.initialTimestamp`: Need to be specified when initial position is "AT\_TIMESTAMP"
- `kinesis.maxRecords`: Maximum number of records fetched in a single request.
- `kinesis.region`: The AWS region where the streams are located.
- `kinesis.appName`: Unique identifier for the app which ensures that if it is stopped and restarted, it will restart at the correct location.
- `nsq.channelName`: Channel name for NSQ source stream. If more than one application reading from the same NSQ topic at the same time, all of them must have unique channel name to be able to get all the data from the same topic
- `nsq.host`: Hostname for NSQ tools
- `nsq.port`: HTTP port number for nsqd
- `nsq.lookupPort`: HTTP port number for nsqlookupd
- `stream.inStreamName`: The name of the input stream of the tool which you choose as a source.
- `stream.outStreamName`: The name of the output stream of the tool which you choose as sink. Records which cannot be converted to JSON or can be converted but are rejected by Elasticsearch get sent here.
- `streams.buffer.byteLimit`: Whenever the total size of the buffered records exceeds this number, they will all be sent to elasticsearch.
- `streams.buffer.recordLimit`: Whenever the total number of buffered records exceeds this number, they will all be sent to elasticsearch.
- `streams.buffer.timeLimit`: If this length of time passes without the buffer being flushed, the buffer will be flushed.
- `elasticsearch.client.endpoint`: The Elasticesarch cluster endpoint.
- `elasticsearch.client.port`: The Elasticesarch cluster port.
- `elasticsearch.client.maxTimeout`: The Elasticesarch maximum timeout in milliseconds.
- `elasticsearch.client.ssl`: If using the HTTP API whether to use SSL or not.
- `elasticsearch.aws.signing`: If using the Amazon Elasticsearch service and the HTTP API, this lets you sign your requests.
- `elasticsearch.aws.region`: If signing API requests, region where the Elasticsearch cluster is located.
- `elasticsearch.cluster.name`: The Elasticesarch cluster name.
- `elasticsearch.cluster.index`: The Elasticsearch index name.
- `elasticsearch.cluster.clusterType`: The Elasticesarch type name.

### [](https://github.com/snowplow/snowplow/wiki/elasticsearch-loader-setup#monitoring)

### Monitoring

You can also include Snowplow Monitoring in the application. This is set up through a new section at the bottom of the config. You will need to ammend:

- `monitoring.snowplow.collectorUri` insert your snowplow collector URI here.
- `monitoring.snowplow.appId` the app-id used in decorating the events sent.

If you do not wish to include Snowplow Monitoring, remove the entire `monitoring` section from the config.

### [](https://github.com/snowplow/snowplow/wiki/elasticsearch-loader-setup#execution)

### Execution

The Elasticsearch Loader is a jarfile. Simply provide the configuration file as a parameter:

```bash
$ java -jar snowplow-elasticsearch-loader-http-0.10.0.jar --config my.conf # if using the HTTP API
$ java -jar snowplow-elasticsearch-loader-tcp-0.10.0.jar --config my.conf # if using the transport API with a 5.x cluster
$ java -jar snowplow-elasticsearch-loader-tcp-2x-0.10.0.jar --config my.conf # if using the transport API with a 2.x cluster
```

This will start the process of reading events from Kinesis and writing them to an Elasticsearch cluster.

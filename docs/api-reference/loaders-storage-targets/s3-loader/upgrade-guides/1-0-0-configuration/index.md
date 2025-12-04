---
title: "S3 Loader v1.0.0 configuration"
sidebar_label: "1.0.0 configuration"
date: "2021-07-16"
sidebar_position: 12
---

The sink is configured using a HOCON file. These are the fields:

- `source`: Choose kinesis or nsq as a source stream
- `sink`: Choose between kinesis or nsq as a sink stream for failed events
- `aws.accessKey` and `aws.secretKey`: Change these to your AWS credentials. You can alternatively leave them as "default", in which case the [DefaultAWSCredentialsProviderChain](http://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html) will be used.
- `kinesis.initialPosition`: Where to start reading from the stream the first time the app is run. "TRIM_HORIZON" for as far back as possible, "LATEST" for as recent as possibly, "AT_TIMESTAMP" for after the specified timestamp.
- `kinesis.initialTimestamp`: Timestamp for "AT_TIMESTAMP" initial position
- `kinesis.maxRecords`: Maximum number of records to read per GetRecords call
- `kinesis.region`: The Kinesis region name to use.
- `kinesis.appName`: Unique identifier for the app which ensures that if it is stopped and restarted, it will restart at the correct location.
- `kinesis.customEndpoint`: Optional endpoint url configuration to override aws kinesis endpoints. This can be used to specify local endpoints when using localstack.
- `kinesis.disableCloudWatch`: Optional override to disable CloudWatch metrics for KCL
- `nsq.channelName`: Channel name for NSQ source stream. If more than one application reading from the same NSQ topic at the same time, all of them must have unique channel name to be able to get all the data from the same topic.
- `nsq.host`: Hostname for NSQ tools
- `nsq.port`: HTTP port number for nsqd
- `nsq.lookupPort`: HTTP port number for nsqlookupd
- `stream.inStreamName`: The name of the input stream of the tool which you choose as a source. This should be the stream to which your are writing records with the Scala Stream Collector.
- `streams.outStreamName`: The name of the output stream of the tool which you choose as sink. This is stream where records are sent if the compression process fails.
- `streams.buffer.byteLimit`: Whenever the total size of the buffered records exceeds this number, they will all be sent to S3.
- `streams.buffer.recordLimit`: Whenever the total number of buffered records exceeds this number, they will all be sent to S3.
- `streams.buffer.timeLimit`: If this length of time passes without the buffer being flushed, the buffer will be flushed. **Note**: With NSQ streams, only record limit is taken into account. Other two option will be ignored.
- `s3.region`: The AWS region for the S3 bucket
- `s3.bucket`: The name of the S3 bucket in which files are to be stored
- `s3.format`: The format the app should write to S3 in (`lzo` or `gzip`)
- `s3.maxTimeout`: The maximum amount of time the app attempts to PUT to S3 before it will kill itself

### Monitoring

It's possible to include Snowplow monitoring in the application. This is setup through the `monitoring` section at the bottom of the config file:

- `monitoring.snowplow.collectorUri` your snowplow collector URI
- `monitoring.snowplow.appId` the app-id used in decorating the events sent

To disable Snowplow monitoring, just remove the entire `monitoring` section from the config.

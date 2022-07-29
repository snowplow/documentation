---
title: "S3 Loader"
date: "2020-11-24"
sidebar_position: 0
---

## Overview

Snowplow S3 Loader consumes records from an [Amazon Kinesis](http://aws.amazon.com/kinesis/) stream and writes them to [S3](http://aws.amazon.com/s3/). A typical Snowplow pipeline would use the S3 loader in several places:

- Load collector payloads from the "raw" stream, to maintain an archive of the original data, before enrichment.
- Load enriched events from the "enriched" stream. These serve as input for [the RDB loader](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/) when loading to a warehouse.
- Load failed events from the "bad" stream.

Records that can't be successfully written to S3 are written to a [second Kinesis stream](https://github.com/snowplow/snowplow-s3-loader/blob/master/examples/config.hocon.sample#L75) with the error message.

## Output Formats

### LZO

Records are treated as raw byte arrays. [Elephant Bird's](https://github.com/twitter/elephant-bird/) `BinaryBlockWriter` class is used to serialize them as a [Protocol Buffers](https://github.com/google/protobuf/) array (so it is clear where one record ends and the next begins) before compressing them.

The compression process generates both compressed .lzo files and small .lzo.index files ([splittable LZO](https://github.com/twitter/hadoop-lzo)). Each index file contain the byte offsets of the LZO blocks in the corresponding compressed file, meaning that the blocks can be processed in parallel.

LZO encoding is generally used for raw data produced by Snowplow Collector.

### Gzip

The records are treated as byte arrays containing UTF-8 encoded strings (whether CSV, JSON or TSV). New lines are used to separate records written to a file. This format can be used with the Snowplow Kinesis Enriched stream, among other streams.

Gzip encoding is generally used for both enriched data and bad data.

## Running

### Available on Terraform Registry

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/s3-loader-kinesis-ec2/aws/latest)

A Terraform module which deploys the Snowplow S3 Loader on AWS EC2 for use with Kinesis. For installing in other environments, please see the other installation options below.

### Docker image

We publish three different flavours of the docker image.

- Pull the `:2.2.1` tag if you only need GZip output format
- Pull the `:2.2.1-lzo` tag if you also need LZO output format
- Pull the `:2.2.1-distroless` tag for an lightweight alternative to `:2.2.1`

```
docker pull snowplow/snowplow-s3-loader:2.2.1
docker pull snowplow/snowplow-s3-loader:2.2.1-lzo
docker pull snowplow/snowplow-s3-loader:2.2.1-distroless
```

Here is a standard command to run the loader on a EC2 instance in AWS:

```
docker run \
      -d \
      --name snowplow-s3-loader \
      --restart always \
      --log-driver awslogs \
      --log-opt awslogs-group=snowplow-s3-loader \
      --log-opt awslogs-stream=`ec2metadata --instance-id` \
      --network host \
      -v $(pwd):/snowplow/config \      
      -e 'JAVA_OPTS=-Xms512M -Xmx1024M -Dorg.slf4j.simpleLogger.defaultLogLevel=WARN' \           
      snowplow/snowplow-s3-loader:2.2.1 \       
      --config /snowplow/config/config.hocon
```

### Jar

JARs can be found attached to the [Github release](https://github.com/snowplow/snowplow-s3-loader/releases). Only pick the `-lzo` version of the JAR file if you need to output in LZO format

```
java -jar snowplow-s3-loader-2.2.1.jar --config config.hocon
java -jar snowplow-s3-loader-lzo-2.2.1.jar --config config.hocon
```

Running the jar requires to have the native LZO binaries installed. For example for Debian this can be done with:

```
sudo apt-get install lzop liblzo2-dev
```

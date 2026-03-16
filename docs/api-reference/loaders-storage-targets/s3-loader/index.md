---
title: "S3 Loader"
sidebar_label: "S3 Loader"
sidebar_position: 5
description: "Archive Snowplow events from Kinesis to S3 in LZO or Gzip format for raw payloads, enriched events, and failed events."
keywords: ["s3 loader", "kinesis to s3", "aws s3", "lzo compression"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Snowplow S3 Loader consumes records from an [Amazon Kinesis](http://aws.amazon.com/kinesis/) stream and writes them to [S3](http://aws.amazon.com/s3/). A typical Snowplow pipeline would use the S3 loader in several places:

- Load enriched events from the "enriched" stream. These serve as input for [the RDB loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) when loading to a warehouse.
- Load failed events from the "bad" stream.

Records that can't be successfully written to S3 are written to a [second Kinesis stream](https://github.com/snowplow/snowplow-s3-loader/blob/master/examples/config.hocon.sample#L75) with the error message.

## Output format : GZIP

The records are treated as byte arrays containing UTF-8 encoded strings (whether CSV, JSON or TSV). New lines are used to separate records written to a file. This format can be used with the Snowplow Kinesis Enriched stream, among other streams.

Gzip encoding is generally used for both enriched data and bad data.

## Running

### Available on Terraform Registry

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/s3-loader-kinesis-ec2/aws/latest)

A Terraform module which deploys the Snowplow S3 Loader on AWS EC2 for use with Kinesis. For installing in other environments, please see the other installation options below.

### Docker image

We publish two different flavours of the docker image:

- <p><code>{`snowplow/snowplow-s3-loader:${versions.s3Loader}`}</code></p>
- <p><code>{`snowplow/snowplow-s3-loader:${versions.s3Loader}-distroless`}</code> (lightweight alternative)</p>

Here is a standard command to run the loader on a EC2 instance in AWS:

<CodeBlock language="bash">{
`docker run \\
      -d \\
      --name snowplow-s3-loader \\
      --restart always \\
      --log-driver awslogs \\
      --log-opt awslogs-group=snowplow-s3-loader \\
      --log-opt awslogs-stream='ec2metadata --instance-id' \\
      --network host \\
      -v $(pwd):/snowplow/config \\
      -e 'JAVA_OPTS=-Xms512M -Xmx1024M -Dorg.slf4j.simpleLogger.defaultLogLevel=WARN' \\
      snowplow/snowplow-s3-loader:${versions.s3Loader} \\
      --config /snowplow/config/config.hocon
`}</CodeBlock>
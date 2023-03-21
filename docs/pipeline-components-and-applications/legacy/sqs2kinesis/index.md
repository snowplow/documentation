---
title: "Sqs2kinesis"
date: "2021-07-16"
sidebar_position: 40
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::caution

Sqs2kinesis is a _deprecated_ application for moving data from SQS to Kinesis.

It is superseded by [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md), which provides the same functionality via its [SQS source](/docs/destinations/forwarding-events/snowbridge/configuration/sources/sqs.md) and [Kinesis target](/docs/destinations/forwarding-events/snowbridge/configuration/targets/kinesis.md).

:::

Sqs2kinesis is an application for moving data from SQS to Kinesis on AWS. In a Snowplow pipeline, you can run it if you are using SQS as either a fallback buffer or as your primary collector sink.

The AWS setup guide describes [how to set up a SQS buffer for your collector, and why it is needed](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-the-snowplow-collector/set-up-an-sqs-buffer/index.md).

### Getting a Docker image

sqs2kinesis is published on [Docker Hub](https://hub.docker.com/r/snowplow/sqs2kinesis/tags):

<CodeBlock language="bash">{
`docker pull snowplow/sqs2kinesis:${versions.sqs2kinesis}
`}</CodeBlock>

It is configured by providing a hocon file on the command line:

<CodeBlock language="bash">{
`docker run --rm \\
  -v $PWD/config.hocon:/sqs2kinesis/config.hocon \\
  snowplow/sqs2kinesis:${versions.sqs2kinesis} --config /sqs2kinesis/config.hocon
`}</CodeBlock>

The `--config` command option is actually optional. For some setups it is more convenient to provide configuration parameters using jvm system properties or environment variables, as documented in [the Lightbend config readme](https://github.com/lightbend/config/blob/v1.4.1/README.md). This way can be used like following:

<CodeBlock language="bash">{
`docker run snowplow/sqs2kinesis:${versions.sqs2kinesis} -Doutput.good.streamName=goodstream -Doutput.bad.streamName=badstream -Dinput.queue=https://sqs.eu-central-1.amazonaws.com/000000000000/test-topic
`}</CodeBlock>


### Configuration

Here is an example of a minimal configuration file:

```json
{
  "input": {
    "queue": "https://sqs.eu-central-1.amazonaws.com/000000000000/snowplow-buffer"
  }
  "output": {
    # Configure output kinesis stream for valid messages
    "good": {
      "streamName": "snowplow-raw-payloads"
    }

    "bad": {
      # Configure output kinesis stream for invalid sqs messages
      "streamName": "snowplow-bad-events"
    }
  }
}
```

See [the configuration reference](/docs/pipeline-components-and-applications/legacy/sqs2kinesis/sqs2kinesis-configuration-reference/index.md) for a complete description of all parameters.

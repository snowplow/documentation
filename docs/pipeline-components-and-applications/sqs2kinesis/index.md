---
title: "Sqs2kinesis"
date: "2021-07-16"
sidebar_position: 40
---

Sqs2kinesis is an application for moving data from SQS to Kinesis on AWS. In a Snowplow pipeline, you can run it if you are using SQS as either a fallback buffer or as your primary collector sink.

The AWS setup guide describes [how to set up a SQS buffer for your collector, and why it is needed.](/docs/pipeline-components-and-applications/stream-collector/configure/index.md#setting-up-an-sqs-buffer-2-0-0) If you chose not to configure an SQS buffer, then you do not need to run sqs2kinesis.

### Getting a Docker image

sqs2kinesis is published on [Docker Hub](https://hub.docker.com/r/snowplow/sqs2kinesis/tags):

```bash
docker pull snowplow/sqs2kinesis:1.0.2
```

It is configured by providing a hocon file on the command line:

```bash
docker run --rm \
  -v $PWD/config.hocon:/sqs2kinesis/config.hocon \
  snowplow/sqs2kinesis:1.0.2 --config /sqs2kinesis/config.hocon
```

The `--config` command option is actually optional. For some setups it is more convenient to provide configuration parameters using jvm system properties or environment variables, as documented in [the Lightbend config readme](https://github.com/lightbend/config/blob/v1.4.1/README.md).

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

See [the configuration reference](/docs/pipeline-components-and-applications/sqs2kinesis/sqs2kinesis-configuration-reference/index.md) for a complete description of all parameters.

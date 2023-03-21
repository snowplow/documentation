---
title: "The Snowplow Collector on AWS"
date: "2020-02-26"
sidebar_position: 10
---

![](images/snowplow-aws-pipeline-collector.png)

On a AWS pipeline, the Snowplow Stream Collector receives events sent over HTTP(S), and writes them to a raw Kinesis stream. From there, the data is picked up and processed by the Snowplow validation and enrichment job.

On a AWS pipeline the basic steps are:

1. In the AWS console, create two Kinesis streams to which the collector will write good payloads and bad events.
2. (Optional) [Set up an SQS buffer](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-the-snowplow-collector/set-up-an-sqs-buffer/index.md) to handle spikes in traffic.
3. Configure and run the collector, using the main [collector documentation](/docs/pipeline-components-and-applications/stream-collector/index.md), which describes the core concepts of how the collector works, and the configuration options.
4. (Optional) [Configure and run Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md) with an [SQS source](/docs/destinations/forwarding-events/snowbridge/configuration/sources/sqs.md) and a [Kinesis target](/docs/destinations/forwarding-events/snowbridge/configuration/targets/kinesis.md) to move data from your SQS buffer back to the primary Kinesis queue.
5. (Optional) Sink the raw data to S3 using [the Snowplow S3 loader](/docs/destinations/warehouses-and-lakes/s3/index.md). This is recommended in production so keep a copy of the raw data before any processing.

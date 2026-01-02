---
title: "Stream transformer for real-time processing"
sidebar_label: "Stream transformer"
date: "2022-04-04"
sidebar_position: 20
description: "Transform enriched Snowplow data in real-time from Kinesis, Pub/Sub, or Kafka streams without Spark or EMR."
keywords: ["stream transformer", "real-time transformation", "kinesis transformer", "pubsub transformer", "kafka transformer"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::info

For a high-level overview of the Transform process, see [Transforming enriched data](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md). For guidance on picking the right `transformer` app, see [How to pick a transformer](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md#how-to-pick-a-transformer).

:::

Unlike the [Spark transformer](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/spark-transformer/index.md), the stream transformer reads data directly from the enriched stream and does not use Spark or EMR. It's a plain JVM application, like Stream Enrich or S3 Loader.

Reading directly from stream means that the transformer can bypass the `s3DistCp` staging / archiving step.

Another benefit is that it doesn't process a bounded data set and can emit transformed folders based only on its configured frequency. This means the pipeline loading frequency is limited only by the storage target.

Stream Transformer has three variants: [Transformer Kinesis](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/stream-transformer/transformer-kinesis/index.md), [Transformer Pubsub](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/stream-transformer/transformer-pubsub/index.md) and [Transformer Kafka](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/stream-transformer/transformer-kafka/index.md). They are different variants for AWS, GCP and Azure.



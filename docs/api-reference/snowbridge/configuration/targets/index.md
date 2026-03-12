---
title: "Snowbridge target configuration"
sidebar_label: "Targets"
date: "2022-10-20"
sidebar_position: 300
description: "Configure Snowbridge targets including stdout, EventHub, HTTP, Kafka, Kinesis, PubSub, and SQS for stream output."
keywords: ["snowbridge config", "target configuration", "stdout", "http target", "kinesis target", "pubsub target"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

**Stdout target** is the default. We also support EventHub, HTTP, Kafka, Kinese, PubSub, and SQS targets.

Stdout target doesn't have any configurable options - when configured it simply outputs the messages to stdout.

## Configuration options

Here is an example of the configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/stdout-full-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/api-reference/snowbridge/concepts/failure-model/index.md#failure-targets), then use `failure_target` instead of `target`.

## Batching

From version 5.0.0, all targets support configurable batching. Batching options are specified in a `batching {}` block inside the target's `use` block.

```hcl
target {
  use "http" {
    url = "https://acme.com/x"

    batching {
      max_batch_messages     = 50
      max_batch_bytes        = 1048576
      max_message_bytes      = 1048576
      max_concurrent_batches = 5
      flush_period_millis    = 500
    }
  }
}
```

Each target has its own defaults for batching options. See the individual target pages for the defaults.

| Batching option | Description |
|---|---|
| `max_batch_messages` | Maximum number of messages in a single batch sent to the target. |
| `max_batch_bytes` | Maximum total byte size of a batch. |
| `max_message_bytes` | Maximum byte size of a single message. Messages exceeding this are sent to the failure target. |
| `max_concurrent_batches` | Number of batches written concurrently (default: `5`). |
| `flush_period_millis` | Interval in milliseconds between timer-based batch flushes (default: `500`). |

If either of `max_batch_messages` or `max_batch_bytes` is reached before `flush_period_millis` elapses, the batch is sent immediately.

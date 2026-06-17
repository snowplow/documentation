---
title: "Scaling Snowbridge horizontally"
sidebar_label: "Scaling"
date: "2026-03-11"
sidebar_position: 150
description: "Scale Snowbridge horizontally across multiple instances with per-target concurrency controls and target provisioning for optimal throughput."
keywords: ["horizontal scaling", "concurrent writes", "snowbridge performance", "throughput optimization"]
---

Snowbridge is built for a **horizontal scaling** model. You can deploy multiple instances consuming from the same source without additional configuration. No coordination setup is required between instances.

:::note
If you are using the Kinesis source, you must create a few DynamoDB tables as described in [the Kinesis source configuration section](/docs/api-reference/snowbridge/configuration/sources/kinesis.md). Snowbridge uses these tables to coordinate multiple instances consuming from the same stream.
:::

## Internal concurrency model

From version 5.0.0, Snowbridge uses a channel-based pipeline architecture:

**Source → Transformer → Router → Targets**

Each stage runs concurrently:

- The **Transformer** runs a worker pool of goroutines. The pool scales automatically based on `GOMAXPROCS`, or can be set explicitly via `worker_pool` in the `transform {}` block.
- The **Router** writes batches to targets concurrently, with concurrency controlled per target via `max_concurrent_batches`.

This architecture replaces the previous `concurrent_writes` source-level setting.

## Configuring concurrency

### Transformation concurrency

The `worker_pool` option controls how many goroutines process transformations in parallel. The default scales with `GOMAXPROCS`.

```hcl
transform {
  worker_pool = 8
  use "spEnrichedToJson" {}
}
```

### Target write concurrency

The `max_concurrent_batches` option on each target controls how many batch writes may be in flight simultaneously for that target. 

```hcl
target {
  use "http" {
    url = "https://acme.com/x"

    batching {
      max_concurrent_batches = 10
    }
  }
}
```

Increasing `max_concurrent_batches` increases write throughput to the target, at the cost of higher resource usage and more open connections to the destination. Decrease it if the target is being overwhelmed.

## Scaling recommendations

Snowbridge should consume as much data as possible, as fast as possible. A backlog or traffic spike should cause CPU usage to increase noticeably. If spikes do not produce this behavior and there are no target retries or failures, try increasing `max_concurrent_batches`.

How you configure scaling depends on your infrastructure and use case. If you scale based on CPU usage, note that this metric is affected by the volume of data, the transformations configured, and — for scripting transformations — the content of the scripts.

:::tip
New Snowbridge releases sometimes improve efficiency significantly. After upgrading Snowbridge or changing the transformation configuration, monitor your scaling metrics to confirm that they behave as expected with the new version.
:::

## Target scaling

Snowbridge sends data to the target as fast as resources allow. We recommend provisioning the target to scale with the expected throughput. If target writes fail, Snowbridge retries with exponential backoff. If a backlog builds up due to target downtime, overprovision the target until the backlog drains.

---
title: "Snowbridge batching model"
sidebar_label: "Batching model"
date: "2026-03-11"
sidebar_position: 500
description: "Understand how Snowbridge handles message batching across sources and targets for optimal throughput and performance."
keywords: ["batching model", "message batching", "snowbridge performance", "stream batching"]
---

Snowbridge processes messages through a channel-based pipeline:

**Source → Transformer → Router → Targets**

Each stage operates concurrently, with backpressure propagated between stages via Go channels.

## Sources

Sources emit messages one at a time onto a shared channel. No batching occurs at the source level — sources are responsible only for reading and emitting messages.

## Transformer

The Transformer stage reads messages from the source channel and applies all configured transformations. It runs a worker pool of goroutines for concurrent processing. The pool scales automatically based on `GOMAXPROCS`, or can be set explicitly with the `worker_pool` option on the `transform {}` block.

```hcl
transform {
  worker_pool = 4

  use "spEnrichedToJson" {}
}
```

Filtered messages (those dropped by a filter transformation) are routed separately and never reach the targets.

## Router and batching

The Router receives transformed messages and accumulates them into per-target batches. A batch is sent to the target when any of the following conditions are met:

- The batch reaches `max_batch_messages`.
- The batch reaches `max_batch_bytes`.
- The `flush_period_millis` timer elapses (timer-based flush), ensuring batches do not wait indefinitely even during low-volume periods.

Messages that exceed `max_message_bytes` are detected by the Router before batching and are routed directly to the failure target as oversized messages.

The Router sends batches concurrently to each target, controlled by `max_concurrent_batches` per target.

## Configuring batching

From version 5.0.0, all targets support a `batching {}` configuration block. Each target has its own defaults; see the individual target configuration pages for the defaults.

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

| Option | Description |
|---|---|
| `max_batch_messages` | Maximum number of messages in a single batch. |
| `max_batch_bytes` | Maximum total byte size of a batch. |
| `max_message_bytes` | Maximum byte size of a single message. Messages exceeding this are sent to the failure target. |
| `max_concurrent_batches` | Number of batches written to the target concurrently (default: `5`). |
| `flush_period_millis` | Milliseconds between timer-based batch flushes (default: `500`). |

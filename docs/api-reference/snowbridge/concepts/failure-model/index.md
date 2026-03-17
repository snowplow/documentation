---
title: "Snowbridge failure model"
sidebar_label: "Failure model"
date: "2026-03-11"
sidebar_position: 600
description: "Learn how Snowbridge handles target failures, oversized data, invalid data, transformation failures, and fatal errors."
keywords: ["failure handling", "error recovery", "failed events", "retry logic", "snowbridge errors"]
---

## Failure targets

When Snowbridge encounters an unrecoverable error — for example [oversized](#oversized-data) or [invalid](#invalid-data) data — it emits a [failed event](/docs/fundamentals/failed-events/index.md) to the configured failure target. A failure target is configured the same way as a regular target; the only difference is that the destination receives failed events rather than the main data stream.

You can find more detail on setting up a failure target in the [configuration section](/docs/api-reference/snowbridge/configuration/targets/index.md).

## Target failure

A target failure occurs when a write request to the destination fails or is rejected — for example, an HTTP 400 response.

Retry behavior is determined by the retry configuration. See the [retry configuration section](/docs/api-reference/snowbridge/configuration/retries/index.md) for details.

The Kinesis target handles write throughput exceptions separately, with an in-built backoff and retry, rather than treating them as a standard failure type.

Each failed attempt is reported as a `target_failed` metric for monitoring purposes.

## Oversized data

Internally, application checks each message against the target's `max_message_bytes` limit before batching. Messages that exceed this limit produce a [size violation failed event](/docs/api-reference/failed-events/index.md#size-violation) and are sent to the failure target.

Oversized message handling occurs before the message reaches the target, so no write is attempted to the main target.


## Invalid data

In the unlikely event that Snowbridge encounters data that the target cannot process (for example, empty data is invalid for PubSub), it creates a [generic error failed event](/docs/api-reference/failed-events/index.md#generic-error), emits it to the failure target, and acks the original message.

The HTTP target may produce invalid failures in the following situations:

- A POST request body cannot be formed.
- The templating feature fails to template the data.
- A response rule configured with `type = "invalid"` matches the response.

Transformation failures are also treated as invalid (see [transformation failure](#transformation-failure)).

Invalid message writes to the failure target are reported as `failure_target_success` and `failure_target_failed` metrics.

## Transformation failure

Where a transformation throws an exception, Snowbridge treats the message as invalid. It creates a [generic error failed event](/docs/api-reference/failed-events/index.md#generic-error), emits it to the failure target, and acks the original message.

Built-in transformations rarely fail when configured correctly. For scripting transformations, an exception is interpreted as meaning the transformation cannot process the data — construct and test your scripts accordingly.

## Fatal failure

A fatal failure is a scenario where continued processing is not possible and Snowbridge must stop.

There are three paths that lead to a fatal failure.

### Source read error

If Snowbridge cannot read from the source stream, it logs an error and exits. This is usually a misconfiguration of the source. When redeployed, the app resumes from the first unacked message, which may cause some duplicate sends to the target.

### Failure target write error

When invalid or oversized data cannot be written to the failure target, Snowbridge crashes. On redeploy, the app resumes from the last acked message. The likely impact is duplicated target sends, not data loss.

### Fatal response rule (graceful shutdown)

From version 5.0.0, the HTTP target supports a `fatal` response rule type. When a response matches a `fatal` rule, Snowbridge interprets this as a signal that the request can never succeed — for example, a 413 response indicating the payload is permanently too large. Rather than crashing immediately, Snowbridge completes all in-flight writes and flushes any remaining batches before shutting down gracefully.

```hcl
response_rules {
  rule {
    type       = "fatal"
    http_codes = [413]
  }
}
```

This provides a clean shutdown path distinct from a crash, ensuring in-flight data is not lost when the target signals an unrecoverable state.

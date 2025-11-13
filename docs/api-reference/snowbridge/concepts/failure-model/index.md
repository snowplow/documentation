---
title: "Failure model"
date: "2022-10-20"
sidebar_position: 600
---

# Failure model

## Failure targets

When Snowbridge hits an unrecoverable error — for example [oversized](#oversized-data) or [invalid](#invalid-data) data — it will emit a [failed event](/docs/fundamentals/failed-events/index.md#what-is-a-failed-event) to the configured failure target. A failure target is the same as a target, the only difference is that the configured destination will receive failed events.

You can find more detail on setting up a failure target, in the [configuration section](/docs/api-reference/snowbridge/configuration/targets/index.md).

## Failure cases

There are several different failures that Snowbridge may hit.

### Target failure

This is where a request to the destination technology fails or is rejected - for example a HTTP 400 response is received.

Retry behavior for target failures is determined by the retry configuration. You can find details of this in the [configuration section](/docs/api-reference/snowbridge/configuration/retries/index.md).

As of Snowbridge 2.4.2, the Kinesis target does not treat kinesis write throughput exceptions as this type of failure. Rather it has an in-built backoff and retry, which will persist until each event in the batch is either successful, or fails for a different reason.

Before version 3.0.0, Snowbridge treated every kind of target failure the same -  it would retry 5 times. If all 5 attempts failed, it would proceed without acking the failed Messages. As long as the source's acking model allows for it, these would be re-processed through Snowbridge again.

Each target failure attempt will be reported as a 'MsgFailed' for monitoring purposes.

### Oversized data

Targets have limits to the size of a single message. Where the destination technology has a hard limit, targets are hardcoded to that limit. Otherwise, this is a configurable option in the target configuration. When a message's data is above this limit, Snowbridge will produce a [size violation failed event](/docs/fundamentals/failed-events/index.md#size-violation), and emit it to the failure target.

Writes of oversized messages to the failure target will be recorded with 'OversizedMsg' statistics in monitoring. Any failure to write to the failure target will cause a [fatal failure](#fatal-failure).

### Invalid data

In the unlikely event that Snowbridge encounters data which is invalid for the target destination (for example empty data is invalid for pubsub), it will create a [generic error failed event](/docs/fundamentals/failed-events/index.md#generic-error),  emit it to the failure target, and ack the original message.

As of version 3.0.0, the HTTP target may produce 'invalid' type failures. This occurs when: the a POST request body cannot be formed; the templating feature's attempts to template data result in an error; or the response conforms to a response rules configuration which specifies that the failure is to be treated as invalid. You can find more details in the [configuration section](/docs/api-reference/snowbridge/configuration/targets/http/index.md).

Transformation failures are also treated as invalid, as described below.

Writes of invalid messages to the failure target will be recorded with 'InvalidMsg' statistics in monitoring. Any failure to write to the failure target will cause a [fatal failure](#fatal-failure).

### Transformation failure

Where a transformation hits an exception, Snowbridge will consider it invalid, assuming that the configured transformation cannot process the data. It will create a [generic error failed event](/docs/fundamentals/failed-events/index.md#generic-error), emit it to the failure target, and ack the original message.

As long as the built-in transformations are configured correctly, this should be unlikely. For scripting transformations, Snowbridge assumes that an exception means the data cannot be processed - make sure to construct and test your scripts accordingly.

Writes of invalid messages to the failure target will be recorded with 'InvalidMsg' statistics in monitoring. Any failure to write to the failure target will cause a [fatal failure](#fatal-failure).

### Fatal failure

Snowbridge is built to be averse to crashes, but there are two scenarios where it would be expected to crash.

Firstly, if it hits an error in retrieving data from the source stream, it will log an error and crash. If this occurs it is normally a case of misconfiguration of the source. If that is not the case, it will be safe to redeploy the app — it will attempt to begin from the first unacked message. This may cause duplicates.

Secondly, as described above, where there are failures it will attempt to reprocess the data if it can, and where failures aren't recoverable it will attempt to handle that via a failure target. Normally, even reaching this point is rare.

In the very unlikely event that Snowbridge reaches this point and cannot write to a failure target, the app will crash. Should this happen, and the app is re-deployed, it will begin processing data from the last acked message. Note that the likely impact of this is duplicated sends to the target, but not data loss.

Of course, if you experience crashes or other issues that are not explained by the above, please log an issue detailing the behavior.

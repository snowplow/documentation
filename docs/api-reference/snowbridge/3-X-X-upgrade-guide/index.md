---
title: "3.X.X upgrade guide"
sidebar_position: 400
---

## Breaking Changes

The below breaking changes were made in version 3.0.0. All other functionality is backwards compatible.

### Lua support removed

Support for Lua transformations has been removed. If you are running a Lua transformation, you can port the logic to [Javascript](/docs/api-reference/snowbridge/configuration/transformations/custom-scripts/javascript-configuration/index.md) or [JQ](/docs/api-reference/snowbridge/configuration/transformations/builtin/jq.md).

## HTTP target: non-JSON data no longer supported

We never intended to support non-JSON data, but prior to version 3.0.0, the request body was simply populated with whatever bytes were found in the message data, regardless of whether it is valid JSON.

From version 3.0.0 onwards, only valid JSON will work, otherwise the message will be considered invalid and sent to the failure target.

## HTTP target: request batching

Many HTTP APIs allow sending several events in a single request by putting them into a JSON array. Since version 3.0.0, if the Snowbridge source provides data in batches, the HTTP target will batch events in this way.

As a consequence, even when the source provides events in a single event batch, it will now be placed into an array of one element. For example, prior to version 3.0.0, a request body might look like this:

```
{"foo": "bar"}
```

But it will now look like this:

```
[{"foo": "bar"}]
```

As of version 3.0.0, the SQS source provides events in batches of up to ten, and the Kinesis, Kafka, and Pubsub and Stdin sources provide events in single-event batches. This behavior will likely change in a future version.

You can preserve the previous behavior and ensure that requests are always single-event non-array objects, even with a batching source. To do so, set `request_max_messages` to 1, and provide this template (as long as your data is valid JSON):

```go reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/targets/http-template-unwrap-example.file
```

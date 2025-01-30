---
title: "3.X.X Upgrade Guide"
sidebar_position: 400
---

## Breaking Changes

The below breaking changes were made in version 3.0.0. All other functionality is backwards compatible.

### Lua support removed

Support for Lua transformations has been removed. If you are running a Lua transformation, you can port the logic to [Javascript](/docs/destinations/forwarding-events/snowbridge/configuration/transformations/custom-scripts/javascript-configuration/index.md), or [JQ](/docs/destinations/forwarding-events/snowbridge/configuration/transformations/builtin/jq.md).

### HTTP Target Changes

Previously, by default the body of http requests came in whatever form it received. It is now an array. From v3, where no template is configured, the POST request body will contain an array of JSON containing the data for the whole batch. Data must be valid JSON or it will be considered invalid and sent to the failure target.

Note that this is a breaking change to the pre-v3 default behaviour, in two ways:

1. Previously to v3, we sent data one request per message

This means that where no template is provided, request bodies will be arrays of JSON rather than individual JSON objects. 

For example, pre-v3, a request body might look like this:

```
{"foo": "bar"}
```

But it will now look like this:

```
[{"foo": "bar"}]
```

If you need to preserve the previous behaviour (as long as your data is valid JSON), you can set `request_max_messages` to 1, and provide this template:

```go reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/targets/http-template-unwrap-example.file
```

2. Non-JSON data is not supported

While the intention was never to support non-JSON data, previously to v3 the request body was simply populated with whatever bytes were found in the message data, regardless of whether it is valid JSON.

From v3 on, only valid JSON will work, otherwise the message will be considered invalid and sent to the failure target.


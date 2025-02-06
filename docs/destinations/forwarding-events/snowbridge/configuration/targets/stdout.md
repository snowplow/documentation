---
title: "Stdout"
description: "Write data to an SQS queue."
sidebar_position: 1
---

Stdout target doesn't have any configurable options - when configured it simply outputs the messages to stdout.

## Configuration options

Here is an example of the configuration:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/targets/stdout-full-example.hcl
```

If you want to use this as a [failure target](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

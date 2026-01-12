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

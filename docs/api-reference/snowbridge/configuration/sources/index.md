---
title: "Snowbridge source configuration"
sidebar_label: "Sources"
date: "2022-10-20"
sidebar_position: 100
description: "Configure Snowbridge sources including stdin, Kafka, Kinesis, PubSub, SQS, and HTTP for stream ingestion."
keywords: ["snowbridge config", "source configuration", "stdin", "kinesis source", "pubsub source", "kafka source"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

**Stdin source** is the default. We also support Kafka, Kinesis, PubSub, SQS and experimental HTTP sources.

Stdin source simply treats stdin as the input. It has one optional configuration to set the concurrency.

## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/stdin-minimal-example.hcl
`}</CodeBlock>

Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/stdin-full-example.hcl
`}</CodeBlock>

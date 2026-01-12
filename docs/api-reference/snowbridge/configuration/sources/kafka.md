---
title: "Configure Kafka as a Snowbridge source"
sidebar_label: "Kafka"
description: "Configure Kafka source for Snowplow Snowbridge to read data from Kafka topics with authentication and consumer group settings."
keywords: ["snowbridge config", "kafka source", "kafka consumer", "kafka topic", "kafka config"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Authentication is done by providing valid credentials in the configuration.

## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/kafka-minimal-example.hcl
`}</CodeBlock>

Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/kafka-full-example.hcl
`}</CodeBlock>

---
title: "Kafka"
description: "Configure Apache Kafka as a source for behavioral event forwarding using Snowbridge data pipelines."
schema: "TechArticle"
keywords: ["Kafka Source", "Kafka Input", "Stream Input", "Event Ingestion", "Kafka Integration", "Message Source"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Authentication

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

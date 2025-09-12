---
title: "Kafka"
description: "Configure Apache Kafka as a destination for real-time behavioral event streaming using Snowbridge."
schema: "TechArticle"
keywords: ["Kafka Target", "Kafka Export", "Stream Export", "Kafka Integration", "Message Queue", "Event Streaming"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Authentication

Where SASL is used, it may be enabled via the `enable_sasl`, `sasl_username`, and `sasl_password` and `sasl_algorithm` options.

we recommend using environment variables for sensitive values - which can be done via HCL's native `env.MY_ENV_VAR` format (as seen below).

TLS may be configured by providing the `key_file`, `cert_file` and `ca_file` options with paths to the relevant TLS files.


## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/kafka-minimal-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/kafka-full-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

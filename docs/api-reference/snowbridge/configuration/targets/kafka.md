---
title: "Configure Kafka as a Snowbridge target"
sidebar_label: "Kafka"
description: "Configure Kafka target for Snowplow Snowbridge to write data to Kafka topics with SASL authentication and TLS encryption."
keywords: ["snowbridge config", "kafka target", "kafka producer", "sasl authentication", "kafka topic"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Where SASL is used, it may be enabled via the `enable_sasl`, `sasl_username`, and `sasl_password` and `sasl_algorithm` options.

we recommend using environment variables for sensitive values - which can be done via HCL's native `env.MY_ENV_VAR` format (as seen below).

TLS may be configured by providing the `key_file`, `cert_file` and `ca_file` options with paths to the relevant TLS files.

To compress data before sending it, set the `compression_type` option to `"gzip"`, `"snappy"`, `"lz4"`, or `"zstd"`. For the `gzip` and `zstd` codecs, you can also tune the compression level with the `compression_level` option. Compression reduces network usage, but may add latency. Note that `zstd` requires Kafka version 2.1.0 or later, and `lz4` requires 0.10.0 or later.

:::note[Added in version 6.1.0]
The `compression_type` and `compression_level` options were added in version 6.1.0. They replace the deprecated `compress` boolean option, which compresses with `snappy`. Setting `compress` still works, but logs a warning, and `compression_type` takes precedence if both are set.
:::

## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/kafka-minimal-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/api-reference/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/kafka-full-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/api-reference/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

---
title: "Configuring SQS as a Snowbridge Source"
description: "Read data from an SQS queue."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

# SQS Source

Read data from an SQS queue.

## Authentication

Authentication is done via the [AWS authentication environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html). Optionally, you can use the `role_arn` option to specify an ARN to use on the stream.

## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/sqs-minimal-example.hcl
`}</CodeBlock>

Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/sqs-full-example.hcl
`}</CodeBlock>

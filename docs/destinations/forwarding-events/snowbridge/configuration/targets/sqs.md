---
title: "SQS"
description: "Set up Amazon SQS queues as destinations for reliable behavioral event forwarding and processing."
schema: "TechArticle"
keywords: ["SQS Target", "Amazon SQS", "AWS Integration", "Message Queue", "Queue Export", "Event Queuing"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Authentication

Authentication is done via the [AWS authentication environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html). Optionally, you can use the `role_arn` option to specify an ARN to use on the queue.


## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/sqs-minimal-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/sqs-full-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

---
title: "Configure Kinesis as a Snowbridge target"
sidebar_label: "Kinesis"
description: "Configure Kinesis target for Snowplow Snowbridge to write data to AWS Kinesis streams with throttle retry handling and IAM authentication."
keywords: ["snowbridge config", "kinesis target", "aws kinesis", "kinesis producer", "throttle handling"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Authentication is done via the [AWS authentication environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html). Optionally, you can use the `role_arn` option to specify an ARN to use on the stream.

## Throttle retries

As of 2.4.2, the kinesis target handles kinesis write throughput exceptions separately from all other errors and failures. It will back off and retry only the throttled records on an initial back off of 50ms, increasing by 50ms each time, until there are no more throttle errors.

## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/kinesis-minimal-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/api-reference/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/kinesis-full-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/api-reference/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

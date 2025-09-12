---
title: "Retry behavior (beta)"
description: "Configure retry policies and error handling for reliable behavioral event forwarding in Snowbridge."
schema: "TechArticle"
keywords: ["Retry Configuration", "Error Handling", "Retry Logic", "Failure Recovery", "Retry Strategy", "Error Recovery"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::note
This feature was added in version 3.0.0

This feature is in beta status because we may make breaking changes in future versions.
:::

This feature allows you to configure the retry behavior when the target encounters a failure in sending the data. There are two types of failure you can define:

A **transient failure** is a failure which we expect to succeed again on retry. For example, some temporary network error, or when we encounter throttling. Typically, you would configure a short backoff for this type of failure. When we encounter a transient failure, we keep processing the rest of the data as normal, under the expectation that everything is operating as normal. The failed data is retried after a backoff.

A **setup failure** is one we don't expect to be immediately resolved, for example an incorrect address, or an invalid API Key. Typically, you would configure a long backoff for this type of failure, under the assumption that the issue needs to be fixed with either a configuration change or a change to the target itself (e.g. permissions need to be granted). Setup errors will be retried 5 times before the app crashes.

As of version 3.0.0, only the http target can be configured to return setup errors, via the response rules feature - see [the http target configuration section](/docs/destinations/forwarding-events/snowbridge/configuration/targets/http/index.md). For all other targets, all errors returned will be considered transient, and behavior can be configured using the `transient` block of the retry configuration.

Retries will be attempted with an exponential backoff. In other words, on each subsequent failure, the backoff time will double. You can configure transient failures to be retried indefinitely by setting `max_attempts` to 0.

## Configuration options

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/retry-example.hcl
`}</CodeBlock>

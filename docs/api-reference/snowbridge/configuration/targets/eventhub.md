---
title: "Configure EventHub as a Snowbridge target"
sidebar_label: "EventHub"
description: "Configure EventHub target for Snowplow Snowbridge to write data to Azure Event Hubs with namespace and environment authentication."
keywords: ["snowbridge config", "eventhub target", "azure event hubs", "azure streaming", "eventhub config"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Authentication for the EventHub target is done by configuring any valid combination of the environment variables [listed in the Azure Event Hubs Client documentation](https://pkg.go.dev/github.com/Azure/azure-event-hubs-go#NewHubWithNamespaceNameAndEnvironment).

## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/eventhub-minimal-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/api-reference/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/eventhub-full-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/api-reference/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.

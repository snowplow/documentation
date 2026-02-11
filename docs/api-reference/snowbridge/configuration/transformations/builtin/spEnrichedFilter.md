---
title: "Snowbridge spEnrichedFilter transformation"
sidebar_label: "spEnrichedFilter"
description: "Filter Snowplow enriched events based on regex matches against atomic fields with keep or drop actions, with Snowbridge."
keywords: ["snowbridge config", "enriched filter", "atomic fields", "regex filter", "snowplow filtering"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::warning Deprecated
This transformation is deprecated and can result in unexpected behavior when matching integers. Use the [`jqFilter`](/docs/api-reference/snowbridge/configuration/transformations/builtin/jqFilter.md) transformation instead, which provides more robust and flexible filtering capabilities.
:::

`spEnrichedFilter`: Specific to Snowplow data. Filters messages based on a regex match against an atomic field.

This transformation is for use on base-level atomic fields, rather than fields from contexts, or custom events — which can be achieved with `spEnrichedFilterContext` and `spEnrichedFilterUnstructEvent`.

Filters can be used in one of two ways, which is determined by the `filter_action` option. `filter_action` determines the behavior of the app when the regex provided evaluates to `true`. If it's set to `"keep"`, the app will complete the remaining transformations and send the message to the destination (unless a subsequent filter determines otherwise). If it's set to `"drop"`, the message will be acked and discarded, without continuing to the next transformation or target.

This example filters out all data whose `platform` value does not match either `web` or `mobile`.

## Configuration options

Minimal configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/snowplow-builtin/spEnrichedFilter-minimal-example.hcl
`}</CodeBlock>

Every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/snowplow-builtin/spEnrichedFilter-full-example.hcl
`}</CodeBlock>

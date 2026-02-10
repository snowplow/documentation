---
title: "Snowbridge jqFilter transformation"
sidebar_label: "jqFilter"
description: "Filter messages using jq commands that return boolean results to keep or discard messages, with Snowbridge."
keywords: ["snowbridge config", "jq filter", "json filter", "conditional filtering", "jq boolean"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::note
This transformation was added in version 3.0.0.
:::

```mdx-code-block
import JQDescriptionSharedBlock from "./reusable/_jqDescription.md"

<JQDescriptionSharedBlock/>
```

`jqFilter` filters messages based on the output of a jq command which is run against the data. The provided command must return a boolean result. `false` filters the message out, `true` keeps it.

If the provided jq command returns a non-boolean value error, or results in an error, then the message will be considered invalid, and will be sent to the failure target.

## Configuration options

This example filters out all data that doesn't have an `app_id` key.

Minimal configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/builtin/jqFilter-minimal-example.hcl
`}</CodeBlock>

Every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/builtin/jqFilter-full-example.hcl
`}</CodeBlock>

## Filtering based on entity fields

You can use `jqFilter` to filter Snowplow enriched events based on fields within [entities](/docs/fundamentals/entities/index.md). This replaces the deprecated `spEnrichedFilterContext` transformation.

To keep events where a field in an entity matches specific values:

```hcl
transform {
  use "jqFilter" {
    jq = ".contexts_com_acme_app_1[0].siteId | IN(536870919, 536870924)"
  }
}
```

This keeps events where the `siteId` field in `contexts_com_acme_app_1` equals either `536870919` or `536870924`. Note that this checks only the first instance of the entity, which covers the vast majority of use cases.

You can also use regex patterns with jq's `test` function:

```hcl
transform {
  use "jqFilter" {
    jq = ".contexts_com_acme_env_context_1[0].environment | test(\"^(prod|staging)$\")"
  }
}
```

If you need to check all instances of an entity (when the same entity is attached multiple times), you can use the `any` function:

```hcl
transform {
  use "jqFilter" {
    jq = ".contexts_com_acme_env_context_1 | any(.[]; .environment == \"prod\" or .environment == \"staging\")"
  }
}
```

## Helper Functions

```mdx-code-block
import JQHelpersSharedBlock from "./reusable/_jqHelpers.md"

<JQHelpersSharedBlock/>
```

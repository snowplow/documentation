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

## Filtering examples

You can use `jqFilter` to filter Snowplow enriched events based on any field in the data. This replaces the deprecated `spEnrichedFilter`, `spEnrichedFilterContext`, and `spEnrichedFilterUnstructEvent` transformations.

Example: Atomic field matches any of a list of values:

```hcl
transform {
  use "jqFilter" {

    # Keep only web and mobile data
    jq_command = <<JQEOT
    .platform | IN("web", "mobile")
JQEOT

    snowplow_mode = true
  }
}
```

Example: Regex match against a singlular entity:

```
transform {
  use "jqFilter" {

    # Keep only "environment" matching a regex in custom event
    # `// ""` is needed as `null` is not regex compatible
    jq_command = <<JQEOT
    .contexts_com_acme_env_context_1.environment // "" | test("^prod")
JQEOT

    snowplow_mode = true
  }
}
```

Example: Any entity entry matches the condition 

```
transform {
  use "jqFilter" {

    # Keep if any entry's environment matches one of two values:
    jq_command = <<JQEOT
    .contexts_com_acme_env_context_1 | any(.[]; .environment == "prod" or .environment == "staging")
JQEOT

    snowplow_mode = true
  }
}
```

Example: Exact match on an unstruct event field:

```
transform {
  use "jqFilter" {
    # Keep only "sku" of "test-data" in custom event
    jq_command = <<JQEOT
    .unstruct_event_com_acme_my_custom_event_1.sku == "test-data"
JQEOT

    snowplow_mode = true
  }
}
```

## Helper Functions

```mdx-code-block
import JQHelpersSharedBlock from "./reusable/_jqHelpers.md"

<JQHelpersSharedBlock/>
```

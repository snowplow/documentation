---
title: "spEnrichedFilterContext"
description: "Filter behavioral events by context entities using built-in Snowbridge transformation capabilities."
schema: "TechArticle"
keywords: ["Context Filter", "Event Context", "Context Processing", "Entity Filtering", "Context Data", "Event Entities"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

`spEnrichedFilterContext`: Specific to Snowplow data. Filters messages based on a regex match against a field in an entity.

This transformation is for use on fields from entities (contexts).

Note that if the same context is present in the data more than once, one instance of a match is enough for the regex condition to be considered a match — and the message to be kept.

The full parsed context name must be provided, in camel case, in the format returned by the Snowplow analytics SDK: `contexts_{vendor}_{name}_{major version}` — for example `contexts_nl_basjes_yauaa_context_1`.

The path to the field to be matched must then be provided as a jsonpath (dot notation and square braces only) — for example `test1.test2[0].test3`.

Filters can be used in one of two ways, which is determined by the `filter_action` option. `filter_action` determines the behavior of the app when the regex provided evaluates to `true`. If it's set to `"keep"`, the app will complete the remaining transformations and send the message to the destination (unless a subsequent filter determines otherwise). If it's set to `"drop"`, the message will be acked and discarded, without continuing to the next transformation or target.

The below example keeps messages which contain `prod` in the `environment` field of the `contexts_com_acme_env_context_1` context. Note that the `contexts_com_acme_env_context_1` context is attached more than once, if _any_ of the values at `dev` don't match `environment`, the message will be kept.

## Configuration options

Minimal configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/snowplow-builtin/spEnrichedFilterContext-minimal-example.hcl
`}</CodeBlock>

Every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/snowplow-builtin/spEnrichedFilterContext-full-example.hcl
`}</CodeBlock>

---
title: "spEnrichedSetPk"
description: "Sets the message's destination partition key to an atomic field."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

`spEnrichedSetPk`: Specific to Snowplow data. Sets the message's destination partition key to an atomic field from a Snowplow Enriched tsv string.  The input data must be a valid Snowplow enriched TSV.


## Configuration options

`SpEnrichedSetPk` only takes one option — the field to use for the partition key.

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/snowplow-builtin/spEnrichedSetPk-minimal-example.hcl
`}</CodeBlock>

Note: currently, setting partition key to fields in custom events and contexts is unsupported.
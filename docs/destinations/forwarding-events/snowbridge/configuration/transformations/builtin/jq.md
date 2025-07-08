---
title: "jq"
description: "Runs a jq command on the message data and outputs the result."
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

`jq` runs a jq command on the message data, and outputs the result of the command. While jq supports multi-element results, commands must output only a single element - this single element can be an array data type.

If the provided jq command results in an error, the message will be considered invalid, and will be sent to the failure target.

The minimal example here returns the input data as a single element array, and the full example maps the data to a new data structure.

The jq transformation will remove any keys with null values from the data.

## Configuration options

Minimal configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/${versions.snowbridge}/assets/docs/configuration/transformations/builtin/jq-minimal-example.hcl
`}</CodeBlock>

Every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/${versions.snowbridge}/assets/docs/configuration/transformations/builtin/jq-full-example.hcl
`}</CodeBlock>

## Helper functions

```mdx-code-block
import JQHelpersSharedBlock from "./reusable/_jqHelpers.md"

<JQHelpersSharedBlock/>
```

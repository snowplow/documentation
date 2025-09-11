---
title: "base64Decode"
description: "Decode Base64-encoded behavioral event data using built-in Snowbridge transformation functions."
schema: "TechArticle"
keywords: ["Base64 Decode", "Data Decoding", "Binary Decoding", "String Decoding", "Decode Transform", "Data Conversion"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Introduced in version 2.1.0

`base64Decode`: Base64 decodes the message's data.

This transformation base64 decodes the message's data from a base64 byte array, to a byte array representation of the decoded data.

`base64Decode` has no options.

## Configuration options

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/builtin/base64Decode-minimal-example.hcl
`}</CodeBlock>

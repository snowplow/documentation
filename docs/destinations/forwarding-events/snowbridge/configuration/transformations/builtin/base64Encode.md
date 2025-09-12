---
title: "base64Encode"
description: "Encode behavioral event data using Base64 transformation for secure forwarding to external systems."
schema: "TechArticle"
keywords: ["Base64 Encode", "Data Encoding", "Binary Encoding", "String Encoding", "Encode Transform", "Data Conversion"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Introduced in version 2.1.0

`base64Encode`: Base64 encodes the message's data.

This transformation base64 encodes the message's data to a base 64 byte array.

`base64Encode` has no options.

## Configuration options

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/builtin/base64Encode-minimal-example.hcl
`}</CodeBlock>

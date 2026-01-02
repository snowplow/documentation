---
title: "Snowbridge base64Encode transformation"
sidebar_label: "base64Encode"
description: "Base64 encode message data to base64 byte array representation for Snowbridge."
keywords: ["snowbridge config", "base64 encode", "encode transformation", "base64", "data encoding"]
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

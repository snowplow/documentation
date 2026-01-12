---
title: "Snowbridge base64Decode transformation"
sidebar_label: "base64Decode"
description: "Base64 decode message data from base64 byte array to decoded byte array representation for Snowbridge."
keywords: ["snowbridge config", "base64 decode", "decode transformation", "base64", "data decoding"]
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

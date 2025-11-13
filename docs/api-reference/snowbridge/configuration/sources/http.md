---
title: "HTTP"
description: "Receive data over HTTP."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::note
This source was added in version 3.6.2

This source is experimental and not recommended for production use.
:::


## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/http-minimal-example.hcl
`}</CodeBlock>


Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/http-full-example.hcl
`}</CodeBlock>



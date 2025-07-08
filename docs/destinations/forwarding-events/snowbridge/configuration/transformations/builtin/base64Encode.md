```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

# base64Encode

Introduced in version 2.1.0

`base64Encode`: Base64 encodes the message's data.

This transformation base64 encodes the message's data to a base 64 byte array.

`base64Encode` has no options.

## Configuration options

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/${versions.snowbridge}/assets/docs/configuration/transformations/builtin/base64Encode-minimal-example.hcl
`}</CodeBlock>

---
title: "JavaScript transformation configuration"
date: "2022-10-20"
sidebar_position: 200
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

This section details how to configure the transformation, once a script is written.

You can also find some complete example use cases in [the examples section](../examples/index.md).

The custom JavaScript script transformation uses the [goja](https://pkg.go.dev/github.com/dop251/goja) embedded Javascript engine to run scripts upon the data.

If a script errors or times out, a [transformation failure](/docs/api-reference/snowbridge/concepts/failure-model/index.md#transformation-failure) occurs.

Scripts must be available to the runtime of the application at the path provided in the `script_path` configuration option. For docker, this means mounting the script to the container and providing that path.

## Configuration options

Minimal configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/js-configuration-minimal-example.hcl
`}</CodeBlock>

Every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/js-configuration-full-example.hcl
`}</CodeBlock>

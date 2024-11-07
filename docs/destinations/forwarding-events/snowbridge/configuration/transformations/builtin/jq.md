# jq

:::note
This transformation was added in version 3.0.0
:::

[jq](https://github.com/jqlang/jq) is a lightweight and flexible command-line JSON processor akin to sed,awk,grep, and friends for JSON data. Snowbridge's jq features utilise the [gojq](https://github.com/itchyny/gojq) package, which is a pure go implementation of jq. jq is Turing complete, so these features allow you to configure arbitrary logic upon json data structures. 

jq supports formatting values, mathematical operations, boolean comparisons, regex matches, and many more useful features. To get started with jq command, see the [tutorial](https://jqlang.github.io/jq/tutorial/), and [full reference manual](https://jqlang.github.io/jq/manual/). While it is unlikely to meaningfully encounter them, note that there are [some small differences](https://github.com/itchyny/gojq?tab=readme-ov-file#difference-to-jq) between jq and gojq.

`jq` runs a jq command on the message data, and outputs the result of the command. While jq supports multi-element results, commands must output only a single element - this single element can be an array data type.

The provided command must return a boolean result. `false` filters the message out, `true` keeps it.

If the provided jq command results in an error, the message will be considred invalid, and will be sent to the failure target.

The minimal example here returns the input data as a single element array, and the full example maps the data to a new data structure.

The jq transformation will remove any keys with null values from the data.

## Configuration options

Minimal configuration:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/builtin/jq-minimal-example.hcl
```

Every configuration option:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/builtin/jq-full-example.hcl
```

## Helper functions

```mdx-code-block
import JQHelpersSharedBlock from "./reusable/_jqHelpers.md"

<JQHelpersSharedBlock/>
```
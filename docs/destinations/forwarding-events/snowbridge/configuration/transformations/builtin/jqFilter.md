# jqFilter

[jq](https://github.com/jqlang/jq) is a lightweight and flexible command-line JSON processor akin to sed,awk,grep, and friends for JSON data. Snowbridge's jq features utilise the [gojq](https://github.com/itchyny/gojq) package, which is a pure go implementation of jq. jq is Turing complete, so these features allow you to configure arbitrary logic upon json data structures. 

jq supports formatting values, mathematical operations, boolean comparisons, regex matches, and many more useful features. To get started with jq command, see the [tutorial](https://jqlang.github.io/jq/tutorial/), and [full reference manual](https://jqlang.github.io/jq/manual/). While it is unlikely to meaningfully encounter them, note that there are [some small differences](https://github.com/itchyny/gojq?tab=readme-ov-file#difference-to-jq) between jq and gojq.

`jqFilter` filters messages based on the output of a jq command which is run against the data. The provided command must return a boolean result. `false` filters the message out, `true` keeps it.

If the provided jq command returns a non-boolean value error, or results in an error, then the message will be considred invalid, and will be sent to the failure target.

This example filters out all data that doesn't have an `app_id` key.

Minimal configuration:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/snowplow-builtin/assets/docs/configuration/transformations/builtin/jqFilter-minimal-example.hcl
```

Every configuration option:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/snowplow-builtin/jqFilter-full-example.hcl
```

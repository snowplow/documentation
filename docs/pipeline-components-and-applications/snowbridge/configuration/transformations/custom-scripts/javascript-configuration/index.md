---
title: "Javascript Transformation Configuration"
date: "2022-10-20"
sidebar_position: 200
---

# Custom Javascript Script Configuration

This section details how to configure the transformation, once a script is written. You can find a guide to creating the script itself in [the create a script section](../create-a-script/index.md).

You can also find some complete example use cases in [the examples section](../examples/index.md).

The Custom Javascript Script transformation uses the [goja](https://pkg.go.dev/github.com/dop251/goja) embedded Javascript engine to run scripts upon the data.

If a script errors or times out, a [transformation failure](/docs/pipeline-components-and-applications/snowbridge/concepts/failure-model/index.md#transformation-failure) occurs.

Scripts must be available to the runtime of the application at the path provided in the `script_path` configuration option. For docker, this means mounting the script to the container and providing that path.

Here is an example of a minimal configuration for the custom Javascript script transformation:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/js-configuration-minimal-example.hcl
```

Here is an example of every configuration option:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/js-configuration-full-example.hcl
```

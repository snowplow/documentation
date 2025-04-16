---
title: "JavaScript transformation configuration"
date: "2022-10-20"
sidebar_position: 200
---

This section details how to configure the transformation, once a script is written.

You can also find some complete example use cases in [the examples section](../examples/index.md).

The custom JavaScript script transformation uses the [goja](https://pkg.go.dev/github.com/dop251/goja) embedded Javascript engine to run scripts upon the data.

If a script errors or times out, a [transformation failure](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#transformation-failure) occurs.

Scripts must be available to the runtime of the application at the path provided in the `script_path` configuration option. For docker, this means mounting the script to the container and providing that path.

## Configuration options

Minimal configuration:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/js-configuration-minimal-example.hcl
```

Every configuration option:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/js-configuration-full-example.hcl
```

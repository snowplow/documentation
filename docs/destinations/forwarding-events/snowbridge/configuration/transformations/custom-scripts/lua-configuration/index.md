---
title: "Lua Transformation Configuration"
date: "2022-10-20"
sidebar_position: 300
---

# Custom Lua Script Configuration

This section details how to configure the transformation, once a script is written. You can find a guide to creating the script itself in [the create a script section](../create-a-script/index.md).

You can also find some complete example use cases in [the examples section](../examples/index.md).

The Custom Lua Script transformation uses the [gopher-lua](https://pkg.go.dev/github.com/yuin/gopher-lua) embedded Lua engine to run scripts upon the data.

If a script errors or times out, a [transformation failre](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#transformation-failure) occurs.

Scripts must be available to the runtime of the application at the path provided in the `script_path` configuration option. For docker, this means mounting the script to the container and providing that path.


Here is an example of a minimal configuration for the custom Lua script transformation:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/lua-configuration-minimal-example.hcl
```

Here is an example of every configuration option:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/lua-configuration-full-example.hcl 
```

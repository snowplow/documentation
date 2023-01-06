---
title: "Writing a script"
date: "2022-10-20"
sidebar_position: 100
---

# Writing a script

Custom tranformation scripts may be defined in Javascript or Lua, and provided to Snowbridge.

## The scripting interface

The script - whether Lua or Javascript - must define a main function with a single argument. Snowbridge will pass the engineProtocol data structure as the argument:


```go
type engineProtocol struct {
	FilterOut    bool
	PartitionKey string
	Data         interface{}
}
```

This data structure will serve as both the input and the output of the script - for Javascript it will be an object, and for Lua a table.

Scripts must define a main function with a single input argument:

```js
function main(input) {
    return input
}
```

```lua
function main(input)
  return input
end
```

## Accessing data

Scripts can access the message Data at `input.Data`, and can return modified data by returning it in the `Data` field of the output. Likewise for the partition key to be used for the destination - `input.PartitionKey` and the `PartitionKey` field of the output.

By default, the Data field will be a string. For Snowplow enriched TSV data, the Javascript transformation has a `snowplow_mode` option, which transforms the data to an object first.

The output of the script must be an object (Javascript) or a table (Lua) which maps to engineProtocol.

## Transforming Data

To modify the message data, return an object which conforms to EngineProtocol, with the `Data` field set to the modified data. The `Data` field may be returned as either a string, or an object (Javascript) / table (Lua).

```js reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/create-a-script-modify-example.js
```

```lua reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/create-a-script-modify-example.lua
```

## Filtering

If the `FilterOut` field of the output is returned as `true`, the message will be acked immediately and won't be sent to the target. This will be the behaviour regardelss of what is returned to the other fields in the protocol.

```js reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/create-a-script-filter-example.js
```

```lua reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/create-a-script-filter-example.lua
```

## Setting the Partition Key

To set the Partition Key in the message, you can simply set the input's PartitionKey field, and return it:

```js reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/create-a-script-setpk-example.js
```

```lua reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/create-a-script-modify-example.lua
```

Or, if modifying the data as well, return the modified data and PartitionKey field:

```js reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/create-a-script-setpk-modify-example.js
```

```lua reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/custom-scripts/create-a-script-setpk-modify-example.lua
```

## Configuration

Once your script is ready, you can configure it in the app by following the [Javascript](../javascript-configuration/index.md) or [Lua](../lua-configuration/index.md) configuration pages.

You can also find some complete example use cases in [the examples section](./examples/).
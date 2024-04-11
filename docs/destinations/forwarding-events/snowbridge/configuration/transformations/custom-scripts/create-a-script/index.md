---
title: "Writing a script"
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
  HTTPHeaders  map[string]string
}
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

For all the below examples, the input is a string representation of the below JSON object. For Snowplow data, using `snowplow_mode` will produce a JSON object input - see [the snowplow example](../examples/snowplow/index.md).

```json
{
  "name": "Bruce",
  "id": "b47m4n",
  "batmobileCount": 1
}
```

To modify the message data, return an object which conforms to EngineProtocol, with the `Data` field set to the modified data. The `Data` field may be returned as either a string, or an object (Javascript) / table (Lua).

```js reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-modify-example.js
```

```lua reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-modify-example.lua
```

## Filtering

If the `FilterOut` field of the output is returned as `true`, the message will be acked immediately and won't be sent to the target. This will be the behavior regardelss of what is returned to the other fields in the protocol.

```js reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-filter-example.js
```

```lua reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-filter-example.lua
```

## Setting the Partition Key

To set the Partition Key in the message, you can simply set the input's PartitionKey field, and return it:

```js reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-setpk-example.js
```

```lua reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-modify-example.lua
```

Or, if modifying the data as well, return the modified data and PartitionKey field:

```js reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-setpk-modify-example.js
```

```lua reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-setpk-modify-example.lua
```

## Setting a HTTP header (v)

For the http target only, you can specify a set of http headers, which will be appended to the configured headers for the http target. Do so by prividing an object in the `HTTPHeaders` field:

```js reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/custom-scripts/create-a-script-header-example.js
```

## Configuration

Once your script is ready, you can configure it in the app by following the [Javascript](/docs/destinations/forwarding-events/snowbridge/configuration/transformations/custom-scripts/javascript-configuration/index.md) or [Lua](/docs/destinations/forwarding-events/snowbridge/configuration/transformations/custom-scripts/lua-configuration/index.md) configuration pages.

You can also find some complete example use cases in [the examples section](/docs/destinations/forwarding-events/snowbridge/configuration/transformations/custom-scripts/examples/index.md).

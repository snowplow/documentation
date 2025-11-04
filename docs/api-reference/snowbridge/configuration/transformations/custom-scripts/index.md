---
title: "Custom script transformations"
date: "2022-10-20"
sidebar_position: 100
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Custom transformation scripts may be defined in Javascript and provided to Snowbridge.

## The scripting interface

The script must define a main function with a single argument. Snowbridge will pass the `engineProtocol` data structure as the argument:


```go
type engineProtocol struct {
    FilterOut    bool
    PartitionKey string
    Data         interface{}
    HTTPHeaders  map[string]string
}
```

This structure is represented as an object in the script engine, and serves as both the input and output of the script.

Scripts must define a `main` function with a single input argument (JSDoc for type information is optional):

```js
/**
 * @typedef {object} EngineProtocol
 * @property {boolean} FilterOut
 * @property {string} PartitionKey
 * @property {(string | Object.<string, ?>)} Data
 * @property {Object.<string, string>} HTTPHeaders
 */

/**
 * @param {EngineProtocol} input
 * @return {Partial<EngineProtocol>}
 */
function main(input) {
    return input
}
```

## Accessing data

Scripts can access the message Data at `input.Data`, and can return modified data by returning it in the `Data` field of the output. Likewise for the partition key to be used for the destination - `input.PartitionKey` and the `PartitionKey` field of the output.

By default, the input's `Data` field will be a string in [enriched TSV format](/docs/fundamentals/canonical-event/understanding-the-enriched-tsv-format/index.md).
This can be changed with the [SpEnrichedToJson](/docs/api-reference/snowbridge/configuration/transformations/builtin/spEnrichedToJson.md) transform, or the Javascript transformation itself has a `snowplow_mode` option, which transforms the data to an object first.

The output of the script must be an object which maps to engineProtocol.

### `snowplow_mode`

`snowplow_mode` uses the [Go Analytics SDK](/docs/api-reference/analytics-sdk/analytics-sdk-go/index.md) to parse the TSV fields into an object suitable for working with in Go.
The result of the [`ParsedEvent.ToMap()`](https://pkg.go.dev/github.com/snowplow/snowplow-golang-analytics-sdk/analytics#ParsedEvent.ToMap) method is the input to your transform function.

The [keys of the resulting map](https://github.com/snowplow/snowplow-golang-analytics-sdk/blob/a3430fbe576483d615b713120cfb5e443897d572/analytics/mappings.go#L153) are defined by the Analytics SDK.
Values are primitives (string, number, boolean) or, for timestamps (e.g. `derived_tstamp`, `collector_tstamp`), [`time.Time`](https://pkg.go.dev/time#Time) objects.

:::tip

To work with native Javascript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) objects for timestamps, construct one via `new Date(ts.UnixMilli())` where `ts` is a `time.Time` instance.

When returned as part of `Data`, `time.Time` instances will [serialize in JSON](https://pkg.go.dev/time#Time.MarshalJSON) as [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html) strings.

:::

Structured data ([Self Describing Event](/docs/fundamentals/events/index.md#self-describing-events) payloads and [Entities](/docs/fundamentals/entities/index.md)) will have keys with a prefix of `unstruct_event_` or `contexts_`, the vendor name converted to snake case, the event/entity name in snake case, and the [schema model version](/docs/api-reference/iglu/common-architecture/schemaver/index.md). For example:

| **Schema URI**                                                  | **Type** | **Key**                                              |
| --------------------------------------------------------------- | -------- | ---------------------------------------------------- |
| `iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0` | Entity   | `contexts_com_snowplowanalytics_snowplow_web_page_1` |
| `iglu:org.w3/PerformanceNavigationTiming/jsonschema/1-0-0`      | Entity   | `contexts_org_w3_performance_navigation_timing_1`    |
| `iglu:com.urbanairship.connect/OPEN/jsonschema/1-0-0`           | Event    | `unstruct_event_com_urbanairship_connect_open_1`     |

Timestamps in structured data values will always have their primitive representation (string/number) and not be `time.Time` instances.

## Transforming Data

For all the below examples, the input is a string representation of the below JSON object. For Snowplow data, using `snowplow_mode` will produce a JSON object input - see [the snowplow example](./examples/index.md).

```json
{
  "name": "Bruce",
  "id": "b47m4n",
  "batmobileCount": 1
}
```

To modify the message data, return an object which conforms to EngineProtocol, with the `Data` field set to the modified data. The `Data` field may be returned as either a string, or an object.

<CodeBlock language="js" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/create-a-script-modify-example.js
`}</CodeBlock>

## Filtering

If the `FilterOut` field of the output is returned as `true`, the message will be acknowledged immediately and won't be sent to the target. This will be the behavior regardless of what is returned to the other fields in the protocol.

<CodeBlock language="js" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/create-a-script-filter-example.js
`}</CodeBlock>

## Setting the Partition Key

To set the Partition Key in the message, you can simply set the input's PartitionKey field, and return it:

<CodeBlock language="js" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/create-a-script-setpk-example.js
`}</CodeBlock>

Or, if modifying the data as well, return the modified data and PartitionKey field:

<CodeBlock language="js" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/create-a-script-setpk-modify-example.js
`}</CodeBlock>

## Setting an HTTP header

For the `http` target only, you can specify a set of HTTP headers, which will be appended to the configured headers for the `http` target. Do so by providing an object in the `HTTPHeaders` field:

<CodeBlock language="js" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/custom-scripts/create-a-script-header-example.js
`}</CodeBlock>

The headers will only be included if the target has the [`dynamic_headers = true` setting](/docs/api-reference/snowbridge/configuration/targets/http/index.md#configuration-options) configured.


## Helper functions

* `hash(input, algorithm)` hashes the input value. Salt is configured using the `hash_salt_secret` parameter in the hcl configuration. If no value is provided, this function will perform an unsalted hash

The following hash algorithms are supported:
- `sha1` - SHA-1 hash (160 bits)
- `sha256` - SHA-256 hash (256 bits)
- `md5` - MD5 hash (128 bits) 

```
hash(input.Data["app_id"], "sha1")
```

## Configuration

Once your script is ready, you can configure it in the app by following the [Javascript](/docs/api-reference/snowbridge/configuration/transformations/custom-scripts/javascript-configuration/index.md) configuration page.

You can also find some complete example use cases in [the examples section](/docs/api-reference/snowbridge/configuration/transformations/custom-scripts/examples/index.md).

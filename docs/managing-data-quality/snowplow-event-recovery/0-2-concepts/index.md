---
title: "Concepts"
date: "2020-04-15"
sidebar_position: 0
---

There is a wide range of use cases at which the recovery might come in handy. Configuration mechanism allows for flexibility taking into account the most common use cases.

With recovery it is possible to:

- replace values
- remove values
- cast JSON types

## Configuration

With introduction of multiple bad row types, recovery process has to adjust its runtime to operate only on a subset of bad rows or to be able to perform different action on different bad row types. Therefore to allow for the flexibility we introduce reusable configuration components that we map onto specific bad row types:

### Steps

Steps are individual modifications applied to Bad Row payloads as atomic parts of recovery flows (scenarios). The steps operate on specific field values and can replace or nullify/remove values. Other modifications could possibly be implemented in the future. There is prior art started at [Json Patch](http://jsonpatch.com/#operations) that provides an RFC for patching operations used with HTTP. These operations are however limited to structural changes not value changes and it assumes no deep modifications. It was suggested whether we could extend the specification to also operate internally on field values. The assumption is that we add additional, optional field - `match` that, when available as a part of step description, will use the field's value as a regex and replace its matches with `value`.

Currently we do anticipate following operations that can be expressed:

- replace value contents by matching an expression (can be used to replace complete values)
- remove value contents by matching an expression
- cast value from one type to another (ie. `string -> int`, `int -> string`, `a -> [a]`)

It is important to note that recovery operates on bad row payloads and thus steps' path scopes its entry point as bad row's `payload` field, ie. to reach a `vendor` field that's located within `raw` part of payload, the `path` is `raw.vendor`.

Steps are constructed with following JSON object format consisting of four individual parts:

- `op` - transformation operation to perform: Replace, Remove, Cast
- `path` - JSON Path to object, the path can contain specific field names (ie. `raw`) , array ids (ie. `[1]`) or filters (by regex: `$.raw.parameters.cx.data.[?(@.data.navigationStart=~([0-9]+))].data.domComplete`).
- `match` - an expression applied when replacing field's values with new value
- `value` - a new value to be set

```
// Replace
{
  "op": "Replace",
  "path": "$.raw.parameters.aid",
  "match": "(?U)^.*$",
  "value": "https://console.snplow.com/"
}

// Remove
{
  "op": "Remove",
  "path": "$.raw.parameters.aid",
  "match": "(?U)^.*$"
}

// Cast
{
  "op": "Cast",
  "path": "
$.raw.parameters.cx.data.[?(@.data.navigationStart=~([0-9]+))].data.domComplete",
  "from": "Numeric",
  "to": "Boolean"
}
```

### Conditions

Conditions are boolean expressions that operate on `BadRow` fields. The conditions are used to select proper recovery flow depending on `BadRow` structure or value. For structure finding appropriate path is solved by many specs of JSON query ie. Json Path. The values can be matched using regexes using a flexible syntax that is well understood and widely used. Condition therefore is a product of path and value expressions. To keep it in line with [JSON Patch](http://jsonpatch.com/#operations), following description is proposed: It is important to note that conditions can be applied to arbitrary bad row fields and thus conditions' path scopes its entry point as bad row's "root".

Much like steps, conditions are constructed with following JSON object format consisting of four individual parts:

- `op` - transformation operation to perform: Replace, Remove, Cast
- `path` - JSON Path to object, the path can contain specific field names (ie. `raw`) , array ids (ie. `[1]`) or filters (by regex: `[?(@.schema=~iglu://\\.*)]`).
- `value` - a value matcher to match against: match a regular expression, compare directly (object equality), check size for equality, less or greater than

```
// Compare values
{
  "op": "Test",
  "path": "$.processor.artifact",
  "value": {
    "value": "beam-enrich"
  }
}

// Match against regex
{
  "op": "Test",
  "path": "$.payload.raw.vendor",
  "value": {
    "regex": "com.snowplow\\.*"
  }
}

// Compare sizes
{
  "op": "Test",
  "path": "$.processor.artifact",
  "value": {
    "size": {
      "eq": 11
    }
  }
}
{
  "op": "Test",
  "path": "$.processor.artifact",
  "value": {
    "size": {
      "gt": 3
    }
  }
}
{
  "op": "Test",
  "path": "$.processor.artifact",
  "value": {
    "size": {
      "lt": 30
    }
  }
}
```

### Flows

Flows are sequences of Steps applied one by one. Flows are mapped onto specific

```
{
  "name": "main flow",
  "conditions": [],
  "steps": []
}
```

## I/O

By principle data is sourced from bad row bucket storage and delivered back into collector stream. Failed and unrecoverable bad rows are stored in bucket storage. For cloud-specific locations see below tables.

#### AWS

<table><tbody><tr><td>input</td><td>output</td><td>failed output</td><td>unrecoverable output</td></tr><tr><td>S3<br/>(<code>--input</code>)</td><td>Kinesis<br/>(<code>--output</code>)</td><td>S3<br/>(<code>--failedOutput</code>)</td><td>S3<br/>(<code>--unrecoverableOutput</code>)</td></tr></tbody></table>

#### GCP

<table><tbody><tr><td>input</td><td>output</td><td>failed output</td><td>unrecoverable output</td></tr><tr><td>GCS<br/>(<code>--input</code>)</td><td>PubSub<br/>(<code>--output</code>)</td><td>GCS<br/>(<code>--failedOutput</code>)</td><td>GCS (<code>--unrecoverableOutput</code>)</td></tr></tbody></table>

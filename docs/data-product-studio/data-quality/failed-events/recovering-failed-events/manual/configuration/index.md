---
title: "Configuration"
description: "Configure failed event recovery parameters and settings for optimal data quality restoration workflows."
schema: "TechArticle"
keywords: ["Recovery Configuration", "Recovery Setup", "Config Management", "Recovery Settings", "Configuration Guide", "Setup Process"]
date: "2020-08-25"
sidebar_position: 10
---

Configuration for event recovery involves the use of reusable components that help map onto specific failure types. The following components are available:

### Steps

Steps are individual modifications applied to specific failed event payloads. The steps operate on specific field values and can replace, remove/nullify or cast JSON type values.

Notice

Recovery operates on an individual event's `payload` field. As an example to reach the `vendor` field that’s located within the payload, the `path` would be `$.vendor`.

Steps are constructed in JSON object format consisting of four individual parts:

- `op` – transformation operation to perform: Replace, Remove, Cast
- `path` – JSON Path to the object where the operation is meant to happen. The path can contain specific field names (ie. `vendor`) , array ids (ie. `[1]`) or filters (by regex: `$.raw.parameters.cx.data.[?(@.data.navigationStart=~([0-9]+))].data.domComplete`).
- `match` – an expression applied when replacing field’s values with new value
- `value` – a new value to be set
- `from` / `to` - used for casting types _from_ one type _to_ another

```json
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

Conditions are boolean expressions that operate on failed event fields in order to match on specific structure or values.

Note that conditions can be applied to arbitrary fields and therefore a condition's path scopes its entry point as the failed events “root”.

Much like steps, conditions are constructed with the following JSON object format consisting of four individual parts:

- `op` – transformation operation to perform: Replace, Remove, Cast & Test (tests that the specified value is set in the document. If the test fails, then the patch as a whole should not apply.)
- `path` – JSON Path to object, the path can contain specific field names (ie. `raw`) , array ids (ie. `[1]`) or filters (by regex: `[?(@.schema=~iglu://\\.*)]`).
- `value` – a value matcher to match against: match a regular expression, compare directly (object equality), check size for equality, less or greater than

```json
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

Flows are sequences of Steps applied one by one. Flows are mapped onto specific steps and conditions.

```json
{
  "name": "main flow",
  "conditions": [],
  "steps": []
}
```

## I/O

In principle data is sourced from bucket storage and delivered back into a collector. Recoverable and unrecoverable failed events are stored in bucket storage. For cloud-specific locations see below tables.

#### AWS

<table><tbody><tr><td>input</td><td>output</td><td>failed output</td><td>unrecoverable output</td></tr><tr><td>S3<br/>(<code>--input</code>)</td><td>Kinesis<br/>(<code>--output</code>)</td><td>S3<br/>(<code>--failedOutput</code>)</td><td>S3<br/>(<code>--unrecoverableOutput</code>)</td></tr></tbody></table>

#### GCP

<table><tbody><tr><td>input</td><td>output</td><td>failed output</td><td>unrecoverable output</td></tr><tr><td>GCS<br/>(<code>--input</code>)</td><td>PubSub<br/>(<code>--output</code>)</td><td>GCS<br/>(<code>--failedOutput</code>)</td><td>GCS (<code>--unrecoverableOutput</code>)</td></tr></tbody></table>

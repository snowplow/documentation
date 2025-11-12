---
title: "Configuration Examples"
date: "2020-07-22"
sidebar_position: 0
---

### Minimal example

The most basic configuration that will run for the particular failure type: `adapter-failure`, in a particular version, and mark all others as `failed` because of missing configuration mappings would look like this:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/4-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/adapter_failures/jsonschema/1-0-0": [
      {
        "name": "pass-through-flow",
        "conditions": [],
        "steps": []
      }
    ]
  }
}
```

In above scenario we would be resubmitting all the received `adapter_failures` without any modifications.

### Multiple flows example

The next example shows a way of setting up multiple configuration flows for specific failure types. Configurations will be matched top to bottom and the first from the top will be chosen.

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/4-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-0": [
      {
        "name": "main-flow",
        "conditions": [
          {
            "op": "Test",
            "path": "$.payload.raw.vendor",
            "value": {
              "regex": "com.snowplow\\.*"
            }
          }
        ],
        "steps": [
          {
            "op": "Replace",
            "path": "$.raw.refererUri",
            "match": "(?U)^.*$",
            "value": "https://console.snplow.com/"
          }
        ]
      },
      {
        "name": "pass-through",
        "conditions": [],
        "steps": []
      }
    ]
  }
}
```

In above scenario we would only process the `1-0-0` version of `enrichment_failures`. We would be modifying those for which vendor in raw payload starts with `com.snowplow`. For those rows that match that field value, we replace the full `refererUri` contents with `https://console.snplow.com/`. All other `enrichment_failures` will be resubmitted as they were originally (pass-through scenario).

### Putting it all together

Below is an advanced example making use of most of the features and performing multiple operations on a very specific subset of failed events.

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/4-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-0": [
      {
        "name": "main-flow",
        "conditions": [
          {
            "op": "Test",
            "path": "$.processor.artifact",
            "value": {
              "value": "beam-enrich"
            }
          },
          {
            "op": "Test",
            "path": "$.payload.raw.vendor",
            "value": {
              "regex": "com.snowplow\\.*"
            }
          },
          {
            "op": "Test",
            "path": "$.processor.artifact",
            "value": {
              "size": {
                "eq": 11
              }
            }
          },
          {
            "op": "Test",
            "path": "$.processor.artifact",
            "value": {
              "size": {
                "gt": 3
              }
            }
          },
          {
            "op": "Test",
            "path": "$.processor.artifact",
            "value": {
              "size": {
                "lt": 30
              }
            }
          }
        ],
        "steps": [
          {
            "op": "Replace",
            "path": "$.raw.refererUri",
            "match": "(?U)^.*$",
            "value": "https://console.snplow.com/"
          },
          {
            "op": "Remove",
            "path": "$.raw.parameters.aid",
            "match": "(?U)^.*$"
          },
          {
            "op": "Replace",
            "path": "$.raw.headers",
            "match": "X-Forwarded-Proto:.*",
            "value": "X-Forwarded-Proto: http"
          },
          {
            "op": "Replace",
            "path": "$.raw.parameters.cx.data.[?(@.schema=~iglu:org.w3/PerformanceTiming/jsonschema/1-0-0)].data.loadEventEnd",
            "match": "(?U)^.*$",
            "value": "1"
          },
          {
            "op": "Cast",
            "path": "$.raw.parameters.cx.data.[?(@.schema=~iglu:org.w3/PerformanceTiming/jsonschema/1-0-0)].data.domComplete",
            "from": "Numeric",
            "to": "Boolean"
          },
          {
            "op": "Replace",
            "path": "$.raw.parameters.cx.data.[1].data.domComplete",
            "match": "false",
            "value": "true"
          },
          {
            "op": "Cast",
            "path": "$.raw.parameters.cx.data.[?(@.data.navigationStart=~([0-9]+))].data.domComplete",
            "from": "Boolean",
            "to": "Numeric"
          }
        ]
      },
      {
        "name": "impossible-flow",
        "conditions": [
          {
            "op": "Test",
            "path": "$.processor.artifact",
            "value": {
              "value": "lorem-ipsum"
            }
          }
        ],
        "steps": []
      }
    ]
  }
}
```

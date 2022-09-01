---
title: "Configuration Examples"
date: "2020-04-14"
sidebar_position: 0
---

Below configuration examples incorporate most of the available features.

### Minimal example

The most basic configuration that will run for particular bad row type in particular version and mark all the other as `failed` because of missing configuration mappings.

```
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/2-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/adapter_failures/jsonschema/*-*-*": [
      {
        "name": "pass-through flow",
        "conditions": [],
        "steps": []
      }
    ]
  }
}
```

In above scenario we want to resubmit all the received `adapter_failures` without any modifications.

### Multiple flows example

Following example shows a way of setting up multiple configuration flows for specific bad row types. Configurations will be matched top to bottom and the first from the to will be chosen.

```
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/2-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-*": [
      {
        "name": "main flow",
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

In above scenario we want to process `1-0`\-series of `enrichment_failures` bad row type only. Moreover we only want to modify those for which vendor in raw payload is starting with `com.snowplow`. For those bad rows we will replace full `refererUri` contents with `https://console.snplow.com/`. All the other `enrichment_failures` will be resubmitted as they've been originally submitted (pass-through scenario).

### Full example

An advanced example making use of most of the features that will perform multiple operations on very specific subset of bad rows.

```
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/2-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-*": [
      {
        "name": "main flow making use of most of available features",
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
        "name": "impossible flow",
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

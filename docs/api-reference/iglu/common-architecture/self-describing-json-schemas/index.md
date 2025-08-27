---
title: "Self-describing JSON Schemas"
description: "Self-describing JSON Schema extensions with vendor, name, format, and version metadata for semantic identification and versioning."
date: "2021-03-26"
sidebar_position: 30
---

_This page is adapted from the Snowplow Analytics blog post, [Introducing self-describing JSONs](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/)._

With the explosion of possible event types due to Snowplow going from a web analytics to a general event analytics platform, it became necessary to give some coherence to the events sent in to Snowplow. Snowplow dealing only with JSON, we chose to rely on JSON Schemas.

In addition to the usual JSON Schema we decided to make it self-describing by adding information we already knew about the schema such as:

- `vendor` which tells us who created this JSON Schema
- `name` which is the JSON Schema's name
- `format` in our case this will be a JSON Schema
- `version` which is the JSON Schema's version (using [SchemaVer](/docs/api-reference/iglu/common-architecture/schemaver/index.md))

We encapsulated all this information in a `self` property.

As an example, we would go from this JSON Schema:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "properties": {
        "bannerId": {
            "type": "string"
        }
    },
    "required": ["bannerId"],
    "additionalProperties": false
}
```

to this one:

```json
{
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    "self": {
        "vendor": "com.snowplowanalytics",
        "name": "ad_click",
        "format": "jsonschema",
        "version": "1-0-0"
    },
    "type": "object",
    "properties": {
        "bannerId": {
            "type": "string"
        }
    },
    "required": ["bannerId"],
    "additionalProperties": false
}
```

incorporating the aforementioned `self` property.

Notice that we also changed the `$schema` property to [our own JSON Schema](http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#) which enforces the `self` property.

To make our JSONs self-describing we still have to reference this JSON Schema in our JSONs. This process is described in [Self-describing JSONs](/docs/api-reference/iglu/common-architecture/self-describing-jsons/index.md).

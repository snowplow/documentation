---
title: "SchemaVer"
date: "2021-03-26"
sidebar_position: 10
---

_This page is adapted from the Snowplow Analytics blog post, [Introducing SchemaVer for semantic versioning of schemas](http://snowplowanalytics.com/blog/2014/05/13/introducing-schemaver-for-semantic-versioning-of-schemas/) ._

### Overview

With the advent of our new self-describing JSON Schemas, it became necessary to implement some kind of versioning to those JSON Schemas so they could evolve through time.

Our approach is based on [semantic versioning](http://semver.org/) (SemVer for short) which, as a reminder, looks like this: `MAJOR.MINOR.PATCH`

- `MAJOR` which you're supposed to use when you make backwards-incompatible API changes
- `MINOR` when you add backwards-compatible functionalities
- `PATCH` when you make backwards-compatible bug fixes

As is, SemVer does not suit schema versioning well. Indeed, there is no such thing as bug fixes for a JSON Schema and the idea of an API doesn't really translate to JSON Schemas either.

That's why we decided to introduce our own schema versioning notion: SchemaVer.  
SchemaVer is defined as follows: `MODEL-REVISION-ADDITION`

- `MODEL` when you make a breaking schema change which will prevent interaction with _any_ historical data
- `REVISION` when you introduce a schema change which _may_ prevent interaction with _some_ historical data
- `ADDITION` when you make a schema change that is compatible with _all_ historical data

### Addition example

By way of example, if we were to modify an existing JSON Schema representing an ad click with version `1-0-0` defined as follows:

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

and introduce a new `impressionId` property to obtain the following JSON Schema:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "properties": {
        "bannerId": {
            "type": "string"
        },
        "impressionId": {
            "type": "string"
        }
    },
    "required": ["bannerId"],
    "additionalProperties": false
}
```

Because the new `impressionId` is **not** a required property and because the `additionalProperties` in our `1-0-0` version was set to `false`, any historical data following the `1-0-0` schema will work with this new schema.  
  
According to our definition of SchemaVer, we are consequently looking at an `ADDITION` and the schema's version becomes `1-0-1`.

### Revision example

If we continue with the same example, but modify the `additionalProperties` property to true to get the following schema:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "properties": {
        "bannerId": {
            "type": "string"
        },
        "impressionId": {
            "type": "string"
        }
    },
    "required": ["bannerId"],
    "additionalProperties": true
}
```

We are now at version `1-0-2`. After a while, we decide to add a new `cost` property:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "properties": {
        "bannerId": {
            "type": "string"
        },
        "impressionId": {
            "type": "string"
        },
        "cost": {
            "type": "number",
            "minimum": 0
        }
    },
    "required": ["bannerId"],
    "additionalProperties": true
}
```

The problem now is that since we modified the `additionalProperties` to true before adding the `cost` field, someone might have added another `cost` field in the meantime following a different set of rules (for example it could be an amount followed by the currency such as 1.00$, the effective type would be string and not number) and so we cannot be sure that this new schema validate all historical data.  
  
As a result, this new JSON Schema is a `REVISION` of the previous one, its version becomes `1-1-0`.

### Model example

Times goes by and we choose to completely review our JSON Schema identifying an ad click only through a `clickId` property so our schema becomes:

```json
{
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "properties": {
        "clickId": {
            "type": "string"
        },
        "cost": {
            "type": "number",
            "minimum": 0
        }
    },
    "required": ["clickId"],
    "additionalProperties": false
}
```

The change is so important that we cannot realistically expect our historical data to interact with this new JSON Schema, consequently, the `MODEL` is changed and the schema's version becomes `2-0-0`.  
  
Another important thing to notice is that we switched the `additionalProperties` back to false in order to avoid unnecessary future revisions.

### Additional differences

There are a few additional differences between our own SchemaVer and SemVer:

- we use hyphens instead of periods to separate the components that make our SchemaVer
- the versioning starts with `1-0-0` instead of `0.1.0`

The design considerations behind those decisions can be found in the blog post on [SchemaVer](http://snowplowanalytics.com/blog/2014/05/13/introducing-schemaver-for-semantic-versioning-of-schemas/).

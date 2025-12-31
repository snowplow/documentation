---
title: "Structuring your data with schemas"
sidebar_label: "Schemas (data structures)"
sidebar_position: 3
description: "Schemas are a powerful feature that ensures your data is clean and descriptive"
---

**Schemas** are one of the most powerful features of Snowplow. They define the structure of the data that you collect. Each schema defines what fields are recorded with each [event](/docs/fundamentals/events/index.md), and provides validation criteria for each field. Schemas are also used to describe the structure of [entities that are attached to events](/docs/fundamentals/entities/index.md).

:::info Terminology

We often use the terms “schema” and “data structure” interchangeably, although “data structure” usually refers to a combination of a schema with some additional metadata.

:::

With schemas, you can:

* Define your own data structures to capture data in a way that works for your business. For example, a two-sided marketplace will be tracking very different events than a gaming application
* Ensure your data presents a clear and easy-to-understand record of what has happened

As you evolve your website, mobile app or server-side application, you can evolve your schemas to reflect the changes. _In the data warehouse, Snowplow automatically evolves your table definition to accommodate both old and new data safely and non-destructively._

:::tip

Check out the documentation for [managing](/docs/event-studio/data-structures/manage/index.md) and [versioning](/docs/event-studio/data-structures/version-amend/index.md) data structures.

:::

## Managing data quality with schemas

Schemas describe how you want your data to be structured. When data is [processed through your Snowplow pipeline](/docs/fundamentals/index.md), each event is validated against its schema and only valid events are allowed to pass through. [Failed events](/docs/fundamentals/failed-events/index.md) are sent to a separate location.

By describing how the data should be structured as part of your schema definition, you ensure clean and consistent data landing in your data warehouse or other destinations.

## Building data meaning with schemas

Rather than just leaving your data open to interpretation by the many different people that will consume and analyze it, you can use schemas to describe the meaning of your data. Each schema you define should clearly describe what is being collected and why — both for the schema itself and for each field within the schema.

## Iglu

**Iglu** is a set of tools for hosting and managing schemas (more specifically, JSON schemas). We use it to store all the schemas associated with events and entities.

:::info Terminology

We use the terms “schema repository” and “schema registry” interchangeably.

:::

There is a [central Iglu repository](http://iglucentral.com/) that holds public schemas for use with Snowplow, including ones for some of the [out-of-the-box self-described events](/docs/fundamentals/events/index.md#out-of-the-box-and-custom-events) and [out-of-the-box entities](/docs/fundamentals/entities/index.md#out-of-the-box-entities).

To host schemas for your [custom self-described events](/docs/fundamentals/events/index.md#self-describing-events) and [custom entities](/docs/fundamentals/entities/index.md#custom-entities), you can run your own Iglu, either using [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) (recommended), or a [static repository](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md). _(This is not required for Snowplow CDI customers, as Snowplow already includes a private Iglu repository.)_

## The anatomy of a schema

:::info
Snowplow CDI customers can create custom schemas using the [Data Structures Builder](/docs/event-studio/data-structures/manage/builder/index.md) without worrying about how it works under the hood.
:::

Snowplow schemas are based on the [JSON Schema](https://json-schema.org/) standard ([draft 4](https://datatracker.ietf.org/doc/html/draft-fge-json-schema-validation-00)). For a comprehensive guide to all Snowplow supported validation options, see the [Snowplow JSON Schema reference](/docs/fundamentals/schemas/json-schema-reference/index.md). Let’s take a look at an example schema to talk about its constituent parts:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an example event",
  "self": {
    "vendor": "com.snowplowanalytics",
    "name": "example_event",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 128
    },
    "job_role": {
      "description": "",
      "type": [
        "string",
        "null"
      ],
      "maxLength": 128
    },
    "promo_code": {
      "description": "",
      "type": [
        "string",
        "null"
      ],
      "minLength": 8,
      "maxLength": 20
    }
  },
  "additionalProperties": false,
  "required": [
    "name"
  ]
}
```

**“$schema”** - this argument instructs the Snowplow pipeline on how to handle this schema and in most circumstances should be left as shown in the example.

**“description”** - This argument is where you should put detailed information on the purpose of this schema. This will be particularly helpful for others who are trying to understand the meaning of particular data or when they want to know if a schema already exists for something they want to track.

**“self”** - This section of arguments contains metadata which makes the schema “self-describing”.

- **“vendor”** - This usually refers to the company who has authored the schema. Most times this will be your company’s name. This could also be for organizing schemas from different groups in your organization if you have multiple teams working on different events and contexts (e.g. com.acme.android, com.acme.marketing). Snowplow uses the reversed company internet domain for vendor names (e.g. com.snowplowanalytics).
- **“name”** - This is the name you want to give your schema. Much like the description above, this is a good chance to help others like data analysts who might be consuming this data know exactly what your schema is meant to capture.
- **“format”** - This field simply states the format of the schema which will always be `jsonschema`.
- **“version”** - Snowplow allows you to [increment versions of a schema](/docs/event-studio/data-structures/version-amend/index.md) as your tracking needs to evolve and this argument stores the current version.

After the self section, the remainder of the schema is where you will begin describing the event or context fields that you will be collecting.

**“type”** - Type should always be set as `object`.

**“properties”** - Here is where you will describe the fields you intend on collecting. Each field is given a name and a number of arguments, these are important as they feed directly into the validation process.

- **“description”** - Similar to the description field for the schema, this argument is where you should put detailed information on what this field represents to avoid any misunderstanding or misinterpretation during analysis.
- **"type"** - This denotes the type of data that is collected through this field. The most common types of data collected are `string`, `number`, `integer`, `object`, `array`, `boolean` and `null`. A single field can allow multiple types as shown in the field `job role` in the example schema which allows both `string` and `null`
- Validation arguments can then be passed into the field such as `minLength`, `maxLength` and `enum` for strings and `minimum` and `maximum` for integers.

**“$supersedes”** / **“$supersededBy”** - _Optional, not shown_. See [marking schemas as superseded](/docs/event-studio/data-structures/version-amend/amending/index.md#marking-the-schema-as-superseded).

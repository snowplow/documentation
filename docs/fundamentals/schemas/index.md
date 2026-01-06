---
title: "Introduction to structuring your data with schemas"
sidebar_label: "Schemas and data structures"
sidebar_position: 3
description: "Schemas are a powerful feature that ensures your data is clean and descriptive"
---

**Schemas** define the structure of the data that you collect. Each schema defines what fields are recorded with each [event](/docs/fundamentals/events/index.md), and provides validation criteria for each field. Schemas are also used to describe the structure of [entities that are attached to events](/docs/fundamentals/entities/index.md).

With schemas, you can:
* Build meaning into your data by clearly defining what each field represents.
* Define your own data structures to capture data in a way that works for your business. For example, a two-sided marketplace will be tracking very different events from a gaming application.
* Ensure your data presents a validated record of what has happened.

Schemas describe how you structure your data. When data is [processed through your Snowplow pipeline](/docs/fundamentals/index.md), each event is validated against its schema and only valid events are allowed to pass through. [Failed events](/docs/fundamentals/failed-events/index.md) are sent to a separate location.

By describing how the data should be structured as part of your schema definition, you ensure clean and consistent data landing in your data warehouse or other destinations.

As you evolve your website, mobile app, or server-side application, you can update your schemas to reflect the changes. Snowplow automatically evolves your table definition to accommodate both old and new data safely.

## Data structures are schemas plus metadata

We often use the terms "schema" and "data structure" interchangeably, but they're not exactly the same thing. A **schema** is the JSON Schema definition that describes the structure of your data.

A **data structure** is a higher-level data management concept that includes the schema along with additional metadata, including:
* Whether the schema is to be used for an event or an entity
* Whether it's available to your pipeline, or is still in draft
* Optional change notes associated with schema versions

[Data structures](/docs/data-product-studio/data-structures/index.md) wrap schemas with this additional metadata to help you manage your data definitions. They allow you to group related schemas within [data products](/docs/data-product-studio/data-products/index.md) (tracking plans), or keep track of [which schemas are used where](/docs/data-product-studio/event-specifications/index.md).

:::tip Data structure management
Check out the documentation for [managing](/docs/data-product-studio/data-structures/manage/index.md) and [versioning](/docs/data-product-studio/data-structures/version-amend/index.md) data structures.
:::

## Self-describing JSON schema anatomy

:::info Data structures builder
Snowplow CDI customers can create custom schemas using the [data structures builder](/docs/data-product-studio/data-structures/manage/builder/index.md), without worrying about how it works under the hood.
:::

Snowplow schemas are based on the [JSON Schema](https://json-schema.org/) standard ([draft 4](https://datatracker.ietf.org/doc/html/draft-fge-json-schema-validation-00)). For a comprehensive guide to all Snowplow supported validation options, see the [Snowplow JSON Schema reference](/docs/api-reference/json-schema-reference/index.md).

Snowplow specifically uses **self-describing JSON schemas**, meaning that they contain metadata about themselves within the schema definition.

Let's take a look at an example schema to talk about its constituent parts:

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

`$schema`: this argument instructs the Snowplow pipeline on how to handle this schema and in most circumstances should be left as shown in the example.

`description`: this argument is where you should put detailed information on the purpose of this schema. This will be particularly helpful for others who are trying to understand the meaning of particular data or when they want to know if a schema already exists for something they want to track.

`self`: this section of arguments contains metadata which makes the schema "self-describing".

- `vendor`: this usually refers to the company who has authored the schema. Most times this will be your company’s name. This could also be for organizing schemas from different groups in your organization if you have multiple teams working on different events and entities (e.g. `com.acme.android`, `com.acme.marketing`). Snowplow uses the reversed company internet domain for vendor names (e.g. `com.snowplowanalytics`).
- `name`: this is the name you want to give your schema. Much like the description above, this is a good chance to help others like data analysts who might be consuming this data know exactly what your schema is meant to capture.
- `format`: this field simply states the format of the schema which will always be `jsonschema`.
- `version`: Snowplow allows you to [increment versions of a schema](/docs/data-product-studio/data-structures/version-amend/index.md) as your tracking needs to evolve and this argument stores the current version.

After the self section, the remainder of the schema is where you will begin describing the event or entity fields that you will be collecting.

`type`: type should always be set as `object`.

`properties`: here is where you will describe the fields you intend on collecting. Each field is given a name and a number of arguments, these are important as they feed directly into the validation process.

- `description`: similar to the description field for the schema, this argument is where you should put detailed information on what this field represents to avoid any misunderstanding or misinterpretation during analysis.
- `type`: this denotes the type of data that is collected through this field. The most common types of data collected are `string`, `number`, `integer`, `object`, `array`, `boolean` and `null`. A single field can allow multiple types as shown in the field `job role` in the example schema which allows both `string` and `null`
- Validation arguments can then be passed into the field such as `minLength`, `maxLength` and `enum` for strings and `minimum` and `maximum` for integers.

This example doesn't show the optional `$supersedes` and `$supersededBy` fields. See [marking schemas as superseded](/docs/data-product-studio/data-structures/version-amend/amending/index.md#marking-the-schema-as-superseded).

## Iglu schema repository

:::info Iglu is included for Snowplow CDI customers
Snowplow CDI customers don't need to create or manage their own Iglu repositories. A private Iglu repository is included in your pipeline.
:::

**Iglu** is a set of tools for hosting and managing JSON schemas. We use it to store all the schemas associated with events and entities. It's called a schema repository or schema registry.

You'll notice that schema URIs use the `iglu:` protocol, for example: `iglu:com.snowplowanalytics.snowplow/page_view/jsonschema/1-0-0`. This is because all Snowplow schemas are stored in an Iglu repository.

There is a [central Iglu repository](http://iglucentral.com/) that holds public schemas for use with Snowplow, including ones for some of the [out-of-the-box self-describing events](/docs/fundamentals/events/index.md#self-describing-events) and [out-of-the-box entities](/docs/fundamentals/entities/index.md#how-to-track-entities).

For Snowplow Self-Hosted users, you'll need to run your own Iglu schema repository to host schemas for your custom [events](/docs/fundamentals/events/index.md#self-describing-events) and [entities](/docs/fundamentals/entities/index.md#custom-entities). Use [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) (recommended), or a [static repository](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md).

## Self-describing JSON data in the event payload

Snowplow trackers can send self-describing JSON event and entity data as is, or as Base64-encoded strings. Base-64 strings are URL-safe and ensure that no data is lost or corrupted. The downside is that the data will be bigger and less readable.

Here's an example showing a self-describing JSON object for a product view event:

```json
{
  "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
  "data": {
    "product_id": "ASO01043",
    "price": 49.95
  }
}
```

Before adding this data to the event payload, the tracker will wrap this event self-describing JSON in an outer self-describing JSON. The wrapper specifies that this is a self-describing event, using the historical `unstruct_event` naming:

```json
{
  // Tells Snowplow this is an self-describing event
  "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
  "data": {

    // Tells Snowplow this is a viewed_product event
    "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
    "data": {

      // The event data itself
      "product_id": "ASO01043",
      "price": 49.95
    }
  }
}
```

:::info It's self-describing JSON all the way down
The event payload is itself a self-describing JSON object. See how this works in practise in these [example tracker HTTP requests](/docs/events/http-requests/index.md).
:::

The parameter name used for this wrapped structure depends on whether you've chosen to use Base-64 encoding or not:

| Payload property | Type                | Example values                                                 |
| ---------------- | ------------------- | -------------------------------------------------------------- |
| `ue_px`          | Base64-encoded JSON | `eyAicHJvZHVjdF9pZCI6ICJBU08wMTA0MyIsICJwcmljZSI6IDQ5Ljk1IH0=` |
| `ue_pr`          | JSON                | `{ "product_id": "ASO01043", "price": 49.95 }`                 |

Trackers process entities in a similar way. The differences are:
* They're wrapped in a `contexts` self-describing JSON rather than `unstruct_event`
* Payload parameter options are `co` for JSON or `cx` for Base64-encoded JSON

See the [schema translation reference](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md) page to learn how schema data lands in your warehouse.

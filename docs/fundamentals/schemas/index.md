---
title: "Introduction to structuring your data with schemas"
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

Check out the documentation for [managing](/docs/data-product-studio/data-structures/manage/index.md) and [versioning](/docs/data-product-studio/data-structures/version-amend/index.md) data structures.

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
Snowplow CDI customers can create custom schemas using the [Data Structures Builder](/docs/data-product-studio/data-structures/manage/builder/index.md) without worrying about how it works under the hood.
:::

Snowplow schemas are based on the [JSON Schema](https://json-schema.org/) standard ([draft 4](https://datatracker.ietf.org/doc/html/draft-fge-json-schema-validation-00)). For a comprehensive guide to all Snowplow supported validation options, see the [Snowplow JSON Schema reference](/docs/data-product-studio/json-schema-reference/index.md). Let’s take a look at an example schema to talk about its constituent parts:

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
- **“version”** - Snowplow allows you to [increment versions of a schema](/docs/data-product-studio/data-structures/version-amend/index.md) as your tracking needs to evolve and this argument stores the current version.

After the self section, the remainder of the schema is where you will begin describing the event or context fields that you will be collecting.

**“type”** - Type should always be set as `object`.

**“properties”** - Here is where you will describe the fields you intend on collecting. Each field is given a name and a number of arguments, these are important as they feed directly into the validation process.

- **“description”** - Similar to the description field for the schema, this argument is where you should put detailed information on what this field represents to avoid any misunderstanding or misinterpretation during analysis.
- **"type"** - This denotes the type of data that is collected through this field. The most common types of data collected are `string`, `number`, `integer`, `object`, `array`, `boolean` and `null`. A single field can allow multiple types as shown in the field `job role` in the example schema which allows both `string` and `null`
- Validation arguments can then be passed into the field such as `minLength`, `maxLength` and `enum` for strings and `minimum` and `maximum` for integers.

**“$supersedes”** / **“$supersededBy”** - _Optional, not shown_. See [marking schemas as superseded](/docs/data-product-studio/data-structures/version-amend/amending/index.md#marking-the-schema-as-superseded).


---
Each individual entity is a self-describing JSON such as:

```json
{
  "schema": "iglu:com.my_company/user/jsonschema/1-0-0",
  "data": {
    "fb_uid": "9999xyz"
  }
}
```

:::info

`"iglu:com.my_company/user/jsonschema/1-0-0"` respresents a [self-describing JSON](/docs/api-reference/iglu/common-architecture/self-describing-jsons/index.md). It is used to validate the event data against a predefined JSON Schema as part of a Snowplow pipeline.

:::


---


An example of a self-describing event for a product view event:

```json
{
  "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
  "data": {
    "product_id": "ASO01043",
    "price": 49.95
  }
}
```

:::info

`"iglu:com.my_company/viewed_product/jsonschema/1-0-0"` respresents a [self-describing JSON](/docs/api-reference/iglu/common-architecture/self-describing-jsons/index.md). It is used to validate the event data against a predefined JSON Schema as part of a Snowplow pipeline.

:::

---


## Self-describing JSON serialization

TODO this should probably go in the Fundamentals schema section

<details>
  <summary>How are self-describing events serialized in event payload?</summary>
  <div>

The tracker will wrap this self-describing JSON in an outer self-describing JSON, which is what gets sent in the payload:

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

As well as setting `e=ue`, there are two custom event specific parameters that can be populated with the outer self-describing JSON:

| **Parameter** | **Table Column** | **Type**                       | **Description**             | **Example values**                                             |
| ------------- | ---------------- | ------------------------------ | --------------------------- |
| `ue_px`       | `unstruct_event` | JSON (URL-safe Base64 encoded) | The properties of the event | `eyAicHJvZHVjdF9pZCI6ICJBU08wMTA0MyIsICJwcmljZSI6IDQ5Ljk1IH0=` |
| `ue_pr`       | `unstruct_event` | JSON                           | The properties of the event | `{ "product_id": "ASO01043", "price": 49.95 }`                 |

The tracker can decide to pass the `ue_px` or the `ue_pr` parameter. Encoding properties into URL-safe Base64 allows is the recommended approach although does sacrifice readability.

  </div>
</details>




<details>
  <summary>How are context entities serialized in event payload?</summary>
  <div>

All entities attached to an event will be wrapped in an array by the user and passed to the tracker, which will wrap them in a self-describing JSON:

```json
{

  // Tells Snowplow this is an array of custom contexts
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {

      // Tells Snowplow that this is a "user" context
      "schema": "iglu:com.my_company/user/jsonschema/1-0-0",
      "data": {

        // The context data itself
        "fb_uid": "9999xyz"
      }
    }
  ]
}
```

Trackers can be configured to encode the context into URL-safe Base64 to ensure that no data is lost or corrupted. The downside is that the data will be bigger and less readable.

| **Parameter** | **Table Column** | **Type**                       | **Description**             | **Example values**                                                                                                                                                                                                                                                                                             |
| ------------- | ---------------- | ------------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `co`          | `context`        | JSON                           | An array of custom contexts | `%7B%22schema%22:%22iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0%22,%22data%22:%5B%7B%22schema%22:%22iglu:com.my_company/user/jsonschema/1-0-0%22,%22data%22:%7B%22fb_uid%22:%229999xyz%22%7D%7D%5D%7D`                                                                                       |
| `cx`          | `context`        | JSON (URL-safe Base64 encoded) | An array of custom contexts | `ew0KICBzY2hlbWE6ICdpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wJyANCiAgZGF0YToge1sNCiAgICB7DQogICAgICBzY2hlbWE6ICdpZ2x1OmNvbS5teV9jb21wYW55L3VzZXIvanNvbnNjaGVtYS8xLTAtMCcgDQogICAgICBkYXRhOiB7DQogICAgICAgIGZiX3VpZDogJzk5OTl4eXonDQogICAgICB9DQogICAgfQ0KICBdfQ0KfQ==` |

:::note
The exact field names may vary depending on your warehouse, for snowflake/bigquery/databricks you will find `unstruct_` or `context_` at the front and for bigquery you will see an extended version number at the end such as `1_0_0`.
:::

  </div>
</details>

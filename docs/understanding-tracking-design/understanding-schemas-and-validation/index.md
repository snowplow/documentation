---
title: "Structuring your data with schemas"
date: "2020-02-13"
sidebar_position: 10
---

One of the most powerful features of Snowplow is schemas.

Schemas define the structure of the data that you collect. Each schema defines what fields are recorded with each event that is captured, and provides validation criteria for each field. Schemas are also used to describe the structure of [entities that are attached to events](/docs/understanding-tracking-design/understanding-events-entities/index.md).

Schemas make it possible for you to:

1. define your own data structures to capture data in a way that works for your business; for example a two-sided marketplace will be tracking very different events than a gaming application
2. ensure your data presents a clear and easy-to-understand record of what has happened
3. evolve your event and entity definitions over time by updating those schemas, enabling you to [evolve their data collection with their business](https://snowplowanalytics.com/blog/2019/07/23/how-to-ensure-your-data-collection-evolves-alongside-your-business/). Schemas can be updated to reflect changes to the design of websites, mobile apps and server-side applications
4. expand your tracking to include more data as your organisation becomes more data sophisticated and needs to collect more granular data

## Managing data quality with data structures

Schemas describe how you want your data to be structured. When data is [processed through your Snowplow pipeline](/docs/understanding-your-pipeline/architecture-overview-aws/index.md), each event is validated against its self-describing schema and only those that pass are allowed to pass through, [failures are sent to a separate queue](/docs/managing-data-quality/understanding-failed-events/index.md).

Through describing how the data should be structured as part of your schema definition you ensure clean and consistent data landing in your data warehouse or other destinations.

## Building data meaning with data structures

Rather than just leaving your data open to interpretation by the many different people that will consume and analyze it, you can use schemas to describe the meaning of your data. Each schema you define should clearly describe what is being collected and why both for the schema itself, but also for each field within the schema.

## The anatomy of a schema

:::info
If you are using BDP Cloud, you can create custom schemas using the [Data Structures Builder](/docs/understanding-tracking-design/managing-your-data-structures/builder/index.md) without worrying about how it works under the hood.
:::

Let’s take a look at an example JSON schema to talk about its constituent parts:

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
- **“version”** - Snowplow allows you to [increment versions of a schema](/docs/understanding-tracking-design/versioning-your-data-structures/index.md) as your tracking needs evolve and this argument stores the current version.

After the self section the remainder of the schema is where you will begin describing the event or context fields that you will be collecting.

**“type”** - Type should always be set as `object`.

**“properties”** - Here is where you will describe the fields you intend on collecting. Each field is given a name and a number of arguments, these are important as they feed directly into the validation process.

- **“description”** - Similar to the description field for the schema, this argument is where you should put detailed information on what this field represents to avoid any misunderstanding or misinterpretation during analysis.
- **"type"** - This denotes the type of data that is collected through this field. The most common types of data collected are `string`, `number`, `integer`, `object`, `array`, `boolean` and `null`. A single field can allow multiple types as shown in the field `job title` in the example schema which allows both `string` and `null`
- Validation arguments can then be passed into the field such as `minLength`, `maxLength` and `enum` for strings and `minimum` and `maximum` for integers. A full set of valid arguments can be found on the [JSON schema specification](https://datatracker.ietf.org/doc/html/draft-fge-json-schema-validation-00#section-5).

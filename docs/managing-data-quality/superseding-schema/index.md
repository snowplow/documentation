---
title: "Superseding schemas"
date: "2022-04-07"
sidebar_position: 50
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

One of the most powerful features of Snowplow is schemas.

Schemas define the structure of the data that you collect. Each schema defines what fields are recorded with each event that is captured, and provides validation criteria for each field. Schemas are also used to describe the structure of [entities that are attached to events](/docs/understanding-tracking-design/understanding-events-entities/index.md). You can get more information about schemas in [here](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md).

We treat schemas as immutable objects because updating the schemas might make previously valid events invalid. However, there are some cases we want more flexibility. Let's go through an example. Let's say we have an mobile application. We are sending certain events from this application, and these events contain contexts with following schema:

<details>
  <summary>Geolocation 1-0-0</summary>
  <CodeBlock>{`
  {
          "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
          "description": "Schema for client geolocation contexts",
          "self": {
                  "vendor": "com.acme",
                  "name": "geolocation",
                  "format": "jsonschema",
                  "version": "1-0-0"
          },
          "type": "object",
          "properties": {
                  "latitude": {
                          "type": "number",
                  },
                  "longitude": {
                          "type": "number",
                  }
          },
          "additionalProperties": false
  }
  `}</CodeBlock> 
</details>

Later, we realized that we mistakenly included `altitude` field to the context objects. Since `additionalProperties` is made `false`, all events with `altitude` field will end up as bad row. We can create new schema with version `1-0-1` that contains `altitude` field and use this schema in the next version of the application. However users will not update their application all at once to the new version. Events from the older version will continue to come therefore there will be still bad rows until all users start to use newer version. 

Superseding schemas feature comes to rescue at this point. With superseding schemas, it is possible to replace schema versions in incoming events to another version. So, how this works exactly ? If we want a schema to be replaced by another one, we state this with `$supersededBy` field of the schema. Later, when event with superseded schema arrived, superseded schema version will be replaced by specified superseding schema version. Let's continue with our example above to see it in action.

After having problem with with `1-0-0` version of geolocation schema, we will create new version `1-0-1` of this schema. This time, we will add `altitude` field to the new schema. However, we want events coming from older version of the application to be valid as well. Therefore, we will make `1-0-1` to supersede `1-0-0` like following:
<details>
  <summary>Geolocation 1-0-1 with $supersedes</summary>
  <CodeBlock>{`
  {
          "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
          "$supersedes": ["1-0-0"],
          "description": "Schema for client geolocation contexts",
          "self": {
                  "vendor": "com.acme",
                  "name": "geolocation",
                  "format": "jsonschema",
                  "version": "1-0-1"
          },
          "type": "object",
          "properties": {
                  "latitude": {
                          "type": "number",
                  },
                  "longitude": {
                          "type": "number",
                  },
                  "altitude": {
                          "type": "number",
                  }
          },
          "additionalProperties": false
  }
  `}</CodeBlock> 
</details>
When this schema submitted to Iglu Server, information of `1-0-1` superseding `1-0-0` will be saved to database. When `1-0-0` version is fetched, it will look like following:
<details>
  <summary>Geolocation 1-0-0 with $supersededBy</summary>
  <CodeBlock>{`
  {
          "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
          "$supersededBy": "1-0-1",
          "description": "Schema for client geolocation contexts",
          "self": {
                  "vendor": "com.acme",
                  "name": "geolocation",
                  "format": "jsonschema",
                  "version": "1-0-0"
          },
          "type": "object",
          "properties": {
                  "latitude": {
                          "type": "number",
                  },
                  "longitude": {
                          "type": "number",
                  }
          },
          "additionalProperties": false
  }
  `}</CodeBlock> 
</details>
Note the `$supersededBy` field in there. This field specifies that if an event is received with `1-0-0` version of that schema, version should be replaced with `1-0-1` and the respective entity will be validated with `1-0-1` instead. This operation is performed on Enrich.

## Upgrading components for superseding schema feature

You need >= Enrich 3.8.0 and >= Iglu Server 0.10.0 to be able to use this feature.

While upgrading Iglu Server to 0.10.0, you need to add new `superseded_by` column to `iglu_schemas` table. You can do this either with the following command:
```bash
# Replace ${config-folder} with a path to folder where your Iglu Server config resides
# Rename your config file name to iglu-config.hocon
docker run \
  -v /${config-folder}/config:/snowplow/config \
  snowplow/iglu-server:0.10.0 \
  setup --config "/snowplow/config/iglu-config.hocon" --migrate 0.9.0
```

or with running the following SQL statement in your database:
```sql
ALTER TABLE iglu_schemas ADD COLUMN superseded_by VARCHAR(32);
```

No additional configuration change is required on Enrich or on Iglu Server to make superseding schema feature work.

## How to add superseding information to schema

There are two ways to add superseding information: `$supersedes` and `$supersededBy`.

`$supersedes` field states that schema version defined in the `self` part supersedes the schema versions listed under `$supersedes` field. It is used like following:
<details>
  <summary>Example 1-0-2 with $supersedes</summary>
  <CodeBlock>{`
  {
          "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
          "$supersedes": ["1-0-0", "1-0-1"],
          "self": {
                  "vendor": "com.acme",
                  "name": "example",
                  "format": "jsonschema",
                  "version": "1-0-2"
          },
          "type": "object",
          "properties": {}
  }
  `}</CodeBlock> 
</details>
Above schema specifies that version `1-0-2` supersedes `1-0-0` and `1-0-1`. After uploading this schema to Iglu Server, superseding information will be stored.

It is also possible to submit superseding information to Iglu Server with `$supersededBy` field. In this case, we submit superseding information to Iglu Server in reverse way. It is used like following:
<details>
  <summary>Example 1-0-0 with $supersededBy</summary>
  <CodeBlock>{`
  {
          "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
          "$supersededBy": "1-0-1",
          "self": {
                  "vendor": "com.acme",
                  "name": "example",
                  "format": "jsonschema",
                  "version": "1-0-0"
          },
          "type": "object",
          "properties": {}
  }
  `}</CodeBlock> 
</details>
Above schema specifies that version `1-0-0` is superseded by `1-0-1`. After uploading this schema to Iglu Server, superseding information will be stored.

After superseding information is submitted, superseded schema will contain `$supersededBy` field when it is retrieved regardless of the way used while submitted the schema.

Things to keep in mind while submitting superseding information:

* `$supersedes` field value should be list of schema versions.
* `$supersededBy` field value should be single schema version.
* A schema can't supersede schema with greater version than itself.
* Superseding schema info can be overwritten with submitting same schema with different superseding information. Note that this will only overwrite superseding info. The content of the schema won't be overwritten.
* This feature allows to create chain of superseding schemas. In this case, when the last schema in the chain is superseded by another schema, all the schemas in the chain will be superseded by the new schema as well. For example, let's say `1-0-0` is superseded by `1-0-1` initially. Later, we create a new schema `1-0-2` that supersedes `1-0-1`. In this case, both `1-0-1` and `1-0-0` will be superseded by `1-0-2`. Later, we create `1-0-3` that supersedes `1-0-2`. In that case, `1-0-0`, `1-0-1` and `1-0-2` will be superseded by `1-0-3`.

## What will happen when Enrich receives an event with superseded schema

When Enrich receives an event with superseded schema, initially respective entity will be validated with superseding schema. If the validation is successful, the schema version of the entity will be replaced with the superseding schema's version. Lastly, a new context will be added to event to specify the actual schema version entity validated with. Let's go over an example to make it more clear:

Let's say `iglu:com.acme/geolocation/jsonschema/1-0-0` is superseded by `iglu:com.acme/geolocation/jsonschema/1-0-1`. Enrich receives an event that contains a context with `iglu:com.acme/geolocation/jsonschema/1-0-0`. In that case, respective context will be validated with `iglu:com.acme/geolocation/jsonschema/1-0-1` instead of `1-0-0` because `1-0-0` is superseded by `1-0-1`. Then, the schema version `1-0-0` will be replaced with `1-0-1` in the enriched event's respective context. Also, following context will be added to enriched event:
```
{
        "schema": "iglu:com.snowplowanalytics.iglu/validation_info/jsonschema/1-0-0",
        "data": {
                "originalSchema": "iglu:com.acme/geolocation/jsonschema/1-0-0",
                "validatedWith": "1-0-1"
        }
}
```
This context states that there was an entity with `iglu:com.acme/geolocation/jsonschema/1-0-0` originally however it's schema version replaced with `1-0-1` since `1-0-0` was superseded by `1-0-1`.

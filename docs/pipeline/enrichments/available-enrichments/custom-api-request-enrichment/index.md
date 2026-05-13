---
title: "Custom API request enrichment"
sidebar_position: 15
sidebar_label: Custom API request
description: "Enrich events with data from external HTTP APIs by making custom API requests during event processing."
keywords: ["API enrichment", "HTTP API", "external data enrichment"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

The API request enrichment lets you add data to a Snowplow event via your own or third-party proprietary HTTP(S) API. Only basic access authentication is supported.

For example, use a common key like a user ID or an email address to add relevant information about a user to each event, before it gets written to your data store. The retrieved data is added as entities.

As with all enrichments, only one instance of it can be configured within your pipeline. This means you can only call one API during event processing.

## Configuration

For historical reasons, the configuration uses terms that's no longer used elsewhere in Snowplow.

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow.enrichments/api_request_enrichment_config/jsonschema/1-0-2",
    data: {
      vendor: "com.snowplowanalytics.snowplow.enrichments",
      name: "api_request_enrichment_config",
      enabled: false,
      parameters: {
        inputs: [
          {
            key: "user",
            json: {
              field: "contexts",
              schemaCriterion: "iglu:com.snowplowanalytics.snowplow/client_session/jsonschema/1-*-*",
              jsonPath: "$.userId"
            }
          },
          {
            key: "client",
            pojo: {
              field: "app_id"
            }
          }
        ],
        api: {
          http: {
            method: "GET",
            uri: "http://api.acme.com/users/{{client}}/{{user}}?format=json",
            timeout: 2000,
            authentication: {
              httpBasic: {
                username: "xxx",
                password: "yyy"
              }
            }
          }
        },
        outputs: [
          {
            schema: "iglu:com.acme/user/jsonschema/1-0-0",
            json: {
              jsonPath: "$.record"
            }
          }
        ],
        cache: {
          size: 3000,
          ttl: 60
        },
        ignoreOnError: false
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for API Request Enrichment configuration", "self": { "vendor": "com.snowplowanalytics.snowplow.enrichments", "name": "api_request_enrichment_config", "format": "jsonschema", "version": "1-0-2" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "inputs": { "type": "array", "description": "Specifies the data points from the Snowplow event to use as keys when performing your API lookup", "items": { "type": "object", "properties": { "key": { "type": "string", "pattern": "^[A-Za-z0-9_-]+$" }, "pojo": { "type": "object", "properties": { "field": { "type": "string" } }, "additionalProperties": false }, "json": { "type": "object", "properties": { "field": { "type": "string", "enum": ["unstruct_event", "contexts", "derived_contexts"] }, "schemaCriterion": { "type": "string", "pattern": "^iglu:[a-zA-Z0-9-_.]+/[a-zA-Z0-9-_]+/[a-zA-Z0-9-_]+/([1-9][0-9]*|\\*)-((?:0|[1-9][0-9]*)|\\*)-((?:0|[1-9][0-9]*)|\\*)$" }, "jsonPath": { "type": "string", "pattern": "^\\$.*$" } }, "additionalProperties": false } }, "additionalProperties": false, "minProperties": 2, "maxProperties": 2, "required": ["key"] } }, "api": { "type": "object", "description": "Defines how the enrichment can access your API", "minProperties": 1, "maxProperties": 1, "properties": { "http": { "type": "object", "properties": { "method": { "type": "string", "enum": ["GET", "POST", "PUT"] }, "uri": { "type": "string" }, "timeout": { "type": "integer", "minimum": 1, "maximum": 60000 }, "authentication": { "type": "object", "properties": { "httpBasic": { "type": "object", "properties": { "username": { "type": "string" }, "password": { "type": "string" } }, "required": ["username", "password"], "additionalProperties": false } }, "additionalProperties": false } }, "required": ["method", "uri", "timeout", "authentication"], "additionalProperties": false } }, "additionalProperties": false }, "outputs": { "type": "array", "description": "Specify how to process the returned JSON", "minItems": 1, "items": { "type": "object", "properties": { "schema": { "type": "string", "pattern": "^iglu:([a-zA-Z0-9-_.]+)/([a-zA-Z0-9-_]+)/([a-zA-Z0-9-_]+)/([1-9][0-9]*(?:-(?:0|[1-9][0-9]*)){2})$" }, "json": { "type": "object", "properties": { "jsonPath": { "type": "string", "pattern": "^\\$.*$" } }, "required": ["jsonPath"], "additionalProperties": false } }, "required": ["schema"], "minProperties": 2, "maxProperties": 2, "additionalProperties": false } }, "cache": { "type": "object", "description": "Improves the enrichment's performance by storing values retrieved from the API", "properties": { "size": { "type": "integer", "minimum": 0 }, "ttl": { "type": "integer", "minimum": 0, "maximum": 86400 } }, "additionalProperties": false, "required": ["size", "ttl"] }, "ignoreOnError": { "type": ["boolean", "null"], "description": "Whether to make the event fail if the API request fails" } }, "additionalProperties": false, "required": ["inputs", "api", "outputs", "cache"] } }, "additionalProperties": false, "required": ["name", "vendor", "enabled", "parameters"] }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

### `inputs`

The enrichment can use any property in the event as input data source. The input data can be extracted from:
- [Atomic event properties](/docs/fundamentals/canonical-event/index.md) such as `user_id`
- [Self-describing event](/docs/fundamentals/events/index.md#self-describing-events) fields
- [Entities](/docs/fundamentals/entities/index.md) attached by tracker SDKs
- Entities attached by other enrichments

The custom API enrichment runs after most other enrichments, so it can access data added by them. Only the IP anonymization and PII pseudonymization enrichments run after the custom API enrichment.

Specify an array of `inputs` to use as keys when performing your API lookup. Each input consists of a `key` and a source: `pojo` for atomic event fields, or `json` for JSON fields, whether event or entity.

Key names can contain only alphanumeric symbols, hyphens, and underscores.

For `json`, specify the field name as either `unstruct_event` for self-describing event fields, `contexts` for fields in entities added during tracking, or `derived_contexts` for fields in enrichment entities. Add two additional fields:
- `schemaCriterion` is the Iglu schema URI. You can specify all versions of the schema (`*-*-*`), or a specific major version (e.g. `1-*-*`), major plus minor (e.g. `1-1-*`) or a full major-minor-patch version (e.g. `1-1-1`)
- `jsonPath` is the [JSON Path statement](http://goessner.net/articles/JsonPath/) to navigate to the field inside the JSON that you want to use as the input.

The resolved values should be primitive types (string, number, or boolean).

### `api`

Configure the API access with `api`. The enrichment supports `GET`, `POST`, and `PUT` methods, and both HTTP and HTTPS protocols.

For the `uri` field, specify the full URI, including the protocol. You can attach a querystring to the end of the URI. You can also embed the keys from your `inputs` section in the URI, by wrapping the key in `{{}}` brackets:

```json
"uri": "http://api.acme.com/users/{{client}}/{{user}}?format=json"
```

If a key required in the `uri` wasn't found in any of the `inputs`, then the lookup won't proceed, but this will **not** be flagged as a failure.

The only supported `authentication` option is `httpBasic`. Provide a `username` and/or `password` for the enrichment to connect to your API using [basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). Some APIs use only the `username` or `password` field to contain an API key; in this case, set the other property to an empty string `""`.

If your API is unsecured (for example, because it's only accessible from inside your private subnet, or because you're using an IP address allowlist) then configure the `authentication` section like this:

```json
"authentication": { }
```

### `outputs`

This enrichment assumes that your API returns a JSON object containing one or more properties that you want to add to your event. You'll need to specify the schema or data structure that the enrichment should use to define the retrieved data.

Each entry in the `outputs` array needs two fields:
- `schema` to specify the schema URI you want to attach to the event.
- `json` and `jsonPath` to specify which part of the returned JSON you want to add to the enriched event. Use `$` if you want to attach the returned JSON as is.

The `outputs` array must have at least one entry in it.

If the JSON path specified can't be found within the API response, then the lookup and the event will be flagged as a failure - unless `ignoreOnError` is set to `true`.

### `cache`

An enrichment can run many millions of time per hour, effectively launching a DoS attack on a data source. The `cache` configuration attempts to minimize the number of lookups performed.

The cache is an LRU (least-recently used) cache, where less frequently accessed values are evicted to make space for new values. The `uri` with all keys populated is used as the key in the cache. Configure the `cache` as follows:

- `size` is the maximum number of entries to hold in the cache at any one time. The minimum value is `1`.
- `ttl` is the number of seconds that an entry can stay in the cache before it is forcibly evicted. This is useful to prevent stale values from being retrieved in the case that your API can return different values for the same key over time.

### `ignoreOnError`

When set to `true`, if the enrichment fails for any reason, the event is still considered successfully enriched. It'll be loaded as usual, except without the entities added by the enrichment.

When set to `false`, the event will become a [failed event](/docs/fundamentals/failed-events/index.md) if the API call fails.

## Edge case handling

This enrichment can use any third-party RESTful service to fetch data in JSON format. In most cases, we recommend using your own private server to maintain performance. Third-party services could cause slowdown of your enrichment process.

This table describes what will happen under different conditions:

| Scenario                                                                      | Outcome                                                                                                                                                    |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A provided JSONPath is invalid.                                               | Failed event, unless `ignoreOnError` is set to `true`.                                                                                                     |
| Any one of the input keys wasn't found.                                       | The HTTP request won't be sent, and no entities will be added. The event will otherwise be processed as usual - not failed.                                |
| More than one entity in the event matches the `schemaCriterion`.              | The first matching entity found will be used.                                                                                                              |
| Multiple inputs share the same key (don't do this).                           | The last input configured will be picked.                                                                                                                  |
| An input JSONPath matches a non-primitive value.                              | The enrichment will try to stringify it, likely resulting in an invalid URL. If so, it will cause a failed event, unless `ignoreOnError` is set to `true`. |
| The output's JSONPath wasn't found.                                           | Failed event, unless `ignoreOnError` is set to `true`.                                                                                                     |
| The response returned JSON which is not valid according to the output schema. | Failed event, unless `ignoreOnError` is set to `true`.                                                                                                     |
| The server returned any non-successful response or timed-out.                 | Failed event, unless `ignoreOnError` is set to `true`.                                                                                                     |

## Output

This enrichment adds entities based on your configuration.

Example API response:

```json
// GET http://api.acme.com/users/northwind-traders/123?format=json
{
  "metadata": {
    "whenCreated": 1448371243,
    "whenUpdated": 1448373431
  },
  "record": {
    "name": "Bob Thorpe",
    "id": "123"
  }
}
```

With this configuration:

```json
"outputs": [ {
  "schema": "iglu:com.acme/user/jsonschema/1-0-0",
  "json": {
    "jsonPath": "$.record"
  }
} ]
```

The enrichment will add this entity to your event:

```json
{
  "schema": "iglu:com.acme/user/jsonschema/1-0-0",
  "data": {
    "name": "Bob Thorpe",
    "id": "123"
  }
}
```

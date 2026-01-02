---
title: "Iglu Server"
sidebar_label: "Iglu Server"
date: "2021-03-26"
sidebar_position: 2000
description: "RESTful interface for publishing, testing, and serving Iglu schemas with comprehensive API endpoints for schema management, validation, and authentication."
keywords: ["iglu server api", "schema registry rest api"]
---

The [Iglu Server](https://github.com/snowplow-incubator/iglu-server/) is an Iglu schema registry which allows you to publish, test and serve schemas via an easy-to-use RESTful interface. It is split into a few services which will be detailed in the following sections.

## Setup an Iglu Server

Information on setting up an instance of the Iglu Server can be found in [the setup guide](/docs/api-reference/iglu/iglu-repositories/iglu-server/setup/index.md).

## 1. The schema service (`/api/schemas`)

The schema service allows you to interact with Iglu schemas using simple HTTP requests.

### 1.1 POST requests

Sending a `POST` request to the schema service allows you to publish a new self-describing schema to the repository.

As an example, let's assume you own the `com.acme` vendor prefix (more information on that can be found in the API authentication section) and have a JSON schema defined as follows:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an Acme Inc ad click event",
  "self": {
    "vendor": "com.acme",
    "name": "ad_click",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "clickId": {
      "type": "string"
    },
    "targetUrl": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": ["targetUrl"],
  "additionalProperties": false
}
```

The schema can be added to your repository by making a `POST` request to the following endpoint with the schema included in the request's body:

```text
HOST/api/schemas/
```

By default, the schema will not be public (available to others) - this can be changed by adding an `isPublic` query parameter and setting its value to `true`.

For example, the following request:

```bash
curl HOST/api/schemas -X POST -H "apikey: YOUR_APIKEY" -d @myschema.json
```

will produce a response like this one, if no errors are encountered:

```json
{
  "message": "Schema created",
  "updated": false,
  "location": "iglu:com.acme/ad_click/jsonschema/1-0-0",
  "status":201
}
```

_Please note:_ This endpoint must be used with an API key with a `schema_action` permission of `CREATE`.

### 1.2 PUT requests

Another way of adding schemas is using a `PUT` request. Just like a `POST` request, it allows you to publish a schema to the Iglu Server by including it in the request's body, with an optional `isPublic` parameter used to set the visibility of a schema. Unlike `POST` requests, `PUT` requests require a schema's Iglu URI to be included in the request URI (i.e. `HOST/api/schemas/vendor/name/format/version`.

However, this means that a schema included in the request's body can be non-self-describing as well as self-describing. Note that in the latter case the URL path must match the schema's metadata, so a schema described as `iglu:com.snplow/foo/jsonschema/1-0-0` cannot be published using the `/api/schemas/com.acme/bar/jsonschema/1-0-0` PUT endpoint.

For example:

```bash
curl HOST/api/schemas/com.acme/ad_click/jsonschema/1-0-0 -X PUT -H "apikey: YOUR_APIKEY" -d @myschema.json
```

_Please note:_ This endpoint must be used with an API key with a `schema_action` permission of `CREATE`.

### 1.3 Single-schema GET requests

A schema previously added to the repository can be retrieved by making a `GET` request:

```bash
curl HOST/api/schemas/com.acme/ad_click/jsonschema/1-0-0 -X GET -H "apikey: YOUR_APIKEY"
```

The JSON response should look like this:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an Acme Inc ad click event",
  "self": {
    "vendor": "com.acme",
    "name": "ad_click",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
  "clickId": {
    "type": "string"
  },
  "targetUrl": {
    "type": "string",
    "minLength": 1
  }
  },
  "required": ["targetUrl"],
  "additionalProperties": false
}
```

GET requests support a `repr` URL parameter, allowing you to specify three different ways of representing an Iglu schema. This can have values of either `canonical`, `meta` or `uri`. `repr=canonical` returns the schema as a self-describing Iglu event - it is also the default representation method if no query parameter is specified. (An example of this representation can be seen above.) `repr=meta` adds an additional `metadata` field to the schema, containing some meta information about it - this would make the JSON response look like this:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an Acme Inc ad click event",
  "self": {
    "vendor": "com.acme",
    "name": "ad_click",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
  "clickId": {
    "type": "string"
  },
  "targetUrl": {
    "type": "string",
    "minLength": 1
  }
  },
  "required": ["targetUrl"],
  "additionalProperties": false,
  "metadata": {
    "createdAt":"2019-04-01T14:23:45.173728Z",
    "updatedAt":"2019-04-01T14:23:45.173728Z",
    "isPublic":true
  }
}
```

`repr=uri` simply returns a schema's Iglu URI - this is used internally in the Iglu Server, but public requests are also supported. A response with this URL parameter set would look like this:

```text
"iglu:com.acme/ad_click/jsonschema/1-0-0"
```

_Please note:_ While `metadata`/`body` query parameters used in previous versions of the Iglu Server are supported, they have been deprecated in favor of the single `repr` parameter.

### 1.4 Multiple GET requests

You can also retrieve multiple schemas in a single `GET` request using a few different endpoints

#### Vendor-based requests

Every schema belonging to a single vendor can be retrieved by sending a `GET` request to the following endpoint:

```text
HOST/api/schemas/vendor
```

```bash
curl HOST/api/schemas/com.acme -X GET -H "apikey: YOUR_APIKEY"
```

You will get back an array of every schema belonging to this vendor. You can use the same approach to get a list of schemas by vendor and name:

```text
HOST/api/schemas/vendor/name
```

```bash
curl HOST/api/schemas/com.acme/ad_click -X GET -H "apikey: YOUR_APIKEY"
```

Or simply retrieve every single public schema accessible to you:

```text
HOST/api/schemas
```

or `/api/schemas/public` in pre-0.5.0 releases.

```bash
curl HOST/api/schemas -X GET -H "apikey: YOUR_APIKEY"
```

_Please note:_ you can only retrieve schemas that can be read by your API key. This means that if you do not own a vendor you're requesting schemas for, you will only be able to retrieve the vendor's public schemas (if any exist).

### 1.5 Swagger support

We have added [Swagger](https://swagger.io/) support to our API so you can explore the repository server’s API interactively. The Swagger UI is available at the following URL:

```text
http://$HOST/static/swagger-ui/index.html
```

## 2. Schema validation and the validation service (`/api/validation`)

When adding a schema to the repository, the repository will validate that the provided schema is self-describing - an overview of this concept can be found in the [Self describing JSON schemas](/docs/api-reference/iglu/common-architecture/self-describing-json-schemas/index.md) wiki page. In practice this means your schema should contain a `self` property, which itself contains the following properties:

- `vendor`
- `name`
- `format`
- `version`

Non-self-describing schemas can only be added to a repository using a PUT call to the schemas API that describes its vendor, name, format and version in the URL itself rather than the schema.

The Iglu Server's Validation service can also be used to validate that a schema is valid without adding it to the repository using the following endpoint:

```text
POST HOST/api/schemas/validation/validate/schema/format
```

```bash
curl HOST/api/validation/validate/schema/jsonschema -X POST -d @myevent.json
```

The response received will be a detailed report containing information about the schema's validity, as well as potential errors or warnings:

```json
{
  "message": "The schema has some issues",
  "report": [
    {
      "message": "The schema is missing the \"description\" property",
      "level": "INFO",
      "pointer": "/properties/targetUrl"
    },
    {
      "message": "A string type in the schema doesn't contain \"maxLength\" or format which is required",
      "level": "WARNING",
      "pointer": "/properties/targetUrl"
    },
    {
      "message": "The schema is missing the \"description\" property",
      "level": "INFO",
      "pointer": "/properties/clickId"
    },
    {
      "message": "A string type in the schema doesn't contain \"maxLength\" or format which is required",
      "level": "WARNING",
      "pointer": "/properties/clickId"
    },
    {
      "message": "Use \"type: null\" to indicate a field as optional for properties clickId",
      "level": "INFO",
      "pointer": "/"
    }
  ]
}
```

Another endpoint in the validation service allows you to validate self-describing _data_ against a schema already located in the Iglu Server repository, if it is accessible to your API key:

```text
POST HOST/api/schemas/validation/validate/instance
```

```bash
curl HOST/api/validation/validate/instance -X POST -H "apikey: YOUR_APIKEY" -d @myevent.json
```

The service will then either confirm the schema's validity:

```json
{
  "message": "Instance is valid iglu:com.acme/ad_click/jsonschema/1-0-0"
}
```

Or, if it has some issues, return a detailed report about its problems:

```json
{
  "message":"The instance is invalid against its schema",
  "report":[
    {
      "message": "$.targetUrl: must be at least 1 characters long",
      "path": "$.targetUrl",
      "keyword": "minLength",
      "targets": [ "1" ]
    }
  ]
}
```

Like the schema service, the validation service is also accessible through Swagger UI.

## 3. Drafts service (`/api/drafts`)

The draft schema service lets you interact with draft schemas using simple HTTP requests. Draft schemas are variants of Iglu schemas with simple versions that start with `1` and can be increased as needed.

### 3.1 POST requests

Sending a `POST` request to the draft service allows you to publish a new self-describing schema to the repository.

As an example, let's assume you own the `com.acme` vendor prefix (more information on that can be found in the API authentication section) and have a JSON schema defined as follows:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an Acme Inc ad click event",
  "self": {
    "vendor": "com.acme",
    "name": "ad_click",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "clickId": {
      "type": "string"
    },
    "targetUrl": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": ["targetUrl"],
  "additionalProperties": false
}
```

The schema can be added to your repository as a draft by making a `POST` request to the following endpoint with the schema included in the request's body, and its vendor, name, format and desired draft number added to the request's URL:

```text
HOST/api/drafts/vendor/name/format/draftNumber
```

By default, the schema draft will not be public (available to others) - this can be changed by adding an `isPublic` query parameter and setting its value to `true`.

For example, the following request:

```bash
curl HOST/api/drafts/com.acme/ad_click/jsonschema/1 -X POST -H "apikey: YOUR_APIKEY" -d @myschema.json
```

will produce a response like this one, if no errors are encountered:

```json
{
  "message": "Schema created",
  "updated": false,
  "location": "iglu:com.acme/ad_click/jsonschema/1",
  "status":201
}
```

_Please note:_ This endpoint must be used with an API key with a `schema_action` permission of `CREATE`.

### 3.2 Single-draft GET requests

A schema draft previously added to the repository can be retrieved by making a `GET` request:

```bash
curl HOST/api/drafts/com.acme/ad_click/jsonschema/1 -X GET -H "apikey: YOUR_APIKEY"
```

The JSON response should look like this:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an Acme Inc ad click event",
  "self": {
    "vendor": "com.acme",
    "name": "ad_click",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
  "clickId": {
    "type": "string"
  },
  "targetUrl": {
    "type": "string",
    "minLength": 1
  }
  },
  "required": ["targetUrl"],
  "additionalProperties": false
}
```

GET requests support a `repr` URL parameter, allowing you to specify three different ways of representing an Iglu schema. This can have values of either `canonical`, `meta` or `uri`. `repr=canonical` returns the schema as a self-describing Iglu event - it is also the default representation method if no query parameter is specified. (An example of this representation can be seen above.) `repr=meta` adds an additional `metadata` field to the schema, containing some meta information about it - this would make the JSON response look like this:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an Acme Inc ad click event",
  "self": {
    "vendor": "com.acme",
    "name": "ad_click",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
  "clickId": {
    "type": "string"
  },
  "targetUrl": {
    "type": "string",
    "minLength": 1
  }
  },
  "required": ["targetUrl"],
  "additionalProperties": false,
  "metadata": {
    "createdAt":"2019-04-01T14:23:45.173728Z",
    "updatedAt":"2019-04-01T14:23:45.173728Z",
    "isPublic":true
  }
}
```

`repr=uri` simply returns a schema's Iglu URI - this is used internally in the Iglu Server, but public requests are also supported. A response with this URL parameter set would look like this:

```text
"iglu:com.acme/ad_click/jsonschema/1-0-0"
```

_Please note:_ While `metadata`/`body` query parameters used in previous versions of the Iglu Server are supported, they have been deprecated in favor of the single `repr` parameter.

## 4. Debug (`/api/debug`) and metadata (`/api/meta`) services

The Iglu Server includes several endpoints for inspecting its own state.

The `/api/debug` endpoint is only active when `debug` is set to true in the Iglu Server's configuration file, and returns the Iglu Server's internal state if in-memory storage is used instead of PostgreSQL. **This endpoint should be used for internal development and testing only!**

The `/api/meta/health` endpoint will respond with a simple OK string if the server is available:

```bash
curl HOST/api/meta/health
OK
```

The `/api/meta/health/db` endpoint is similar, but will also check if the database is accessible if PostgreSQL storage is used (in-memory storage is always accessible):

```bash
curl HOST/api/meta/health/db
OK
```

The `/api/meta/server` endpoint returns information about the server - its version, database type, certain configuration settings etc. If an `apiKey` header is included in the request, it will also return information about the key's permissions and the number of schemas accessible to it:

```bash
curl HOST/api/meta/server -H 'apikey: YOUR_APIKEY'
{
  "version": "0.6.0",
  "authInfo": {
    "vendor": "",
    "schema": "CREATE_VENDOR",
    "key": [ "CREATE", "DELETE" ]
  },
  "database": "postgres",
  "schemaCount": 18,
  "debug": true,
  "patchesAllowed": false
}
```

## 5. API keys and the authentication service (`/api/auth`)

In order to use the routes of the Iglu Server's API that require either write access to the repository or readaccess to non-public schemas, you will need an API key, passed as an `apiKey` HTTP header to relevant calls of those services.

The Iglu Server's administrator is responsible for distributing API keys to the repository's clients. To do so, they will need a super API key which will let them generate other keys - this key will have to be manually added to the database:

```sql
INSERT INTO permissions
VALUES ('api_key_here', '', TRUE, 'CREATE_VENDOR'::schema_action, '{"CREATE", "DELETE"}'::key_action[])
```

Thanks to this super API key the server's administrator be able to use the API key generation service, which lets them create and revoke API keys. A pair of API keys for a given vendor can be generated by submitting a POST request to the keygen endpoint, with the prefix included in the request's body:

```text
POST HOST/api/auth/keygen
```

```bash
curl HOST/api/auth/keygen -X POST -H 'apikey: ADMIN_APIKEY' -H "Content-Type: application/json" -d '{"vendorPrefix": "com.acme"}'
```

If no errors occur, the method should return two UUIDs that act as API keys for the given vendor:

```json
{
  "read":"bfa90866-aa14-4b92-b6ef-d421fd688b54",
  "write":"6175aa41-d3b7-4e4f-9fb4-3a170f3c6c16"
}
```

One of those API keys will have read access and will let you retrieve private schemas or drafts (or other vendors' public schemas) through `GET` requests. The other will have both read and write access - you will therefore be able to publish and modify schemas or drafts through `POST` and `PUT` requests in addition to being able to retrieve them. It is then up to you on to distribute those two keys however you want. The keys grant access to every schema whose vendor starts with `com.acme`, though wildcard (`*`) vendor keys can also be generated.

Existing API keys can be revoked by sending a `DELETE` request to the same endpoint:

```text
DELETE HOST/api/auth/keygen
```

```bash
curl HOST/api/auth/keygen?key=APIKEY_TO_DELETE -X DELETE -H 'apikey: ADMIN_APIKEY'
```

If the operation succeeds, it will return a simple JSON response:

```json
{
  "message":"Keys have been deleted"
}
```

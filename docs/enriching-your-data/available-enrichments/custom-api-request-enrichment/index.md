---
title: "Custom API Request enrichment"
date: "2020-02-14"
sidebar_position: 140
---

## Summary

The API Request Enrichment lets you perform dimension widening on a Snowplow event via your own or third-party proprietary http(s) API.

## Overview

This enrichment gives you the flexibility to add additional data points for your events by pulling in data from other sources. Using a common key like a user ID or an email address for example, you might be able to add relevant information about a user to each event before it gets written to your database.

The configuration for this enrichment is all about connecting to your data source and fetching the relevant data points you want to enrich your events with.

If you’d like support in setting up or configuring this enrichment please contact us at support@snowplowanalytics.com.

## Configuration

- [schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/api_request_enrichment_config/jsonschema/1-0-1)
- [example](https://github.com/snowplow/enrich/blob/master/config/enrichments/api_request_enrichment_config.json)

The example configuration is using imaginary api.acme.com RESTful service to widen Snowplow event with context containing information about users. To find real-world example you can check our extensive tutorial on [Integrating Clearbit data into Snowplow using the API Request Enrichment](https://discourse.snowplowanalytics.com/t/integrating-clearbit-data-into-snowplow-using-the-api-request-enrichment/210).

The configuration JSON for this enrichment contains four sub-objects:

1. `inputs` specifies the datapoint(s) from the Snowplow event to use as keys when performing your API lookup
2. `api` defines how the enrichment can access your API
3. `outputs` lets you tune how you convert the returned JSON into one or more self-describing JSONs ready to be attached to your Snowplow event
4. `cache` improves the enrichment's performance by storing values retrieved from the API

### [](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment#configuration)Configuration

To go through each of sub-objects in more detail:

#### [](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment#inputs)`inputs`

Specify an array of `inputs` to use as keys when performing your API lookup. Each input consists of a `key` and a source: either `pojo` if the datapoint comes from the Snowplow enriched event POJO, or `json` if the datapoint comes from a self-describing JSON inside one of the three JSON fields. The `key` can be referred to later in the `api.http.uri` property. Note that key name can contain only alphanumeric symbols, hyphens and underscores.

For `pojo`, the field name must be specified. A field name which is not recognized as part of the POJO will be ignored by the enrichment.

For `json`, you must specify the field name as either `unstruct_event`, `contexts` or `derived_contexts`. You must then provide two additional fields:

- `schemaCriterion` lets you specify the self-describing JSON you are looking for in the given JSON field. You can specify all SchemaVers (`*-*-*`), only the SchemaVer MODEL (e.g. `1-*-*`), MODEL plus REVISION (e.g. `1-1-*`) or a full MODEL-REVISION-ADDITION version (e.g. `1-1-1`)
- `jsonPath` lets you provide the [JSON Path statement](http://goessner.net/articles/JsonPath/) to navigate to the field inside the JSON that you want to use as the input.

The lookup algorithm is short-circuiting: the first match for a given key will be used.

#### [](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment#api)`api`

The `api` section lets you configure how the enrichment should access your API. At the moment only `http` is supported, with this option covering both HTTP and HTTPS - the protocol on the `uri` field will determine which to use. Before R113, only `GET` was supported as the HTTP `method` for the lookup. Now it supports both `GET` and `POST`.

For the `uri` field, specify the full URI including the protocol. You can attach a querystring to the end of the URI. You can also embed the keys from your `inputs` section in the URI, by wrapping the key in `{{}}` brackets thus:

```
"uri": "http://api.acme.com/users/{{client}}/{{user}}?format=json"
```

If a key required in the `uri` was not found in any of the `inputs`, then the lookup will not proceed, but this will **not** be flagged as a failure.

Make sure your `uri` is actually valid URI and does not contain any special symbols or spaces. Enrichment will "urlize" content of input extracted from event with `java.net.URLEncoder.encode` function, but safety of `uri` is on user's behalf.

Currently the only supported `authentication` option is `http-basic`: provide a `username` and/or a `password` for the enrichment to use to connect to your API using [basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). Some APIs use only the `username` or `password` field to contain an API key; in this case, set the other property to the empty string `""`.

If your API is unsecured (because for example it is only accessible from inside your private subnet, or using IP address whitelisting), then configure the `authentication` section like so:

```
"authentication": { }
```

#### [](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment#outputs)`outputs`

This enrichment assumes that your API returns a JSON, which will contain one or more _entities_ that you want to add to your event as derived contexts. Within the `outputs` array, each entry is a `json` sub-object that contains a `jsonPath` configuration field that lets you specify which part of the returned JSON you want to add to your enriched event. `$` can be used if you want to attach returned JSON as is.

If the JSON Path specified cannot be not found within the API's returned JSON, then the lookup (and thus the overall event) will be flagged as a failure.

The enrichment adds the returned JSON into the `derived_contexts` field within a Snowplow enriched event. Because all JSONs in the `derived_contexts` field must be self-describing JSONs, use the `schema` field to specify the Iglu schema URI that you want to attach to the event.

Example:

```json
GET http://api.acme.com/users/northwind-traders/123?format=json
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

This would be added to the `derived_contexts` array:

```json
{
  "schema": "iglu:com.acme/user/jsonschema/1-0-0",
  "data": {
    "name": "Bob Thorpe",
    "id": "123"
  }
}
```

The `outputs` array must have at least one entry in it.

#### [](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment#cache)`cache`

A Snowplow enrichment can run many millions of time per hour, effectively launching a DoS attack on a data source if we are not careful. The `cache` configuration attempts to minimize the number of lookups performed.

The cache is an LRU (least-recently used) cache, where less frequently accessed values are evicted to make space for new values. The `uri` with all keys populated is used as the key in the cache. Configure the `cache` as follows:

- `size` is the maximum number of entries to hold in the cache at any one time (minimum value for is `1`)
- `ttl` is the number of seconds that an entry can stay in the cache before it is forcibly evicted. This is useful to prevent stale values from being retrieved in the case that your API can return different values for the same key over time.

To disable `ttl` so keys could be stored in cache until job is done `0` value should be used.

### Data sources

The data source for this enrichment is the entire `enriched/good` event. More precisely, input data can be accessed in any of four forms:

- Snowplow Plain Old Java Object produced during common enrichment process
- [Snowplow Unstructured event](https://github.com/snowplow/snowplow/wiki/Custom-events#unstructured-event)
- [Custom contexts](https://github.com/snowplow/snowplow/wiki/Custom-contexts) attached to event by tracking SDK
- Derived contexts attached to event by [other enrichments](https://github.com/snowplow/snowplow/wiki/Configurable-enrichments)

More precise usage of these data sources is described in inputs section.

### [](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment#algorithm)Algorithm

This enrichment uses any 3rd party RESTful service to fetch data in JSON format. In most cases however you probably want to use your own private server to maintain acceptable performance since third-party service may cause serious slowdown of your enrichment process.

Here are some clues on how this enrichment will handle some exceptional cases:

- if provided JSONPath is invalid - all events attempted to being enriched will be sent to `enriched/bad`
- if more than one context (derived or custom) matches `schemaCriterion` - first one will be picked, no matter if following have higher SchemaVer
- if input's value found more than in one sources - last one will be picked, so try to put more precise input last (for example to get longitude/latitude pair use data from IP Lookup enrichment first and GPS-derived longitude/latitude second)
- if any of input key wasn't found - HTTP request won't be sent and new context won't be derived, but event will be processed as usual
- if output's JSONPath wasn't found - event will be sent to `enriched/bad` bucket
- if server returned any non-successful response or timed-out - event will be sent to `enriched/bad` bucket
- if server response returned JSON which invalidated by schema provided in output - event will be sent to `shredded/bad`
- if input JSONPath will match non-primitive value in context or unstructured event, enrichment will try to stringify it. Array will be concatenated with commas, `null` will be transformed to string "null", object will be just stringified and will inevitable result in invalid URL

### [](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment#data-generated)Data generated

This enrichment adds a new context to the enriched event with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ua_parser_context/jsonschema/1-0-0).

As during the API Request enrichment process the new context is added to `derived_contexts` of the enriched/good event, the data generated will end up in its own table determined by the custom `schema` key in `output` configuration sub-object.

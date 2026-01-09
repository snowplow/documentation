---
title: "Iglu Resolver configuration for Snowplow applications"
sidebar_label: "Iglu Resolver"
date: "2020-10-22"
sidebar_position: 30
description: "Configure Iglu Resolver for schema fetching and validation in Snowplow enrichers and loaders with cache and repository settings."
keywords: ["iglu resolver", "resolver config", "schema fetching", "iglu client configuration"]
---

Iglu Resolver is a component embedded into many Snowplow applications, including enrichers and loaders. It's responsible for fetching schemas from Iglu registries and validating data against these schemas.

Most of the time, configuring Iglu Resolver (or Client) means adding following JSON file:

```json
{
  "schema": "iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-3",
  "data": {
    "cacheSize": 500,
    "cacheTtl": 600,
    "repositories": [
      {
        "name": "Iglu Central",
        "priority": 0,
        "vendorPrefixes": [ "com.snowplowanalytics" ],
        "connection": {
          "http": {
            "uri": "https://iglucentral.com"
          }
        }
      },
      {
        "name": "Custom Iglu Server",
        "priority": 0,
        "vendorPrefixes": [ "com.snowplowanalytics" ],
        "connection": {
          "http": {
            "uri": "https://${iglu_server_hostname}/api",
            "apikey": "${iglu_server_apikey}"
          }
        }
      }
    ]
  }
}
```

The above configuration assumes Snowplow-authored schemas (Iglu Central) will be used in a pipeline, and that you have your own registry (Iglu Server) being hosted at `https://${iglu_server_hostname}/` with an API Key, `${iglu_server_apikey}`, with read rights.

### Configuration parameters

- `cacheSize` determines how many individual schemas we will keep cached in our Iglu client (to save additional lookups)
- `cacheTtl` determines how long a schema can live in the cache before being reloaded (in seconds)
- `repositories` is a JSON array of repositories to look up schemas in
- `priority` and `vendorPrefixes` help the resolver to know which repository to check first for a given schema. For details see Iglu's [repository resolution algorithm](/docs/api-reference/iglu/common-architecture/schema-resolution/index.md#3-registry-priority)

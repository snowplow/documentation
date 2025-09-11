---
title: "Iglu Resolver"
description: "Iglu Resolver API reference for behavioral data schema resolution and validation workflows."
schema: "TechArticle"
keywords: ["Iglu Resolver", "Schema Resolution", "Registry Resolution", "Schema Lookup", "Registry Client", "Schema Client"]
date: "2020-10-22"
sidebar_position: 30
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
            "uri": "http://iglucentral.com"
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

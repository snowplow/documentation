---
title: "Iglu Resolver"
date: "2020-10-22"
sidebar_position: 30
---

Iglu Resolver is a component embedded into many Snowplow applications, including enrichers and loaders. It's responsible for fetching schemas from Iglu Central and user registries and validating data against these schemas.

Most of the time, configuring Iglu Resolver (or Client) means adding following JSON file:

```json
{
  "schema": "iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-1",
  "data": {
    "cacheSize": 500,
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
            "uri": "${iglu_server_url}",
            "apikey": "${iglu_server_apikey}"
          }
        }
      }
    ]
  }
}
```

Above configuration assumes Snowplow-authored schemas (Iglu Central) will be used in a pipeline and that you have your own registry (Iglu Server) being hosted at `${iglu_server_url}` with an API Key `${iglu_server_apikey}`.

### Configuration parameters

- `cacheSize` determines how many individual schemas we will keep cached in our Iglu client (to save additional lookups)
- `repositories` is a JSON array of repositories to look up schemas in
- `name` and `connection` should be self-evident
- `priority` and `vendorPrefixes` help the resolver to know which repository to check first for a given schema. For details see Iglu's [repository resolution algorithm](/docs/pipeline-components-and-applications/iglu/common-architecture/schema-resolution/index.md#3-registry-priority)

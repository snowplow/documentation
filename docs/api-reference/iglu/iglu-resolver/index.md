---
title: "Iglu Resolver configuration for Snowplow applications"
sidebar_label: "Iglu Resolver"
date: "2026-05-14"
sidebar_position: 20
description: "Configure Iglu Resolver for schema fetching and validation in Snowplow enrichers and loaders with cache and repository settings."
keywords: ["iglu resolver", "resolver config", "schema fetching", "iglu client configuration", "self-hosted"]
---

```mdx-code-block
import CdiCallout from "/docs/reusable/iglu-self-hosted-only/_callout.md"

<CdiCallout/>
```

Iglu Resolver is a component embedded into many Snowplow applications, including Enrich and loaders. It's responsible for fetching schemas from Iglu registries and validating data against these schemas.

## Configuration

Most of the time, configuring Iglu Resolver means providing a JSON file like this:

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

The above configuration assumes Snowplow-authored schemas ([Iglu Central](/docs/api-reference/iglu/iglu-repositories/index.md#iglu-central)) will be used in a pipeline, and that you have your own [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) registry hosted at `https://${iglu_server_hostname}/` with a read-rights API key `${iglu_server_apikey}`.

### Configuration parameters

- `cacheSize` determines how many individual schemas the resolver keeps cached.
- `cacheTtl` determines how long a schema can live in the cache before being reloaded, in seconds.
- `repositories` is a JSON array of registries to look up schemas in.
- `priority` and `vendorPrefixes` help the resolver decide which registry to check first for a given schema. See [Registry priority](#registry-priority).

## How schemas are resolved

When the resolver is asked for a schema, it checks its cache first. On a miss, it queries the configured registries in priority order until a registry returns the schema.

### Caching

The resolver caches both successful and failed lookups, keyed per-registry:

- A schema fetched successfully is cached until it's evicted by the LRU algorithm (when the cache reaches `cacheSize`).
- If a registry responds with "not found", that result is also cached, so the registry won't be queried again for that schema until the entry is evicted.
- If a registry responds with another error (timeout, network error, server fault), the resolver retries that registry up to three more times before marking the schema as missing for that registry.

If `cacheTtl` is set, successfully fetched schemas are also re-resolved after the TTL expires. This lets you patch schemas without restarting the pipeline (though patching production schemas isn't recommended). For real-time pipelines, `cacheTtl` prevents stale "failed" results from persisting for too long.

### Registry priority

For each schema lookup, registries are sorted by:

1. `vendorPrefixes` — the resolver checks registries with a matching `vendorPrefix` first. Other registries aren't skipped, just queried later.
2. Class priority — a hardcoded value per registry type. Embedded registries are always checked before HTTP registries (within the same `vendorPrefix` match).
3. `priority` — the user-defined value in your config. Only affects ordering within the same class priority.

Lower numbers mean higher priority. `[0, 1, 2, 3]` is checked left to right.

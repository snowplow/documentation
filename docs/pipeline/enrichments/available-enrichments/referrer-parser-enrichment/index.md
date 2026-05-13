---
title: "Referrer parser enrichment"
sidebar_position: 3
sidebar_label: Referrer parser
description: "Extract attribution data from referrer URLs to identify traffic sources, search terms, and marketing channels."
keywords: ["referrer parser", "traffic source", "attribution", "referer"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

This enrichment uses the [Snowplow referer-parser](https://github.com/snowplow/referer-parser) library to extract attribution data from referrer URLs.

This is particularly useful when looking for traffic from specific search engine providers or social networks.

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow/referer_parser/jsonschema/2-0-1",
    data: {
      name: "referer_parser",
      vendor: "com.snowplowanalytics.snowplow",
      enabled: true,
      parameters: {
        internalDomains: [],
        database: "referers-latest.json",
        uri: "https://s3-eu-west-1.amazonaws.com/snowplow-hosted-assets/third-party/referer-parser/",
        referrers: {
          search: {
            "Search website 1": {
              domains: ["search.acme.com"],
              parameters: ["q"]
            },
            "Search website 2": {
              domains: ["search.acmebis.com"]
            }
          },
          social: {
            "Social website": {
              domains: ["social.acme.com"]
            }
          }
        }
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for referer-parser customization enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "referer_parser", "format": "jsonschema", "version": "2-0-1" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "internalDomains": { "type": "array", "items": { "type": "string" } }, "database": { "type": "string" }, "uri": { "type": "string", "format": "uri" }, "referrers": { "type": "object", "additionalProperties": { "type": "object", "additionalProperties": { "type": "object", "properties": { "domains": { "type": "array", "minItems": 1, "items": { "type": "string" } }, "parameters": { "type": "array", "items": { "type": "string" } } }, "required": ["domains"], "additionalProperties": false } } } }, "required": ["internalDomains", "database", "uri"], "additionalProperties": false } }, "required": ["name", "vendor", "enabled", "parameters"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

### `internalDomains`

Use this property to specify a list of subdomains to class as `Internal` traffic sources.

```json
"internalDomains": [
    "community.snowplow.io",
    "docs.snowplow.io"
],
```

:::note

The enrichment will also classify `refr_medium` as `Internal` when an event's `page_urlhost` matches its `refr_urlhost`, regardless of the configured `internalDomains`.

This behavior isn't configurable, and may require handling in data models or a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md) to change.

:::

### `database` and `uri`

Provide details of the referer-parser format database to use. Snowplow hosts a database you can use: the latest version is listed in the [library README](https://github.com/snowplow/referer-parser). Alternatively, the enrichment will accept any valid JSON or YAML file in the right format.

### Custom referrer mappings

:::note[Availability]
This feature is available since version 6.9.0 of Enrich.
:::

You can add your own referrer-to-category mappings directly in the enrichment configuration using the optional `referrers` parameter. This is useful when you need to classify new traffic sources - such as internal tools, niche search engines, or AI chatbots - without waiting for changes to the upstream database.

Custom mappings take precedence over the default database. If a domain appears in both your custom mappings and the default database, the custom mapping is used.

The `referrers` parameter is a nested object structured like this:

```json
"referrers": {
  "<medium>": {
    "<source name>": {
      "domains": ["<domain1>", "<domain2>"],
      "parameters": ["<param1>"]
    }
  }
}
```

| Field           | Description                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `<medium>`      | The referrer category e.g., `search`, `social`, `email`. This value populates `refr_medium`.                      |
| `<source name>` | A human-readable name for the source e.g., `"Google"`, `"Internal Search"`. This value populates `refr_source`.   |
| `domains`       | An array of hostnames to match against the referrer URL. At least one domain is required.                         |
| `parameters`    | An optional array of URL query parameter names to extract search terms from. Matched values populate `refr_term`. |

For example, to classify a custom search engine and a social network:

```json
"referrers": {
  "search": {
    "Corporate Search": {
      "domains": ["search.example.com"],
      "parameters": ["q", "query"]
    }
  },
  "social": {
    "Internal Forum": {
      "domains": ["forum.example.com"]
    }
  }
}
```

With this configuration, a referrer URL of `https://search.example.com/?q=snowplow` would produce the following:

| Field         | Value              |
| ------------- | ------------------ |
| `refr_medium` | `search`           |
| `refr_source` | `Corporate Search` |
| `refr_term`   | `snowplow`         |

:::tip[Contributing mappings upstream]

You can use custom referrer mappings to immediately test new categorizations in your pipeline. Once validated, consider contributing your mappings back to the [upstream referer-parser database](https://github.com/snowplow/referer-parser) via a pull request.

:::

## Output

This enrichment populates the `refr_medium`, `refr_source`, and `refr_term` [atomic event fields](/docs/fundamentals/canonical-event/index.md#page-fields).

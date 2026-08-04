---
title: "Referrer parser enrichment"
sidebar_position: 3
sidebar_label: Referrer parser
description: "Extract attribution data from referrer URLs and utm_source parameters to identify traffic sources, search terms, and marketing channels."
keywords: ["referrer parser", "traffic source", "attribution", "referer", "utm_source", "chatbot"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

This enrichment uses the [Snowplow referer-parser](https://github.com/snowplow/referer-parser) library to extract attribution data from referrer URLs.

This is particularly useful when looking for traffic from specific search engine providers or social networks.

Since version 6.13.0 of Enrich, it also classifies traffic sources that identify themselves through a [`utm_source` query parameter](#identifying-referrers-from-utm_source) rather than (or in addition to) a `Referer` header. An example would be ChatGPT setting `utm_source=chatgpt.com`.

## Configuration

The enrichment takes these parameters:

| Parameter         | Required | Description                                                                |
| ----------------- | -------- | -------------------------------------------------------------------------- |
| `internalDomains` | ✅        | Subdomains to classify as `Internal` traffic sources.                      |
| `database`        | ✅        | Filename of the referer-parser database. Already provided for CDI customers. |
| `uri`             | ✅        | URI of the bucket containing the database file. Already provided for CDI customers. |
| `referrers`       | ❌        | Custom referrer-to-category mappings, taking precedence over the database. |

<Tabs groupId="deployment" queryString>
  <TabItem value="console" label="Console" default>

Configure the parameters in the Console enrichment editor. Keep the Console default for the `database` and `uri` fields. For example:

```json
{
  "internalDomains": [],
  "database": "<use default value from Console>",
  "uri": "<use default value from Console>",
  "referrers": {
    "search": {
      "Search website 1": {
        "domains": ["search.acme.com"],
        "parameters": ["q"]
      },
      "Search website 2": {
        "domains": ["search.acmebis.com"]
      }
    },
    "social": {
      "Social website": {
        "domains": ["social.acme.com"]
      }
    },
    "chatbot": {
      "Acme Assistant": {
        "domains": ["assistant.acme.com"],
        "utm_sources": ["assistant.acme.com"]
      }
    }
  }
}
```

  </TabItem>
  <TabItem value="self-hosted" label="Self-Hosted">

For Self-Hosted, [provide a complete JSON](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md). For example:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/referer_parser/jsonschema/2-0-2",
  "data": {
    "name": "referer_parser",
    "vendor": "com.snowplowanalytics.snowplow",
    "enabled": true,
    "parameters": {
      "internalDomains": [],
      "database": "referers-5.3.json",
      "uri": "https://s3-eu-west-1.amazonaws.com/snowplow-hosted-assets/third-party/referer-parser/",
      "referrers": {
        "search": {
          "Search website 1": {
            "domains": ["search.acme.com"],
            "parameters": ["q"]
          },
          "Search website 2": {
            "domains": ["search.acmebis.com"]
          }
        },
        "social": {
          "Social website": {
            "domains": ["social.acme.com"]
          }
        },
        "chatbot": {
          "Acme Assistant": {
            "domains": ["assistant.acme.com"],
            "utm_sources": ["assistant.acme.com"]
          }
        }
      }
    }
  }
}
```

:::note

The `utm_sources` field requires configuration schema version `2-0-2`, available since version 6.13.0 of Enrich. Earlier schema versions (`2-0-0`, `2-0-1`) remain valid, but reject `utm_sources`.

:::

  </TabItem>
</Tabs>

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

:::tip[Snowplow CDI]
If you're using Snowplow CDI, you don't need to configure these. Use the default values provided in Console.
:::

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
      "parameters": ["<param1>"],
      "utm_sources": ["<utm_source1>"]
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
| `utm_sources`   | An optional array of `utm_source` values identifying this source. See [Identifying referrers from `utm_source`](#identifying-referrers-from-utm_source). Available since version 6.13.0 of Enrich. |

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

## Identifying referrers from `utm_source`

:::note[Availability]
This feature is available since version 6.13.0 of Enrich.
:::

The `Referer` header is not set when users share or copy and paste the link, rather than click it directly. To circumvent this limitation and make attribution more reliable, some sites also append a `utm_source` query parameter. For example:

```
https://www.example.com/product?utm_source=chatgpt.com
```

Note that an event might contain both a `Referer` header value *and* a `utm_source` value. These values might not match. For example, if person A shared the above link with person B via Instagram messages, and person B clicked the link, `Referer` would be `instagram.com`. In these cases, you should rely on the `utm_source` value for first-touch attribution.

The hosted database includes `utm_sources` entries for the major chatbot providers — ChatGPT, Claude.ai, Google Gemini, Microsoft Copilot, META.ai, Mistral.ai, Perplexity.ai, Character.AI and Poe — so this works out of the box, as long as you use the actively-maintained database file (`referers-5.3`). You can recognize additional sources by adding `utm_sources` to your [custom referrer mappings](#custom-referrer-mappings).

### Output entity

On a match, the enrichment attaches a `utm_referrer` entity to `derived_contexts`.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    source: "ChatGPT",
    medium: "chatbot"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Referer identified from an injected utm_source query parameter, classified by the referer parser enrichment against its utm_sources database entries", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "utm_referrer", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "source": { "type": "string", "description": "The name of the referer source (e.g. ChatGPT), equivalent to refr_source", "maxLength": 128 }, "medium": { "type": "string", "description": "The medium of the referer (e.g. chatbot), equivalent to refr_medium", "maxLength": 64 }, "term": { "type": ["string", "null"], "description": "The search term extracted from the referer, equivalent to refr_term", "maxLength": 512 } }, "required": ["source", "medium"], "additionalProperties": false }} />

Currently, the `term` field is always absent for `utm_source` matches, as there's no referrer URL to extract a search term from.

### How it relates to referrer URL parsing

The `utm_source` classification is deliberately kept separate from the `Referer` header parsing described above:

* It **doesn't populate** `refr_medium`, `refr_source`, or `refr_term`. Those fields continue to reflect the referrer URL only, so existing data models and queries are unaffected.
* It's **additive**. If an event has both a recognized referrer URL and a recognized `utm_source`, you get the `refr_*` fields *and* the `utm_referrer` entity.
* It's **independent of the [campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md)**, which copies `utm_source` into `mkt_source` verbatim. The referrer parser instead resolves the value to a known source and medium. Both can run on the same event.

Matching is an exact, case-sensitive comparison of the full `utm_source` value against the `utm_sources` entries, and only the page URL's query string is inspected. Values from your own `referrers` configuration take precedence over the database.

## Output

This enrichment populates the `refr_medium`, `refr_source`, and `refr_term` [atomic event fields](/docs/fundamentals/canonical-event/index.md#page-fields).

Since version 6.13.0 of Enrich, it can additionally attach a [`utm_referrer` entity](#output-entity) to `derived_contexts`.

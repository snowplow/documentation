---
title: "Referrer parser enrichment"
sidebar_position: 3
sidebar_label: Referrer parser
description: "Extract attribution data from referrer URLs to identify traffic sources, search terms, and marketing channels."
keywords: ["referrer parser", "traffic source", "attribution"]
---

This enrichment uses [snowplow referer-parser](https://github.com/snowplow/referer-parser) library to extract attribution data from referer URLs.

Knowing which sites refer users to our website is very much a staple of analytics in order to help understand traffic patterns. This enrichment takes the value of the referring URL and matches it against the company/site it belongs to.

This is particularly useful when looking for specific traffic from search engine providers or social networks for instance. Rather than scouring a full referrer URL list this enrichment adds an additional field so that it's possible to look at reports that combine sub-domains from some of the bigger referrers.

## Configuration example

- [Enrichment schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/referer_parser/jsonschema/2-0-1)
- [Example schema](https://github.com/snowplow/enrich/blob/master/config/enrichments/referer_parser.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

### Internal domains

Snowplow has several subdomains like _community.snowplow.io_ and _docs.snowplow.io_. As users move from these subdomains to our main _snowplow.io_ domain, we would like to capture that traffic as being referred internally. Therefore we would set the configuration in the example schema as such:

```json
"internalDomains": [
    "community.snowplow.io",
    "docs.snowplow.io"
],
```

Enabling this enrichment with the above configuration would fill the `refr_medium` column in our data warehouse with _"Internal"_ (rather then _"Unknown"_) when the referring URL to a page matches the subdomains above.

:::note

The enrichment will also classify `refr_medium` as `Internal` when an event's `page_urlhost` matches it's `refr_urlhost`, regardless of the configured `internalDomains`.
This behavior is not configurable, and may require handling in data models or a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md) to change.

:::

### Custom referrer mappings

:::note[Availability]
This feature is available since version 6.9.0 of Enrich.
:::

By default, the enrichment classifies referrers using a [hosted database](https://github.com/snowplow/referer-parser) of known sources. You can add your own referrer-to-category mappings directly in the enrichment configuration using the optional `referrers` parameter. This is useful when you need to classify new traffic sources (such as internal tools, niche search engines, or AI chatbots) without waiting for changes to the upstream database.

Custom mappings take precedence over the default database. If a domain appears in both your custom mappings and the default database, the custom mapping is used.

The `referrers` parameter is a nested object structured as follows:

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

| Field | Description |
| --- | --- |
| `<medium>` | The referrer category (e.g., `search`, `social`, `email`). This value populates `refr_medium`. |
| `<source name>` | A human-readable name for the source (e.g., `"Google"`, `"Internal Search"`). This value populates `refr_source`. |
| `domains` | An array of hostnames to match against the referrer URL. At least one domain is required. |
| `parameters` | An optional array of URL query parameter names to extract search terms from. Matched values populate `refr_term`. |

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

| Field         | Value               |
| ------------- | ------------------- |
| `refr_medium` | `search`            |
| `refr_source` | `Corporate Search`  |
| `refr_term`   | `snowplow`          |

:::tip[Contributing mappings upstream]

You can use custom referrer mappings to immediately test new categorizations in your pipeline. Once validated, consider contributing your mappings back to the [upstream referer-parser database](https://github.com/snowplow/referer-parser) via a pull request.

:::

## Output

This enrichment populates the following fields of the atomic event :

| Field         | Purpose                                                              |
| ------------- | -------------------------------------------------------------------- |
| `refr_medium` | Type of referer. Examples : Search, Internal, Unknown, Social, Email |
| `refr_source` | Name of referer if recognised. Examples: Google, Facebook            |
| `refr_term`   | Keywords if source is a search engine                                |

With this information in the data warehouse it's possible to get such insights:

| refr_medium | number of sessions |
| ----------- | ------------------ |
| Search      | 272,699            |
| Internal    | 142,555            |
| Unknown     | 127,335            |
| Social      | 14,525             |
| Email       | 5,345              |

---
title: "Referrer parser enrichment"
sidebar_position: 3
sidebar_label: Referrer parser
description: "Extract attribution data from referrer URLs to identify traffic sources, search terms, and marketing channels."
keywords: ["referrer parser", "traffic source", "attribution"]
---

This enrichment uses [snowplow referer-parser](https://github.com/snowplow/referer-parser) library to extract attribution data from referer URLs.

Knowing which sites refer users to our website is very much a staple of analytics in order to help understand traffic patterns. This enrichment takes the value of the referring URL and matches it against the company/site it belongs to.

This is particularly useful when looking for specific traffic from search engine providers or social networks for instance. Rather than scouring a full referrer URL list this enrichment adds an additional field so that it's possible to look at reports that combine sub-domains from some of the bigger referrers.

## Configuration example

- [Enrichment schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/referer_parser/jsonschema/2-0-0)
- [Example schema](https://github.com/snowplow/enrich/blob/master/config/enrichments/referer_parser.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

Snowplow has several subdomains like _community.snowplow.io_ and _docs.snowplow.io_. As users move from these subdomains to our main _snowplow.io_ domain, we would like to capture that traffic as being referred internally. Therefore we would set the configuration in the example schema as such:

```json
"internalDomains": [
    "community.snowplow.io",
    "docs.snowplow.io"
],
```

Enabling this enrichment with the above configuration would fill the `refr_medium` column in our data warehouse with _“Internal”_ (rather then _"Unknown"_) when the referring URL to a page matches the subdomains above.

:::note

The enrichment will also classify `refr_medium` as `Internal` when an event's `page_urlhost` matches it's `refr_urlhost`, regardless of the configured `internalDomains`.
This behavior is not configurable, and may require handling in data models or a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md) to change.

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
